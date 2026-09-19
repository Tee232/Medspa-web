import { useMemo, useState } from "react";
import type { Campaign, CampaignChannel, CampaignPerformance, CampaignStatus, CampaignDraft } from "./types";
import { AUDIENCE_OPTIONS, mockCampaigns } from "./mockData";

/** Estimated per-recipient send cost used to derive ROI on mock campaigns. */
function sendCost(channel: CampaignChannel): number {
  return channel === "SMS" ? 0.08 : 0.06;
}

export function campaignSpend(campaign: Campaign): number {
  return Math.round(campaign.sent * sendCost(campaign.channel));
}

export function campaignOpenRate(campaign: Campaign): number {
  if (campaign.sent === 0) return 0;
  return Math.round((campaign.opened / campaign.sent) * 100);
}

export function campaignConversionRate(campaign: Campaign): number {
  if (campaign.sent === 0) return 0;
  return Math.round((campaign.converted / campaign.sent) * 100);
}

export function campaignROIPct(campaign: Campaign): number {
  const spend = campaignSpend(campaign);
  if (spend === 0) return 0;
  return Math.round(((campaign.revenue - spend) / spend) * 100);
}

export interface CreateCampaignInput {
  draft: CampaignDraft;
  status: CampaignStatus;
}

/**
 * Owns the campaign list as real React state (same pattern as
 * useClients / useAppointments). `create` accepts either a launched
 * (active) campaign or a draft saved before launch.
 */
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);

  function create({ draft, status }: CreateCampaignInput): Campaign {
    if (!draft.name || !draft.goal || !draft.type || !draft.audienceType || !draft.channel) {
      throw new Error("Campaign draft is incomplete");
    }
    const audienceSize =
      AUDIENCE_OPTIONS.find((o) => o.value === draft.audienceType)?.size ?? 0;
    const sendDate = draft.sendDate ? new Date(`${draft.sendDate}T09:00:00`).toISOString() : new Date().toISOString();

    const newCampaign: Campaign = {
      id: `cmp-${Date.now()}`,
      name: draft.name,
      goal: draft.goal,
      type: draft.type,
      audienceType: draft.audienceType,
      audienceSize,
      channel: draft.channel,
      message: draft.message,
      sendDate,
      sent: 0,
      opened: 0,
      converted: 0,
      revenue: 0,
      status,
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    return newCampaign;
  }

  function updateStatus(id: string, status: CampaignStatus) {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  function remove(id: string) {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }

  const performance: CampaignPerformance = useMemo(() => {
    const live = campaigns.filter((c) => c.status !== "draft");
    const totalSent = live.reduce((sum, c) => sum + c.sent, 0);
    const totalOpened = live.reduce((sum, c) => sum + c.opened, 0);
    const totalConverted = live.reduce((sum, c) => sum + c.converted, 0);
    const totalRevenue = live.reduce((sum, c) => sum + c.revenue, 0);
    const avgOpenRate =
      live.length === 0 || totalSent === 0 ? 0 : Math.round((totalOpened / totalSent) * 100);
    return { totalSent, avgOpenRate, totalConverted, totalRevenue };
  }, [campaigns]);

  return { campaigns, performance, create, updateStatus, remove };
}