import { ClipboardList } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import type { Appointment } from "@/features/appointments/types";
import { formatDateLabel } from "@/features/appointments/format";

export interface ClinicalNoteModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export function ClinicalNoteModal({ appointment, onClose }: ClinicalNoteModalProps) {
  if (!appointment || !appointment.clinicalNote) return null;
  const note = appointment.clinicalNote;

  return (
    <Modal
      open={Boolean(appointment)}
      onClose={onClose}
      title="Clinical Note"
      size="sm"
      footer={<div className="flex justify-end"><Button variant="secondary" size="sm" onClick={onClose}>Close</Button></div>}
    >
      <div className="mb-5 flex items-center gap-3">
        <Avatar name={appointment.client.name} size="md" />
        <div className="min-w-0 flex-1">
          <div className="truncate font-heading text-sm font-bold text-[#1C1C1A]">{appointment.client.name}</div>
          <div className="truncate font-body text-xs text-[#6B7280]">{appointment.treatment.name} · {formatDateLabel(appointment.startTime)}</div>
        </div>
        <span className="rounded-full bg-[#E8F4F0] px-2.5 py-1 font-body text-xs font-medium text-[#1A6B52]">Completed</span>
      </div>

      <div className="mb-4 rounded-[12px] border border-[#E8E4DF] p-3.5">
        <div className="mb-2.5 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-[#1A6B52]" aria-hidden="true" />
          <span className="font-heading text-xs font-bold text-[#1C1C1A]">Treatment Details</span>
        </div>
        <p className="font-body text-xs leading-relaxed text-[#6B7280]">{note.treatmentDetails}</p>
        <div className="mt-3 grid grid-cols-2 gap-2.5 border-t border-[#F5F2EF] pt-3">
          <MiniField label="Provider" value={appointment.provider.name} />
          <MiniField label="Room" value={appointment.room.name} />
        </div>
      </div>

      <div className="mb-4">
        <p className="mb-1.5 font-body text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Provider Notes</p>
        <p className="font-body text-xs leading-relaxed text-[#1C1C1A]">{note.providerNotes}</p>
      </div>

      <div className="mb-4">
        <p className="mb-1.5 font-body text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Products Used</p>
        <div className="flex flex-wrap gap-1.5">
          {note.productsUsed.map((product) => (
            <span key={product} className="rounded-full bg-[#F3F0EB] px-2.5 py-1 font-body text-[11px] text-[#1C1C1A]">{product}</span>
          ))}
        </div>
      </div>

      {note.nextRecommendedVisit && (
        <div className="rounded-[12px] bg-[#E8F4F0] px-3.5 py-2.5">
          <p className="font-body text-[11px] font-semibold uppercase tracking-wide text-[#1A6B52]">Next Recommended Visit</p>
          <p className="font-body text-sm font-medium text-[#1C1C1A]">{note.nextRecommendedVisit}</p>
        </div>
      )}
    </Modal>
  );
}

function MiniField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-body text-[10px] text-[#9CA3AF]">{label}</div>
      <div className="font-body text-xs font-medium text-[#1C1C1A]">{value}</div>
    </div>
  );
}
