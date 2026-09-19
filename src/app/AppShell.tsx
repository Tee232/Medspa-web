import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "@/components/shared/Sidebar";
import { Navbar } from "@/components/shared/Navbar";
import { useAuth } from "@/app/AuthContext";
import { useNotificationsContext } from "@/features/notifications/NotificationsContext";
import type { NotificationItem } from "@/features/notifications/types";

function getActiveKey(pathname: string): string {
  return pathname.split("/")[1] || "dashboard";
}

/**
 * Application shell: Sidebar + Navbar + routed content.
 * Sidebar is a persistent column at `lg`+, an off-canvas drawer below that.
 * AppShell is the one place that wires NotificationsContext into the
 * shell — Navbar itself stays prop-controlled, it never reaches into
 * context directly.
 */
export function AppShell() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user, logout, setRole } = useAuth();
  const { notifications, markAsRead, markAllAsRead } = useNotificationsContext();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const activeKey = getActiveKey(location.pathname);

  function handleNavigate(key: string) {
    navigate(`/${key}`);
    setMobileNavOpen(false);
  }

  function handleProfileClick() {
    navigate("/settings");
    setMobileNavOpen(false);
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleNotificationClick(item: NotificationItem) {
    markAsRead(item.id);
    if (item.linkTo) navigate(item.linkTo);
  }

  const roleDisplayLabel =
    user.role === "manager" ? "Operations Manager" : "Front Desk";

  return (
    <div className="flex h-screen overflow-hidden bg-[#F9F7F4]">
      <div className="hidden lg:block">
        <Sidebar
          activeKey={activeKey}
          onNavigate={handleNavigate}
          userName={user.name}
          userRole={user.role}
          avatarUrl={user.avatarUrl}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
        />
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setMobileNavOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ x: -220 }}
              animate={{ x: 0 }}
              exit={{ x: -220 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar
                activeKey={activeKey}
                onNavigate={handleNavigate}
                userName={user.name}
                userRole={user.role}
                avatarUrl={user.avatarUrl}
                onProfileClick={handleProfileClick}
                onLogout={handleLogout}
                className="shadow-2xl"
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          userName={user.name}
          userRole={roleDisplayLabel}
          avatarUrl={user.avatarUrl}
          onMenuClick={() => setMobileNavOpen(true)}
          notifications={notifications}
          onNotificationItemClick={handleNotificationClick}
          onMarkAllNotificationsRead={markAllAsRead}
          onProfileClick={handleProfileClick}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Quick Role Switcher for testing RBAC views */}
      <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2 rounded-full border border-[#E8E4DF] bg-white px-3.5 py-2 shadow-lg">
        <span className="font-body text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
          Role:
        </span>
        <button
          type="button"
          onClick={() => setRole(user.role === "manager" ? "front_desk" : "manager")}
          className="rounded-full bg-[#F3F0EB] px-2.5 py-1 font-body text-xs font-medium text-[#1A6B52] hover:bg-[#E8F4F0]"
        >
          {roleDisplayLabel}
        </button>
      </div>
    </div>
  );
}
