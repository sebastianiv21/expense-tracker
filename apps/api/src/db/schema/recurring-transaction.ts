import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  numeric,
  pgEnum,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { category } from "./category";
import { transactionTypeEnum } from "./transaction";

export const recurrenceFrequencyEnum = pgEnum("recurrence_frequency", [
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "yearly",
]);

export const recurringTransaction = pgTable("recurring_transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => category.id, {
    onDelete: "set null",
  }),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  description: varchar("description", { length: 255 }),
  frequency: recurrenceFrequencyEnum("frequency").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  nextDueDate: timestamp("next_due_date").notNull(),
  lastGeneratedDate: timestamp("last_generated_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const recurringTransactionRelations = relations(
  recurringTransaction,
  ({ one }) => ({
    user: one(user, {
      fields: [recurringTransaction.userId],
      references: [user.id],
    }),
    category: one(category, {
      fields: [recurringTransaction.categoryId],
      references: [category.id],
    }),
  }),
);

export type RecurringTransaction = typeof recurringTransaction.$inferSelect;
export type NewRecurringTransaction =
  typeof recurringTransaction.$inferInsert;
