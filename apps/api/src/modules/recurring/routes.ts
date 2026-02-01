import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { eq, and, lte, desc, sql } from "drizzle-orm";
import { getDb } from "../../db";
import { recurringTransaction } from "../../db/schema/recurring-transaction";
import { transaction } from "../../db/schema/transaction";
import {
  createRecurringTransactionSchema,
  updateRecurringTransactionSchema,
} from "@repo/shared";
import { requireAuth } from "../../lib/session";

export const recurringRoutes = new Hono();

// Calculate next due date based on frequency
function calculateNextDueDate(
  fromDate: Date,
  frequency: string,
): Date {
  const date = new Date(fromDate);
  switch (frequency) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "biweekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "quarterly":
      date.setMonth(date.getMonth() + 3);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      date.setMonth(date.getMonth() + 1);
  }
  return date;
}

// Generate transactions for a recurring item
async function generateTransactions(
  db: ReturnType<typeof getDb>,
  recurring: typeof recurringTransaction.$inferSelect,
  upToDate: Date = new Date(),
): Promise<number> {
  let generated = 0;
  let nextDue = new Date(recurring.nextDueDate);
  const endDate = recurring.endDate ? new Date(recurring.endDate) : null;

  while (nextDue <= upToDate) {
    // Check if we've passed the end date
    if (endDate && nextDue > endDate) break;

    // Create the transaction
    await db.insert(transaction).values({
      userId: recurring.userId,
      categoryId: recurring.categoryId,
      amount: recurring.amount,
      type: recurring.type,
      description: `[Recurring] ${recurring.description || ""}`,
      date: nextDue,
    });

    generated++;

    // Calculate next due date
    nextDue = calculateNextDueDate(nextDue, recurring.frequency);
  }

  // Update the recurring transaction
  if (generated > 0) {
    await db
      .update(recurringTransaction)
      .set({
        lastGeneratedDate: upToDate,
        nextDueDate: nextDue,
        updatedAt: new Date(),
      })
      .where(eq(recurringTransaction.id, recurring.id));
  }

  return generated;
}

// Get all recurring transactions for the current user
recurringRoutes.get("/", requireAuth, async (c) => {
  const session = c.var.session;
  const db = getDb();

  // Auto-generate pending transactions first
  const today = new Date();
  const pendingRecurrences = await db.query.recurringTransaction.findMany({
    where: and(
      eq(recurringTransaction.userId, session.user.id),
      eq(recurringTransaction.isActive, true),
      lte(recurringTransaction.nextDueDate, today),
    ),
  });

  // Generate transactions for each pending recurrence
  for (const recurring of pendingRecurrences) {
    // Check end date
    if (recurring.endDate && new Date(recurring.endDate) < today) {
      // Past end date, mark as inactive
      await db
        .update(recurringTransaction)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(recurringTransaction.id, recurring.id));
      continue;
    }

    await generateTransactions(db, recurring, today);
  }

  // Fetch all recurring transactions with categories
  const recurrences = await db.query.recurringTransaction.findMany({
    where: eq(recurringTransaction.userId, session.user.id),
    orderBy: [desc(recurringTransaction.isActive), desc(recurringTransaction.nextDueDate)],
    with: {
      category: true,
    },
  });

  return c.json(recurrences);
});

// Create new recurring transaction
recurringRoutes.post("/", requireAuth, async (c) => {
  const session = c.var.session;
  const body = await c.req.json();
  const parsed = createRecurringTransactionSchema.safeParse(body);
  const db = getDb();

  if (!parsed.success) {
    throw new HTTPException(400, {
      message:
        parsed.error.issues.map((i) => i.message).join(", ") || "Invalid data",
    });
  }

  const { generateFirst, ...data } = parsed.data;
  const startDate = new Date(data.startDate);
  const nextDueDate = calculateNextDueDate(startDate, data.frequency);

  // Create the recurring transaction
  const newRecurring = await db
    .insert(recurringTransaction)
    .values({
      userId: session.user.id,
      categoryId: data.categoryId || null,
      amount: data.amount.toString(),
      type: data.type,
      description: data.description,
      frequency: data.frequency,
      startDate: startDate,
      endDate: data.endDate ? new Date(data.endDate) : null,
      nextDueDate: startDate, // First due date is start date
      isActive: data.isActive,
    })
    .returning();

  // Generate first transaction if requested
  if (generateFirst) {
    await db.insert(transaction).values({
      userId: session.user.id,
      categoryId: data.categoryId || null,
      amount: data.amount.toString(),
      type: data.type,
      description: `[Recurring] ${data.description || ""}`,
      date: startDate,
    });

    // Update next due date
    await db
      .update(recurringTransaction)
      .set({
        nextDueDate: nextDueDate,
        lastGeneratedDate: startDate,
        updatedAt: new Date(),
      })
      .where(eq(recurringTransaction.id, newRecurring[0]!.id));

    newRecurring[0]!.nextDueDate = nextDueDate;
    newRecurring[0]!.lastGeneratedDate = startDate;
  }

  const result = await db.query.recurringTransaction.findFirst({
    where: eq(recurringTransaction.id, newRecurring[0]!.id),
    with: {
      category: true,
    },
  });

  return c.json(result, 201);
});

// Update recurring transaction
recurringRoutes.patch("/:id", requireAuth, async (c) => {
  const session = c.var.session;
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateRecurringTransactionSchema.safeParse(body);
  const db = getDb();

  if (!parsed.success) {
    throw new HTTPException(400, {
      message:
        parsed.error.issues.map((i) => i.message).join(", ") || "Invalid data",
    });
  }

  // Verify ownership
  const existing = await db.query.recurringTransaction.findFirst({
    where: and(
      eq(recurringTransaction.id, id),
      eq(recurringTransaction.userId, session.user.id),
    ),
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Recurring transaction not found" });
  }

  const updateData: any = {
    updatedAt: new Date(),
  };

  if (parsed.data.categoryId !== undefined) {
    updateData.categoryId = parsed.data.categoryId;
  }
  if (parsed.data.amount !== undefined) {
    updateData.amount = parsed.data.amount.toString();
  }
  if (parsed.data.type !== undefined) {
    updateData.type = parsed.data.type;
  }
  if (parsed.data.description !== undefined) {
    updateData.description = parsed.data.description;
  }
  if (parsed.data.frequency !== undefined) {
    updateData.frequency = parsed.data.frequency;
    // Recalculate next due date if frequency changes
    const lastGen = existing.lastGeneratedDate
      ? new Date(existing.lastGeneratedDate)
      : new Date(existing.startDate);
    updateData.nextDueDate = calculateNextDueDate(lastGen, parsed.data.frequency);
  }
  if (parsed.data.startDate !== undefined) {
    updateData.startDate = new Date(parsed.data.startDate);
  }
  if (parsed.data.endDate !== undefined) {
    updateData.endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : null;
  }
  if (parsed.data.isActive !== undefined) {
    updateData.isActive = parsed.data.isActive;
  }

  await db
    .update(recurringTransaction)
    .set(updateData)
    .where(
      and(
        eq(recurringTransaction.id, id),
        eq(recurringTransaction.userId, session.user.id),
      ),
    );

  const result = await db.query.recurringTransaction.findFirst({
    where: eq(recurringTransaction.id, id),
    with: {
      category: true,
    },
  });

  return c.json(result);
});

// Delete recurring transaction
recurringRoutes.delete("/:id", requireAuth, async (c) => {
  const session = c.var.session;
  const id = c.req.param("id");
  const db = getDb();

  // Verify ownership
  const existing = await db.query.recurringTransaction.findFirst({
    where: and(
      eq(recurringTransaction.id, id),
      eq(recurringTransaction.userId, session.user.id),
    ),
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Recurring transaction not found" });
  }

  await db
    .delete(recurringTransaction)
    .where(
      and(
        eq(recurringTransaction.id, id),
        eq(recurringTransaction.userId, session.user.id),
      ),
    );

  return c.json({ message: "Recurring transaction deleted successfully" });
});

// Manually trigger transaction generation
recurringRoutes.post("/:id/generate", requireAuth, async (c) => {
  const session = c.var.session;
  const id = c.req.param("id");
  const db = getDb();

  // Verify ownership
  const existing = await db.query.recurringTransaction.findFirst({
    where: and(
      eq(recurringTransaction.id, id),
      eq(recurringTransaction.userId, session.user.id),
    ),
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Recurring transaction not found" });
  }

  if (!existing.isActive) {
    throw new HTTPException(400, { message: "Cannot generate for inactive recurring transaction" });
  }

  const generated = await generateTransactions(db, existing, new Date());

  return c.json({
    message: `Generated ${generated} transaction(s)`,
    generated,
  });
});

export { generateTransactions, calculateNextDueDate };
