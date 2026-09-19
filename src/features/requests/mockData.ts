import type { CustomerRequest } from "./types";

export const mockRequests: CustomerRequest[] = [
  {
    id: "req-101",
    name: "Sarah Jenkins",
    email: "sarah.j@example.com",
    phone: "(310) 555-0182",
    requestType: "consultation",
    requestedTreatment: "Dermal Fillers",
    message: "Hi! I would like to schedule a consultation for lip fillers before my anniversary next month. Do you have any weekend appointments available?",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    status: "pending",
  },
  {
    id: "req-102",
    name: "Marcus Thorne",
    email: "marcus.thorne@example.com",
    phone: "(310) 555-0294",
    requestType: "general_inquiry",
    requestedTreatment: "Laser Hair Removal",
    message: "Hello, I am interested in your full back laser hair removal package. Could you send me pricing details and recommended session intervals?",
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hrs ago
    status: "pending",
  },
  {
    id: "req-103",
    name: "Elena Rostova",
    email: "elena.r@example.com",
    phone: "(310) 555-0842",
    requestType: "consultation",
    requestedTreatment: "Botox Cosmetic",
    message: "I am looking for subtle forehead line smoothing before an upcoming conference. Would love a 30 min consultation with Dr. Sarah Lin.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: "responded",
    replyMessage: "Hi Elena! Thank you for contacting Lumière MedSpa. Dr. Sarah Lin would be delighted to see you for a Botox consultation. We sent a booking link to your email.",
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: "req-104",
    name: "Chloe Bennett",
    email: "chloe.b@example.com",
    phone: "(310) 555-0419",
    requestType: "consultation",
    requestedTreatment: "HydraFacial Deluxe",
    message: "Interested in a deep pore cleansing and glowing facial treatment before a photoshoots session next week.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    status: "converted",
    replyMessage: "Hi Chloe, we have converted your inquiry into a client record and reserved your HydraFacial slot!",
    respondedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    convertedClientId: "client-1",
    convertedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "req-105",
    name: "David Miller",
    email: "david.m@example.com",
    phone: "(310) 555-0912",
    requestType: "general_inquiry",
    requestedTreatment: "Chemical Peel",
    message: "I have sensitive skin prone to redness. Is a mild lactic acid chemical peel suitable for my skin type?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    status: "pending",
  },
];
