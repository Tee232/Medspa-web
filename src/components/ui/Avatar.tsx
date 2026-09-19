import { cn } from "@/lib/utils";

export interface AvatarProps {
  name: string;
  /** Uploaded photo URL. Falls back to initials when omitted. */
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-9 w-9 text-xs",
  lg: "h-11 w-11 text-sm",
} as const;

const PALETTE = ["#1A6B52", "#7C3AED", "#2563EB", "#DC2626", "#C9A96E", "#059669"];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

/** Circular avatar — shows an uploaded photo when `imageUrl` is set, otherwise deterministic-color initials. */
export function Avatar({ name, imageUrl, size = "md", className }: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", SIZE_CLASSES[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-body font-semibold text-white",
        SIZE_CLASSES[size],
        className
      )}
      style={{ backgroundColor: getColorForName(name) }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}
