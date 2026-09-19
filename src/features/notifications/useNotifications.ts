import { useMemo, useState } from "react";
import type { NotificationItem, NotificationCategory } from "@/features/notifications/types";
import { mockNotifications } from "@/features/notifications/mockData";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);

  function markAsRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function addNotification(input: { title: string; description: string; category?: NotificationCategory; linkTo?: string }) {
    const newItem: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: input.title,
      description: input.description,
      timeLabel: "Just now",
      read: false,
      category: input.category || "appointment",
      linkTo: input.linkTo,
    };
    setNotifications((prev) => [newItem, ...prev]);
  }

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return { notifications, unreadCount, markAsRead, markAllAsRead, addNotification };
}
