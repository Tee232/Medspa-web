export type NotificationCategory = "appointment" | "scheduling" | "ai_insight" | "client_activity";

export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timeLabel: string;
  read: boolean;
  linkTo?: string;
}
