"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { type CreateRecurringTransaction, createRecurringTransactionSchema, type RecurrenceFrequency } from "@repo/shared";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Category } from "@/app/(app)/categories/page";

const frequencyOptions: { value: RecurrenceFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

interface RecurringFormProps {
  id?: string;
  categories: Category[];
  initialValues?: Partial<CreateRecurringTransaction>;
  onSubmit: (values: CreateRecurringTransaction) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  showFooter?: boolean;
}

export function RecurringForm({
  id = "recurring-form",
  categories,
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  showFooter = true,
}: RecurringFormProps) {
  const [hasEndDate, setHasEndDate] = useState(!!initialValues?.endDate);
  const [generateFirst, setGenerateFirst] = useState(initialValues?.generateFirst ?? false);

  const form = useForm<CreateRecurringTransaction>({
    resolver: zodResolver(createRecurringTransactionSchema),
    defaultValues: {
      amount: initialValues?.amount ?? 0,
      type: initialValues?.type ?? "expense",
      description: initialValues?.description ?? "",
      categoryId: initialValues?.categoryId ?? null,
      frequency: initialValues?.frequency ?? "monthly",
      startDate: initialValues?.startDate ?? format(new Date(), "yyyy-MM-dd"),
      endDate: initialValues?.endDate,
      isActive: initialValues?.isActive ?? true,
      generateFirst: initialValues?.generateFirst ?? false,
    },
  });

  const handleSubmit = (values: CreateRecurringTransaction) => {
    // Include generateFirst state in submission
    onSubmit({
      ...values,
      generateFirst,
    });
  };

  const watchType = form.watch("type");
  const filteredCategories = categories.filter((c) => c.type === watchType);

  return (
    <Form {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a89580]">Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a89580]">
                    $
                  </span>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    className="pl-7 bg-[#16110a] border-[#2d2420] text-[#f5f2ed] placeholder:text-[#4a3f35]"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type & Category row */}
        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a89580]">Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#16110a] border-[#2d2420] text-[#f5f2ed]">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1f1815] border-[#2d2420]">
                    <SelectItem value="expense" className="text-[#f5f2ed]">
                      Expense
                    </SelectItem>
                    <SelectItem value="income" className="text-[#f5f2ed]">
                      Income
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#a89580]">Category</FormLabel>
                <Select
                  onValueChange={(val) =>
                    field.onChange(val === "none" ? null : val)
                  }
                  value={field.value ?? "none"}
                >
                  <FormControl>
                    <SelectTrigger className="bg-[#16110a] border-[#2d2420] text-[#f5f2ed]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-[#1f1815] border-[#2d2420]">
                    <SelectItem value="none" className="text-[#a89580]">
                      No category
                    </SelectItem>
                    {filteredCategories.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-[#f5f2ed]"
                      >
                        <span className="flex items-center gap-2">
                          {cat.icon && <span>{cat.icon}</span>}
                          {cat.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a89580]">Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Netflix Subscription"
                  className="bg-[#16110a] border-[#2d2420] text-[#f5f2ed] placeholder:text-[#4a3f35]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Frequency */}
        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[#a89580]">Frequency</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-[#16110a] border-[#2d2420] text-[#f5f2ed]">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-[#1f1815] border-[#2d2420]">
                  {frequencyOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-[#f5f2ed]"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-[#a89580]">Start Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal bg-[#16110a] border-[#2d2420] text-[#f5f2ed] hover:bg-[#1f1815] hover:text-[#f5f2ed]",
                        !field.value && "text-[#a89580]"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-[#1f1815] border-[#2d2420]"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date Toggle */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="has-end-date"
            checked={hasEndDate}
            onCheckedChange={(checked) => {
              setHasEndDate(checked === true);
              if (!checked) {
                form.setValue("endDate", undefined);
              }
            }}
          />
          <label
            htmlFor="has-end-date"
            className="text-sm font-medium leading-none text-[#a89580] cursor-pointer"
          >
            Has end date
          </label>
        </div>

        {/* End Date (conditional) */}
        {hasEndDate && (
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-[#a89580]">End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal bg-[#16110a] border-[#2d2420] text-[#f5f2ed] hover:bg-[#1f1815] hover:text-[#f5f2ed]",
                          !field.value && "text-[#a89580]"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-[#1f1815] border-[#2d2420]"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Generate First Transaction Toggle (only for new) */}
        {!initialValues?.amount && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="generate-first"
              checked={generateFirst}
              onCheckedChange={(checked) => setGenerateFirst(checked === true)}
            />
            <label
              htmlFor="generate-first"
              className="text-sm font-medium leading-none text-[#a89580] cursor-pointer"
            >
              Create first transaction now
            </label>
          </div>
        )}

        {showFooter && (
          <div className="flex justify-end gap-3 pt-4">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-[#2d2420] bg-transparent text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed]"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="warm-gradient text-white border-0"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {initialValues?.amount ? "Update" : "Create"} Recurring
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}
