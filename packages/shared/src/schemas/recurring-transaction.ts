import { z } from "zod";
import { transactionTypeEnum } from "./transaction";

export const recurrenceFrequencyEnum = z.enum([
  "daily",
  "weekly",
  "biweekly",
  "monthly",
  "quarterly",
  "yearly",
]);

export const createRecurringTransactionSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  amount: z.number().positive("Amount must be positive"),
  type: transactionTypeEnum,
  description: z.string().max(255).optional(),
  frequency: recurrenceFrequencyEnum,
  startDate: z.string(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
  generateFirst: z.boolean().default(false),
});

export const updateRecurringTransactionSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  amount: z.number().positive().optional(),
  type: transactionTypeEnum.optional(),
  description: z.string().max(255).optional(),
  frequency: recurrenceFrequencyEnum.optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateRecurringTransaction = z.infer<
  typeof createRecurringTransactionSchema
>;
export type UpdateRecurringTransaction = z.infer<
  typeof updateRecurringTransactionSchema
>;
export type RecurrenceFrequency = z.infer<typeof recurrenceFrequencyEnum>;
