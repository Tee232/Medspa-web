import { Calendar, AlertTriangle, Sparkles, Users, BellOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/DataStates";
import type { NotificationCategory, NotificationItem } from "@/features/notifications/types";

export interface NotificationPanelProps {
  notifications: NotificationItem[];
  onItemClick: (item: NotificationItem) => void;
  onMarkAllRead: () => void;
  className?: string;
}

const CATEGORY_ICON: Record<NotificationCategory, { icon: typeof Calendar; bg: string; color: string }> = {
  appointment: { icon: Calendar, bg: "#E8F4F0", color: "#1A6B52" },
  scheduling: { icon: AlertTriangle, bg: "#FEF9EC", color: "#C9A96E" },
  ai_insight: { icon: Sparkles, bg: "#F0EEFB", color: "#7C6FCD" },
  client_activity: { icon: Users, bg: "#EFF6FF", color: "#3B82F6" },
};

/** Popover content for the Navbar bell. Purely controlled via props. */
export function NotificationPanel({ notifications, onItemClick, onMarkAllRead, className }: NotificationPanelProps) {
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div role="menu" aria-label="Notifications" className={cn("w-[360px] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white shadow-lg", className)}>
      <div className="flex items-center justify-between border-b border-[#E8E4DF] px-4 py-3">
        <span className="font-heading text-sm font-bold text-[#1C1C1A]">Notifications</span>
        {hasUnread && (
          <button type="button" onClick={onMarkAllRead} className="font-body text-xs font-medium text-[#1A6B52] hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={<BellOff className="h-6 w-6" />} title="No notifications" description="You're all caught up." className="py-10" />
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((item) => {
            const { icon: Icon, bg, color } = CATEGORY_ICON[item.category];
            return (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => onItemClick(item)}
                className={cn(
                  "flex w-full items-start gap-3 border-b border-[#F5F2EF] px-4 py-3 text-left transition-colors last:border-0 hover:bg-[#F9FAFB]",
                  !item.read && "bg-[#FAFAF9]"
                )}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: bg, color }}>
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("truncate font-body text-sm", item.read ? "font-medium text-[#1C1C1A]" : "font-semibold text-[#1C1C1A]")}>
                      {item.title}
                    </span>
                    {!item.read && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A6B52]" aria-label="Unread" />}
                  </div>
                  <p className="mt-0.5 line-clamp-2 font-body text-xs text-[#6B7280]">{item.description}</p>
                  <p className="mt-1 font-body text-[11px] text-[#9CA3AF]">{item.timeLabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
