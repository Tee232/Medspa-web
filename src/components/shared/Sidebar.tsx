import type { ReactNode } from "react";
import { Sparkles, LayoutDashboard, Calendar, Users, TrendingUp, Settings, LogOut, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";

export type UserRole = "front_desk" | "manager";

export interface SidebarNavItem {
  key: string;
  label: string;
  icon: ReactNode;
  role?: UserRole;
}

export interface SidebarProps {
  activeKey: string;
  onNavigate: (key: string) => void;
  userName: string;
  userRole: UserRole;
  avatarUrl?: string;
  onProfileClick?: () => void;
  onLogout?: () => void;
  className?: string;
}

const NAV_ITEMS: SidebarNavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { key: "customer-requests", label: "Customer Requests", icon: <Inbox className="h-5 w-5" /> },
  { key: "appointments", label: "Appointments", icon: <Calendar className="h-5 w-5" /> },
  { key: "clients", label: "Clients", icon: <Users className="h-5 w-5" /> },
  { key: "retention", label: "Retention", icon: <TrendingUp className="h-5 w-5" />, role: "manager" },
  { key: "settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

const ROLE_LABEL: Record<UserRole, string> = {
  front_desk: "Front Desk",
  manager: "Operations Manager",
};

/** Primary app navigation. Filters items by role — Retention only renders for managers. */
export function Sidebar({
  activeKey,
  onNavigate,
  userName,
  userRole,
  avatarUrl,
  onProfileClick,
  onLogout,
  className,
}: SidebarProps) {
  const visibleItems = NAV_ITEMS.filter((item) => !item.role || item.role === userRole);

  return (
    <nav className={cn("flex h-full w-[220px] flex-col border-r border-[#E8E4DF] bg-[#F9F7F4]", className)} aria-label="Main navigation">
      <div className="flex items-center gap-2.5 border-b border-[#E8E4DF] px-[18px] py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#1A6B52]">
          <Sparkles className="h-[18px] w-[18px] text-white" aria-hidden="true" />
        </div>
        <div>
          <div className="font-heading text-sm font-bold leading-tight text-[#1C1C1A]">Lumière MedSpa</div>
          <div className="font-body text-[10px] font-medium uppercase tracking-wide text-[#6B7280]">Operations</div>
        </div>
      </div>

      <div className="flex-1 px-3 pt-4">
        <p className="px-2 pb-2.5 font-body text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">Main Menu</p>
        <ul className="flex flex-col gap-0.5">
          {visibleItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2.5 font-body text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B52]",
                    isActive
                      ? "rounded-[16px] border-r border-[#1A6B52] bg-[#E8F4F0] font-semibold text-[#1A6B52]"
                      : "rounded-[10px] text-[#6B7280] hover:bg-[#EEEBE6] hover:text-[#1C1C1A]"
                  )}
                >
                  {item.icon}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-[#E8E4DF] p-2">
        <button
          type="button"
          onClick={onProfileClick}
          className="flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-[#EEEBE6]"
        >
          <Avatar name={userName} imageUrl={avatarUrl} size="md" />
          <div className="min-w-0 flex-1">
            <div className="truncate font-body text-xs font-semibold text-[#1C1C1A]">{userName}</div>
            <div className="truncate font-body text-[11px] text-[#6B7280]">{ROLE_LABEL[userRole] || userRole}</div>
          </div>
        </button>

        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 font-body text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </nav>
  );
}
