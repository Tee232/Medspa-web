import type { AppointmentStatus } from "@/components/shared/Calendar";

export interface MockAppointment {
  id: string;
  time: string;
  clientName: string;
  durationLabel: string;
  service: string;
  provider: string;
  status: AppointmentStatus;
}

export const mockTodayAppointments: MockAppointment[] = [
  { id: "appt-1", time: "9:00 AM", clientName: "Sophia Laurent", durationLabel: "60 min", service: "HydraFacial Deluxe", provider: "Dr. Kim", status: "confirmed" },
  { id: "appt-2", time: "10:15 AM", clientName: "Mia Chen", durationLabel: "45 min", service: "Botox — Full Face", provider: "Dr. Reyes", status: "confirmed" },
  { id: "appt-3", time: "11:00 AM", clientName: "Ava Thornton", durationLabel: "75 min", service: "Laser Skin Resurfacing", provider: "Dr. Kim", status: "pending" },
  { id: "appt-4", time: "12:30 PM", clientName: "Isabella Ross", durationLabel: "30 min", service: "Vitamin IV Drip", provider: "RN Patel", status: "confirmed" },
  { id: "appt-5", time: "2:00 PM", clientName: "Chloe Nakamura", durationLabel: "60 min", service: "Microneedling RF", provider: "Dr. Reyes", status: "pending" },
];

export interface MockAtRiskClient {
  id: string;
  name: string;
  riskLevel: "High" | "Medium";
  daysSinceVisit: number;
  missedCount: number;
  lifetimeValue: number;
}

export const mockAtRiskClients: MockAtRiskClient[] = [
  { id: "client-elena", name: "Elena Vasquez", riskLevel: "High", daysSinceVisit: 62, missedCount: 2, lifetimeValue: 4280 },
  { id: "client-thomas", name: "Thomas Mercer", riskLevel: "Medium", daysSinceVisit: 38, missedCount: 1, lifetimeValue: 2950 },
  { id: "client-naomi", name: "Naomi Kelley", riskLevel: "Medium", daysSinceVisit: 44, missedCount: 0, lifetimeValue: 6100 },
];

export const mockDashboardStats = {
  todayAppointmentCount: 18,
  dayProgressPct: 72,
  confirmedCount: 13,
  pendingCount: 3,
  noShowCount: 2,
  atRiskTotalCount: 14,
  atRiskFlaggedThisWeek: 4,
  clinicUtilizationPct: 78,
  clinicUtilizationTarget: 85,
  followUpsSent: 23,
  followUpsResponded: 9,
  clinicScore: 74,
  clinicScoreActionsAvailable: 3,
};
