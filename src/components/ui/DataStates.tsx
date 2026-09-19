import type { ReactNode } from "react";
import { Loader2, AlertTriangle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ icon, title, description, actionLabel, onAction, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-16 text-center", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F0EB] text-[#9CA3AF]">
        {icon ?? <Inbox className="h-6 w-6" aria-hidden="true" />}
      </div>
      <div>
        <p className="font-heading text-sm font-bold text-[#1C1C1A]">{title}</p>
        {description && <p className="mt-1 font-body text-xs text-[#6B7280]">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

export interface LoadingStateProps {
  label?: string;
  className?: string;
}

export function LoadingState({ label = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 px-6 py-16 text-center", className)} role="status" aria-live="polite">
      <Loader2 className="h-5 w-5 animate-spin text-[#1A6B52]" aria-hidden="true" />
      <p className="font-body text-xs text-[#6B7280]">{label}</p>
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = "Something went wrong", description = "That request could not be completed. Try again.", onRetry, className }: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 px-6 py-16 text-center", className)} role="alert">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <div>
        <p className="font-heading text-sm font-bold text-[#1C1C1A]">{title}</p>
        <p className="mt-1 font-body text-xs text-[#6B7280]">{description}</p>
      </div>
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
