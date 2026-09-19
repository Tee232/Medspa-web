import type { HTMLAttributes, ReactNode, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "large";
}

export function Card({ size = "default", className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border border-[#E8E4DF] bg-white",
        size === "large" ? "rounded-[32px]" : "rounded-[20px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between border-b border-[#E8E4DF] px-5 py-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-heading text-sm font-bold text-[#1C1C1A]", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardBody({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("border-t border-[#E8E4DF] px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  className,
  trackClassName,
  fillClassName,
}: {
  value: number;
  max?: number;
  className?: string;
  trackClassName?: string;
  fillClassName?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn("h-1.5 w-full rounded-full bg-[#F3F0EB]", trackClassName, className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div className={cn("h-1.5 rounded-full bg-[#1A6B52] transition-all", fillClassName)} style={{ width: `${pct}%` }} />
    </div>
  );
}

export interface StatCardProps {
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  label: string;
  value: string | number;
  sub?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({ icon, iconBg = "#E8F4F0", iconColor = "#1A6B52", label, value, sub, onClick, className }: StatCardProps) {
  const isInteractive = Boolean(onClick);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <Card
      className={cn(
        "flex h-20 items-center gap-3.5 px-4",
        isInteractive && "cursor-pointer transition-colors hover:bg-[#FAFAF9]",
        className
      )}
      onClick={isInteractive ? () => onClick?.() : undefined}
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px]" style={{ backgroundColor: iconBg, color: iconColor }}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-heading text-xl font-bold leading-none text-[#1C1C1A]">{value}</div>
        <div className="mt-1 truncate font-body text-xs text-[#6B7280]">{label}</div>
      </div>
      {sub && <div className="shrink-0 text-right font-body text-[11px] text-[#6B7280]">{sub}</div>}
    </Card>
  );
}
