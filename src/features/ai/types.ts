import type { Appointment, Provider, Room } from "@/features/appointments/types";
import type { Client, ClientAIInsight } from "@/features/clients/types";

export type AIModuleContext =
  | {
      module: "dashboard";
      stats: {
        todayAppointmentCount: number;
        confirmedCount: number;
        pendingCount: number;
        noShowCount: number;
        atRiskTotalCount: number;
        clinicUtilizationPct: number;
        followUpsSent: number;
      };
    }
  | { module: "appointments"; appointments: Appointment[]; providers: Provider[]; rooms: Room[] }
  | { module: "clients"; clients: Client[] }
  | { module: "client_profile"; client: Client; upcomingAppointment?: Appointment; aiInsight?: ClientAIInsight }
  | { module: "settings" };

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}
