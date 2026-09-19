import { useEffect, useRef, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/SearchBar";
import { Avatar } from "@/components/ui/Avatar";
import { NotificationPanel } from "@/components/shared/NotificationPanel";
import type { NotificationItem } from "@/features/notifications/types";

export interface NavbarProps {
  userName: string;
  userRole: string;
  avatarUrl?: string;
  onSearch?: (query: string) => void;
  notifications?: NotificationItem[];
  onNotificationItemClick?: (item: NotificationItem) => void;
  onMarkAllNotificationsRead?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  className?: string;
}

/** Top bar: mobile menu trigger, global search, notification bell (with popover), profile chip. */
export function Navbar({
  userName,
  userRole,
  avatarUrl,
  onSearch,
  notifications = [],
  onNotificationItemClick,
  onMarkAllNotificationsRead,
  onProfileClick,
  onMenuClick,
  className,
}: NavbarProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasUnread = notifications.some((n) => !n.read);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setPanelOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setPanelOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <header className={cn("flex h-[62px] items-center gap-4 border-b border-[#E8E4DF] bg-white px-4 sm:px-6", className)}>
      {onMenuClick && (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F0EB] lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      <SearchBar placeholder="Search clients, appointments..." onChange={onSearch} className="max-w-[400px] flex-1" aria-label="Search clients and appointments" />

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => setPanelOpen((o) => !o)}
            aria-label={hasUnread ? "Notifications, unread" : "Notifications"}
            aria-haspopup="menu"
            aria-expanded={panelOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F0EB] text-[#6B7280] transition-colors hover:bg-[#E8E4DF] hover:text-[#1C1C1A]"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
            {hasUnread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full border-2 border-white bg-[#DC2626]" aria-hidden="true" />}
          </button>

          {panelOpen && (
            <NotificationPanel
              notifications={notifications}
              onItemClick={(item) => {
                setPanelOpen(false);
                onNotificationItemClick?.(item);
              }}
              onMarkAllRead={() => onMarkAllNotificationsRead?.()}
              className="absolute right-0 top-full z-20 mt-2"
            />
          )}
        </div>

        <button type="button" onClick={onProfileClick} className="flex items-center gap-2.5 rounded-full bg-[#F3F0EB] py-1 pl-2.5 pr-1 transition-colors hover:bg-[#E8E4DF]">
          <span className="hidden text-right sm:block">
            <span className="block font-heading text-xs font-semibold leading-tight text-[#1C1C1A]">{userName}</span>
            <span className="block font-body text-[11px] leading-tight text-[#6B7280]">{userRole}</span>
          </span>
          <Avatar name={userName} imageUrl={avatarUrl} size="sm" className="!bg-[#C9A96E]" />
        </button>
      </div>
    </header>
  );
}
