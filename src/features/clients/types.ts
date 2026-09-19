import type { ClientStatus } from "@/components/ui/StatusBadge";

export type { ClientStatus };
export type MembershipTier = "Platinum" | "Gold" | "Standard";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  membership: MembershipTier;
  status: ClientStatus;
  visitCount: number;
  lastVisitLabel: string;
  memberSinceLabel: string;
  preferenceNote?: string;
}

export interface TreatmentHistoryEntry {
  id: string;
  treatmentName: string;
  category: string;
  dateLabel: string;
  provider: string;
  outcome: string;
}

export interface AppointmentHistoryEntry {
  id: string;
  treatmentName: string;
  dateLabel: string;
  timeLabel: string;
  provider: string;
  status: "completed" | "missed";
}

export interface ClinicalNoteRecord {
  id: string;
  dateLabel: string;
  timeLabel: string;
  provider: string;
  treatmentName: string;
  room: string;
  durationLabel: string;
  lastSavedLabel: string;
  preview: string;
  treatmentDetails: string;
  providerNotes: string;
  productsUsed: string[];
  nextRecommendedVisit?: { dateLabel: string; treatmentType: string };
}

export type RetentionRiskLevel = "Low" | "Medium" | "High";

export interface ClientAIInsight {
  engagementScore: number;
  retentionRisk: RetentionRiskLevel;
  recommendedNext: { treatmentName: string; dateLabel: string };
  narrative: string;
}
