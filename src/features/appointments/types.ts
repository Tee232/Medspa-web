import type { AppointmentStatus } from "@/components/shared/Calendar";

export type { AppointmentStatus };

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  openSlotsToday: number;
  available: boolean;
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  priceLabel: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface AppointmentClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisitLabel?: string;
}

export interface Appointment {
  id: string;
  client: AppointmentClient;
  treatment: Treatment;
  provider: Provider;
  room: Room;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  cancellationReason?: string;
  cancellationNotes?: string;
  clinicalNote?: {
    treatmentDetails: string;
    providerNotes: string;
    productsUsed: string[];
    nextRecommendedVisit?: string;
  };
}

export interface SuggestedSlot {
  startTime: string;
  endTime: string;
  label: "Best Match" | "Best Utilization" | "Low Traffic" | "Top Pick";
  reason: string;
}
