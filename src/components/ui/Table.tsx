import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface TableColumn<T> {
  key: string;
  header: string;
  width?: string;
  render: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
  className?: string;
}

export function Table<T>({ columns, data, getRowId, onRowClick, isLoading = false, emptyState, className }: TableProps<T>) {
  const gridTemplate = columns.map((c) => c.width ?? "1fr").join(" ");

  return (
    <div className={cn("overflow-hidden rounded-[16px] border border-[#E8E4DF] bg-white", className)}>
      <div className="grid gap-4 bg-[#FAFAF9] px-5 py-2.5" style={{ gridTemplateColumns: gridTemplate }}>
        {columns.map((col) => (
          <span key={col.key} className="font-body text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
            {col.header}
          </span>
        ))}
      </div>

      {isLoading ? (
        <div className="divide-y divide-[#F5F2EF]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="px-5 py-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-[#F3F0EB]" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="px-5 py-12">
          {emptyState ?? <p className="text-center font-body text-sm text-[#6B7280]">No results found.</p>}
        </div>
      ) : (
        <div className="divide-y divide-[#F5F2EF]">
          {data.map((row) => (
            <div
              key={getRowId(row)}
              onClick={() => onRowClick?.(row)}
              className={cn("grid items-center gap-4 px-5 py-3.5 transition-colors", onRowClick && "cursor-pointer hover:bg-[#F3F0EB]")}
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {columns.map((col) => (
                <div key={col.key} className="min-w-0 font-body text-sm text-[#1C1C1A]">
                  {col.render(row)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
