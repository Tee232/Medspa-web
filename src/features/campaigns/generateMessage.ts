import { audienceLabel, CAMPAIGN_GOALS } from "./mockData";
import type { CampaignDraft } from "./types";

function offerFor(goal: CampaignDraft["goal"], type: CampaignDraft["type"]): string {
  if (goal === "win_back") return "a complimentary skin consultation for returning clients";
  if (goal === "vip_appreciation") return "an exclusive complimentary add-on on your next visit";
  if (goal === "onboarding") return "a tailored second-visit plan when you book this month";
  if (goal === "seasonal") return "15% off any treatment booked this week";
  if (goal === "promote_treatment") return "10% off your first session this month";
  if (type === "Promotional") return "a limited-time offer on select treatments this month";
  return "priority booking at a time that works for you";
}

function smsMessage(draft: CampaignDraft): string {
  const firstName = "{first_name}";
  return `Hi ${firstName}! ${draft.name} is here at Lumiere. ${audienceLabel(draft.audienceType ?? "active")} can enjoy ${offerFor(draft.goal, draft.type)}. Reply BOOK to reserve your spot or call (310) 555-0100. — The Lumiere Team`;
}

function emailMessage(draft: CampaignDraft): string {
  const [goalLabel] = CAMPAIGN_GOALS.filter((g) => g.value === draft.goal).map((g) => g.label);
  return `Subject: ${draft.type} — ${goalLabel} ${draft.name}

Hi {first_name},

We hope you're doing wonderfully. As a valued guest of Lumiere MedSpa, we wanted to make sure you're the first to know about ${draft.name}.

You're receiving this because you're part of our ${audienceLabel(draft.audienceType ?? "active").toLowerCase()} group, and we genuinely appreciate having you with us. For a limited time, we're offering ${offerFor(draft.goal, draft.type)}.

Click below to book your next appointment at a time that works for you, and let's keep the glow going together.

With warmth,
The Lumiere MedSpa Team`;
}

/**
 * Mock AI copywriter — deterministic per draft (same inputs produce the
 * same message), mirroring how answerQuery synthesizes answers from the
 * module's data rather than returning canned placeholders.
 */
export function generateCampaignMessage(draft: CampaignDraft): string {
  return draft.channel === "Email" ? emailMessage(draft) : smsMessage(draft);
}