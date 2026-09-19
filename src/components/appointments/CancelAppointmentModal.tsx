import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import type { Appointment } from "@/features/appointments/types";
import { formatDateLabel, formatTimeLabel } from "@/features/appointments/format";

export interface CancelAppointmentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (reason: string, notes: string) => void;
}

const CANCELLATION_REASONS = [
  { value: "client_request", label: "Client requested" },
  { value: "provider_unavailable", label: "Provider unavailable" },
  { value: "illness", label: "Client illness" },
  { value: "scheduling_conflict", label: "Scheduling conflict" },
  { value: "other", label: "Other" },
];

export function CancelAppointmentModal({ appointment, onClose, onConfirm }: CancelAppointmentModalProps) {
  const [reason, setReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  if (!appointment) return null;

  function handleClose() {
    setReason(null);
    setNotes("");
    onClose();
  }

  function handleConfirm() {
    if (!reason) return;
    const label = CANCELLATION_REASONS.find((r) => r.value === reason)?.label ?? reason;
    onConfirm(label, notes);
    setReason(null);
    setNotes("");
  }

  return (
    <Modal
      open={Boolean(appointment)}
      onClose={handleClose}
      title="Cancel Appointment"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={handleClose}>Keep Appointment</Button>
          <Button variant="danger" size="sm" onClick={handleConfirm} disabled={!reason}>Confirm Cancellation</Button>
        </div>
      }
    >
      <p className="mb-4 font-body text-sm text-[#6B7280]">
        {appointment.client.name} · {formatDateLabel(appointment.startTime)}, {formatTimeLabel(appointment.startTime)} · {appointment.treatment.name}
      </p>
      <div className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-[#FEE2E2] bg-[#FEF2F2] px-3.5 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626]" aria-hidden="true" />
        <p className="font-body text-xs leading-relaxed text-[#991B1B]">
          This will cancel the appointment and notify the client. This action can be undone within 2 hours.
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <Dropdown label="Cancellation Reason" placeholder="Select a reason..." value={reason} onChange={setReason} options={CANCELLATION_REASONS} />
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-xs font-medium text-[#1C1C1A]">Additional Notes <span className="text-[#9CA3AF]">(optional)</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes for this cancellation..."
            rows={3}
            className="resize-none rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 font-body text-sm text-[#1C1C1A] placeholder:text-[#9CA3AF] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#1A6B52]"
          />
        </div>
      </div>
    </Modal>
  );
}
