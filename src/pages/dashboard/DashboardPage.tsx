import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  BarChart3,
  MessageSquareText,
  ChevronRight,
  Coffee,
  Bot,
} from "lucide-react";
import { useAuth } from "@/app/AuthContext";
import { useAIAssistant } from "@/features/ai/useAIAssistant";
import { Card, CardHeader, CardTitle, ProgressBar, StatCard } from "@/components/ui/Card";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { AIPanel } from "@/components/shared/AIPanel";
import { AIPanelExpanded } from "@/components/shared/AIPanelExpanded";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { AppointmentStatusBadge } from "@/components/shared/AppointmentStatusBadge";
import {
  AppointmentDetailModal,
  RescheduleModal,
  AppointmentSuccessModal,
  CancelAppointmentModal,
  ClinicalNoteModal,
} from "@/components/appointments";
import { FollowUpModal } from "@/components/retention/FollowUpModal";
import { useAppointmentsContext } from "@/features/appointments/AppointmentsContext";
import type { Appointment, SuggestedSlot } from "@/features/appointments/types";
import { durationMinutes, formatTimeLabel } from "@/features/appointments/format";
import { AT_RISK_CLIENTS } from "@/features/atrisk/mockData";
import type { AtRiskClient, RiskLevel } from "@/features/atrisk/types";
import { mockDashboardStats } from "@/pages/dashboard/mockData";
import { cn } from "@/lib/utils";

const RISK_BADGE: Record<RiskLevel, string> = {
  Critical: "bg-[#FEE2E2] text-[#991B1B]",
  High: "bg-[#FFF7ED] text-[#C2410C]",
  Medium: "bg-[#FEF3C7] text-[#92400E]",
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];
  const isManager = user.role === "manager";
  const { appointments, getById, reschedule, cancel } = useAppointmentsContext();

  const [expandedOpen, setExpandedOpen] = useState(false);
  const [peakHoursDismissed, setPeakHoursDismissed] = useState(false);

  const [viewingId, setViewingId] = useState<string | null>(null);
  const [viewingReadOnly, setViewingReadOnly] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [clinicalNoteId, setClinicalNoteId] = useState<string | null>(null);
  const [followUpClient, setFollowUpClient] = useState<AtRiskClient | null>(null);

  const viewingAppointment = useMemo(() => (viewingId ? getById(viewingId) || null : null), [viewingId, getById]);
  const reschedulingAppointment = useMemo(() => (reschedulingId ? getById(reschedulingId) || null : null), [reschedulingId, getById]);
  const cancellingAppointment = useMemo(() => (cancellingId ? getById(cancellingId) || null : null), [cancellingId, getById]);
  const confirmedAppointment = useMemo(() => (confirmedId ? getById(confirmedId) || null : null), [confirmedId, getById]);
  const clinicalNoteAppointment = useMemo(() => (clinicalNoteId ? getById(clinicalNoteId) || null : null), [clinicalNoteId, getById]);

  function handleConfirmReschedule(slot: SuggestedSlot) {
    if (!reschedulingId) return;
    reschedule({ appointmentId: reschedulingId, startTime: slot.startTime, endTime: slot.endTime });
    const justRescheduledId = reschedulingId;
    setReschedulingId(null);
    setViewingId(null);
    setConfirmedId(justRescheduledId);
  }

  function handleConfirmCancel(reason: string, notes: string) {
    if (!cancellingId) return;
    cancel({ appointmentId: cancellingId, reason, notes });
    setCancellingId(null);
    setViewingId(null);
  }

  const stats = mockDashboardStats;
  const dashboardAtRiskClients = AT_RISK_CLIENTS.slice(0, 3);

  const { messages, isThinking, ask } = useAIAssistant({
    module: "dashboard",
    stats: {
      todayAppointmentCount: stats.todayAppointmentCount,
      confirmedCount: stats.confirmedCount,
      pendingCount: stats.pendingCount,
      noShowCount: stats.noShowCount,
      atRiskTotalCount: stats.atRiskTotalCount,
      clinicUtilizationPct: stats.clinicUtilizationPct,
      followUpsSent: stats.followUpsSent,
    },
  });

  const appointmentColumns: TableColumn<Appointment>[] = [
    { key: "time", header: "Time", width: "88px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{formatTimeLabel(row.startTime)}</span> },
    {
      key: "client",
      header: "Client",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.client.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate font-body text-sm font-medium text-[#1C1C1A]">{row.client.name}</div>
            <div className="font-body text-xs text-[#6B7280]">{durationMinutes(row.startTime, row.endTime)} min</div>
          </div>
        </div>
      ),
    },
    { key: "service", header: "Service", render: (row) => <span className="font-body text-sm text-[#1C1C1A]">{row.treatment.name}</span> },
    { key: "provider", header: "Provider", width: "120px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.provider.name}</span> },
    { key: "status", header: "Status", width: "130px", render: (row) => <AppointmentStatusBadge status={row.status} /> },
  ];

  return (
    <div className="flex h-full flex-col xl:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-5 sm:p-6 lg:p-8 xl:pr-6">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-[#1C1C1A]">Good morning, {firstName} 👋</h1>
            <p className="mt-1 font-body text-sm text-[#6B7280]">Here's what's happening at Lumière today.</p>
          </div>

          <div className="relative mb-5 overflow-hidden rounded-[32px] bg-[#1A6B52] p-6 sm:p-7">
            <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-white/5" aria-hidden="true" />
            <div className="pointer-events-none absolute right-10 top-20 h-32 w-32 rounded-full border border-white/10" aria-hidden="true" />

            <div className="relative mb-6 flex items-center gap-2 text-white/70">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              <span className="font-body text-[11px] font-semibold uppercase tracking-wider">Today's Schedule</span>
            </div>

            <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(180px,220px)_1fr_1fr_1fr] lg:gap-5">
              <div>
                <div className="font-heading text-[52px] font-extrabold leading-none text-white sm:text-[60px]">{stats.todayAppointmentCount}</div>
                <div className="mt-1.5 font-body text-sm text-white/70">appointments today</div>
                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between font-body text-[11px] text-white/60">
                    <span>Day progress</span>
                    <span>{stats.dayProgressPct}% complete</span>
                  </div>
                  <ProgressBar value={stats.dayProgressPct} trackClassName="bg-white/20" fillClassName="bg-[#C9A96E]" />
                </div>
              </div>
              <HeroStatPill icon={<CheckCircle2 className="h-[18px] w-[18px]" aria-hidden="true" />} label="Confirmed" value={stats.confirmedCount} />
              <HeroStatPill icon={<Clock className="h-[18px] w-[18px]" aria-hidden="true" />} label="Pending" value={stats.pendingCount} />
              <HeroStatPill icon={<XCircle className="h-[18px] w-[18px]" aria-hidden="true" />} label="No-Shows" value={stats.noShowCount} />
            </div>
          </div>

          <div className={cn("mb-5 grid grid-cols-1 gap-4", isManager ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
            {isManager && (
              <StatCard icon={<AlertTriangle className="h-[18px] w-[18px]" aria-hidden="true" />} iconBg="#FEF9EC" iconColor="#C9A96E" label="At-Risk Clients" value={stats.atRiskTotalCount} sub={`${stats.atRiskFlaggedThisWeek} flagged this week`} onClick={() => navigate("/clients")} />
            )}
            <StatCard icon={<BarChart3 className="h-[18px] w-[18px]" aria-hidden="true" />} iconBg="#EFF6FF" iconColor="#3B82F6" label="Clinic Utilization" value={`${stats.clinicUtilizationPct}%`} sub={`Target: ${stats.clinicUtilizationTarget}%`} />
            <StatCard icon={<MessageSquareText className="h-[18px] w-[18px]" aria-hidden="true" />} iconBg="#E8F4F0" iconColor="#1A6B52" label="Follow-Ups Sent" value={stats.followUpsSent} sub={`${stats.followUpsResponded} responded today`} />
          </div>

          <Card className="mb-5">
            <CardHeader className="flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-[18px] w-[18px] text-[#1A6B52]" aria-hidden="true" />
                <CardTitle>Upcoming Appointments</CardTitle>
                <CountBadge count={appointments.length} />
              </div>
              <button type="button" onClick={() => navigate("/appointments")} className="flex items-center gap-1 font-body text-xs font-medium text-[#1A6B52] hover:underline">
                View all
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </CardHeader>
            <div className="overflow-x-auto">
              <Table className="min-w-[640px] rounded-none border-0 cursor-pointer" columns={appointmentColumns} data={appointments} getRowId={(row) => row.id} onRowClick={(row) => { setViewingId(row.id); setViewingReadOnly(false); }} />
            </div>
          </Card>

          {isManager && (
            <Card>
              <CardHeader className="flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-[18px] w-[18px] text-[#C9A96E]" aria-hidden="true" />
                  <CardTitle>At-Risk Clients</CardTitle>
                  <CountBadge count={stats.atRiskTotalCount} />
                </div>
                <button type="button" onClick={() => navigate("/clients")} className="flex items-center gap-1 font-body text-xs font-medium text-[#1A6B52] hover:underline">
                  View all
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </CardHeader>
              <div className="divide-y divide-[#F5F2EF]">
                {dashboardAtRiskClients.map((client) => (
                  <AtRiskRow key={client.id} client={client} onOpen={() => navigate(`/clients/${client.id}`)} onFollowUp={() => setFollowUpClient(client)} />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="hidden xl:block">
        <AIPanel
          contextLabel="Live · updated 2m ago"
          userFirstName={firstName}
          insightsLabel={null}
          messages={messages}
          onAsk={ask}
          isAsking={isThinking}
          onExpand={() => setExpandedOpen(true)}
          onViewAllInsights={() => setExpandedOpen(true)}
        >
          <ClinicScoreCard score={stats.clinicScore} actionsAvailable={stats.clinicScoreActionsAvailable} />
          {!peakHoursDismissed && (
            <AIInsightCard
              variant="purple"
              icon={<Coffee />}
              title="Peak Hours Ahead"
              description="Thursdays 10 AM–1 PM are historically your busiest window. Confirm treatment rooms are prepped."
              ctaLabel="View Schedules"
              onCtaClick={() => navigate("/appointments")}
              onDismiss={() => setPeakHoursDismissed(true)}
            />
          )}
        </AIPanel>
      </div>

      <button type="button" onClick={() => setExpandedOpen(true)} aria-label="Open AI Assistant" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A6B52] text-white shadow-xl transition-transform hover:scale-105 xl:hidden">
        <Bot className="h-6 w-6" aria-hidden="true" />
      </button>

      <AIPanelExpanded open={expandedOpen} onClose={() => setExpandedOpen(false)} title="Ask Aura AI Assistant" timestampLabel="Today, 09:30 AM" messages={messages} onAsk={ask} isAsking={isThinking}>
        <AIInsightCard
          variant="purple"
          icon={<Coffee />}
          title="Peak Hours Ahead"
          description="Thursdays 10 AM–1 PM are historically your busiest window. Confirm treatment rooms are prepped."
          ctaLabel="View Schedules"
          onCtaClick={() => { setExpandedOpen(false); navigate("/appointments"); }}
        />
        <AIInsightCard
          variant="gold"
          icon={<AlertTriangle />}
          title="2 No-Shows Today"
          description="Two clients missed appointments today without cancelling. A same-day reminder may reduce this."
          ctaLabel="Review No-Shows"
          onCtaClick={() => { setExpandedOpen(false); navigate("/appointments"); }}
        />
      </AIPanelExpanded>

      {/* Appointment Details & Action Modals */}
      <AppointmentDetailModal
        appointment={viewingAppointment}
        readOnly={viewingReadOnly}
        onClose={() => { setViewingId(null); setViewingReadOnly(false); }}
        onReschedule={(a) => { setViewingId(null); setReschedulingId(a.id); }}
        onCancel={(a) => { setViewingId(null); setCancellingId(a.id); }}
        onViewClinicalNote={(a) => { setViewingId(null); setClinicalNoteId(a.id); }}
      />

      <RescheduleModal
        appointment={reschedulingAppointment}
        onClose={() => setReschedulingId(null)}
        onConfirm={handleConfirmReschedule}
      />

      <AppointmentSuccessModal
        appointment={confirmedAppointment}
        onClose={() => setConfirmedId(null)}
        onBookAnother={() => { setConfirmedId(null); navigate("/appointments"); }}
        onViewAppointment={(a) => { setConfirmedId(null); setViewingId(a.id); setViewingReadOnly(true); }}
      />

      <CancelAppointmentModal
        appointment={cancellingAppointment}
        onClose={() => setCancellingId(null)}
        onConfirm={handleConfirmCancel}
      />

      <ClinicalNoteModal
        appointment={clinicalNoteAppointment}
        onClose={() => setClinicalNoteId(null)}
      />

      {/* Follow-up modal (manager-only At-Risk Clients section) */}
      <FollowUpModal client={followUpClient} onClose={() => setFollowUpClient(null)} />
    </div>
  );
}

function HeroStatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-[16px] bg-white/10 p-4">
      <div className="mb-2 flex items-center gap-1.5 font-body text-xs text-white/75">{icon}{label}</div>
      <div className="font-heading text-[28px] font-extrabold leading-none text-white">{value}</div>
    </div>
  );
}

function CountBadge({ count }: { count: number }) {
  return <span className="rounded-full bg-[#1A6B52] px-2 py-0.5 font-body text-[10px] font-bold text-white">{count}</span>;
}

function ClinicScoreCard({ score, actionsAvailable }: { score: number; actionsAvailable: number }) {
  return (
    <div className="rounded-[16px] border border-[#1A6B52] bg-[#E8F4F0] p-4">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-body text-xs font-semibold text-[#1A6B52]">Clinic Score</span>
        <span className="font-body text-[11px] font-medium text-[#1A6B52]">{actionsAvailable} actions available</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-heading text-[32px] font-extrabold leading-none text-[#1C1C1A]">{score}</span>
        <span className="font-body text-sm text-[#6B7280]">/100</span>
      </div>
      <ProgressBar value={score} className="mt-3" trackClassName="bg-[#C8E6DF]" fillClassName="bg-[#C9A96E]" />
    </div>
  );
}

function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold", RISK_BADGE[level])}>{level}</span>;
}

function AtRiskRow({ client, onOpen, onFollowUp }: { client: AtRiskClient; onOpen: () => void; onFollowUp: () => void }) {
  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      className="flex cursor-pointer flex-wrap items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#F3F0EB]"
    >
      <Avatar name={client.name} size="md" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-body text-sm font-semibold text-[#1C1C1A]">{client.name}</span>
          <RiskLevelBadge level={client.riskLevel} />
        </div>
        <div className="mt-0.5 font-body text-xs text-[#6B7280]">Last visit {client.lastVisit} · {client.visitCount} visits</div>
      </div>
      <div className="text-right">
        <div className="font-heading text-sm font-bold text-[#1C1C1A]">${client.ltv.toLocaleString()}</div>
        <div className="font-body text-[10px] text-[#6B7280]">lifetime</div>
      </div>
      <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); onFollowUp(); }}>Follow Up</Button>
    </div>
  );
}