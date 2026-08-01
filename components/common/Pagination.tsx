"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages] as const;
  }

  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages] as const;
  }

  return [1, "...", currentPage, "...", totalPages] as const;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);
  const paginationItems = getPaginationItems(safeCurrentPage, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 text-white sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-[#f2f2f2]">
        Showing {startItem} to {endItem} of {totalItems} results
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => onPageChange(safeCurrentPage - 1)}
          className="flex size-8 items-center justify-center rounded border border-[#f1f1f1] text-[#f1f1f1] transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#f1f1f1]"
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {paginationItems.map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex size-8 items-center justify-center rounded border border-[#2f2f2f] text-sm text-[#b5b5b5]"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={cn(
                "flex size-8 items-center justify-center rounded border text-sm transition-colors",
                item === safeCurrentPage
                  ? "border-[#f1f1f1] bg-[#f1f1f1] text-black"
                  : "border-[#2f2f2f] text-[#b5b5b5] hover:border-[#f1f1f1] hover:text-white",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={safeCurrentPage === totalPages}
          onClick={() => onPageChange(safeCurrentPage + 1)}
          className="flex size-8 items-center justify-center rounded border border-[#2f2f2f] text-[#b5b5b5] transition-colors hover:border-[#f1f1f1] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
