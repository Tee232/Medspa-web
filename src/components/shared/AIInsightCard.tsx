import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export type InsightVariant = "green" | "gold" | "purple" | "gradient";

export interface AIInsightCardProps {
  variant?: InsightVariant;
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  isCtaLoading?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const VARIANT_STYLES: Record<InsightVariant, { bg: string; border: string; iconBg: string; iconColor: string; titleColor: string; bodyColor: string; buttonBg: string; buttonText: string }> = {
  green: { bg: "bg-[#EAF5F1]", border: "border-[#CFE8DF]", iconBg: "bg-white", iconColor: "text-[#1A6B52]", titleColor: "text-[#1C1C1A]", bodyColor: "text-[#6B7280]", buttonBg: "#1A6B52", buttonText: "#FFFFFF" },
  gold: { bg: "bg-[#FDF4E5]", border: "border-[#F0DFAE]", iconBg: "bg-white", iconColor: "text-[#C9A96E]", titleColor: "text-[#1C1C1A]", bodyColor: "text-[#6B7280]", buttonBg: "#C9A96E", buttonText: "#1C1C1A" },
  purple: { bg: "bg-[#F0EEFB]", border: "border-[#DAD5F5]", iconBg: "bg-white", iconColor: "text-[#7C6FCD]", titleColor: "text-[#1C1C1A]", bodyColor: "text-[#6B7280]", buttonBg: "#7C6FCD", buttonText: "#FFFFFF" },
  gradient: { bg: "bg-gradient-to-br from-[#0F4233] to-[#1A6B52]", border: "border-transparent", iconBg: "bg-white/15", iconColor: "text-white", titleColor: "text-white", bodyColor: "text-white/75", buttonBg: "#FFFFFF", buttonText: "#0F4233" },
};

export function AIInsightCard({ variant = "green", icon, title, description, ctaLabel, onCtaClick, isCtaLoading = false, onDismiss, className }: AIInsightCardProps) {
  const styles = VARIANT_STYLES[variant];
  return (
    <div className={cn("relative flex min-h-[116px] max-h-[210px] flex-col overflow-hidden rounded-[16px] border p-4", styles.bg, styles.border, className)}>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss insight"
          className={cn(
            "absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full transition-colors",
            variant === "gradient" ? "text-white/60 hover:bg-white/15 hover:text-white" : "text-[#9CA3AF] hover:bg-black/5 hover:text-[#6B7280]"
          )}
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
      <div className={cn("mb-2.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]", styles.iconBg)}>
        <span className={cn("[&>svg]:h-4 [&>svg]:w-4", styles.iconColor)}>{icon}</span>
      </div>
      <h4 className={cn("mb-1.5 pr-5 font-heading text-[13px] font-bold", styles.titleColor)}>{title}</h4>
      <p className={cn("mb-3.5 flex-1 font-body text-xs leading-relaxed", styles.bodyColor)}>{description}</p>
      {ctaLabel && (
        <Button
          variant="primary"
          size="sm"
          className="w-full shrink-0 border-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: styles.buttonBg, color: styles.buttonText }}
          onClick={onCtaClick}
          isLoading={isCtaLoading}
        >
          {ctaLabel}
        </Button>
      )}
    </div>
  );
}
