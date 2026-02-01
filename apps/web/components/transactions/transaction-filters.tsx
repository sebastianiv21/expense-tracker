"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { type Category } from "@/app/(app)/categories/page";

export interface FilterState {
  startDate?: string;
  endDate?: string;
  type?: "expense" | "income";
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface TransactionFiltersProps {
  filters: FilterState;
  categories: Category[];
  onChange: (filters: FilterState) => void;
  onClear: () => void;
  className?: string;
}

export function TransactionFilters({
  filters,
  categories,
  onChange,
  onClear,
  className,
}: TransactionFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ""
  ).length;

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterState) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onChange(newFilters);
  };

  return (
    <div className={className}>
      {/* Filter Toggle Button */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "border-[#2d2420] bg-transparent text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed]",
              activeFilterCount > 0 && "border-[#c97a5a]/50 text-[#c97a5a]"
            )}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-2 h-5 min-w-5 rounded-full bg-[#c97a5a]/20 text-[#c97a5a] text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-[320px] sm:w-[400px] p-4 bg-[#1f1815] border-[#2d2420]"
          align="end"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-[#f5f2ed]">Filter Transactions</h4>
              {activeFilterCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs text-[#a89580] hover:text-[#f5f2ed] hover:bg-transparent"
                  onClick={onClear}
                >
                  <X className="mr-1 h-3 w-3" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#a89580] uppercase tracking-wider">
                Type
              </label>
              <div className="flex gap-2">
                {(["all", "expense", "income"] as const).map((type) => (
                  <Button
                    key={type}
                    variant={
                      (filters.type === type ||
                        (type === "all" && !filters.type))
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className={cn(
                      "flex-1 text-xs",
                      (filters.type === type ||
                        (type === "all" && !filters.type))
                        ? "warm-gradient text-white border-0"
                        : "border-[#2d2420] bg-transparent text-[#a89580] hover:bg-[#16110a] hover:text-[#f5f2ed]"
                    )}
                    onClick={() =>
                      updateFilter("type", type === "all" ? undefined : type)
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#a89580] uppercase tracking-wider">
                Category
              </label>
              <Select
                value={filters.categoryId || "all"}
                onValueChange={(value) =>
                  updateFilter("categoryId", value === "all" ? undefined : value)
                }
              >
                <SelectTrigger className="bg-[#16110a] border-[#2d2420] text-[#f5f2ed]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1f1815] border-[#2d2420]">
                  <SelectItem
                    value="all"
                    className="text-[#f5f2ed] focus:bg-[#2d2420] focus:text-[#f5f2ed]"
                  >
                    All Categories
                  </SelectItem>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      value={cat.id}
                      className="text-[#f5f2ed] focus:bg-[#2d2420] focus:text-[#f5f2ed]"
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#a89580] uppercase tracking-wider">
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Start Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal border-[#2d2420] bg-[#16110a] text-[#f5f2ed] hover:bg-[#2d2420]",
                        !filters.startDate && "text-[#a89580]"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.startDate ? (
                        format(new Date(filters.startDate), "MMM d")
                      ) : (
                        <span>From</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1f1815] border-[#2d2420]">
                    <Calendar
                      mode="single"
                      selected={
                        filters.startDate
                          ? new Date(filters.startDate)
                          : undefined
                      }
                      onSelect={(date) =>
                        updateFilter(
                          "startDate",
                          date?.toISOString() || undefined
                        )
                      }
                      initialFocus
                      className="rounded-lg"
                    />
                  </PopoverContent>
                </Popover>

                {/* End Date */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "w-full justify-start text-left font-normal border-[#2d2420] bg-[#16110a] text-[#f5f2ed] hover:bg-[#2d2420]",
                        !filters.endDate && "text-[#a89580]"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-3 w-3" />
                      {filters.endDate ? (
                        format(new Date(filters.endDate), "MMM d")
                      ) : (
                        <span>To</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1f1815] border-[#2d2420]">
                    <Calendar
                      mode="single"
                      selected={
                        filters.endDate ? new Date(filters.endDate) : undefined
                      }
                      onSelect={(date) =>
                        updateFilter("endDate", date?.toISOString() || undefined)
                      }
                      initialFocus
                      className="rounded-lg"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#a89580] uppercase tracking-wider">
                Amount Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89580] text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minAmount || ""}
                    onChange={(e) =>
                      updateFilter(
                        "minAmount",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="pl-6 bg-[#16110a] border-[#2d2420] text-[#f5f2ed] placeholder:text-[#a89580]/50"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89580] text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxAmount || ""}
                    onChange={(e) =>
                      updateFilter(
                        "maxAmount",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="pl-6 bg-[#16110a] border-[#2d2420] text-[#f5f2ed] placeholder:text-[#a89580]/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.type && (
            <Badge
              variant="secondary"
              className="bg-[#2d2420] text-[#f5f2ed] hover:bg-[#3d3430] cursor-pointer"
              onClick={() => clearFilter("type")}
            >
              {filters.type}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {filters.categoryId && (
            <Badge
              variant="secondary"
              className="bg-[#2d2420] text-[#f5f2ed] hover:bg-[#3d3430] cursor-pointer"
              onClick={() => clearFilter("categoryId")}
            >
              {categories.find((c) => c.id === filters.categoryId)?.name ||
                "Category"}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {(filters.startDate || filters.endDate) && (
            <Badge
              variant="secondary"
              className="bg-[#2d2420] text-[#f5f2ed] hover:bg-[#3d3430] cursor-pointer"
              onClick={() => {
                const newFilters = { ...filters };
                delete newFilters.startDate;
                delete newFilters.endDate;
                onChange(newFilters);
              }}
            >
              {filters.startDate && filters.endDate
                ? `${format(new Date(filters.startDate), "MMM d")} - ${format(
                    new Date(filters.endDate),
                    "MMM d"
                  )}`
                : filters.startDate
                ? `From ${format(new Date(filters.startDate), "MMM d")}`
                : `To ${format(new Date(filters.endDate!), "MMM d")}`}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {(filters.minAmount !== undefined ||
            filters.maxAmount !== undefined) && (
            <Badge
              variant="secondary"
              className="bg-[#2d2420] text-[#f5f2ed] hover:bg-[#3d3430] cursor-pointer"
              onClick={() => {
                const newFilters = { ...filters };
                delete newFilters.minAmount;
                delete newFilters.maxAmount;
                onChange(newFilters);
              }}
            >
              {filters.minAmount !== undefined && filters.maxAmount !== undefined
                ? `$${filters.minAmount} - $${filters.maxAmount}`
                : filters.minAmount !== undefined
                ? `Min $${filters.minAmount}`
                : `Max $${filters.maxAmount}`}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
