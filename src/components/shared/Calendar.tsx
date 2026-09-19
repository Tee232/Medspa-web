import { cn } from "@/lib/utils";

export type AppointmentStatus = "confirmed" | "pending" | "completed" | "no_show" | "cancelled";

export interface CalendarAppointment {
  id: string;
  clientName: string;
  service: string;
  providerName?: string;
  room?: string;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
}

export interface CalendarProps {
  days: Date[];
  appointments: CalendarAppointment[];
  startHour?: number;
  endHour?: number;
  hourHeight?: number;
  onAppointmentClick?: (appointment: CalendarAppointment) => void;
  onSlotClick?: (day: Date, hour: number) => void;
  className?: string;
}

const STATUS_STYLES: Record<AppointmentStatus, { bg: string; border: string; text: string; subtext: string }> = {
  confirmed: { bg: "bg-[#E8F4F0]", border: "border-l-[#1A6B52]", text: "text-[#1C1C1A]", subtext: "text-[#1A6B52]" },
  pending: { bg: "bg-[#FEF9EC]", border: "border-l-[#C9A96E]", text: "text-[#1C1C1A]", subtext: "text-[#92400E]" },
  completed: { bg: "bg-[#F3F4F6]", border: "border-l-[#9CA3AF]", text: "text-[#1C1C1A]", subtext: "text-[#6B7280]" },
  no_show: { bg: "bg-[#FEE2E2]", border: "border-l-[#DC2626]", text: "text-[#1C1C1A]", subtext: "text-[#991B1B]" },
  cancelled: { bg: "bg-[#F3F4F6]", border: "border-l-[#D1D5DB]", text: "text-[#9CA3AF]", subtext: "text-[#9CA3AF]" },
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function minutesFromStart(date: Date, startHour: number) {
  return (date.getHours() - startHour) * 60 + date.getMinutes();
}

interface LaidOutAppointment {
  appt: CalendarAppointment;
  lane: number;
  laneCount: number;
}

/**
 * Assigns each appointment a lane within its overlapping cluster,
 * so overlapping appointments render side-by-side (like Google
 * Calendar) instead of stacking on top of each other at full width.
 */
function layoutDayAppointments(appts: CalendarAppointment[]): LaidOutAppointment[] {
  const sorted = [...appts].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const laneEndTimes: number[] = [];
  const placed: { appt: CalendarAppointment; lane: number }[] = [];

  for (const appt of sorted) {
    const start = new Date(appt.startTime).getTime();
    const end = new Date(appt.endTime).getTime();

    let lane = laneEndTimes.findIndex((endTime) => endTime <= start);
    if (lane === -1) {
      lane = laneEndTimes.length;
      laneEndTimes.push(end);
    } else {
      laneEndTimes[lane] = end;
    }
    placed.push({ appt, lane });
  }

  return placed.map(({ appt, lane }) => {
    const start = new Date(appt.startTime).getTime();
    const end = new Date(appt.endTime).getTime();
    const overlapping = placed.filter(
      (p) =>
        new Date(p.appt.startTime).getTime() < end &&
        new Date(p.appt.endTime).getTime() > start
    );
    const laneCount = Math.max(1, ...overlapping.map((p) => p.lane + 1));
    return { appt, lane, laneCount };
  });
}

/**
 * Time-grid calendar.
 */
export function Calendar({
  days,
  appointments,
  startHour = 8,
  endHour = 18,
  hourHeight = 64,
  onAppointmentClick,
  onSlotClick,
  className,
}: CalendarProps) {
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const totalHeight = hours.length * hourHeight;

  return (
    <div className={cn("overflow-hidden rounded-[16px] border border-[#E8E4DF] bg-white", className)}>
      <div className="overflow-x-auto">
        <div className={days.length > 1 ? "min-w-[700px]" : "w-full"}>
          <div className="grid border-b border-[#E8E4DF]" style={{ gridTemplateColumns: `72px repeat(${days.length}, 1fr)` }}>
            <div />
            {days.map((day) => (
              <div key={day.toISOString()} className="border-l border-[#E8E4DF] px-3 py-2.5 text-center">
                <div className="font-body text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                </div>
                <div className="font-heading text-sm font-bold text-[#1C1C1A]">{day.getDate()}</div>
              </div>
            ))}
          </div>

          <div className="max-h-[560px] overflow-y-auto">
            <div className="grid" style={{ gridTemplateColumns: `72px repeat(${days.length}, 1fr)` }}>
              <div className="relative" style={{ height: totalHeight }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-2 -translate-y-1/2 text-right font-body text-[11px] text-[#9CA3AF]"
                    style={{ top: (hour - startHour) * hourHeight }}
                  >
                    {hour === 12 ? "12 PM" : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                  </div>
                ))}
              </div>

              {days.map((day) => {
                const dayAppointments = appointments.filter((appt) => isSameDay(new Date(appt.startTime), day));
                const laidOut = layoutDayAppointments(dayAppointments);

                return (
                  <div key={day.toISOString()} className="relative border-l border-[#E8E4DF]" style={{ height: totalHeight }}>
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => onSlotClick?.(day, hour)}
                        aria-label={`New appointment, ${day.toDateString()} ${hour}:00`}
                        className="absolute left-0 right-0 border-t border-[#F5F2EF] hover:bg-[#FAFAF9]"
                        style={{ top: (hour - startHour) * hourHeight, height: hourHeight }}
                      />
                    ))}

                    {laidOut.map(({ appt, lane, laneCount }) => {
                      const start = new Date(appt.startTime);
                      const end = new Date(appt.endTime);
                      const rawTop = (minutesFromStart(start, startHour) / 60) * hourHeight;
                      const rawHeight = Math.max(
                        ((end.getTime() - start.getTime()) / 60000 / 60) * hourHeight,
                        28
                      );
                      const top = rawTop + 2;
                      const height = Math.max(rawHeight - 4, 24);

                      const widthPct = 100 / laneCount;
                      const leftPct = widthPct * lane;
                      const gutter = laneCount > 1 ? 3 : 4;

                      const styles = STATUS_STYLES[appt.status];

                      return (
                        <button
                          key={appt.id}
                          type="button"
                          onClick={() => onAppointmentClick?.(appt)}
                          className={cn(
                            "absolute overflow-hidden rounded-[8px] border-l-[3px] px-2 py-1 text-left shadow-sm transition-shadow hover:z-10 hover:shadow-md",
                            styles.bg,
                            styles.border
                          )}
                          style={{
                            top,
                            height,
                            left: `calc(${leftPct}% + ${gutter}px)`,
                            width: `calc(${widthPct}% - ${gutter * 2}px)`,
                          }}
                        >
                          <div className={cn("truncate font-body text-[11px] font-semibold", styles.text)}>
                            {appt.clientName}
                          </div>
                          <div className={cn("truncate font-body text-[10px]", styles.subtext)}>
                            {appt.service}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
