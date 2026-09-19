import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Renders a built-in label + description row alongside the track.
   *  Omit when the caller already renders its own label text and
   *  only needs the bare toggle — use `ariaLabel` for accessibility
   *  in that case instead. */
  label?: string;
  description?: string;
  /** Accessible name for the track button. Falls back to `label`.
   *  Use this (without `label`) when embedding the switch inside a
   *  row the caller already labels visually, to avoid rendering the
   *  label text twice. */
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function Switch({ checked, onChange, label, description, ariaLabel, disabled = false, className }: SwitchProps) {
  const track = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B52] focus-visible:ring-offset-2",
        checked ? "bg-[#1A6B52]" : "bg-[#D1D5DB]",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "h-[18px] w-[18px] transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );

  if (!label) return track;

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        <div className="font-body text-sm font-medium text-[#1C1C1A]">{label}</div>
        {description && <div className="mt-0.5 font-body text-xs text-[#6B7280]">{description}</div>}
      </div>
      {track}
    </div>
  );
}
