import { FileText } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AppointmentStatusBadge } from "@/components/shared/AppointmentStatusBadge";
import type { Appointment } from "@/features/appointments/types";
import { formatDateLabel, formatTimeRange } from "@/features/appointments/format";

export interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onReschedule: (appointment: Appointment) => void;
  onCancel: (appointment: Appointment) => void;
  onViewClinicalNote: (appointment: Appointment) => void;
  /** Read-only mode: no Reschedule/Cancel actions, just a Close
   *  button. Used for "View Appointment" reached from the
   *  post-reschedule success state — reviewing, not re-editing. */
  readOnly?: boolean;
}

/**
 * Read-only appointment summary with entry points into Reschedule,
 * Cancel, and Clinical Note — all gated by status:
 *   confirmed/pending  -> Reschedule, Cancel
 *   completed          -> View Clinical Notes only
 *   no_show/cancelled  -> Close only
 */
export function AppointmentDetailModal({
  appointment,
  onClose,
  onReschedule,
  onCancel,
  onViewClinicalNote,
  readOnly = false,
}: AppointmentDetailModalProps) {
  if (!appointment) return null;

  const isUpcoming = appointment.status === "confirmed" || appointment.status === "pending";
  const canReschedule = isUpcoming && !readOnly;
  const canCancel = isUpcoming && !readOnly;
  const showClinicalNotes = appointment.status === "completed" && Boolean(appointment.clinicalNote);

  return (
    <Modal
      open={Boolean(appointment)}
      onClose={onClose}
      title="Appointment Details"
      size="sm"
      footer={
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
          {canCancel && (
            <Button variant="danger" size="sm" onClick={() => onCancel(appointment)}>Cancel Appointment</Button>
          )}
          {canReschedule && (
            <Button variant="primary" size="sm" onClick={() => onReschedule(appointment)}>Reschedule</Button>
          )}
        </div>
      }
    >
      <div className="mb-5 flex items-center gap-3">
        <Avatar name={appointment.client.name} size="lg" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-heading text-base font-bold text-[#1C1C1A]">{appointment.client.name}</div>
          <div className="truncate font-body text-xs text-[#6B7280]">{appointment.client.phone}</div>
        </div>
        <AppointmentStatusBadge status={appointment.status} />
      </div>

      <div className="flex flex-col gap-3">
        <DetailRow label="Treatment" value={appointment.treatment.name} />
        <DetailRow label="Provider" value={appointment.provider.name} />
        <DetailRow label="Date" value={formatDateLabel(appointment.startTime)} />
        <DetailRow label="Time" value={formatTimeRange(appointment.startTime, appointment.endTime)} />
        <DetailRow label="Room" value={appointment.room.name} />
        {appointment.status === "cancelled" && appointment.cancellationReason && (
          <DetailRow label="Cancellation reason" value={appointment.cancellationReason} />
        )}
      </div>

      {showClinicalNotes && (
        <button
          type="button"
          onClick={() => onViewClinicalNote(appointment)}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] py-2.5 font-body text-sm font-medium text-[#1A6B52] transition-colors hover:bg-[#F3F0EB]"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          View Clinical Notes
        </button>
      )}
    </Modal>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#F5F2EF] pb-3 last:border-0 last:pb-0">
      <span className="font-body text-xs text-[#6B7280]">{label}</span>
      <span className="font-body text-sm font-medium text-[#1C1C1A]">{value}</span>
    </div>
  );
}
