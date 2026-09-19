import {
  Send,
  Eye,
  TrendingUp,
  Pause,
  Play,
  CheckCircle2,
  RefreshCw,
  Users,
  Megaphone,
  MessageSquare,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Campaign, CampaignStatus } from "@/features/campaigns/types";
import {
  campaignOpenRate,
  campaignConversionRate,
  campaignROIPct,
  campaignSpend,
} from "@/features/campaigns/useCampaigns";
import { audienceLabel, goalLabel } from "@/features/campaigns/mockData";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CampaignStatus, { label: string; className: string; dot: string }> = {
  active: { label: "Active", className: "bg-[#E8F4F0] text-[#1A6B52]", dot: "bg-[#1A6B52]" },
  paused: { label: "Paused", className: "bg-[#FEF3C7] text-[#92400E]", dot: "bg-[#F59E0B]" },
  completed: { label: "Completed", className: "bg-[#EFF6FF] text-[#1D4ED8]", dot: "bg-[#3B82F6]" },
  draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#6B7280]", dot: "bg-[#9CA3AF]" },
};

function StatusBadge({ status }: { status: CampaignStatus }) {
  const config = STATUS_STYLES[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-semibold", config.className)}>
      <span className={cn("mr-1.5 h-2 w-2 rounded-full", config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  );
}

export interface CampaignDetailModalProps {
  campaign: Campaign | null;
  onClose: () => void;
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onReuse: (campaign: Campaign) => void;
}

export function CampaignDetailModal({
  campaign,
  onClose,
  onStatusChange,
  onReuse,
}: CampaignDetailModalProps) {
  if (!campaign) return null;

  const openRate = campaignOpenRate(campaign);
  const conversionRate = campaignConversionRate(campaign);
  const roi = campaignROIPct(campaign);
  const spend = campaignSpend(campaign);

  return (
    <Modal
      open={Boolean(campaign)}
      onClose={onClose}
      title="Campaign Details"
      size="md"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            {campaign.status === "paused" && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => {
                    onStatusChange(campaign.id, "completed");
                    onClose();
                  }}
                >
                  Finish Campaign
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Play className="h-4 w-4" />}
                  onClick={() => {
                    onStatusChange(campaign.id, "active");
                    onClose();
                  }}
                >
                  Resume Campaign
                </Button>
              </>
            )}

            {campaign.status === "active" && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Pause className="h-4 w-4 text-[#D97706]" />}
                  onClick={() => {
                    onStatusChange(campaign.id, "paused");
                    onClose();
                  }}
                >
                  Pause Campaign
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  onClick={() => {
                    onStatusChange(campaign.id, "completed");
                    onClose();
                  }}
                >
                  End Campaign
                </Button>
              </>
            )}

            {campaign.status === "completed" && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" />}
                onClick={() => {
                  onClose();
                  onReuse(campaign);
                }}
              >
                Reuse Campaign
              </Button>
            )}

            {campaign.status === "draft" && (
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Send className="h-4 w-4" />}
                onClick={() => {
                  onStatusChange(campaign.id, "active");
                  onClose();
                }}
              >
                Launch Campaign
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Top Header Card */}
        <div className="rounded-[16px] border border-[#E8E4DF] bg-[#FAFAF9] p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-heading text-lg font-bold text-[#1C1C1A]">{campaign.name}</h3>
              <p className="mt-0.5 font-body text-xs text-[#6B7280]">
                Launched / Scheduled: {new Date(campaign.sendDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F0EB] px-2.5 py-1 font-body text-xs font-semibold text-[#1C1C1A]">
                {campaign.channel === "SMS" ? <Send className="h-3 w-3 text-[#1A6B52]" /> : <Eye className="h-3 w-3 text-[#1A6B52]" />}
                {campaign.channel}
              </span>
              <StatusBadge status={campaign.status} />
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-[12px] border border-[#F0EDE8] bg-white p-3">
            <div className="flex items-center gap-1.5 font-body text-xs text-[#6B7280]">
              <Users className="h-3.5 w-3.5 text-[#1A6B52]" /> Target Audience
            </div>
            <div className="mt-1 font-body text-xs font-bold text-[#1C1C1A] truncate">
              {audienceLabel(campaign.audienceType)}
            </div>
            <div className="font-body text-[11px] text-[#9CA3AF]">{campaign.audienceSize} recipients</div>
          </div>

          <div className="rounded-[12px] border border-[#F0EDE8] bg-white p-3">
            <div className="flex items-center gap-1.5 font-body text-xs text-[#6B7280]">
              <Megaphone className="h-3.5 w-3.5 text-[#1A6B52]" /> Campaign Type
            </div>
            <div className="mt-1 font-body text-xs font-bold text-[#1C1C1A] truncate">
              {campaign.type}
            </div>
            <div className="font-body text-[11px] text-[#9CA3AF]">{goalLabel(campaign.goal)}</div>
          </div>

          <div className="col-span-2 rounded-[12px] border border-[#F0EDE8] bg-white p-3 sm:col-span-1">
            <div className="flex items-center gap-1.5 font-body text-xs text-[#6B7280]">
              <TrendingUp className="h-3.5 w-3.5 text-[#1A6B52]" /> Return on Ad Spend
            </div>
            <div className={cn("mt-1 font-body text-sm font-extrabold", roi > 0 ? "text-[#1A6B52]" : "text-[#DC2626]")}>
              {roi}% ROI
            </div>
            <div className="font-body text-[11px] text-[#9CA3AF]">${spend} est. spend</div>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div>
          <h4 className="mb-2 font-body text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            Performance Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-[12px] bg-[#F8F6F2] p-3 text-center">
              <span className="block font-body text-xs text-[#6B7280]">Messages Sent</span>
              <span className="font-heading text-lg font-bold text-[#1C1C1A]">{campaign.sent.toLocaleString()}</span>
            </div>
            <div className="rounded-[12px] bg-[#EFF6FF] p-3 text-center">
              <span className="block font-body text-xs text-[#3B82F6]">Open Rate</span>
              <span className="font-heading text-lg font-bold text-[#1D4ED8]">{openRate}%</span>
              <span className="block font-body text-[10px] text-[#60A5FA]">{campaign.opened.toLocaleString()} opened</span>
            </div>
            <div className="rounded-[12px] bg-[#FEF9EC] p-3 text-center">
              <span className="block font-body text-xs text-[#D97706]">Conversions</span>
              <span className="font-heading text-lg font-bold text-[#B45309]">{campaign.converted}</span>
              <span className="block font-body text-[10px] text-[#F59E0B]">{conversionRate}% rate</span>
            </div>
            <div className="rounded-[12px] bg-[#F0FDF4] p-3 text-center">
              <span className="block font-body text-xs text-[#16A34A]">Revenue</span>
              <span className="font-heading text-lg font-bold text-[#15803D]">${campaign.revenue.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Campaign Message Preview */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
              Campaign Message Preview
            </h4>
            <span className="font-body text-[11px] text-[#1A6B52] font-medium">
              {campaign.channel} Format
            </span>
          </div>
          <div className="rounded-[16px] border border-[#E8E4DF] bg-[#FDFCFB] p-4 text-xs font-body text-[#374151] leading-relaxed shadow-inner">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#1A6B52]">
              <MessageSquare className="h-3.5 w-3.5" /> Outbound Message Body
            </div>
            {campaign.message}
          </div>
        </div>
      </div>
    </Modal>
  );
}
