import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Search,
  UserPlus,
  Check,
  Sparkles,
  Loader2,
  MessageSquareText,
  Mail,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SearchBar } from "@/components/ui/SearchBar";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { SuggestedSlotPicker } from "@/components/appointments/SuggestedSlotPicker";
import type {
  Appointment,
  AppointmentClient,
  Provider,
  Room,
  SuggestedSlot,
  Treatment,
} from "@/features/appointments/types";
import type { CreateAppointmentInput } from "@/features/appointments/useAppointments";
import {
  mockBookableClients,
  mockProviders,
  mockRooms,
  mockTreatments,
  getMockSuggestedSlots,
} from "@/features/appointments/mockData";
import { rankProvidersForTreatment, findAvailableRoom } from "@/features/appointments/scheduling";
import { formatDateLabel, formatTimeLabel } from "@/features/appointments/format";

export interface NewAppointmentWizardProps {
  open: boolean;
  onClose: () => void;
  existingAppointments: Appointment[];
  onCreate: (input: CreateAppointmentInput) => Appointment;
  onBooked: (appointment: Appointment) => void;
  /** Pre-selects a client and skips straight to Treatment — used
   *  from Client Profile's "Schedule Appointment" action. */
  preselectedClient?: AppointmentClient;
}

type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;

const STEP_LABELS: Record<WizardStep, string> = {
  1: "Client",
  2: "Treatment",
  3: "Provider",
  4: "AI Scheduling",
  5: "Review",
  6: "Confirm",
};

interface NewClientDraft {
  fullName: string;
  phone: string;
  email: string;
  dob: string;
}

const EMPTY_DRAFT: NewClientDraft = { fullName: "", phone: "", email: "", dob: "" };

export function NewAppointmentWizard({
  open,
  onClose,
  existingAppointments,
  onCreate,
  onBooked,
  preselectedClient,
}: NewAppointmentWizardProps) {
  const [step, setStep] = useState<WizardStep>(1);

  const [clientMode, setClientMode] = useState<"search" | "create">("search");
  const [clientQuery, setClientQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<AppointmentClient | null>(null);
  const [newClientDraft, setNewClientDraft] = useState<NewClientDraft>(EMPTY_DRAFT);

  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SuggestedSlot | null>(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [notify, setNotify] = useState({ sms: false, email: true, timeline: true });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestedSlots = useMemo(() => getMockSuggestedSlots(), []);

  useEffect(() => {
    if (step !== 4) return;
    setIsAnalyzing(true);
    const timeout = setTimeout(() => setIsAnalyzing(false), 700);
    return () => clearTimeout(timeout);
  }, [step]);

  useEffect(() => {
    if (!open) return;
    if (preselectedClient) {
      setSelectedClient(preselectedClient);
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, preselectedClient]);

  useEffect(() => {
    if (open) return;
    const timeout = setTimeout(resetAll, 200);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function resetAll() {
    setStep(1);
    setClientMode("search");
    setClientQuery("");
    setSelectedClient(null);
    setNewClientDraft(EMPTY_DRAFT);
    setSelectedTreatment(null);
    setSelectedProvider(null);
    setSelectedSlot(null);
    setSelectedSlotIndex(0);
    setNotify({ sms: false, email: true, timeline: true });
    setIsSubmitting(false);
  }

  const rankedProviders = useMemo(
    () => (selectedTreatment ? rankProvidersForTreatment(selectedTreatment, mockProviders) : []),
    [selectedTreatment]
  );

  const computedEndTime = useMemo(() => {
    if (!selectedSlot || !selectedTreatment) return null;
    const start = new Date(selectedSlot.startTime);
    return new Date(start.getTime() + selectedTreatment.durationMinutes * 60000).toISOString();
  }, [selectedSlot, selectedTreatment]);

  const assignedRoom: Room | null = useMemo(() => {
    if (!selectedSlot || !computedEndTime) return null;
    return findAvailableRoom(selectedSlot.startTime, computedEndTime, existingAppointments, mockRooms);
  }, [selectedSlot, computedEndTime, existingAppointments]);

  const filteredClients = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    if (!q) return mockBookableClients;
    return mockBookableClients.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [clientQuery]);

  function handleClose() {
    onClose();
  }

  function goNext() {
    setStep((s) => (s < 6 ? ((s + 1) as WizardStep) : s));
  }
  function goBack() {
    setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s));
  }

  function handleCreateNewClient() {
    if (!newClientDraft.fullName.trim() || !newClientDraft.phone.trim()) return;
    const client: AppointmentClient = {
      id: `client-${Date.now()}`,
      name: newClientDraft.fullName.trim(),
      phone: newClientDraft.phone.trim(),
      email: newClientDraft.email.trim(),
    };
    setSelectedClient(client);
    goNext();
  }

  function handleConfirmBooking() {
    if (!selectedClient || !selectedTreatment || !selectedProvider || !selectedSlot || !assignedRoom) return;
    setIsSubmitting(true);
    const created = onCreate({
      client: selectedClient,
      treatment: selectedTreatment,
      provider: selectedProvider,
      room: assignedRoom,
      startTime: selectedSlot.startTime,
      endTime: computedEndTime ?? selectedSlot.endTime,
    });
    setIsSubmitting(false);
    onBooked(created);
  }

  const canContinue: Record<WizardStep, boolean> = {
    1: Boolean(selectedClient),
    2: Boolean(selectedTreatment),
    3: Boolean(selectedProvider),
    4: Boolean(selectedSlot),
    5: true,
    6: false,
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="New Appointment"
      size="md"
      footer={
        step === 6 ? (
          <div className="flex justify-between">
            <Button variant="secondary" size="sm" onClick={goBack}>Back</Button>
            <Button variant="primary" size="sm" leftIcon={<CheckCircle2 className="h-4 w-4" />} isLoading={isSubmitting} onClick={handleConfirmBooking}>
              Confirm Appointment
            </Button>
          </div>
        ) : (
          <div className="flex justify-between">
            {step > 1 ? (
              <Button variant="secondary" size="sm" onClick={goBack}>Back</Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
            )}
            <Button variant="primary" size="sm" disabled={!canContinue[step]} onClick={goNext}>Continue</Button>
          </div>
        )
      }
    >
      <p className="mb-5 font-body text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
        Step {step} of 6 — {STEP_LABELS[step]}
      </p>

      <WizardStepper step={step} />

      <div className="mt-5">
        {step === 1 && (
          <ClientStep
            mode={clientMode}
            onModeChange={setClientMode}
            query={clientQuery}
            onQueryChange={setClientQuery}
            clients={filteredClients}
            selectedClient={selectedClient}
            onSelectClient={setSelectedClient}
            draft={newClientDraft}
            onDraftChange={setNewClientDraft}
            onCreateClient={handleCreateNewClient}
          />
        )}

        {step === 2 && <TreatmentStep treatments={mockTreatments} selected={selectedTreatment} onSelect={setSelectedTreatment} />}

        {step === 3 && selectedTreatment && (
          <ProviderStep treatment={selectedTreatment} ranked={rankedProviders} selected={selectedProvider} onSelect={setSelectedProvider} />
        )}

        {step === 4 && (
          <AISchedulingStep
            isAnalyzing={isAnalyzing}
            slots={suggestedSlots}
            selectedIndex={selectedSlotIndex}
            onSelectIndex={(i) => {
              setSelectedSlotIndex(i);
              setSelectedSlot(suggestedSlots[i]);
            }}
          />
        )}

        {step === 5 && selectedClient && selectedTreatment && selectedProvider && selectedSlot && (
          <ReviewStep
            client={selectedClient}
            treatment={selectedTreatment}
            provider={selectedProvider}
            room={assignedRoom}
            startTime={selectedSlot.startTime}
            endTime={computedEndTime ?? selectedSlot.endTime}
          />
        )}

        {step === 6 && <ConfirmStep notify={notify} onChange={setNotify} />}
      </div>
    </Modal>
  );
}

function WizardStepper({ step }: { step: WizardStep }) {
  const steps: WizardStep[] = [1, 2, 3, 4, 5, 6];
  return (
    <div className="flex items-center">
      {steps.map((s, i) => {
        const isDone = s < step;
        const isActive = s === step;
        return (
          <div key={s} className="flex flex-1 items-center last:flex-none">
            <div
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-body text-[11px] font-bold",
                isDone ? "bg-[#1A6B52] text-white" : isActive ? "border-2 border-[#1A6B52] text-[#1A6B52]" : "border border-[#E5E7EB] text-[#9CA3AF]"
              )}
            >
              {isDone ? <Check className="h-3 w-3" aria-hidden="true" /> : s}
            </div>
            {i < steps.length - 1 && <div className={cn("mx-1.5 h-px flex-1", isDone ? "bg-[#1A6B52]" : "bg-[#E5E7EB]")} />}
          </div>
        );
      })}
    </div>
  );
}

function ClientStep({
  mode, onModeChange, query, onQueryChange, clients, selectedClient, onSelectClient, draft, onDraftChange, onCreateClient,
}: {
  mode: "search" | "create";
  onModeChange: (m: "search" | "create") => void;
  query: string;
  onQueryChange: (q: string) => void;
  clients: AppointmentClient[];
  selectedClient: AppointmentClient | null;
  onSelectClient: (c: AppointmentClient) => void;
  draft: NewClientDraft;
  onDraftChange: (d: NewClientDraft) => void;
  onCreateClient: () => void;
}) {
  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onModeChange("search")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-[12px] border py-2.5 font-body text-sm font-medium transition-colors",
            mode === "search" ? "border-[#1A6B52] bg-[#E8F4F0] text-[#1A6B52]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
          )}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Search Existing Client
        </button>
        <button
          type="button"
          onClick={() => onModeChange("create")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-[12px] border py-2.5 font-body text-sm font-medium transition-colors",
            mode === "create" ? "border-[#1A6B52] bg-[#E8F4F0] text-[#1A6B52]" : "border-[#E5E7EB] text-[#6B7280] hover:bg-[#F9FAFB]"
          )}
        >
          <UserPlus className="h-4 w-4" aria-hidden="true" />
          Create New Client
        </button>
      </div>

      {mode === "search" ? (
        <div>
          <SearchBar placeholder="Search by name, phone, or email..." value={query} onChange={onQueryChange} debounceMs={150} className="mb-3 w-full" aria-label="Search existing clients" />
          <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
            {clients.length === 0 ? (
              <div className="rounded-[12px] border border-dashed border-[#E5E7EB] p-5 text-center">
                <p className="mb-2 font-body text-xs text-[#6B7280]">No matching client found.</p>
                <button type="button" onClick={() => onModeChange("create")} className="font-body text-xs font-medium text-[#1A6B52] hover:underline">
                  Create a new client instead →
                </button>
              </div>
            ) : (
              clients.map((client) => {
                const isSelected = selectedClient?.id === client.id;
                return (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => onSelectClient(client)}
                    className={cn("flex items-center gap-3 rounded-[12px] border p-3 text-left transition-colors", isSelected ? "border-[#1A6B52] bg-[#E8F4F0]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]")}
                  >
                    <Avatar name={client.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-body text-sm font-semibold text-[#1C1C1A]">{client.name}</div>
                      <div className="truncate font-body text-xs text-[#6B7280]">{client.phone} · {client.email}</div>
                    </div>
                    {client.lastVisitLabel && (
                      <div className="shrink-0 text-right">
                        <div className="font-body text-[10px] text-[#9CA3AF]">Last visit</div>
                        <div className="font-body text-xs text-[#6B7280]">{client.lastVisitLabel}</div>
                      </div>
                    )}
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full Name" placeholder="Sophia Laurent" value={draft.fullName} onChange={(e) => onDraftChange({ ...draft, fullName: e.target.value })} />
            <Input label="Phone Number" placeholder="(310) 555-0000" value={draft.phone} onChange={(e) => onDraftChange({ ...draft, phone: e.target.value })} />
            <Input label="Email Address" type="email" placeholder="client@email.com" value={draft.email} onChange={(e) => onDraftChange({ ...draft, email: e.target.value })} />
            <Input label="Date of Birth" type="date" value={draft.dob} onChange={(e) => onDraftChange({ ...draft, dob: e.target.value })} />
          </div>
          <Button variant="primary" size="md" className="self-start" disabled={!draft.fullName.trim() || !draft.phone.trim()} onClick={onCreateClient}>
            Save Client &amp; Continue
          </Button>
        </div>
      )}
    </div>
  );
}

function TreatmentStep({ treatments, selected, onSelect }: { treatments: Treatment[]; selected: Treatment | null; onSelect: (t: Treatment) => void }) {
  return (
    <div className="grid max-h-80 grid-cols-1 gap-2.5 overflow-y-auto sm:grid-cols-2">
      {treatments.map((treatment) => {
        const isSelected = selected?.id === treatment.id;
        return (
          <button
            key={treatment.id}
            type="button"
            onClick={() => onSelect(treatment)}
            className={cn("flex flex-col items-start rounded-[12px] border p-3.5 text-left transition-colors", isSelected ? "border-[#1A6B52] bg-[#E8F4F0]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]")}
          >
            <div className="mb-1.5 flex w-full items-center justify-between">
              <span className="rounded-full bg-[#F3F0EB] px-2 py-0.5 font-body text-[10px] font-medium uppercase tracking-wide text-[#6B7280]">{treatment.category}</span>
              {isSelected && <Check className="h-4 w-4 text-[#1A6B52]" aria-hidden="true" />}
            </div>
            <div className="font-heading text-sm font-bold text-[#1C1C1A]">{treatment.name}</div>
            <div className="mt-1 font-body text-xs text-[#6B7280]">{treatment.durationMinutes} min · {treatment.priceLabel}</div>
          </button>
        );
      })}
    </div>
  );
}

function ProviderStep({ treatment, ranked, selected, onSelect }: { treatment: Treatment; ranked: { provider: Provider; isSuitable: boolean }[]; selected: Provider | null; onSelect: (p: Provider) => void }) {
  const topSuitable = ranked.find((r) => r.isSuitable)?.provider;
  return (
    <div>
      {topSuitable && (
        <div className="mb-4 flex items-start gap-2.5 rounded-[12px] bg-[#E8F4F0] px-3.5 py-3">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />
          <p className="font-body text-xs leading-relaxed text-[#1A6B52]">
            <span className="font-semibold">AI Recommendation:</span> {topSuitable.name} is the best match for {treatment.name} today, with {topSuitable.openSlotsToday} open slots.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2">
        {ranked.map(({ provider, isSuitable }) => {
          const isSelected = selected?.id === provider.id;
          const disabled = !provider.available;
          return (
            <button
              key={provider.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(provider)}
              className={cn(
                "flex items-center gap-3 rounded-[12px] border p-3.5 text-left transition-colors",
                disabled ? "cursor-not-allowed border-[#E5E7EB] opacity-50" : isSelected ? "border-[#1A6B52] bg-[#E8F4F0]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
              )}
            >
              <Avatar name={provider.name} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-body text-sm font-semibold text-[#1C1C1A]">{provider.name}</span>
                  {isSuitable && <span className="rounded-full bg-[#E8F4F0] px-1.5 py-0.5 font-body text-[9px] font-bold uppercase tracking-wide text-[#1A6B52]">Recommended</span>}
                  <span className={cn("flex items-center gap-1 font-body text-[11px]", disabled ? "text-[#9CA3AF]" : "text-[#16A34A]")}>
                    <span className={cn("h-1.5 w-1.5 rounded-full", disabled ? "bg-[#9CA3AF]" : "bg-[#16A34A]")} />
                    {disabled ? "Unavailable" : "Available"}
                  </span>
                </div>
                <div className="font-body text-xs text-[#6B7280]">{provider.specialty}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="font-heading text-base font-bold text-[#1C1C1A]">{provider.openSlotsToday}</div>
                <div className="font-body text-[10px] text-[#9CA3AF]">open slots</div>
              </div>
              {isSelected && <Check className="h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AISchedulingStep({ isAnalyzing, slots, selectedIndex, onSelectIndex }: { isAnalyzing: boolean; slots: SuggestedSlot[]; selectedIndex: number; onSelectIndex: (i: number) => void }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5 rounded-[12px] bg-[#E8F4F0] px-3.5 py-3">
        {isAnalyzing ? <Loader2 className="h-4 w-4 shrink-0 animate-spin text-[#1A6B52]" aria-hidden="true" /> : <Sparkles className="h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />}
        <div className="min-w-0 flex-1">
          <p className="font-body text-xs font-semibold text-[#1A6B52]">{isAnalyzing ? "AI Scheduling — Analyzing availability" : `AI Scheduling — ${slots.length} suitable slots found`}</p>
          <p className="font-body text-[11px] text-[#1A6B52]/70">Ranked by provider availability, room readiness, and clinic flow.</p>
        </div>
        {!isAnalyzing && <span className="shrink-0 rounded-full bg-white px-2 py-0.5 font-body text-[10px] font-bold text-[#1A6B52]">AI Powered</span>}
      </div>
      {isAnalyzing ? (
        <div className="flex flex-col gap-2.5">
          {[0, 1, 2].map((i) => <div key={i} className="h-[72px] animate-pulse rounded-[12px] bg-[#F3F0EB]" />)}
        </div>
      ) : (
        <SuggestedSlotPicker slots={slots} selectedIndex={selectedIndex} onSelect={onSelectIndex} />
      )}
      <p className="mt-3 font-body text-[11px] text-[#9CA3AF]">These are suggestions — you can select any available slot above.</p>
    </div>
  );
}

function ReviewStep({ client, treatment, provider, room, startTime, endTime }: { client: AppointmentClient; treatment: Treatment; provider: Provider; room: Room | null; startTime: string; endTime: string }) {
  return (
    <div>
      <div className="flex flex-col gap-3 rounded-[12px] border border-[#E8E4DF] p-4">
        <ReviewRow label="Client" value={client.name} sub={client.phone} />
        <ReviewRow label="Treatment" value={treatment.name} sub={`Duration: ${treatment.durationMinutes} min`} />
        <ReviewRow label="Provider" value={provider.name} sub={provider.specialty} />
        <ReviewRow label="Date & Time" value={formatDateLabel(startTime)} sub={`${formatTimeLabel(startTime)} – ${formatTimeLabel(endTime)}`} />
        {room && <ReviewRow label="Room" value={room.name} />}
      </div>
      <div className="mt-4 flex items-start gap-2.5 rounded-[12px] bg-[#E8F4F0] px-3.5 py-3">
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />
        <p className="font-body text-xs leading-relaxed text-[#1A6B52]">Everything looks correct. Proceed to confirm, or go back to make changes.</p>
      </div>
    </div>
  );
}

function ReviewRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F5F2EF] pb-3 last:border-0 last:pb-0">
      <span className="font-body text-xs text-[#6B7280]">{label}</span>
      <div className="text-right">
        <div className="font-body text-sm font-medium text-[#1C1C1A]">{value}</div>
        {sub && <div className="font-body text-[11px] text-[#9CA3AF]">{sub}</div>}
      </div>
    </div>
  );
}

interface NotifyOptions { sms: boolean; email: boolean; timeline: boolean; }

function ConfirmStep({ notify, onChange }: { notify: NotifyOptions; onChange: (n: NotifyOptions) => void }) {
  return (
    <div>
      <p className="mb-4 font-body text-sm text-[#6B7280]">Choose how to notify the client about this appointment.</p>
      <div className="flex flex-col gap-2.5">
        <NotifyToggle icon={<MessageSquareText className="h-4 w-4" />} label="Send SMS Confirmation" description="Client receives a text with appointment details" checked={notify.sms} onToggle={() => onChange({ ...notify, sms: !notify.sms })} />
        <NotifyToggle icon={<Mail className="h-4 w-4" />} label="Send Email Confirmation" description="Client receives a detailed email confirmation" checked={notify.email} onToggle={() => onChange({ ...notify, email: !notify.email })} />
        <NotifyToggle icon={<Clock3 className="h-4 w-4" />} label="Add to Client Timeline" description="Log this appointment in the client's record" checked={notify.timeline} onToggle={() => onChange({ ...notify, timeline: !notify.timeline })} />
      </div>
    </div>
  );
}

function NotifyToggle({ icon, label, description, checked, onToggle }: { icon: ReactNode; label: string; description: string; checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className="flex items-center gap-3 rounded-[12px] border border-[#E5E7EB] p-3.5 text-left transition-colors hover:bg-[#F9FAFB]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#F3F0EB] text-[#6B7280]">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="font-body text-sm font-medium text-[#1C1C1A]">{label}</div>
        <div className="font-body text-xs text-[#6B7280]">{description}</div>
      </div>
      <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors", checked ? "border-[#1A6B52] bg-[#1A6B52]" : "border-[#D1D5DB] bg-white")}>
        {checked && <Check className="h-3 w-3 text-white" aria-hidden="true" />}
      </div>
    </button>
  );
}
