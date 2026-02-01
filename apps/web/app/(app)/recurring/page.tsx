"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Repeat } from "lucide-react";
import { toast } from "sonner";
import { type CreateRecurringTransaction } from "@repo/shared";

import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api-client";
import { ResponsiveModal, ResponsiveModalClose } from "@/components/ui/responsive-modal";
import { RecurringForm } from "@/components/recurring/recurring-form";
import { RecurringItem, type RecurringTransaction } from "@/components/recurring/recurring-item";
import type { Category } from "@/app/(app)/categories/page";

export default function RecurringPage() {
  const [recurrences, setRecurrences] = useState<RecurringTransaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);

  const fetchData = async () => {
    try {
      const [recData, catData] = await Promise.all([
        api.get<RecurringTransaction[]>("/recurring-transactions"),
        api.get<Category[]>("/categories"),
      ]);
      setRecurrences(recData);
      setCategories(catData);
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Failed to fetch recurring transactions";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (values: CreateRecurringTransaction) => {
    setIsSubmitting(true);
    try {
      await api.post("/recurring-transactions", values);
      toast.success("Recurring transaction created");
      setIsDialogOpen(false);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Failed to create recurring transaction";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: CreateRecurringTransaction) => {
    if (!editingRecurring) return;
    setIsSubmitting(true);
    try {
      await api.patch(`/recurring-transactions/${editingRecurring.id}`, values);
      toast.success("Recurring transaction updated");
      setIsDialogOpen(false);
      setEditingRecurring(null);
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Failed to update recurring transaction";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recurring transaction?")) return;
    try {
      await api.delete(`/recurring-transactions/${id}`);
      toast.success("Recurring transaction deleted");
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Failed to delete";
      toast.error(message);
    }
  };

  const handleToggleActive = async (recurring: RecurringTransaction) => {
    try {
      await api.patch(`/recurring-transactions/${recurring.id}`, {
        isActive: !recurring.isActive,
      });
      toast.success(recurring.isActive ? "Paused recurring transaction" : "Resumed recurring transaction");
      fetchData();
    } catch (err: unknown) {
      const message = err instanceof ApiError ? err.message : "Failed to update";
      toast.error(message);
    }
  };

  const openCreateDialog = () => {
    setEditingRecurring(null);
    setIsDialogOpen(true);
  };

  const openEditDialog = (recurring: RecurringTransaction) => {
    setEditingRecurring(recurring);
    setIsDialogOpen(true);
  };

  // Group recurrences
  const activeRecurrences = recurrences.filter((r) => r.isActive);
  const inactiveRecurrences = recurrences.filter((r) => !r.isActive);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c97a5a]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#f5f2ed]">Recurring</h1>
          <p className="text-[#a89580] text-sm">
            Manage your scheduled transactions.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="warm-gradient text-white border-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Recurring
        </Button>
      </div>

      {/* Active Recurrences */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-[#f5f2ed]">
          Active ({activeRecurrences.length})
        </h2>
        {activeRecurrences.length === 0 ? (
          <div className="text-center py-10 bg-[#1f1815] rounded-2xl border border-[#2d2420]">
            <div className="w-12 h-12 rounded-full bg-[#16110a] flex items-center justify-center mx-auto mb-3 border border-[#2d2420]">
              <Repeat className="h-5 w-5 text-[#a89580]" />
            </div>
            <p className="text-sm text-[#a89580] mb-2">No active recurring transactions</p>
            <Button variant="outline" onClick={openCreateDialog} className="border-[#2d2420] text-[#a89580]">
              Create Your First
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {activeRecurrences.map((recurring) => (
              <RecurringItem
                key={recurring.id}
                recurring={recurring}
                onEdit={() => openEditDialog(recurring)}
                onDelete={() => handleDelete(recurring.id)}
                onToggleActive={() => handleToggleActive(recurring)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Inactive Recurrences */}
      {inactiveRecurrences.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-[#a89580]">
            Paused ({inactiveRecurrences.length})
          </h2>
          <div className="space-y-3 opacity-60">
            {inactiveRecurrences.map((recurring) => (
              <RecurringItem
                key={recurring.id}
                recurring={recurring}
                onEdit={() => openEditDialog(recurring)}
                onDelete={() => handleDelete(recurring.id)}
                onToggleActive={() => handleToggleActive(recurring)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Create/Edit Modal */}
      <ResponsiveModal
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingRecurring ? "Edit Recurring" : "New Recurring Transaction"}
        description={
          editingRecurring
            ? "Update your scheduled transaction."
            : "Create a transaction that repeats automatically."
        }
        footer={
          <>
            <ResponsiveModalClose>
              <Button
                variant="outline"
                className="w-full sm:w-auto border-[#2d2420] bg-transparent text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed]"
              >
                Cancel
              </Button>
            </ResponsiveModalClose>
            <Button
              type="submit"
              form="recurring-form"
              className="w-full sm:w-auto warm-gradient text-white"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingRecurring ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="py-2">
          <RecurringForm
            id="recurring-form"
            showFooter={false}
            categories={categories}
            initialValues={
              editingRecurring
                ? {
                    categoryId: editingRecurring.category?.id ?? null,
                    amount: parseFloat(editingRecurring.amount),
                    type: editingRecurring.type,
                    description: editingRecurring.description || "",
                    frequency: editingRecurring.frequency,
                    startDate: editingRecurring.startDate.slice(0, 10),
                    endDate: editingRecurring.endDate
                      ? editingRecurring.endDate.slice(0, 10)
                      : undefined,
                    isActive: editingRecurring.isActive,
                  }
                : undefined
            }
            onSubmit={editingRecurring ? handleUpdate : handleCreate}
          />
        </div>
      </ResponsiveModal>
    </div>
  );
}
