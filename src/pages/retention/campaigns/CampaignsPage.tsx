import { useState, type ReactNode } from "react";
import {
  CheckCircle2,
  DollarSign,
  Eye,
  Pause,
  Play,
  Plus,
  Send,
  Trash2,
  UserCheck,
  TrendingUp,
  History,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { AddCampaignWizard } from "@/components/campaigns/AddCampaignWizard";
import { CampaignDetailModal } from "@/components/campaigns/CampaignDetailModal";
import { useCampaignsContext } from "@/features/campaigns/CampaignsContext";
import { campaignROIPct } from "@/features/campaigns/useCampaigns";
import { mockWeeklyConversions } from "@/features/campaigns/mockData";
import type { Campaign, CampaignDraft, CampaignStatus } from "@/features/campaigns/types";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<CampaignStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[#E8F4F0] text-[#1A6B52]" },
  paused: { label: "Paused", className: "bg-[#FEF3C7] text-[#92400E]" },
  completed: { label: "Completed", className: "bg-[#EFF6FF] text-[#1D4ED8]" },
  draft: { label: "Draft", className: "bg-[#F3F4F6] text-[#6B7280]" },
};

function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const config = STATUS_STYLES[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium", config.className)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", status === "active" ? "bg-[#1A6B52]" : status === "paused" ? "bg-[#F59E0B]" : status === "completed" ? "bg-[#3B82F6]" : "bg-[#9CA3AF]")} aria-hidden="true" />
      {config.label}
    </span>
  );
}

function ChannelPill({ channel }: { channel: Campaign["channel"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F0EB] px-2.5 py-1 font-body text-xs font-medium text-[#1C1C1A]">
      {channel === "SMS" ? <Send className="h-3 w-3 text-[#1A6B52]" aria-hidden="true" /> : <Eye className="h-3 w-3 text-[#1A6B52]" aria-hidden="true" />}
      {channel}
    </span>
  );
}

const TABLE_GRID = "grid grid-cols-[minmax(150px,1fr)_84px_64px_80px_64px_92px_68px_104px_44px] items-center gap-3 px-5";

function HeaderCell({ children, align = "left" }: { children: ReactNode; align?: "left" | "right" }) {
  return (
    <span className={cn("font-body text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]", align === "right" && "text-right")}>
      {children}
    </span>
  );
}

function CampaignTable({
  campaigns,
  onStatusChange,
  onDelete,
  onNewCampaign,
  onSelectCampaign,
}: {
  campaigns: Campaign[];
  onStatusChange: (id: string, status: CampaignStatus) => void;
  onDelete: (id: string) => void;
  onNewCampaign: () => void;
  onSelectCampaign: (campaign: Campaign) => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between overflow-hidden rounded-[20px] border border-[#E8E4DF] bg-white">
      <div className="overflow-x-auto flex-1">
        <div className="min-w-[720px]">
          {/* Header */}
          <div className={cn("border-b border-[#E8E4DF] bg-[#FAFAF9] py-2.5", TABLE_GRID)}>
            <HeaderCell>Campaign Name</HeaderCell>
            <HeaderCell>Channel</HeaderCell>
            <HeaderCell align="right">Opened</HeaderCell>
            <HeaderCell align="right">Converted</HeaderCell>
            <HeaderCell align="right">Sent</HeaderCell>
            <HeaderCell align="right">Revenue</HeaderCell>
            <HeaderCell align="right">ROI</HeaderCell>
            <HeaderCell>Status</HeaderCell>
            <HeaderCell align="right">Action</HeaderCell>
          </div>

          {/* Rows */}
          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#F3F0EB] text-[#6B7280]">
                <History className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="font-heading text-sm font-bold text-[#1C1C1A]">No campaigns yet</p>
              <p className="mt-1 max-w-xs font-body text-xs text-[#6B7280]">Launch your first AI-generated campaign to start re-engaging at-risk clients.</p>
              <Button variant="primary" size="sm" className="mt-4" leftIcon={<Plus className="h-4 w-4" />} onClick={onNewCampaign}>
                New Campaign
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#F5F2EF]">
              {campaigns.map((row) => {
                const roi = campaignROIPct(row);
                const items = [];
                if (row.status === "active") {
                  items.push({ label: "Pause Campaign", icon: <Pause className="h-4 w-4" />, onClick: () => onStatusChange(row.id, "paused" as const) });
                } else if (row.status === "paused") {
                  items.push({ label: "Resume Campaign", icon: <Play className="h-4 w-4" />, onClick: () => onStatusChange(row.id, "active" as const) });
                }
                if (row.status !== "completed") {
                  items.push({ label: "Mark Completed", icon: <CheckCircle2 className="h-4 w-4" />, onClick: () => onStatusChange(row.id, "completed" as const) });
                }
                items.push({ label: "Delete Campaign", icon: <Trash2 className="h-4 w-4" />, danger: true, onClick: () => onDelete(row.id) });

                return (
                  <div
                    key={row.id}
                    className={cn("py-3.5 cursor-pointer transition-colors hover:bg-[#FDFCFB]", TABLE_GRID)}
                    onClick={() => onSelectCampaign(row)}
                  >
                    <div className="min-w-0 pr-2">
                      <div className="truncate font-body text-sm font-semibold text-[#1C1C1A]">{row.name}</div>
                      <div className="truncate font-body text-xs text-[#6B7280]">
                        {new Date(row.sendDate).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                    </div>
                    <div className="min-w-0"><ChannelPill channel={row.channel} /></div>
                    <span className="text-right font-body text-sm text-[#6B7280]">{row.opened.toLocaleString()}</span>
                    <span className="text-right font-body text-sm font-medium text-[#1A6B52]">{row.converted}</span>
                    <span className="text-right font-body text-sm font-medium text-[#1C1C1A]">{row.sent.toLocaleString()}</span>
                    <span className="text-right font-body text-sm font-medium text-[#1C1C1A]">${row.revenue.toLocaleString()}</span>
                    <span className={cn("text-right font-body text-sm font-semibold", roi > 0 ? "text-[#1A6B52]" : "text-[#DC2626]")}>{roi}%</span>
                    <span className="min-w-0"><CampaignStatusBadge status={row.status} /></span>
                    <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu items={items} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CampaignsPage() {
  const { campaigns, performance, updateStatus, remove } = useCampaignsContext();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [reuseDraft, setReuseDraft] = useState<Partial<CampaignDraft> | undefined>(undefined);

  const weekTotal = mockWeeklyConversions.reduce((sum, point) => sum + point.bookings, 0);
  const lastWeek = mockWeeklyConversions[mockWeeklyConversions.length - 1]?.bookings ?? 0;
  const prevWeek = mockWeeklyConversions[mockWeeklyConversions.length - 2]?.bookings ?? lastWeek;
  const weekChange = prevWeek === 0 ? 0 : Math.round(((lastWeek - prevWeek) / prevWeek) * 100);

  const handleOpenNewWizard = () => {
    setReuseDraft(undefined);
    setWizardOpen(true);
  };

  const handleReuseCampaign = (c: Campaign) => {
    setReuseDraft({
      name: c.name,
      goal: c.goal,
      type: c.type,
      audienceType: c.audienceType,
      channel: c.channel,
      message: c.message,
    });
    setWizardOpen(true);
  };

  return (
    <div>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#1C1C1A]">Campaigns</h2>
          <p className="mt-0.5 font-body text-sm text-[#6B7280]">AI-generated re-engagement campaigns, editable before launch.</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={handleOpenNewWizard}>
          <span className="hidden sm:inline">New Campaign</span>
        </Button>
      </div>

      {/* Campaign Performance */}
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Send className="h-[18px] w-[18px]" />} iconBg="#E8F4F0" iconColor="#1A6B52" label="Total Sent" value={performance.totalSent.toLocaleString()} sub="across all campaigns" />
        <StatCard icon={<Eye className="h-[18px] w-[18px]" />} iconBg="#EFF6FF" iconColor="#3B82F6" label="Average Open Rate" value={`${performance.avgOpenRate}%`} sub="opened / sent" />
        <StatCard icon={<UserCheck className="h-[18px] w-[18px]" />} iconBg="#FEF9EC" iconColor="#C9A96E" label="Total Converted" value={performance.totalConverted} sub="bookings from campaigns" />
        <StatCard icon={<DollarSign className="h-[18px] w-[18px]" />} iconBg="#F0FDF4" iconColor="#16A34A" label="Campaign Revenue" value={`$${performance.totalRevenue.toLocaleString()}`} sub="attributed revenue" />
      </div>

      {/* Weekly Conversions + Table with Equal Frame Heights */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 items-stretch">
        <div className="flex flex-col lg:col-span-2">
          <div className="flex h-full flex-col justify-between rounded-[20px] border border-[#E8E4DF] bg-white p-5">
            <div>
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-heading text-sm font-bold text-[#1C1C1A]">Weekly Conversions</h3>
                  <p className="mt-0.5 font-body text-xs text-[#6B7280]">Bookings from campaigns</p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-[#E8F4F0] px-2.5 py-1 font-body text-xs font-semibold text-[#1A6B52]">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                  {weekChange > 0 ? "+" : ""}{weekChange}%
                </span>
              </div>

              <div className="mb-4 flex items-baseline gap-2">
                <span className="font-heading text-3xl font-extrabold text-[#1C1C1A]">{weekTotal}</span>
                <span className="font-body text-xs text-[#6B7280]">bookings this period</span>
              </div>
            </div>

            <div className="h-56 mt-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockWeeklyConversions} margin={{ top: 5, right: 5, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="campaignBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1A6B52" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#1A6B52" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" vertical={false} />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF", fontSize: 11, fontFamily: "DM Sans" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF", fontSize: 11, fontFamily: "DM Sans" }} />
                  <Tooltip
                    cursor={{ stroke: "#E5E7EB" }}
                    contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontFamily: "DM Sans", fontSize: 13 }}
                    formatter={(value: number | string) => [`${value} bookings`, "Converted"]}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="#1A6B52" strokeWidth={2} fill="url(#campaignBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex flex-col min-w-0 lg:col-span-3">
          <CampaignTable
            campaigns={campaigns}
            onStatusChange={updateStatus}
            onDelete={remove}
            onNewCampaign={handleOpenNewWizard}
            onSelectCampaign={(c) => setSelectedCampaign(c)}
          />
        </div>
      </div>

      <CampaignDetailModal
        campaign={selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onStatusChange={updateStatus}
        onReuse={handleReuseCampaign}
      />

      <AddCampaignWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        initialDraft={reuseDraft}
      />
    </div>
  );
}