import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SuggestedSlotPicker } from "@/components/appointments/SuggestedSlotPicker";
import type { Appointment, SuggestedSlot } from "@/features/appointments/types";
import { getMockSuggestedSlots } from "@/features/appointments/mockData";

export interface RescheduleModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onConfirm: (slot: SuggestedSlot) => void;
}

export function RescheduleModal({ appointment, onClose, onConfirm }: RescheduleModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  if (!appointment) return null;

  const slots = getMockSuggestedSlots();
  const selected = slots[selectedIndex];

  return (
    <Modal
      open={Boolean(appointment)}
      onClose={onClose}
      title="Reschedule Appointment"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" onClick={() => onConfirm(selected)}>Confirm Reschedule</Button>
        </div>
      }
    >
      <p className="mb-4 font-body text-sm text-[#6B7280]">{appointment.client.name} · {appointment.treatment.name}</p>
      <div className="mb-4 flex items-center gap-2 rounded-[12px] bg-[#E8F4F0] px-3 py-2">
        <Sparkles className="h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />
        <span className="font-body text-xs font-medium text-[#1A6B52]">AI Suggested Slots</span>
        <span className="ml-auto font-body text-[11px] text-[#1A6B52]/70">Best available times for this treatment and provider</span>
      </div>
      <SuggestedSlotPicker slots={slots} selectedIndex={selectedIndex} onSelect={setSelectedIndex} />
    </Modal>
  );
}
