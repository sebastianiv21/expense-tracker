"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { type CreateTransaction } from "@repo/shared";

import { cn } from "@/lib/utils";
import { bottomNavItems } from "@/config/nav";
import { Button } from "@/components/ui/button";
import {
  ResponsiveModal,
  ResponsiveModalClose,
} from "@/components/ui/responsive-modal";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { api, ApiError } from "@/lib/api-client";
import { type Category } from "@/app/(app)/categories/page";

export function MobileNav() {
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCats, setIsLoadingCats] = useState(false);

  const fetchCategories = async () => {
    setIsLoadingCats(true);
    try {
      const cats = await api.get<Category[]>("/categories");
      setCategories(cats);
    } catch (err: unknown) {
      console.error("Failed to fetch categories", err);
    } finally {
      setIsLoadingCats(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && categories.length === 0) {
      fetchCategories();
    }
  }, [isModalOpen, categories.length]);

  const handleCreateTransaction = async (values: CreateTransaction) => {
    setIsSubmitting(true);
    try {
      await api.post("/transactions", values);
      toast.success("Transaction recorded");
      setIsModalOpen(false);
      // Refresh the page if we are on dashboard or transactions
      if (pathname === "/" || pathname === "/transactions") {
        window.location.reload();
      }
    } catch (err: unknown) {
      const message =
        err instanceof ApiError ? err.message : "Failed to create transaction";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Split items to put Add button in the middle
  const half = Math.ceil(bottomNavItems.length / 2);
  const leftItems = bottomNavItems.slice(0, half);
  const rightItems = bottomNavItems.slice(half);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background pb-safe md:hidden">
      <div className="flex h-16 items-center justify-between px-2">
        <div className="flex flex-1 justify-around">
          {leftItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-1 text-xs transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "stroke-[2.5px]" : "stroke-2",
                  )}
                />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col items-center justify-center px-2 relative">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>

        <div className="flex flex-1 justify-around">
          {rightItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-2 py-1 text-xs transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "stroke-[2.5px]" : "stroke-2",
                  )}
                />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <ResponsiveModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        title="Add Transaction"
        description="Enter the details of your new income or expense."
        footer={
          <>
            <ResponsiveModalClose>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </ResponsiveModalClose>
            <Button
              type="submit"
              form="mobile-nav-transaction-form"
              className="w-full sm:w-auto"
              disabled={isSubmitting || isLoadingCats}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Record Transaction
            </Button>
          </>
        }
      >
        <div className="py-2">
          {isLoadingCats ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <TransactionForm
              id="mobile-nav-transaction-form"
              showFooter={false}
              categories={categories}
              onSubmit={handleCreateTransaction}
              onCancel={() => setIsModalOpen(false)}
            />
          )}
        </div>
      </ResponsiveModal>
    </nav>
  );
}
