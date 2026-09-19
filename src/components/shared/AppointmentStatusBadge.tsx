import type { AppointmentStatus } from "@/components/shared/Calendar";
import { cn } from "@/lib/utils";

export interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  className?: string;
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; text: string; dot: string }> = {
  confirmed: { label: "Confirmed", bg: "bg-[#E8F4F0]", text: "text-[#1A6B52]", dot: "bg-[#1A6B52]" },
  pending: { label: "Pending", bg: "bg-[#FEF9EC]", text: "text-[#92400E]", dot: "bg-[#C9A96E]" },
  completed: { label: "Completed", bg: "bg-[#F3F4F6]", text: "text-[#374151]", dot: "bg-[#9CA3AF]" },
  no_show: { label: "No-Show", bg: "bg-[#FEE2E2]", text: "text-[#991B1B]", dot: "bg-[#DC2626]" },
  cancelled: { label: "Cancelled", bg: "bg-[#F3F4F6]", text: "text-[#9CA3AF]", dot: "bg-[#D1D5DB]" },
};

export function AppointmentStatusBadge({ status, className }: AppointmentStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs font-medium", config.bg, config.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}
