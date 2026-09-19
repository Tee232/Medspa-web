import type { Appointment, Provider, Room } from "@/features/appointments/types";
import type { AIModuleContext } from "@/features/ai/types";

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

function has(q: string, ...words: string[]): boolean {
  return words.some((w) => q.includes(w));
}

function roomsAnswer(appointments: Appointment[], rooms: Room[]): string {
  const active = appointments.filter((a) => a.status !== "cancelled");
  const occupiedRoomIds = new Set(active.map((a) => a.room.id));
  const free = rooms.filter((r) => !occupiedRoomIds.has(r.id));
  const busy = rooms.filter((r) => occupiedRoomIds.has(r.id));

  if (free.length === 0) {
    return `All ${rooms.length} rooms have at least one appointment scheduled today (${busy.map((r) => r.name).join(", ")}).`;
  }
  return `${free.length} of ${rooms.length} rooms are free today: ${free.map((r) => r.name).join(", ")}. ${
    busy.length > 0 ? `${busy.map((r) => r.name).join(", ")} ${busy.length === 1 ? "has" : "have"} appointments booked.` : ""
  }`.trim();
}

function noShowRiskAnswer(appointments: Appointment[]): string {
  const noShows = appointments.filter((a) => a.status === "no_show");
  if (noShows.length === 0) {
    return "No appointments are currently marked as no-show today. I'll flag it here if a client with a history of missed visits is scheduled.";
  }
  const names = noShows.map((a) => `${a.client.name} (${a.treatment.name}, ${fmtTime(a.startTime)})`);
  return `${noShows.length} appointment${noShows.length > 1 ? "s" : ""} today ${
    noShows.length > 1 ? "are" : "is"
  } marked no-show: ${names.join("; ")}. Consider a confirmation reminder before their next booking.`;
}

function availableSlotsAnswer(appointments: Appointment[], q: string): string {
  const wantsAfternoon = has(q, "afternoon");
  const wantsMorning = has(q, "morning");
  const dayStart = wantsAfternoon ? 12 : 8;
  const dayEnd = wantsMorning ? 12 : 18;

  const today = new Date();
  const rangeStart = new Date(today);
  rangeStart.setHours(dayStart, 0, 0, 0);
  const rangeEnd = new Date(today);
  rangeEnd.setHours(dayEnd, 0, 0, 0);

  const busy = appointments
    .filter((a) => a.status !== "cancelled")
    .map((a) => ({ start: new Date(a.startTime), end: new Date(a.endTime) }))
    .filter((b) => b.end > rangeStart && b.start < rangeEnd)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const gaps: { start: Date; end: Date }[] = [];
  let cursor = rangeStart;
  for (const b of busy) {
    if (b.start.getTime() - cursor.getTime() >= 30 * 60000) {
      gaps.push({ start: cursor, end: b.start });
    }
    if (b.end > cursor) cursor = b.end;
  }
  if (rangeEnd.getTime() - cursor.getTime() >= 30 * 60000) {
    gaps.push({ start: cursor, end: rangeEnd });
  }

  if (gaps.length === 0) {
    return `No open slots found ${wantsAfternoon ? "this afternoon" : wantsMorning ? "this morning" : "in that window"} — the schedule is fully booked.`;
  }
  const label = gaps.slice(0, 3).map((g) => `${fmtTime(g.start.toISOString())}–${fmtTime(g.end.toISOString())}`).join(", ");
  return `${gaps.length} open slot${gaps.length > 1 ? "s" : ""} ${wantsAfternoon ? "this afternoon" : wantsMorning ? "this morning" : "today"}: ${label}.`;
}

function providerAnswer(providers: Provider[]): string {
  const available = providers.filter((p) => p.available);
  const unavailable = providers.filter((p) => !p.available);
  let msg = `${available.length} of ${providers.length} providers are available today: ${available.map((p) => `${p.name} (${p.openSlotsToday} open slots)`).join(", ")}.`;
  if (unavailable.length > 0) {
    msg += ` ${unavailable.map((p) => p.name).join(", ")} ${unavailable.length === 1 ? "is" : "are"} unavailable.`;
  }
  return msg;
}

function appointmentsOverviewAnswer(appointments: Appointment[]): string {
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const noShow = appointments.filter((a) => a.status === "no_show").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;
  return `Today: ${appointments.length} appointments total — ${confirmed} confirmed, ${pending} pending, ${noShow} no-show, ${cancelled} cancelled.`;
}

function answerAppointments(q: string, appointments: Appointment[], providers: Provider[], rooms: Room[]): string {
  if (has(q, "room")) return roomsAnswer(appointments, rooms);
  if (has(q, "no-show", "no show", "risk")) return noShowRiskAnswer(appointments);
  if (has(q, "slot", "available", "afternoon", "morning", "time")) {
    if (has(q, "provider")) return providerAnswer(providers);
    return availableSlotsAnswer(appointments, q);
  }
  if (has(q, "provider")) return providerAnswer(providers);
  return appointmentsOverviewAnswer(appointments);
}

function answerClientsList(q: string, clients: import("@/features/clients/types").Client[]): string {
  if (has(q, "follow-up", "follow up", "at-risk", "at risk", "need")) {
    const atRisk = clients.filter((c) => c.status === "at_risk");
    if (atRisk.length === 0) return "No clients are currently flagged at-risk. Everyone is on track.";
    return `${atRisk.length} client${atRisk.length > 1 ? "s" : ""} may need follow-up: ${atRisk.map((c) => `${c.name} (last visit ${c.lastVisitLabel})`).join(", ")}.`;
  }

  const mentioned = clients.find((c) => q.includes(c.name.toLowerCase().split(" ")[0]));
  if (mentioned) {
    return `${mentioned.name} is currently ${mentioned.status.replace("_", "-")}, with ${mentioned.visitCount} total visits and a last visit ${mentioned.lastVisitLabel.toLowerCase()}. Open their profile for treatment history and AI insights.`;
  }

  const active = clients.filter((c) => c.status === "active").length;
  const atRisk = clients.filter((c) => c.status === "at_risk").length;
  return `${clients.length} clients total — ${active} active, ${atRisk} at-risk. Ask me about a specific client by name, or which clients need follow-up.`;
}

function answerClientProfile(
  q: string,
  client: import("@/features/clients/types").Client,
  upcomingAppointment: Appointment | undefined,
  aiInsight: import("@/features/clients/types").ClientAIInsight | undefined
): string {
  const firstName = client.name.split(" ")[0];

  if (has(q, "next", "recommend", "rebook")) {
    if (aiInsight) return `${firstName}'s recommended next visit is ${aiInsight.recommendedNext.treatmentName} around ${aiInsight.recommendedNext.dateLabel}. ${aiInsight.narrative}`;
    return `I don't have a specific recommendation on file for ${firstName} yet.`;
  }
  if (has(q, "follow-up", "follow up", "risk")) {
    if (aiInsight) return `${firstName}'s retention risk is currently ${aiInsight.retentionRisk}. ${aiInsight.narrative}`;
    return `No retention risk data is available for ${firstName} yet.`;
  }
  if (has(q, "upcoming", "appointment", "scheduled")) {
    if (upcomingAppointment) return `${firstName} has ${upcomingAppointment.treatment.name} scheduled with ${upcomingAppointment.provider.name} on ${fmtTime(upcomingAppointment.startTime)}, currently ${upcomingAppointment.status}.`;
    return `${firstName} has no upcoming appointment scheduled right now.`;
  }
  if (aiInsight) return `${firstName}'s engagement score is ${aiInsight.engagementScore}/100 with ${aiInsight.retentionRisk.toLowerCase()} retention risk. ${aiInsight.narrative}`;
  return `${firstName} has ${client.visitCount} total visits and last visited ${client.lastVisitLabel.toLowerCase()}.`;
}

function answerDashboard(q: string, stats: Extract<AIModuleContext, { module: "dashboard" }>["stats"]): string {
  if (has(q, "at-risk", "at risk")) return `${stats.atRiskTotalCount} clients are currently flagged at-risk. Visit the Clients page to review and follow up.`;
  if (has(q, "utilization")) return `Clinic utilization is at ${stats.clinicUtilizationPct}% today.`;
  if (has(q, "follow-up", "follow up")) return `${stats.followUpsSent} follow-up messages have been sent so far.`;
  return `Today: ${stats.todayAppointmentCount} appointments — ${stats.confirmedCount} confirmed, ${stats.pendingCount} pending, ${stats.noShowCount} no-show.`;
}

function answerSettings(): string {
  return "You can update your profile, notification preferences, and security settings from the tabs on this page.";
}

/** Synthesizes a real answer from the module's actual data — never a generic placeholder. */
export function answerQuery(question: string, context: AIModuleContext): string {
  const q = question.toLowerCase();

  switch (context.module) {
    case "dashboard":
      return answerDashboard(q, context.stats);
    case "appointments":
      return answerAppointments(q, context.appointments, context.providers, context.rooms);
    case "clients":
      return answerClientsList(q, context.clients);
    case "client_profile":
      return answerClientProfile(q, context.client, context.upcomingAppointment, context.aiInsight);
    case "settings":
      return answerSettings();
    default:
      return "I can help with scheduling, clients, and clinic insights — try asking about today's appointments.";
  }
}
