import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = getPageWindow(currentPage, totalPages);

  return (
    <nav className={cn("flex items-center justify-between gap-4", className)} aria-label="Pagination">
      <p className="font-body text-xs text-[#6B7280]">Showing {currentPage} of {totalPages} pages</p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F0EB] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        {pages.map((page, i) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${i}`} className="flex h-8 w-8 items-center justify-center font-body text-xs text-[#9CA3AF]">…</span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full font-body text-xs font-medium transition-colors",
                page === currentPage ? "bg-[#1A6B52] text-white" : "text-[#6B7280] hover:bg-[#F3F0EB] hover:text-[#1C1C1A]"
              )}
            >
              {page}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F0EB] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}

function getPageWindow(current: number, total: number): (number | "ellipsis")[] {
  const window = 1;
  const pages = new Set<number>([1, total]);
  for (let p = current - window; p <= current + window; p++) {
    if (p > 0 && p <= total) pages.add(p);
  }
  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  sorted.forEach((page, i) => {
    if (i > 0 && page - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(page);
  });
  return result;
}
