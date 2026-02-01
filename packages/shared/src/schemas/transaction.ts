import { z } from "zod";

export const transactionTypeEnum = z.enum(["expense", "income"]);

export const createTransactionSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  amount: z.number().positive("Amount must be positive"),
  type: transactionTypeEnum,
  description: z.string().max(255).optional(),
  date: z.string(),
});

export const updateTransactionSchema = z.object({
  categoryId: z.string().uuid().nullable().optional(),
  amount: z.number().positive().optional(),
  type: transactionTypeEnum.optional(),
  description: z.string().max(255).optional(),
  date: z.string().optional(),
});

export const transactionQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  type: transactionTypeEnum.optional(),
  categoryId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  minAmount: z.coerce.number().positive().optional(),
  maxAmount: z.coerce.number().positive().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sortBy: z.enum(["date", "amount", "createdAt"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type UpdateTransaction = z.infer<typeof updateTransactionSchema>;
export type TransactionType = z.infer<typeof transactionTypeEnum>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
