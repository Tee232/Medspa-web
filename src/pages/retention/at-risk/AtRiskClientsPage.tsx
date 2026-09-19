import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { AddCampaignWizard } from "@/components/campaigns/AddCampaignWizard";
import { FollowUpModal } from "@/components/retention/FollowUpModal";
import { AT_RISK_CLIENTS, RISK_CONFIG } from "@/features/atrisk/mockData";
import type { AtRiskClient } from "@/features/atrisk/types";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterTab = "All" | "Critical" | "High" | "Medium";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSummary(clients: AtRiskClient[]) {
  const critical = clients.filter((c) => c.riskLevel === "Critical");
  const high = clients.filter((c) => c.riskLevel === "High");
  const medium = clients.filter((c) => c.riskLevel === "Medium");
  return {
    critical, high, medium,
    criticalStake: critical.reduce((s, c) => s + c.ltv, 0),
    highStake: high.reduce((s, c) => s + c.ltv, 0),
    mediumStake: medium.reduce((s, c) => s + c.ltv, 0),
  };
}

// ─── Summary Card ─────────────────────────────────────────────────────────────

function SummaryCard({ label, count, stake, color }: { label: string; count: number; stake: number; color: string }) {
  return (
    <div className="rounded-2xl border border-[#E8E4DF] bg-white px-5 py-4">
      <p className="mb-1 font-body text-xs font-medium text-[#9CA3AF]">{label}</p>
      <p className={cn("mb-0.5 font-heading text-4xl font-bold", color)}>{count}</p>
      <p className="font-body text-xs text-[#9CA3AF]">${stake.toLocaleString()} at stake</p>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function AtRiskClientsPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterTab>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [followUpClient, setFollowUpClient] = useState<AtRiskClient | null>(null);
  const [campaignWizardOpen, setCampaignWizardOpen] = useState(false);

  const summary = getSummary(AT_RISK_CLIENTS);
  const filtered = AT_RISK_CLIENTS.filter((c) => filter === "All" || c.riskLevel === filter);

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((c) => c.id)));
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="font-heading text-xl font-bold text-[#1C1C1A]">At Risk Clients</h2>
          <p className="mt-0.5 font-body text-sm text-[#6B7280]">Clients showing churn signals based on visit gap, LTV, and engagement score</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} id="new-campaign-btn" onClick={() => setCampaignWizardOpen(true)}>
          Add Campaign
        </Button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <SummaryCard label="Critical" count={summary.critical.length} stake={summary.criticalStake} color="text-[#DC2626]" />
        <SummaryCard label="High Risk" count={summary.high.length} stake={summary.highStake} color="text-[#F97316]" />
        <SummaryCard label="Medium Risk" count={summary.medium.length} stake={summary.mediumStake} color="text-[#EAB308]" />
      </div>

      {/* Filter tabs */}
      <div className="mb-5 flex gap-1">
        {(["All", "Critical", "High", "Medium"] as FilterTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "rounded-full px-4 py-1.5 font-body text-sm font-medium transition-all",
              filter === tab
                ? "bg-[#1A6B52] text-white shadow-sm"
                : "bg-transparent text-[#6B7280] hover:text-[#1C1C1A]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E8E4DF] bg-white">
        {/* Table head */}
        <div className="grid grid-cols-[40px_2fr_1.2fr_1.4fr_1fr_0.8fr_1fr] items-center gap-2 border-b border-[#F0EDE8] bg-[#FAFAF9] px-4 py-3">
          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={toggleAll}
              className="h-4 w-4 cursor-pointer rounded border-[#D1D5DB] accent-[#1A6B52]"
              aria-label="Select all"
            />
          </div>
          {["CLIENT", "LAST VISIT", "RISK SCORE", "RISK LEVEL", "LTV", "STATUS"].map((h) => (
            <p key={h} className="font-body text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#F0EDE8]">
          {filtered.map((client) => {
            const risk = RISK_CONFIG[client.riskLevel];
            const isChecked = selected.has(client.id);
            return (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "grid grid-cols-[40px_2fr_1.2fr_1.4fr_1fr_0.8fr_1fr] items-center gap-2 px-4 py-3.5 transition-colors",
                  isChecked ? "bg-[#F0FDF4]" : "hover:bg-[#FAFAF9]"
                )}
              >
                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOne(client.id)}
                    className="h-4 w-4 cursor-pointer rounded border-[#D1D5DB] accent-[#1A6B52]"
                    aria-label={`Select ${client.name}`}
                  />
                </div>

                {/* Client */}
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar name={client.name} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-body text-sm font-semibold text-[#1C1C1A]">{client.name}</p>
                    <p className="font-body text-xs text-[#9CA3AF]">{client.visitCount} visits</p>
                  </div>
                </div>

                {/* Last Visit */}
                <p className="font-body text-sm text-[#6B7280]">{client.lastVisit}</p>

                {/* Risk Score with bar */}
                <div>
                  <p className={cn("mb-1 font-body text-sm font-bold", risk.color)}>{client.riskScore}</p>
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#E8E4DF]">
                    <div
                      className={cn("h-full rounded-full", risk.bar)}
                      style={{ width: `${Math.min(client.riskScore, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Risk Level */}
                <span className={cn("font-body text-sm font-semibold", risk.color)}>{risk.text}</span>

                {/* LTV */}
                <p className="font-body text-sm font-medium text-[#1C1C1A]">${client.ltv.toLocaleString()}</p>

                {/* Follow Up button */}
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Send className="h-3.5 w-3.5" />}
                  onClick={() => setFollowUpClient(client)}
                  id={`follow-up-${client.id}`}
                >
                  Follow Up
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Follow Up Modal */}
      <FollowUpModal client={followUpClient} onClose={() => setFollowUpClient(null)} />

      {/* Add Campaign Wizard */}
      <AddCampaignWizard
        open={campaignWizardOpen}
        onClose={() => setCampaignWizardOpen(false)}
        onViewCampaigns={() => navigate("/retention/campaigns")}
      />
    </div>
  );
}