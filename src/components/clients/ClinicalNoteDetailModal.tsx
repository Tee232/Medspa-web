import type { ReactNode } from "react";
import { Lock, ClipboardList, FileText, CalendarClock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import type { Client, ClinicalNoteRecord } from "@/features/clients/types";

export interface ClinicalNoteDetailModalProps {
  client: Client | null;
  note: ClinicalNoteRecord | null;
  onClose: () => void;
}

/** Full detail for a single clinical note, including Next Recommended Visit (date + treatment) when present. */
export function ClinicalNoteDetailModal({ client, note, onClose }: ClinicalNoteDetailModalProps) {
  if (!client || !note) return null;

  return (
    <Modal
      open={Boolean(note)}
      onClose={onClose}
      title="Clinical Note"
      size="lg"
      footer={<div className="flex justify-end"><Button variant="secondary" size="sm" onClick={onClose}>Close</Button></div>}
    >
      <p className="mb-5 font-body text-xs text-[#6B7280]">{client.name} · {note.treatmentName} · {note.timeLabel}</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-[200px_1fr]">
        <div>
          <Avatar name={client.name} size="lg" />
          <p className="mt-3 font-heading text-sm font-bold text-[#1C1C1A]">{client.name}</p>
          <span className="mt-1 inline-flex items-center rounded-full bg-[#E8F4F0] px-2.5 py-0.5 font-body text-xs font-medium text-[#1A6B52]">Completed</span>

          <div className="mt-5 flex flex-col gap-3.5">
            <MetaField label="Treatment" value={note.treatmentName} />
            <MetaField label="Provider" value={note.provider} />
            <MetaField label="Room" value={note.room} />
            <MetaField label="Time" value={note.timeLabel} />
            <MetaField label="Duration" value={note.durationLabel} />
            <MetaField label="Last Saved" value={note.lastSavedLabel} />
          </div>

          <div className="mt-4 flex items-center gap-1.5 rounded-full bg-[#F3F0EB] px-2.5 py-1 font-body text-[10px] font-medium text-[#6B7280]">
            <Lock className="h-3 w-3" aria-hidden="true" />
            HIPAA Secured
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <SectionLabel icon={<ClipboardList className="h-4 w-4" />} text="Treatment Details" />
            <p className="rounded-[12px] border border-[#E8E4DF] p-3.5 font-body text-xs leading-relaxed text-[#1C1C1A]">{note.treatmentDetails}</p>
          </div>
          <div>
            <SectionLabel icon={<FileText className="h-4 w-4" />} text="Provider Notes" />
            <p className="rounded-[12px] border border-[#E8E4DF] p-3.5 font-body text-xs leading-relaxed text-[#1C1C1A]">{note.providerNotes}</p>
          </div>
          <div>
            <SectionLabel icon={<ClipboardList className="h-4 w-4" />} text="Products Used" />
            <div className="flex flex-wrap gap-1.5">
              {note.productsUsed.map((product) => (
                <span key={product} className="rounded-full bg-[#F3F0EB] px-2.5 py-1 font-body text-[11px] text-[#1C1C1A]">{product}</span>
              ))}
            </div>
          </div>
          {note.nextRecommendedVisit && (
            <div>
              <SectionLabel icon={<CalendarClock className="h-4 w-4" />} text="Next Recommended Visit" />
              <div className="flex gap-4 rounded-[12px] bg-[#E8F4F0] px-3.5 py-3">
                <div>
                  <div className="font-body text-[10px] uppercase tracking-wide text-[#1A6B52]/70">Date</div>
                  <div className="font-body text-sm font-semibold text-[#1C1C1A]">{note.nextRecommendedVisit.dateLabel}</div>
                </div>
                <div>
                  <div className="font-body text-[10px] uppercase tracking-wide text-[#1A6B52]/70">Treatment Type</div>
                  <div className="font-body text-sm font-semibold text-[#1C1C1A]">{note.nextRecommendedVisit.treatmentType}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-body text-[10px] uppercase tracking-wide text-[#9CA3AF]">{label}</div>
      <div className="font-body text-sm font-medium text-[#1C1C1A]">{value}</div>
    </div>
  );
}

function SectionLabel({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="mb-1.5 flex items-center gap-2">
      <span className="text-[#1A6B52] [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      <span className="font-heading text-xs font-bold text-[#1C1C1A]">{text}</span>
    </div>
  );
}
