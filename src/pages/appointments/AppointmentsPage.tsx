import { useMemo, useState } from "react";
import {
  Plus,
  Download,
  Bot,
  Zap,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Eye,
  CalendarClock,
  Ban,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { AIPanel } from "@/components/shared/AIPanel";
import { AIPanelExpanded } from "@/components/shared/AIPanelExpanded";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { AppointmentStatusBadge } from "@/components/shared/AppointmentStatusBadge";
import { Calendar as ScheduleCalendar } from "@/components/shared/Calendar";
import {
  AppointmentDetailModal,
  RescheduleModal,
  AppointmentSuccessModal,
  CancelAppointmentModal,
  ClinicalNoteModal,
  NewAppointmentWizard,
} from "@/components/appointments";
import { useAuth } from "@/app/AuthContext";
import { useAppointmentsContext } from "@/features/appointments/AppointmentsContext";
import { useAIAssistant } from "@/features/ai/useAIAssistant";
import { mockProviders, mockRooms } from "@/features/appointments/mockData";
import type { Appointment, AppointmentStatus, SuggestedSlot } from "@/features/appointments/types";
import { formatDateLabel, formatTimeLabel } from "@/features/appointments/format";
import { cn } from "@/lib/utils";

type ViewTab = "calendar" | "list";
type ViewRange = "day" | "week" | "month";
type StatusFilter = AppointmentStatus | "all";

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No-Show" },
  { value: "cancelled", label: "Cancelled" },
];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function getWeekDays(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function AppointmentsPage() {
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];
  const { appointments, stats, getById, reschedule, cancel, create } = useAppointmentsContext();

  const [activeTab, setActiveTab] = useState<ViewTab>("calendar");
  const [viewRange, setViewRange] = useState<ViewRange>("day");
  const [referenceDate, setReferenceDate] = useState(new Date());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [viewingId, setViewingId] = useState<string | null>(null);
  const [viewingReadOnly, setViewingReadOnly] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [clinicalNoteId, setClinicalNoteId] = useState<string | null>(null);
  const [expandedInsightsOpen, setExpandedInsightsOpen] = useState(false);
  const [newApptOpen, setNewApptOpen] = useState(false);

  const { messages, isThinking, ask } = useAIAssistant({
    module: "appointments",
    appointments,
    providers: mockProviders,
    rooms: mockRooms,
  });

  const filteredAppointments = useMemo(
    () => (statusFilter === "all" ? appointments : appointments.filter((a) => a.status === statusFilter)),
    [appointments, statusFilter]
  );

  const calendarDays = useMemo(() => {
    if (viewRange === "week") return getWeekDays(referenceDate);
    return [referenceDate];
  }, [viewRange, referenceDate]);

  const calendarAppointments = useMemo(
    () =>
      filteredAppointments.map((a) => ({
        id: a.id,
        clientName: a.client.name,
        service: a.treatment.name,
        providerName: a.provider.name,
        room: a.room.name,
        status: a.status,
        startTime: a.startTime,
        endTime: a.endTime,
      })),
    [filteredAppointments]
  );

  function shiftReferenceDate(direction: 1 | -1) {
    const d = new Date(referenceDate);
    if (viewRange === "day") d.setDate(d.getDate() + direction);
    else if (viewRange === "week") d.setDate(d.getDate() + direction * 7);
    else d.setMonth(d.getMonth() + direction);
    setReferenceDate(d);
  }

  function openDetail(id: string, readOnly = false) {
    setViewingId(id);
    setViewingReadOnly(readOnly);
  }

  const columns: TableColumn<Appointment>[] = [
    { key: "time", header: "Time", width: "88px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{formatTimeLabel(row.startTime)}</span> },
    {
      key: "client",
      header: "Client",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.client.name} size="sm" />
          <span className="truncate font-body text-sm font-medium text-[#1C1C1A]">{row.client.name}</span>
        </div>
      ),
    },
    { key: "treatment", header: "Treatment", render: (row) => <span className="font-body text-sm text-[#1C1C1A]">{row.treatment.name}</span> },
    { key: "provider", header: "Provider", width: "130px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.provider.name}</span> },
    { key: "status", header: "Status", width: "120px", render: (row) => <AppointmentStatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      width: "56px",
      render: (row) => {
        const isUpcoming = row.status === "confirmed" || row.status === "pending";
        const isCompleted = row.status === "completed";
        const items = [
          { label: "View Details", icon: <Eye className="h-4 w-4" />, onClick: () => openDetail(row.id) },
          ...(isUpcoming
            ? [
                { label: "Reschedule", icon: <CalendarClock className="h-4 w-4" />, onClick: () => setReschedulingId(row.id) },
                { label: "Cancel", icon: <Ban className="h-4 w-4" />, danger: true, onClick: () => setCancellingId(row.id) },
              ]
            : []),
          ...(isCompleted && row.clinicalNote
            ? [{ label: "View Clinical Notes", icon: <FileText className="h-4 w-4" />, onClick: () => setClinicalNoteId(row.id) }]
            : []),
        ];
        return <ActionMenu items={items} />;
      },
    },
  ];

  const viewingAppointment = viewingId ? getById(viewingId) ?? null : null;
  const reschedulingAppointment = reschedulingId ? getById(reschedulingId) ?? null : null;
  const cancellingAppointment = cancellingId ? getById(cancellingId) ?? null : null;
  const confirmedAppointment = confirmedId ? getById(confirmedId) ?? null : null;
  const clinicalNoteAppointment = clinicalNoteId ? getById(clinicalNoteId) ?? null : null;

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

  return (
    <div className="flex h-full flex-col xl:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-5 sm:p-6 lg:p-8 xl:pr-6">
          <div className="mb-5">
            <h1 className="font-heading text-2xl font-bold text-[#1C1C1A]">Appointments</h1>
            <p className="mt-1 font-body text-sm text-[#6B7280]">{formatDateLabel(new Date().toISOString())} · {stats.total} appointments</p>
          </div>

          <div className="mb-5 flex flex-col gap-3">
            {/* Row 1: view tabs + action button */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SegmentedTabs<ViewTab>
                value={activeTab}
                onChange={setActiveTab}
                options={[{ value: "calendar", label: "Calendar" }, { value: "list", label: "List" }]}
              />
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setNewApptOpen(true)}>
                <span className="hidden sm:inline">New Appointment</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>

            {/* Row 2: calendar controls + filter + export */}
            <div className="flex flex-wrap items-center gap-2 overflow-x-auto">
              {activeTab === "calendar" && (
                <>
                  <SegmentedTabs<ViewRange>
                    value={viewRange}
                    onChange={setViewRange}
                    options={[{ value: "day", label: "Day" }, { value: "week", label: "Week" }, { value: "month", label: "Month" }]}
                  />
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => shiftReferenceDate(-1)} aria-label="Previous" className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F0EB]">
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" onClick={() => setReferenceDate(new Date())} className="rounded-full px-3 py-1 font-body text-xs font-medium text-[#1A6B52] hover:bg-[#F3F0EB]">
                      Today
                    </button>
                    <button type="button" onClick={() => shiftReferenceDate(1)} aria-label="Next" className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F0EB]">
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}

              <Dropdown<StatusFilter>
                className="w-40"
                placeholder="Filter status"
                value={statusFilter === "all" ? null : statusFilter}
                onChange={setStatusFilter}
                options={STATUS_FILTER_OPTIONS.filter((o) => o.value !== "all")}
              />
              {statusFilter !== "all" && (
                <button type="button" onClick={() => setStatusFilter("all")} className="font-body text-xs font-medium text-[#1A6B52] hover:underline">
                  Clear filter
                </button>
              )}
              <Button variant="secondary" size="md" leftIcon={<Download className="h-4 w-4" />} className="ml-auto"><span className="hidden sm:inline">Export</span></Button>
            </div>
          </div>

          {activeTab === "calendar" ? (
            viewRange === "month" ? (
              <MonthGrid
                referenceDate={referenceDate}
                appointments={filteredAppointments}
                onSelectDay={(day) => {
                  setReferenceDate(day);
                  setViewRange("day");
                }}
              />
            ) : (
              <ScheduleCalendar
                days={calendarDays}
                appointments={calendarAppointments}
                startHour={8}
                endHour={18}
                onAppointmentClick={(a) => openDetail(a.id)}
              />
            )
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>All Appointments</CardTitle>
                <span className="font-body text-xs text-[#9CA3AF]">{filteredAppointments.length} shown</span>
              </CardHeader>
              <div className="overflow-x-auto">
                <Table
                  className="min-w-[720px] rounded-none border-0"
                  columns={columns}
                  data={filteredAppointments}
                  getRowId={(row) => row.id}
                  onRowClick={(row) => openDetail(row.id)}
                  emptyState={<p className="text-center font-body text-sm text-[#6B7280]">No appointments match this filter.</p>}
                />
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="hidden xl:block">
        <AIPanel contextLabel="Appointments context" userFirstName={firstName} messages={messages} onAsk={ask} isAsking={isThinking} onExpand={() => setExpandedInsightsOpen(true)} onViewAllInsights={() => setExpandedInsightsOpen(true)}>
          <AIInsightCard
            variant="purple"
            icon={<Zap />}
            title="3 Open Slots Today"
            description="Dr. Kim has gaps at 1:15 PM and 3:45 PM. Match waitlisted clients instantly."
            ctaLabel="Fill Slot"
            onCtaClick={() => setNewApptOpen(true)}
          />
        </AIPanel>
      </div>

      <button type="button" onClick={() => setExpandedInsightsOpen(true)} aria-label="Open AI Assistant" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A6B52] text-white shadow-xl transition-transform hover:scale-105 xl:hidden">
        <Bot className="h-6 w-6" aria-hidden="true" />
      </button>

      <AIPanelExpanded open={expandedInsightsOpen} onClose={() => setExpandedInsightsOpen(false)} title="Ask Aura AI Assistant" timestampLabel={`Today, ${formatTimeLabel(new Date().toISOString())}`} messages={messages} onAsk={ask} isAsking={isThinking}>
        <AIInsightCard variant="green" icon={<Sparkles />} title="Peak hours approaching" description="Between 12:00 PM and 2:00 PM, provider utilization is expected to exceed 90%. Minor schedule adjustments can help reduce delays." ctaLabel="Optimize Schedule" onCtaClick={() => { setExpandedInsightsOpen(false); setActiveTab("calendar"); }} />
        <AIInsightCard variant="gold" icon={<AlertTriangle />} title="Potential scheduling conflict detected" description="Two appointments overlap with the current provider schedule. Consider moving one to avoid a delay." ctaLabel="Review Schedule" onCtaClick={() => { setExpandedInsightsOpen(false); setActiveTab("list"); }} />
        <AIInsightCard variant="purple" icon={<Zap />} title="Unused appointment slot available" description="Room 3 is available between 2:00 PM and 3:00 PM. Consider moving waitlisted clients into this window." ctaLabel="View Waiting List" onCtaClick={() => { setExpandedInsightsOpen(false); setActiveTab("list"); }} />
        <AIInsightCard variant="gradient" icon={<ShieldAlert />} title="High no-show risk detected" description="Grace Hartley has a higher no-show risk based on recent appointment history. Consider a confirmation reminder." ctaLabel="Send Reminder" onCtaClick={() => { setExpandedInsightsOpen(false); openDetail("appt-7"); }} />
      </AIPanelExpanded>

      <AppointmentDetailModal
        appointment={viewingAppointment}
        readOnly={viewingReadOnly}
        onClose={() => { setViewingId(null); setViewingReadOnly(false); }}
        onReschedule={(a) => { setViewingId(null); setReschedulingId(a.id); }}
        onCancel={(a) => { setViewingId(null); setCancellingId(a.id); }}
        onViewClinicalNote={(a) => { setViewingId(null); setClinicalNoteId(a.id); }}
      />

      <RescheduleModal appointment={reschedulingAppointment} onClose={() => setReschedulingId(null)} onConfirm={handleConfirmReschedule} />

      {/* After a reschedule, "View Appointment" opens a read-only
          detail view (no Reschedule action) — the user just finished
          rescheduling; this is for reviewing, not re-editing. */}
      <AppointmentSuccessModal
        appointment={confirmedAppointment}
        onClose={() => setConfirmedId(null)}
        onBookAnother={() => { setConfirmedId(null); setNewApptOpen(true); }}
        onViewAppointment={(a) => { setConfirmedId(null); openDetail(a.id, true); }}
      />

      <CancelAppointmentModal appointment={cancellingAppointment} onClose={() => setCancellingId(null)} onConfirm={handleConfirmCancel} />
      <ClinicalNoteModal appointment={clinicalNoteAppointment} onClose={() => setClinicalNoteId(null)} />

      <NewAppointmentWizard
        open={newApptOpen}
        onClose={() => setNewApptOpen(false)}
        existingAppointments={appointments}
        onCreate={create}
        onBooked={(booked) => { setNewApptOpen(false); setConfirmedId(booked.id); }}
      />
    </div>
  );
}

function MonthGrid({
  referenceDate,
  appointments,
  onSelectDay,
}: {
  referenceDate: Date;
  appointments: Appointment[];
  onSelectDay: (day: Date) => void;
}) {
  const year = referenceDate.getFullYear();
  const month = referenceDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstOfMonth.getDay();

  const cells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = new Date();

  function countForDay(day: Date) {
    return appointments.filter((a) => isSameDay(new Date(a.startTime), day) && a.status !== "cancelled").length;
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-[#E8E4DF] bg-white">
      <div className="grid grid-cols-7 border-b border-[#E8E4DF] bg-[#FAFAF9]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="px-2 py-2 text-center font-body text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) =>
          day ? (
            <button
              key={i}
              type="button"
              onClick={() => onSelectDay(day)}
              className="flex h-20 flex-col items-start gap-1 border-b border-r border-[#F5F2EF] p-2 text-left transition-colors hover:bg-[#F9FAFB]"
            >
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full font-body text-xs font-medium", isSameDay(day, today) ? "bg-[#1A6B52] text-white" : "text-[#1C1C1A]")}>
                {day.getDate()}
              </span>
              {countForDay(day) > 0 && (
                <span className="rounded-full bg-[#E8F4F0] px-1.5 py-0.5 font-body text-[10px] font-medium text-[#1A6B52]">
                  {countForDay(day)} appt{countForDay(day) > 1 ? "s" : ""}
                </span>
              )}
            </button>
          ) : (
            <div key={i} className="h-20 border-b border-r border-[#F5F2EF] bg-[#FAFAF9]/40" />
          )
        )}
      </div>
    </div>
  );
}
