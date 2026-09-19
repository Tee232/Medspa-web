import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#1A6B52] text-white hover:bg-[#145540] active:bg-[#0F4534] disabled:bg-[#D1D5DB] disabled:text-[#9CA3AF]",
  secondary:
    "bg-white text-[#1C1C1A] border border-[#E5E7EB] hover:bg-[#F3F4F6] disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF]",
  danger:
    "bg-[#DC2626] text-white hover:bg-[#B91C1C] disabled:bg-[#D1D5DB] disabled:text-[#9CA3AF]",
  ghost:
    "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1C1C1A] disabled:text-[#9CA3AF]",
  icon: "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1C1C1A] disabled:text-[#9CA3AF]",
};

const sizeStyles: Record<Exclude<ButtonVariant, "icon">, Record<ButtonSize, string>> = {
  primary: { sm: "h-9 px-3 text-xs", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" },
  secondary: { sm: "h-9 px-3 text-xs", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" },
  danger: { sm: "h-9 px-3 text-xs", md: "h-11 px-5 text-sm", lg: "h-12 px-6 text-base" },
  ghost: { sm: "h-9 px-3 text-xs", md: "h-11 px-4 text-sm", lg: "h-12 px-5 text-base" },
};

const iconSizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-11 w-11",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, disabled, children, ...props },
    ref
  ) => {
    const isIcon = variant === "icon";
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(
          "inline-flex shrink-0 items-center justify-center gap-2 font-body font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B52] focus-visible:ring-offset-2 disabled:cursor-not-allowed",
          isIcon ? "rounded-full" : "rounded-[20px]",
          variantStyles[variant],
          isIcon ? iconSizeStyles[size] : sizeStyles[variant][size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
