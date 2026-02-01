"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  className?: string;
}

export function Pagination({
  total,
  limit,
  offset,
  onPageChange,
  className,
}: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);
  const startItem = offset + 1;
  const endItem = Math.min(offset + limit, total);

  if (totalPages <= 1) return null;

  // Generate page numbers to show (always show first, last, current, and neighbors)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="text-xs text-[#a89580]">
        Showing {startItem}-{endItem} of {total} transactions
      </div>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-[#2d2420] bg-transparent text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed] disabled:opacity-50"
          onClick={() => onPageChange(offset - limit)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Mobile: Just show page indicator */}
        <div className="sm:hidden text-sm text-[#f5f2ed] font-medium px-3">
          Page {currentPage} of {totalPages}
        </div>

        {/* Desktop: Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          {pages.map((page, idx) => (
            <div key={idx}>
              {page === "..." ? (
                <span className="px-2 text-[#a89580]">...</span>
              ) : (
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "h-8 w-8 text-xs",
                    currentPage === page
                      ? "warm-gradient text-white border-0"
                      : "border-[#2d2420] bg-transparent text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed]"
                  )}
                  onClick={() => onPageChange((Number(page) - 1) * limit)}
                >
                  {page}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 border-[#2d2420] bg-transparent text-[#a89580] hover:bg-[#1f1815] hover:text-[#f5f2ed] disabled:opacity-50"
          onClick={() => onPageChange(offset + limit)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
