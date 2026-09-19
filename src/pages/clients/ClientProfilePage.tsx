import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChevronRight,
  Pencil,
  Ban,
  FileText,
  Phone,
  Mail,
  Info,
  ClipboardList,
  CalendarDays,
  Clock,
  User,
  Bot,
  Sparkles,
  CalendarPlus,
  MessageCircle,
} from "lucide-react";
import { Card, CardHeader, CardTitle, ProgressBar } from "@/components/ui/Card";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/DataStates";
import { AIPanel } from "@/components/shared/AIPanel";
import { AIPanelExpanded } from "@/components/shared/AIPanelExpanded";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { AppointmentStatusBadge } from "@/components/shared/AppointmentStatusBadge";
import { RescheduleModal, AppointmentSuccessModal, NewAppointmentWizard } from "@/components/appointments";
import {
  EditClientModal,
  DeactivateClientModal,
  AllClinicalNotesModal,
  ClinicalNoteDetailModal,
  MessageComposerModal,
} from "@/components/clients";
import { useAuth } from "@/app/AuthContext";
import { useClientsContext } from "@/features/clients/ClientsContext";
import { useAppointmentsContext } from "@/features/appointments/AppointmentsContext";
import { useAIAssistant } from "@/features/ai/useAIAssistant";
import type { SuggestedSlot } from "@/features/appointments/types";
import type { AppointmentHistoryEntry, ClinicalNoteRecord, MembershipTier, TreatmentHistoryEntry } from "@/features/clients/types";
import { mockAppointmentHistory, mockClientAIInsights, mockClinicalNotes, mockTreatmentHistory } from "@/features/clients/mockData";

const MEMBERSHIP_PILL: Record<MembershipTier, string> = {
  Platinum: "bg-[#FDF4E5] text-[#92720C]",
  Gold: "bg-[#FDF4E5] text-[#B08D57]",
  Standard: "bg-[#F3F0EB] text-[#6B7280]",
};

const RISK_BADGE: Record<string, string> = {
  Low: "bg-[#E8F4F0] text-[#1A6B52]",
  Medium: "bg-[#FEF3C7] text-[#92400E]",
  High: "bg-[#FEE2E2] text-[#991B1B]",
};

export function ClientProfilePage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];

  const { getById: getClientById, update, deactivate } = useClientsContext();
  const { appointments, reschedule, create: createAppointment, getById: getAppointmentById } = useAppointmentsContext();

  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [allNotesOpen, setAllNotesOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<ClinicalNoteRecord | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [expandedInsightsOpen, setExpandedInsightsOpen] = useState(false);
  const [messageComposerOpen, setMessageComposerOpen] = useState(false);
  const [scheduleWizardOpen, setScheduleWizardOpen] = useState(false);

  const client = clientId ? getClientById(clientId) : undefined;

  const upcomingAppointment = client
    ? appointments.find((a) => a.client.id === client.id && (a.status === "confirmed" || a.status === "pending"))
    : undefined;
  const aiInsight = client ? mockClientAIInsights[client.id] : undefined;

  const { messages, isThinking, ask } = useAIAssistant(
    client ? { module: "client_profile", client, upcomingAppointment, aiInsight } : { module: "settings" }
  );

  if (!client) {
    return (
      <div className="p-8">
        <EmptyState
          title="Client not found"
          description="This client may have been removed or the link is out of date."
          actionLabel="Back to Clients"
          onAction={() => navigate("/clients")}
        />
      </div>
    );
  }

  const reschedulingAppointment = reschedulingId ? getAppointmentById(reschedulingId) ?? null : null;
  const confirmedAppointment = confirmedId ? getAppointmentById(confirmedId) ?? null : null;

  const treatmentHistory: TreatmentHistoryEntry[] = mockTreatmentHistory[client.id] ?? [];
  const appointmentHistory: AppointmentHistoryEntry[] = mockAppointmentHistory[client.id] ?? [];
  const clinicalNotes: ClinicalNoteRecord[] = mockClinicalNotes[client.id] ?? [];

  const completedCount = appointmentHistory.filter((a) => a.status === "completed").length;
  const missedCount = appointmentHistory.filter((a) => a.status === "missed").length;

  const treatmentColumns: TableColumn<TreatmentHistoryEntry>[] = [
    {
      key: "treatment",
      header: "Treatment",
      render: (row) => (
        <div>
          <div className="font-body text-sm font-medium text-[#1C1C1A]">{row.treatmentName}</div>
          <span className="rounded-full bg-[#F3F0EB] px-2 py-0.5 font-body text-[10px] text-[#6B7280]">{row.category}</span>
        </div>
      ),
    },
    { key: "date", header: "Date", width: "110px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.dateLabel}</span> },
    { key: "provider", header: "Provider", width: "100px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.provider}</span> },
    { key: "outcome", header: "Outcome", render: (row) => <span className="font-body text-xs text-[#6B7280]">{row.outcome}</span> },
  ];

  const appointmentColumns: TableColumn<AppointmentHistoryEntry>[] = [
    { key: "treatment", header: "Treatment", render: (row) => <span className="font-body text-sm font-medium text-[#1C1C1A]">{row.treatmentName}</span> },
    { key: "date", header: "Date", width: "100px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.dateLabel}</span> },
    { key: "time", header: "Time", width: "90px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.timeLabel}</span> },
    { key: "provider", header: "Provider", width: "100px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.provider}</span> },
    {
      key: "status",
      header: "Status",
      width: "110px",
      render: (row) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-body text-xs font-medium ${row.status === "completed" ? "bg-[#E8F4F0] text-[#1A6B52]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${row.status === "completed" ? "bg-[#1A6B52]" : "bg-[#DC2626]"}`} />
          {row.status === "completed" ? "Completed" : "Missed"}
        </span>
      ),
    },
  ];

  function handleReschedule(slot: SuggestedSlot) {
    if (!reschedulingId) return;
    reschedule({ appointmentId: reschedulingId, startTime: slot.startTime, endTime: slot.endTime });
    const justRescheduled = reschedulingId;
    setReschedulingId(null);
    setConfirmedId(justRescheduled);
  }

  return (
    <div className="flex h-full flex-col xl:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-5 sm:p-6 lg:p-8 xl:pr-6">
          <div className="mb-4 flex items-center gap-1.5 font-body text-xs text-[#6B7280]">
            <Link to="/clients" className="hover:text-[#1A6B52] hover:underline">Clients</Link>
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
            <span className="text-[#1C1C1A]">{client.name}</span>
          </div>

          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <Avatar name={client.name} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-heading text-lg font-bold text-[#1C1C1A]">{client.name}</h1>
                  <span className={`rounded-full px-2.5 py-0.5 font-body text-[11px] font-medium ${MEMBERSHIP_PILL[client.membership]}`}>
                    Lumière {client.membership} Member
                  </span>
                  <StatusBadge status={client.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 font-body text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" aria-hidden="true" />{client.phone}</span>
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" aria-hidden="true" />{client.email}</span>
                  <span>Member since {client.memberSinceLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" leftIcon={<Pencil className="h-4 w-4" />} onClick={() => setEditOpen(true)}>Edit</Button>
              <Button variant="danger" size="sm" leftIcon={<Ban className="h-4 w-4" />} onClick={() => setDeactivateOpen(true)}>Deactivate</Button>
              <Button variant="primary" size="sm" leftIcon={<FileText className="h-4 w-4" />} onClick={() => setAllNotesOpen(true)}>Clinical Notes</Button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-8">
            <div>
              <div className="font-heading text-lg font-bold text-[#1C1C1A]">{client.lastVisitLabel}</div>
              <div className="font-body text-[11px] uppercase tracking-wide text-[#9CA3AF]">Last Visit</div>
            </div>
            <div>
              <div className="font-heading text-lg font-bold text-[#1C1C1A]">{client.visitCount}</div>
              <div className="font-body text-[11px] uppercase tracking-wide text-[#9CA3AF]">Total Visits</div>
            </div>
          </div>

          {client.preferenceNote && (
            <div className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-[#E8E4DF] bg-white px-3.5 py-3">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#6B7280]" aria-hidden="true" />
              <p className="font-body text-xs leading-relaxed text-[#6B7280]">{client.preferenceNote}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="flex flex-col gap-5 lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-[18px] w-[18px] text-[#1A6B52]" aria-hidden="true" />
                    <CardTitle>Treatment History</CardTitle>
                    <span className="rounded-full bg-[#1A6B52] px-2 py-0.5 font-body text-[10px] font-bold text-white">{treatmentHistory.length}</span>
                  </div>
                </CardHeader>
                {treatmentHistory.length === 0 ? (
                  <EmptyState icon={<ClipboardList className="h-6 w-6" />} title="No treatment history yet" description="Completed treatments will appear here." />
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[560px] rounded-none border-0" columns={treatmentColumns} data={treatmentHistory} getRowId={(row) => row.id} />
                  </div>
                )}
              </Card>

              <Card>
                <CardHeader className="flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-[18px] w-[18px] text-[#1A6B52]" aria-hidden="true" />
                    <CardTitle>Appointment History</CardTitle>
                    <span className="rounded-full bg-[#1A6B52] px-2 py-0.5 font-body text-[10px] font-bold text-white">{appointmentHistory.length}</span>
                  </div>
                  <span className="font-body text-[11px] text-[#9CA3AF]">{completedCount} completed · {missedCount} missed</span>
                </CardHeader>
                {appointmentHistory.length === 0 ? (
                  <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="No appointment history yet" description="Past appointments will appear here." />
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[560px] rounded-none border-0" columns={appointmentColumns} data={appointmentHistory} getRowId={(row) => row.id} />
                  </div>
                )}
              </Card>
            </div>

            <div className="flex flex-col gap-5">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-[18px] w-[18px] text-[#1A6B52]" aria-hidden="true" />
                    <CardTitle>Upcoming Appointment</CardTitle>
                  </div>
                </CardHeader>
                {upcomingAppointment ? (
                  <div className="p-4">
                    <div className="mb-3">
                      <div className="font-heading text-sm font-bold text-[#1C1C1A]">{upcomingAppointment.treatment.name}</div>
                      <AppointmentStatusBadge status={upcomingAppointment.status} className="mt-1.5" />
                    </div>
                    <div className="flex flex-col gap-2 font-body text-xs text-[#6B7280]">
                      <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />{new Date(upcomingAppointment.startTime).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{new Date(upcomingAppointment.startTime).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</span>
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" aria-hidden="true" />{upcomingAppointment.provider.name}</span>
                    </div>
                    {/* Only Reschedule — no View Appointment button here, per spec. */}
                    <Button variant="primary" size="sm" className="mt-4 w-full" onClick={() => setReschedulingId(upcomingAppointment.id)}>Reschedule</Button>
                  </div>
                ) : (
                  <div className="p-4">
                    <EmptyState
                      icon={<CalendarPlus className="h-6 w-6" />}
                      title="No upcoming appointment"
                      description="Schedule the client's next visit."
                      actionLabel="Schedule Appointment"
                      onAction={() => setScheduleWizardOpen(true)}
                    />
                  </div>
                )}
              </Card>

              {aiInsight && (
                <Card className="bg-[#FAFAF9]">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-[18px] w-[18px] text-[#1A6B52]" aria-hidden="true" />
                      <CardTitle>AI Care Insights</CardTitle>
                    </div>
                  </CardHeader>
                  <div className="flex flex-col gap-4 p-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="font-body text-[11px] uppercase tracking-wide text-[#9CA3AF]">Engagement Score</span>
                        <span className="font-body text-xs font-semibold text-[#1C1C1A]">{aiInsight.engagementScore}/100</span>
                      </div>
                      <ProgressBar value={aiInsight.engagementScore} />
                    </div>

                    <div className="flex items-center justify-between rounded-[10px] bg-white px-3 py-2">
                      <span className="font-body text-xs text-[#6B7280]">Retention Risk</span>
                      <span className={`rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold ${RISK_BADGE[aiInsight.retentionRisk]}`}>{aiInsight.retentionRisk}</span>
                    </div>

                    <div className="rounded-[10px] bg-white p-3">
                      <div className="font-body text-[10px] uppercase tracking-wide text-[#9CA3AF]">Recommended Next</div>
                      <div className="font-body text-sm font-semibold text-[#1C1C1A]">{aiInsight.recommendedNext.treatmentName}</div>
                      <div className="font-body text-xs text-[#6B7280]">{aiInsight.recommendedNext.dateLabel}</div>
                    </div>

                    <p className="font-body text-xs leading-relaxed text-[#6B7280]">{aiInsight.narrative}</p>

                    {/* Functional outreach CTA — opens the AI-drafted, editable message composer. */}
                    <Button variant="secondary" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />} onClick={() => setMessageComposerOpen(true)}>
                      Send Message
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden xl:block">
        <AIPanel contextLabel={`${client.name.split(" ")[0]}'s profile`} userFirstName={firstName} messages={messages} onAsk={ask} isAsking={isThinking} onExpand={() => setExpandedInsightsOpen(true)} onViewAllInsights={() => setExpandedInsightsOpen(true)}>
          <AIInsightCard
            variant="gold"
            icon={<Sparkles />}
            title="Outreach Suggestion"
            description={`${client.name.split(" ")[0]} may be due for their next treatment. Consider contacting them before their recommended rebooking window.`}
            ctaLabel="Send Message"
            onCtaClick={() => setMessageComposerOpen(true)}
          />
        </AIPanel>
      </div>

      <button type="button" onClick={() => setExpandedInsightsOpen(true)} aria-label="Open AI Assistant" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A6B52] text-white shadow-xl transition-transform hover:scale-105 xl:hidden">
        <Bot className="h-6 w-6" aria-hidden="true" />
      </button>

      <AIPanelExpanded open={expandedInsightsOpen} onClose={() => setExpandedInsightsOpen(false)} title="Ask Aura AI Assistant" timestampLabel={`${client.name}'s profile`} messages={messages} onAsk={ask} isAsking={isThinking}>
        <AIInsightCard
          variant="gold"
          icon={<Sparkles />}
          title="Outreach Suggestion"
          description={`${client.name.split(" ")[0]} may be due for their next treatment. Consider contacting them before their recommended rebooking window.`}
          ctaLabel="Send Message"
          onCtaClick={() => { setExpandedInsightsOpen(false); setMessageComposerOpen(true); }}
        />
      </AIPanelExpanded>

      <EditClientModal client={editOpen ? client : null} onClose={() => setEditOpen(false)} onSave={update} />
      <DeactivateClientModal client={deactivateOpen ? client : null} onClose={() => setDeactivateOpen(false)} onConfirm={(c) => { deactivate(c.id); setDeactivateOpen(false); }} />

      <AllClinicalNotesModal
        client={allNotesOpen ? client : null}
        notes={clinicalNotes}
        onClose={() => setAllNotesOpen(false)}
        onViewNote={(note) => { setAllNotesOpen(false); setViewingNote(note); }}
      />
      <ClinicalNoteDetailModal client={client} note={viewingNote} onClose={() => setViewingNote(null)} />

      <RescheduleModal appointment={reschedulingAppointment} onClose={() => setReschedulingId(null)} onConfirm={handleReschedule} />
      <AppointmentSuccessModal appointment={confirmedAppointment} onClose={() => setConfirmedId(null)} />

      <NewAppointmentWizard
        open={scheduleWizardOpen}
        onClose={() => setScheduleWizardOpen(false)}
        existingAppointments={appointments}
        onCreate={createAppointment}
        preselectedClient={{ id: client.id, name: client.name, phone: client.phone, email: client.email }}
        onBooked={(booked) => { setScheduleWizardOpen(false); setConfirmedId(booked.id); }}
      />

      <MessageComposerModal open={messageComposerOpen} client={client} aiInsight={aiInsight} onClose={() => setMessageComposerOpen(false)} />
    </div>
  );
}
