import { cn } from "@/lib/utils";

export type ClientStatus = "active" | "at_risk" | "new" | "inactive";

export interface StatusBadgeProps {
  status: ClientStatus;
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<ClientStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[#E8F4F0] text-[#1A6B52]" },
  at_risk: { label: "At-Risk", className: "bg-[#FEE2E2] text-[#DC2626]" },
  new: { label: "New", className: "bg-[#EFF6FF] text-[#1D4ED8]" },
  inactive: { label: "Inactive", className: "bg-[#F3F4F6] text-[#6B7280]" },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium",
        config.className,
        className
      )}
    >
      {label || config.label}
    </span>
  );
}
