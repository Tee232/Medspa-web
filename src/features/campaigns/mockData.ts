import type { Campaign, CampaignAudienceOption, CampaignChannel, CampaignGoal, CampaignType, WeeklyConversionPoint } from "./types";

export const AUDIENCE_OPTIONS: CampaignAudienceOption[] = [
  { value: "at_risk", label: "At-Risk Clients", description: "Clients flagged by retention signals", size: 10 },
  { value: "vip", label: "VIP Platinum Members", description: "Top-tier loyalty members", size: 8 },
  { value: "active", label: "All Active Clients", description: "Every client with an active status", size: 46 },
  { value: "new_clients", label: "New Clients (0–6 months)", description: "Recent acquisitions in onboarding window", size: 12 },
  { value: "inactive_90", label: "Inactive 90+ Days", description: "Lapsed clients past rebooking window", size: 6 },
  { value: "high_ltv", label: "High Lifetime Value", description: "Top 20% by total spend", size: 15 },
];

export const CAMPAIGN_GOALS: { value: CampaignGoal; label: string; description: string }[] = [
  { value: "re_engagement", label: "Re-engagement", description: "Re-book clients showing early churn signals" },
  { value: "win_back", label: "Win Back Lapsed Clients", description: "Recover clients inactive for 90+ days" },
  { value: "onboarding", label: "New Client Onboarding", description: "Nurture new clients into their second visit" },
  { value: "vip_appreciation", label: "VIP Appreciation", description: "Reward Platinum members with exclusive perks" },
  { value: "seasonal", label: "Seasonal Promotion", description: "Limited-time offer tied to the season" },
  { value: "promote_treatment", label: "Promote New Treatment", description: "Introduce a new or underutilized treatment" },
];

export const CAMPAIGN_TYPES: { value: CampaignType; label: string }[] = [
  { value: "Re-engagement", label: "Re-engagement" },
  { value: "Promotional", label: "Promotional" },
  { value: "Educational", label: "Educational" },
  { value: "Seasonal", label: "Seasonal" },
  { value: "Loyalty", label: "Loyalty" },
];

export const CHANNELS: { value: CampaignChannel; label: string; description: string; icon: "sms" | "email" }[] = [
  { value: "SMS", label: "SMS", description: "Instant text messages — high open rates, best for short, time-sensitive offers.", icon: "sms" },
  { value: "Email", label: "Email", description: "Rich, detailed messaging — ideal for longer narratives and booking links.", icon: "email" },
];

export function audienceLabel(value: Campaign["audienceType"]): string {
  return AUDIENCE_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function goalLabel(value: Campaign["goal"]): string {
  return CAMPAIGN_GOALS.find((o) => o.value === value)?.label ?? value;
}

export const mockCampaigns: Campaign[] = [
  {
    id: "cmp-summer-glow",
    name: "Summer Glow Re-engagement",
    goal: "re_engagement",
    type: "Seasonal",
    audienceType: "at_risk",
    audienceSize: 10,
    channel: "SMS",
    message:
      "Hi {first_name}! Summer is here, and so is your glow-up at Lumiere. Rebook your HydraFacial this month and enjoy 15% off. Reply BOOK or call (310) 555-0100. — The Lumiere Team",
    sendDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    sent: 10,
    opened: 9,
    converted: 4,
    revenue: 2840,
    status: "active",
  },
  {
    id: "cmp-platinum-appreciation",
    name: "Platinum Member Appreciation",
    goal: "vip_appreciation",
    type: "Loyalty",
    audienceType: "vip",
    audienceSize: 8,
    channel: "Email",
    message:
      "Hi {first_name},\n\nYou're one of our most valued Lumiere members. As a thank you, enjoy a complimentary add-on on your next treatment this month.\n\nWith warmth,\nThe Lumiere Team",
    sendDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    sent: 8,
    opened: 7,
    converted: 3,
    revenue: 3420,
    status: "completed",
  },
  {
    id: "cmp-skin-quiz",
    name: "Skin Health Check-In",
    goal: "re_engagement",
    type: "Educational",
    audienceType: "inactive_90",
    audienceSize: 6,
    channel: "Email",
    message:
      "Hi {first_name},\n\nIt's been a while since your last visit. Our skincare experts have a few seasonal tips to keep your results glowing. Reply to grab a complimentary skin consultation.\n\n— The Lumiere Team",
    sendDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    sent: 6,
    opened: 4,
    converted: 1,
    revenue: 620,
    status: "paused",
  },
  {
    id: "cmp-autumn-peel-launch",
    name: "Autumn Peel Launch",
    goal: "promote_treatment",
    type: "Promotional",
    audienceType: "high_ltv",
    audienceSize: 15,
    channel: "SMS",
    message:
      "Hi {first_name}! Our new Autumn Enzyme Peel is here. Book now and save 10% on your first session. Reply PEEL to claim yours. — The Lumiere Team",
    sendDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    sent: 15,
    opened: 11,
    converted: 2,
    revenue: 1580,
    status: "active",
  },
];

export const mockWeeklyConversions: WeeklyConversionPoint[] = [
  { week: "Jul 28", bookings: 3 },
  { week: "Aug 4", bookings: 5 },
  { week: "Aug 11", bookings: 4 },
  { week: "Aug 18", bookings: 7 },
  { week: "Aug 25", bookings: 6 },
  { week: "Sep 1", bookings: 8 },
  { week: "Sep 8", bookings: 10 },
];