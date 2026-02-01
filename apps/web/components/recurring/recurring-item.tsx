"use client";

import { format } from "date-fns";
import { Repeat, Pencil, Trash2, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/app/(app)/categories/page";

export interface RecurringTransaction {
  id: string;
  amount: string;
  type: "expense" | "income";
  description: string | null;
  frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate: string | null;
  nextDueDate: string;
  isActive: boolean;
  category: Category | null;
}

interface RecurringItemProps {
  recurring: RecurringTransaction;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  compact?: boolean;
}

const frequencyLabels: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
};

export function RecurringItem({
  recurring,
  onEdit,
  onDelete,
  onToggleActive,
  compact = false,
}: RecurringItemProps) {
  const amount = parseFloat(recurring.amount);
  const nextDue = new Date(recurring.nextDueDate);
  const isExpense = recurring.type === "expense";

  // Format next due date for display
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextDueDay = new Date(nextDue);
  nextDueDay.setHours(0, 0, 0, 0);
  
  let dateDisplay: string;
  const daysDiff = Math.ceil(
    (nextDueDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysDiff === 0) {
    dateDisplay = "Today";
  } else if (daysDiff === 1) {
    dateDisplay = "Tomorrow";
  } else if (daysDiff < 7 && daysDiff > 0) {
    dateDisplay = format(nextDue, "EEEE"); // Day name
  } else {
    dateDisplay = format(nextDue, "MMM d");
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-[#16110a] flex flex-col items-center justify-center text-xs border border-[#2d2420]">
          <span className="text-[#a89580] text-[10px]">
            {format(nextDue, "MMM").toUpperCase()}
          </span>
          <span className="font-bold text-[#f5f2ed]">{format(nextDue, "d")}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#f5f2ed] truncate">
            {recurring.description || "Unnamed"}
          </p>
          <p className="text-xs text-[#a89580]">
            ${amount.toFixed(2)} • {recurring.category?.name || "Uncategorized"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 rounded-2xl border bg-[#1f1815] transition-all",
        recurring.isActive
          ? "border-[#2d2420]"
          : "border-[#2d2420]/50 opacity-60"
      )}
    >
      <div className="flex items-start gap-4">
        {/* Date badge */}
        <div className="w-12 h-12 rounded-xl bg-[#16110a] flex flex-col items-center justify-center border border-[#2d2420] shrink-0">
          <span className="text-[#a89580] text-[10px] font-medium">
            {format(nextDue, "MMM").toUpperCase()}
          </span>
          <span className="font-bold text-[#f5f2ed] text-sm">
            {format(nextDue, "d")}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-[#f5f2ed] truncate">
              {recurring.description || "Unnamed"}
            </p>
            {!recurring.isActive && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2d2420] text-[#a89580]">
                Paused
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className={cn(
                "text-sm font-semibold",
                isExpense ? "text-[#c97a5a]" : "text-[#9fb89f]"
              )}
            >
              {isExpense ? "-" : "+"}${amount.toFixed(2)}
            </span>
            <span className="text-[#a89580] text-xs">•</span>
            <span className="flex items-center gap-1 text-xs text-[#a89580]">
              <Repeat className="h-3 w-3" />
              {frequencyLabels[recurring.frequency]}
            </span>
            {recurring.category && (
              <>
                <span className="text-[#a89580] text-xs">•</span>
                <span className="text-xs text-[#a89580]">
                  {recurring.category.icon && (
                    <span className="mr-1">{recurring.category.icon}</span>
                  )}
                  {recurring.category.name}
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-[#a89580] mt-1">
            Next: {dateDisplay}
            {daysDiff > 0 && daysDiff < 30 && ` (${daysDiff} days)`}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onToggleActive}
            className="p-2 rounded-lg hover:bg-[#2d2420] transition-colors text-[#a89580]"
            title={recurring.isActive ? "Pause" : "Resume"}
          >
            {recurring.isActive ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-[#2d2420] transition-colors text-[#a89580]"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-[#2d2420] transition-colors text-[#c97a5a]"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
