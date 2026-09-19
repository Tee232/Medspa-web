import { CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Appointment } from "@/features/appointments/types";
import { formatDateLabel, formatTimeLabel } from "@/features/appointments/format";

export interface AppointmentSuccessModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  /** Omit on pages that shouldn't offer a "View Appointment" jump. */
  onViewAppointment?: (appointment: Appointment) => void;
  onBookAnother?: () => void;
}

export function AppointmentSuccessModal({ appointment, onClose, onViewAppointment, onBookAnother }: AppointmentSuccessModalProps) {
  if (!appointment) return null;

  return (
    <Modal open={Boolean(appointment)} onClose={onClose} title="Booking Confirmed" size="sm">
      <div className="mb-5 flex flex-col items-center rounded-[16px] bg-[#1A6B52] px-6 py-7 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <CheckCircle2 className="h-6 w-6 text-white" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-lg font-bold text-white">Appointment Confirmed!</h3>
        <p className="mt-1 font-body text-xs text-white/75">Your booking is saved and the client has been notified via SMS and email.</p>
      </div>

      <div className="flex flex-col gap-3">
        <DetailRow label="Client" value={appointment.client.name} />
        <DetailRow label="Treatment" value={appointment.treatment.name} />
        <DetailRow label="Provider" value={appointment.provider.name} />
        <DetailRow label="Scheduled" value={`${formatDateLabel(appointment.startTime)} · ${formatTimeLabel(appointment.startTime)}`} />
      </div>

      <div className="mt-6 flex gap-2">
        {!onViewAppointment && !onBookAnother && (
          <Button variant="primary" size="md" className="flex-1" onClick={onClose}>Done</Button>
        )}
        {onBookAnother && (
          <Button variant="secondary" size="md" className="flex-1" onClick={onBookAnother}>Book Another</Button>
        )}
        {onViewAppointment && (
          <Button variant="primary" size="md" className="flex-1" onClick={() => onViewAppointment(appointment)}>View Appointment</Button>
        )}
      </div>
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
