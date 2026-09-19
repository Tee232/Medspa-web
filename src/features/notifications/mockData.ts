import type { NotificationItem } from "@/features/notifications/types";

export const mockNotifications: NotificationItem[] = [
  { id: "notif-1", category: "scheduling", title: "Scheduling conflict detected", description: "Two appointments overlap on Dr. Reyes's schedule this afternoon.", timeLabel: "12 min ago", read: false, linkTo: "/appointments" },
  { id: "notif-2", category: "appointment", title: "Appointment confirmed", description: "Sophia Laurent confirmed her 9:00 AM HydraFacial Deluxe.", timeLabel: "38 min ago", read: false, linkTo: "/appointments" },
  { id: "notif-3", category: "client_activity", title: "Client marked at-risk", description: "Elena Vasquez hasn't visited in 62 days and was flagged at-risk.", timeLabel: "1 hour ago", read: false, linkTo: "/clients/client-elena" },
  { id: "notif-4", category: "ai_insight", title: "New AI scheduling insight", description: "3 open slots today match waitlisted clients — consider filling them.", timeLabel: "2 hours ago", read: true, linkTo: "/appointments" },
  { id: "notif-5", category: "appointment", title: "Appointment cancelled", description: "Grace Hartley's 3:15 PM Botox appointment was cancelled.", timeLabel: "Yesterday", read: true, linkTo: "/appointments" },
];
