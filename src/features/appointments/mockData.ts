import type {
  Appointment,
  AppointmentClient,
  Provider,
  Room,
  SuggestedSlot,
  Treatment,
} from "@/features/appointments/types";

function todayAt(hour: number, minute = 0): string {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const mockProviders: Provider[] = [
  { id: "prov-kim", name: "Dr. Sarah Kim", specialty: "Laser & Injectables", openSlotsToday: 3, available: true },
  { id: "prov-reyes", name: "Dr. Maria Reyes", specialty: "Botox & Fillers", openSlotsToday: 2, available: true },
  { id: "prov-patel", name: "RN Priya Patel", specialty: "IV Therapy & Skincare", openSlotsToday: 5, available: false },
  { id: "prov-chen", name: "Dr. James Chen", specialty: "Aesthetic Medicine", openSlotsToday: 4, available: true },
];

export const mockTreatments: Treatment[] = [
  { id: "tx-botox", name: "Botox", category: "Injectables", durationMinutes: 45, priceLabel: "$480" },
  { id: "tx-fillers", name: "Dermal Fillers", category: "Injectables", durationMinutes: 60, priceLabel: "$680" },
  { id: "tx-laser", name: "Laser Treatment", category: "Laser", durationMinutes: 75, priceLabel: "$620" },
  { id: "tx-hydrafacial", name: "HydraFacial Deluxe", category: "Facials", durationMinutes: 60, priceLabel: "$320" },
  { id: "tx-skincare", name: "Skincare Treatment", category: "Skincare", durationMinutes: 45, priceLabel: "$280" },
  { id: "tx-consult", name: "Consultation", category: "Consultation", durationMinutes: 30, priceLabel: "$0" },
  { id: "tx-microneedling", name: "Microneedling RF", category: "Skincare", durationMinutes: 60, priceLabel: "$450" },
  { id: "tx-chemicalpeel", name: "Chemical Peel Pro", category: "Skincare", durationMinutes: 45, priceLabel: "$300" },
];

export const mockRooms: Room[] = [
  { id: "room-1", name: "Room 1" },
  { id: "room-2", name: "Room 2" },
  { id: "room-3", name: "Room 3" },
  { id: "room-4", name: "Room 4" },
];

export const mockBookableClients: AppointmentClient[] = [
  { id: "client-sophia", name: "Sophia Laurent", phone: "(310) 555-0142", email: "sophia@email.com", lastVisitLabel: "15 days ago" },
  { id: "client-elena", name: "Elena Vasquez", phone: "(310) 555-0201", email: "elena@email.com", lastVisitLabel: "62 days ago" },
  { id: "client-mia", name: "Mia Chen", phone: "(424) 555-0837", email: "mia@email.com", lastVisitLabel: "8 days ago" },
  { id: "client-priya", name: "Priya Mehta", phone: "(310) 555-0445", email: "priya@email.com", lastVisitLabel: "48 days ago" },
];

function findProvider(id: string) {
  const provider = mockProviders.find((p) => p.id === id);
  if (!provider) throw new Error(`Unknown mock provider id: ${id}`);
  return provider;
}
function findTreatment(id: string) {
  const treatment = mockTreatments.find((t) => t.id === id);
  if (!treatment) throw new Error(`Unknown mock treatment id: ${id}`);
  return treatment;
}
function findRoom(id: string) {
  const room = mockRooms.find((r) => r.id === id);
  if (!room) throw new Error(`Unknown mock room id: ${id}`);
  return room;
}

export const mockAppointments: Appointment[] = [
  {
    id: "appt-1",
    client: { id: "client-sophia", name: "Sophia Laurent", phone: "(310) 555-0142", email: "sophia@email.com" },
    treatment: findTreatment("tx-hydrafacial"),
    provider: findProvider("prov-kim"),
    room: findRoom("room-2"),
    startTime: todayAt(9, 0),
    endTime: todayAt(10, 0),
    status: "confirmed",
  },
  {
    id: "appt-2",
    client: { id: "client-ava", name: "Ava Thornton", phone: "(310) 555-0332", email: "ava@email.com" },
    treatment: findTreatment("tx-laser"),
    provider: findProvider("prov-kim"),
    room: findRoom("room-3"),
    startTime: todayAt(10, 15),
    endTime: todayAt(11, 30),
    status: "confirmed",
  },
  {
    id: "appt-3",
    client: { id: "client-isabella", name: "Isabella Ross", phone: "(310) 555-0559", email: "isabella@email.com" },
    treatment: findTreatment("tx-consult"),
    provider: findProvider("prov-patel"),
    room: findRoom("room-1"),
    // Deliberately overlaps appt-2 (10:15-11:30) — exercises the
    // Calendar's side-by-side overlap layout rather than hiding it.
    startTime: todayAt(11, 0),
    endTime: todayAt(11, 30),
    status: "confirmed",
  },
  {
    id: "appt-4",
    client: { id: "client-nadia", name: "Nadia Okafor", phone: "(424) 555-0671", email: "nadia@email.com" },
    treatment: findTreatment("tx-hydrafacial"),
    provider: findProvider("prov-reyes"),
    room: findRoom("room-4"),
    startTime: todayAt(8, 0),
    endTime: todayAt(9, 0),
    // Completed, with a clinical note attached — the one appointment
    // that exercises "View Clinical Notes" as the only action.
    status: "completed",
    clinicalNote: {
      treatmentDetails:
        "HydraFacial Deluxe performed using HydraFacial MD device. Full 3-step cleanse, extract, and hydrate protocol. Boost serum: Britenol for brightening. Jlo Beauty Booster applied final step.",
      providerNotes:
        "Client disclosed mild dehydration on arrival. Post-treatment expression very strong. Advised increasing at-home water intake. Client interested in adding a Perk Eye Treatment next session for undereye concerns.",
      productsUsed: ["HydraFacial Cleanse Solution", "Britenol Brightening Serum", "CTGF Growth Factor", "GM-DP Dark Spot Corrector"],
      nextRecommendedVisit: "July 17, 2026",
    },
  },
  {
    id: "appt-5",
    client: { id: "client-mia", name: "Mia Chen", phone: "(424) 555-0837", email: "mia@email.com" },
    treatment: findTreatment("tx-microneedling"),
    provider: findProvider("prov-reyes"),
    room: findRoom("room-2"),
    startTime: todayAt(13, 15),
    endTime: todayAt(14, 15),
    status: "pending",
  },
  {
    id: "appt-6",
    client: { id: "client-chloe", name: "Chloe Nakamura", phone: "(310) 555-0918", email: "chloe@email.com" },
    treatment: findTreatment("tx-chemicalpeel"),
    provider: findProvider("prov-chen"),
    room: findRoom("room-1"),
    startTime: todayAt(14, 0),
    endTime: todayAt(14, 45),
    status: "pending",
  },
  {
    id: "appt-7",
    client: { id: "client-grace", name: "Grace Hartley", phone: "(310) 555-1023", email: "grace@email.com" },
    treatment: findTreatment("tx-botox"),
    provider: findProvider("prov-reyes"),
    room: findRoom("room-3"),
    startTime: todayAt(15, 15),
    endTime: todayAt(16, 0),
    status: "no_show",
  },
  {
    id: "appt-8",
    client: { id: "client-camille", name: "Camille Dupont", phone: "(424) 555-1187", email: "camille@email.com" },
    treatment: findTreatment("tx-fillers"),
    provider: findProvider("prov-kim"),
    room: findRoom("room-2"),
    startTime: todayAt(16, 0),
    endTime: todayAt(17, 0),
    status: "confirmed",
  },
];

export function getMockSuggestedSlots(): SuggestedSlot[] {
  return [
    { startTime: todayAt(10, 0), endTime: todayAt(10, 45), label: "Best Match", reason: "Provider available · Room ready · Matches treatment duration" },
    { startTime: todayAt(14, 0), endTime: todayAt(14, 45), label: "Best Utilization", reason: "Optimal clinic flow · Balances provider schedule evenly" },
    { startTime: todayAt(16, 0), endTime: todayAt(16, 45), label: "Low Traffic", reason: "Fewest concurrent sessions · Premium unhurried experience" },
  ];
}
