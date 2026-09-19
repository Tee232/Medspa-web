import { cn } from "@/lib/utils";

export interface SegmentedTabOption<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

export interface SegmentedTabsProps<T extends string = string> {
  options: SegmentedTabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedTabs<T extends string = string>({ options, value, onChange, className }: SegmentedTabsProps<T>) {
  return (
    <div role="tablist" className={cn("inline-flex max-w-full overflow-x-auto items-center gap-1 rounded-full border border-[#E5E7EB] bg-white p-1", className)}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-4 py-1.5 font-body text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B52]",
              isActive ? "bg-[#E8F4F0] text-[#1A6B52]" : "text-[#6B7280] hover:bg-[#F3F0EB] hover:text-[#1C1C1A]"
            )}
          >
            {option.label}
            {option.count !== undefined && (
              <span className={cn("ml-1.5", isActive ? "text-[#1A6B52]" : "text-[#9CA3AF]")}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
