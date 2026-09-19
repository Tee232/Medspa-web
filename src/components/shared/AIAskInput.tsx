import { useState } from "react";
import { Plus, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AIAskInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function AIAskInput({ onSubmit, isLoading = false, placeholder = "Ask Aura AI anything...", className }: AIAskInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setValue("");
  }

  return (
    <div className={cn("flex items-center gap-2 rounded-full border border-[#E8E4DF] bg-white py-2 pl-4 pr-2", className)}>
      <button type="button" aria-label="Add attachment" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#9CA3AF] hover:bg-[#F3F0EB] hover:text-[#6B7280]">
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
        placeholder={placeholder}
        aria-label="Ask AI a question"
        disabled={isLoading}
        className="flex-1 bg-transparent font-body text-[13px] text-[#1C1C1A] placeholder:text-[#9CA3AF] outline-none disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!value.trim() || isLoading}
        aria-label="Send message"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A6B52] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
