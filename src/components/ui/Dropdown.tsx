import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DropdownOption<T extends string = string> {
  value: T;
  label: string;
}

export interface DropdownProps<T extends string = string> {
  label?: string;
  options: DropdownOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown<T extends string = string>({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {label && <span className="mb-1.5 block font-body text-xs font-medium text-[#1C1C1A]">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-11 w-full items-center justify-between gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-4 font-body text-sm text-[#1C1C1A] transition-colors hover:bg-[#F9FAFB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B52]"
      >
        <span className={selected ? "text-[#1C1C1A]" : "text-[#9CA3AF]"}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#6B7280] transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>

      {open && (
        <ul role="listbox" className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-[12px] border border-[#E5E7EB] bg-white p-1 shadow-lg">
          {options.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-[8px] px-3 py-2 font-body text-sm text-[#1C1C1A] hover:bg-[#F3F0EB]",
                option.value === value && "bg-[#E8F4F0] text-[#1A6B52]"
              )}
            >
              {option.label}
              {option.value === value && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
