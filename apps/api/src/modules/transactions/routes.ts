import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { eq, and, gte, lte, desc, asc, sql, like } from "drizzle-orm";
import { getDb } from "../../db";
import { transaction } from "../../db/schema/transaction";
import { createTransactionSchema, updateTransactionSchema, transactionQuerySchema } from "@repo/shared";
import { requireAuth } from "../../lib/session";

export const transactionsRoutes = new Hono();

// Get all transactions for current user (with optional filters and pagination)
transactionsRoutes.get("/", requireAuth, async (c) => {
  const session = c.var.session;
  const searchParams = c.req.query();
  const db = getDb();

  // Validate and parse query params
  const parsed = transactionQuerySchema.safeParse(searchParams);
  if (!parsed.success) {
    throw new HTTPException(400, {
      message: parsed.error.issues.map((i) => i.message).join(", ") || "Invalid query parameters",
    });
  }

  const {
    startDate,
    endDate,
    type,
    categoryId,
    search,
    minAmount,
    maxAmount,
    limit,
    offset,
    sortBy,
    sortOrder,
  } = parsed.data;

  const whereConditions: any[] = [eq(transaction.userId, session.user.id)];

  if (startDate) {
    whereConditions.push(gte(transaction.date, new Date(startDate)));
  }

  if (endDate) {
    whereConditions.push(lte(transaction.date, new Date(endDate)));
  }

  if (type) {
    whereConditions.push(eq(transaction.type, type));
  }

  if (categoryId) {
    whereConditions.push(eq(transaction.categoryId, categoryId));
  }

  if (search) {
    whereConditions.push(like(transaction.description, `%${search}%`));
  }

  if (minAmount !== undefined) {
    whereConditions.push(
      gte(
        sql`CAST(${transaction.amount} AS NUMERIC(10,2))`,
        minAmount.toString(),
      ),
    );
  }

  if (maxAmount !== undefined) {
    whereConditions.push(
      lte(
        sql`CAST(${transaction.amount} AS NUMERIC(10,2))`,
        maxAmount.toString(),
      ),
    );
  }

  // Build order by clause
  const orderByColumn =
    sortBy === "amount"
      ? transaction.amount
      : sortBy === "createdAt"
        ? transaction.createdAt
        : transaction.date;

  const orderBy = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

  // Get total count for pagination
  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(transaction)
    .where(and(...whereConditions));

  const total = Number(countResult[0]?.count || 0);

  // Get paginated transactions
  const transactions = await db.query.transaction.findMany({
    where: and(...whereConditions),
    orderBy: [orderBy, desc(transaction.createdAt)],
    limit,
    offset,
    with: {
      category: true,
    },
  });

  return c.json({
    data: transactions,
    pagination: {
      total,
      limit,
      offset,
      hasMore: offset + transactions.length < total,
    },
  });
});

// Create new transaction
transactionsRoutes.post("/", requireAuth, async (c) => {
  const session = c.var.session;
  const body = await c.req.json();
  const parsed = createTransactionSchema.safeParse(body);
  const db = getDb();

  if (!parsed.success) {
    throw new HTTPException(400, {
      message:
        parsed.error.issues.map((i) => i.message).join(", ") || "Invalid data",
    });
  }

  const newTransaction = await db
    .insert(transaction)
    .values({
      userId: session.user.id,
      categoryId: parsed.data.categoryId || null,
      amount: parsed.data.amount.toString(),
      type: parsed.data.type,
      description: parsed.data.description,
      date: new Date(parsed.data.date),
    })
    .returning();

  const created = await db.query.transaction.findFirst({
    where: eq(transaction.id, newTransaction[0]!.id),
    with: {
      category: true,
    },
  });

  return c.json(created, 201);
});

// Get transaction by ID
transactionsRoutes.get("/:id", requireAuth, async (c) => {
  const session = c.var.session;
  const id = c.req.param("id");
  const db = getDb();

  const txn = await db.query.transaction.findFirst({
    where: and(eq(transaction.id, id), eq(transaction.userId, session.user.id)),
    with: {
      category: true,
    },
  });

  if (!txn) {
    throw new HTTPException(404, { message: "Transaction not found" });
  }

  return c.json(txn);
});

// Update transaction
transactionsRoutes.patch("/:id", requireAuth, async (c) => {
  const session = c.var.session;
  const id = c.req.param("id");
  const body = await c.req.json();
  const parsed = updateTransactionSchema.safeParse(body);
  const db = getDb();

  if (!parsed.success) {
    throw new HTTPException(400, {
      message:
        parsed.error.issues.map((i) => i.message).join(", ") || "Invalid data",
    });
  }

  // Verify transaction exists and belongs to user
  const existing = await db.query.transaction.findFirst({
    where: and(eq(transaction.id, id), eq(transaction.userId, session.user.id)),
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Transaction not found" });
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
  if (parsed.data.date !== undefined) {
    updateData.date = new Date(parsed.data.date);
  }

  const updated = await db
    .update(transaction)
    .set(updateData)
    .where(and(eq(transaction.id, id), eq(transaction.userId, session.user.id)))
    .returning();

  const result = await db.query.transaction.findFirst({
    where: eq(transaction.id, updated[0]!.id),
    with: {
      category: true,
    },
  });

  return c.json(result);
});

// Delete transaction
transactionsRoutes.delete("/:id", requireAuth, async (c) => {
  const session = c.var.session;
  const id = c.req.param("id");
  const db = getDb();

  // Verify transaction exists and belongs to user
  const existing = await db.query.transaction.findFirst({
    where: and(eq(transaction.id, id), eq(transaction.userId, session.user.id)),
  });

  if (!existing) {
    throw new HTTPException(404, { message: "Transaction not found" });
  }

  await db
    .delete(transaction)
    .where(
      and(eq(transaction.id, id), eq(transaction.userId, session.user.id)),
    );

  return c.json({ message: "Transaction deleted successfully" });
});
