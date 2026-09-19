import { Check, Sparkles, Gauge, Wind, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SuggestedSlot } from "@/features/appointments/types";
import { formatDateLabel, formatTimeLabel } from "@/features/appointments/format";

export interface SuggestedSlotPickerProps {
  slots: SuggestedSlot[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

const LABEL_ICON = {
  "Best Match": Sparkles,
  "Best Utilization": Gauge,
  "Low Traffic": Wind,
  "Top Pick": Zap,
} as const;

export function SuggestedSlotPicker({ slots, selectedIndex, onSelect, className }: SuggestedSlotPickerProps) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {slots.map((slot, i) => {
        const Icon = LABEL_ICON[slot.label];
        const isSelected = i === selectedIndex;
        return (
          <button
            key={slot.startTime}
            type="button"
            onClick={() => onSelect(i)}
            className={cn(
              "flex items-start gap-3 rounded-[12px] border p-3.5 text-left transition-colors",
              isSelected ? "border-[#1A6B52] bg-[#E8F4F0]" : "border-[#E5E7EB] hover:bg-[#F9FAFB]"
            )}
          >
            <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]", isSelected ? "bg-[#1A6B52] text-white" : "bg-[#F3F0EB] text-[#6B7280]")}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-0.5 flex items-center gap-2">
                <span className={cn("font-body text-[10px] font-bold uppercase tracking-wide", isSelected ? "text-[#1A6B52]" : "text-[#9CA3AF]")}>
                  {slot.label}
                </span>
              </div>
              <div className="font-heading text-sm font-bold text-[#1C1C1A]">{formatTimeLabel(slot.startTime)}</div>
              <div className="font-body text-xs text-[#6B7280]">{formatDateLabel(slot.startTime)} · {slot.reason}</div>
            </div>
            {isSelected && <Check className="h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />}
          </button>
        );
      })}
    </div>
  );
}
