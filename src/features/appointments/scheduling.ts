import type { Appointment, Provider, Room, Treatment } from "@/features/appointments/types";

const CATEGORY_SPECIALTY_KEYWORDS: Record<string, string[]> = {
  Injectables: ["injectables", "botox", "fillers"],
  Laser: ["laser"],
  Facials: ["skincare", "aesthetic"],
  Skincare: ["skincare", "aesthetic"],
  Consultation: [],
};

export interface RankedProvider {
  provider: Provider;
  isSuitable: boolean;
}

export function rankProvidersForTreatment(treatment: Treatment, providers: Provider[]): RankedProvider[] {
  const keywords = CATEGORY_SPECIALTY_KEYWORDS[treatment.category] ?? [];
  const ranked = providers.map((provider) => {
    const isSuitable = keywords.length === 0 || keywords.some((k) => provider.specialty.toLowerCase().includes(k));
    return { provider, isSuitable };
  });
  return ranked.sort((a, b) => Number(b.isSuitable) - Number(a.isSuitable));
}

function timeRangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return new Date(aStart) < new Date(bEnd) && new Date(bStart) < new Date(aEnd);
}

export function findAvailableRoom(startTime: string, endTime: string, existingAppointments: Appointment[], rooms: Room[]): Room {
  const free = rooms.find(
    (room) =>
      !existingAppointments.some(
        (a) => a.room.id === room.id && a.status !== "cancelled" && timeRangesOverlap(startTime, endTime, a.startTime, a.endTime)
      )
  );
  return free ?? rooms[0];
}
