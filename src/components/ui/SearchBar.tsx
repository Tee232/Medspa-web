import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  className?: string;
  "aria-label"?: string;
}

export function SearchBar({
  placeholder = "Search...",
  value = "",
  onChange,
  debounceMs = 300,
  className,
  "aria-label": ariaLabel = "Search",
}: SearchBarProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === value) return;
    const timeout = setTimeout(() => onChange?.(draft), debounceMs);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  return (
    <div className={cn("flex h-11 items-center gap-2 rounded-full bg-[#F3F0EB] px-4", className)}>
      <Search className="h-4 w-4 shrink-0 text-[#6B7280]" aria-hidden="true" />
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="flex-1 bg-transparent font-body text-sm text-[#1C1C1A] placeholder:text-[#6B7280] outline-none"
      />
      {draft && (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            onChange?.("");
          }}
          aria-label="Clear search"
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#E8E4DF] hover:text-[#1C1C1A]"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
