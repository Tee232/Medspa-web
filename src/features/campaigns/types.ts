export type CampaignChannel = "SMS" | "Email";

export type CampaignStatus = "active" | "completed" | "paused" | "draft";

export type CampaignGoal =
  | "re_engagement"
  | "win_back"
  | "onboarding"
  | "vip_appreciation"
  | "seasonal"
  | "promote_treatment";

export type CampaignType =
  | "Re-engagement"
  | "Promotional"
  | "Educational"
  | "Seasonal"
  | "Loyalty";

export type AudienceType =
  | "at_risk"
  | "vip"
  | "active"
  | "new_clients"
  | "inactive_90"
  | "high_ltv";

/**
 * A retention campaign as displayed on the Campaigns tab. When a
 * manager launches or saves a draft, a full record is created from
 * the wizard draft.
 */
export interface Campaign {
  id: string;
  name: string;
  goal: CampaignGoal;
  type: CampaignType;
  audienceType: AudienceType;
  audienceSize: number;
  channel: CampaignChannel;
  message: string;
  sendDate: string; // ISO timestamp of launch/schedule
  sent: number;
  opened: number;
  converted: number;
  revenue: number;
  status: CampaignStatus;
}

/** In-progress data collected across the five Add Campaign wizard steps. */
export interface CampaignDraft {
  name: string;
  goal: CampaignGoal | null;
  type: CampaignType | null;
  audienceType: AudienceType | null;
  channel: CampaignChannel | null;
  sendDate: string; // ISO date (YYYY-MM-DD)
  message: string;
  aiGenerated: boolean;
}

export interface CampaignAudienceOption {
  value: AudienceType;
  label: string;
  description: string;
  size: number;
}

export interface WeeklyConversionPoint {
  week: string;
  bookings: number;
}

export interface CampaignPerformance {
  totalSent: number;
  avgOpenRate: number;
  totalConverted: number;
  totalRevenue: number;
}