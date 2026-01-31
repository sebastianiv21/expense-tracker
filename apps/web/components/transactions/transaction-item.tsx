"use client";

import { format } from "date-fns";
import { ArrowDownCircle, ArrowUpCircle, Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "@/app/(app)/transactions/page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: () => void;
  onEdit: () => void;
}

export function TransactionItem({
  transaction,
  onDelete,
  onEdit,
}: TransactionItemProps) {
  const isExpense = transaction.type === "expense";
  const amount = Number(transaction.amount);

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors group gap-2">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div
          className={cn(
            "p-2 rounded-full shrink-0",
            isExpense
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600",
          )}
        >
          {isExpense ? (
            <ArrowDownCircle className="h-5 w-5" />
          ) : (
            <ArrowUpCircle className="h-5 w-5" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold truncate block">
              {transaction.description ||
                transaction.category?.name ||
                "Uncategorized"}
            </span>
            {transaction.category && (
              <Badge
                variant="outline"
                className="text-[10px] uppercase shrink-0 hidden sm:inline-flex"
              >
                {transaction.category.name}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {format(new Date(transaction.date), "PPP")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <span
          className={cn(
            "font-bold text-sm sm:text-base",
            isExpense ? "text-red-600" : "text-green-600",
          )}
        >
          {isExpense ? "-" : "+"}
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount)}
        </span>

        <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              if (
                confirm("Are you sure you want to delete this transaction?")
              ) {
                onDelete();
              }
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
