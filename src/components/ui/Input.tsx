import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    const hintId = hint ? `${inputId}-hint` : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="font-body text-xs font-medium text-[#1C1C1A]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={!!error || undefined}
          aria-describedby={cn(errorId, hintId) || undefined}
          className={cn(
            "h-12 rounded-[12px] border bg-white px-4 font-body text-sm text-[#1C1C1A] placeholder:text-[#9CA3AF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B52] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF]",
            error ? "border-[#DC2626] focus-visible:ring-[#DC2626]" : "border-[#E5E7EB]",
            className
          )}
          {...props}
        />
        {error && <p id={errorId} className="font-body text-xs text-[#DC2626]">{error}</p>}
        {hint && !error && <p id={hintId} className="font-body text-xs text-[#6B7280]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
