export function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const datePart = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return isToday ? `Today, ${datePart}` : date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export function formatTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatTimeRange(startIso: string, endIso: string): string {
  return `${formatTimeLabel(startIso)} – ${formatTimeLabel(endIso)}`;
}

export function durationMinutes(startIso: string, endIso: string): number {
  return Math.round((new Date(endIso).getTime() - new Date(startIso).getTime()) / 60000);
}
