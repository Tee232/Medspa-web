import type {
  AppointmentHistoryEntry,
  Client,
  ClientAIInsight,
  ClinicalNoteRecord,
  TreatmentHistoryEntry,
} from "@/features/clients/types";

export const mockClients: Client[] = [
  { id: "client-sophia", name: "Sophia Laurent", phone: "(310) 555-0142", email: "sophia@email.com", membership: "Platinum", status: "active", visitCount: 14, lastVisitLabel: "Today", memberSinceLabel: "March 2023", preferenceNote: "Prefers morning appointments. Sensitive skin — always patch test new serums. VIP client, personally known to Dr. Kim." },
  { id: "client-mia", name: "Mia Chen", phone: "(424) 555-0837", email: "mia@email.com", membership: "Platinum", status: "active", visitCount: 9, lastVisitLabel: "Today", memberSinceLabel: "June 2023" },
  { id: "client-elena", name: "Elena Vasquez", phone: "(310) 555-0201", email: "elena@email.com", membership: "Gold", status: "at_risk", visitCount: 11, lastVisitLabel: "62 days ago", memberSinceLabel: "January 2023" },
  { id: "client-ava", name: "Ava Thornton", phone: "(310) 555-0332", email: "ava@email.com", membership: "Gold", status: "active", visitCount: 6, lastVisitLabel: "22 days ago", memberSinceLabel: "August 2023" },
  { id: "client-priya", name: "Priya Mehta", phone: "(310) 555-0445", email: "priya@email.com", membership: "Gold", status: "at_risk", visitCount: 3, lastVisitLabel: "48 days ago", memberSinceLabel: "May 2024" },
  { id: "client-isabella", name: "Isabella Ross", phone: "(310) 555-0559", email: "isabella@email.com", membership: "Standard", status: "active", visitCount: 4, lastVisitLabel: "3 days ago", memberSinceLabel: "November 2024" },
  { id: "client-camille", name: "Camille Dupont", phone: "(424) 555-1187", email: "camille@email.com", membership: "Platinum", status: "active", visitCount: 12, lastVisitLabel: "5 days ago", memberSinceLabel: "February 2023" },
  { id: "client-rachel", name: "Rachel Kim", phone: "(424) 555-0612", email: "rachel@email.com", membership: "Standard", status: "at_risk", visitCount: 5, lastVisitLabel: "35 days ago", memberSinceLabel: "July 2024" },
  { id: "client-danielle", name: "Danielle Ford", phone: "(310) 555-0934", email: "danielle@email.com", membership: "Gold", status: "at_risk", visitCount: 3, lastVisitLabel: "41 days ago", memberSinceLabel: "September 2024" },
  { id: "client-nadia", name: "Nadia Okafor", phone: "(424) 555-0671", email: "nadia@email.com", membership: "Platinum", status: "new", visitCount: 2, lastVisitLabel: "2 days ago", memberSinceLabel: "June 2026" },
  { id: "client-grace", name: "Grace Hartley", phone: "(310) 555-1023", email: "grace@email.com", membership: "Standard", status: "inactive", visitCount: 7, lastVisitLabel: "Today", memberSinceLabel: "April 2023" },
  { id: "client-chloe", name: "Chloe Nakamura", phone: "(310) 555-0918", email: "chloe@email.com", membership: "Standard", status: "active", visitCount: 5, lastVisitLabel: "10 days ago", memberSinceLabel: "October 2024" },
];

export const mockTreatmentHistory: Record<string, TreatmentHistoryEntry[]> = {
  "client-sophia": [
    { id: "th-1", treatmentName: "HydraFacial Deluxe", category: "Skincare", dateLabel: "Jun 19, 2026", provider: "Dr. Kim", outcome: "Excellent glow response, no irritation" },
    { id: "th-2", treatmentName: "Vitamin C Peel", category: "Skincare", dateLabel: "May 12, 2026", provider: "Dr. Kim", outcome: "Mild redness resolved in 2h, strong brightening" },
    { id: "th-3", treatmentName: "Dermal Filler — Lips", category: "Injectables", dateLabel: "Mar 28, 2026", provider: "Dr. Reyes", outcome: "0.8ml Juvederm, symmetry achieved, client very satisfied" },
    { id: "th-4", treatmentName: "HydraFacial Deluxe", category: "Skincare", dateLabel: "Feb 14, 2026", provider: "Dr. Kim", outcome: "Pre-event treatment, great texture improvement" },
  ],
};

export const mockAppointmentHistory: Record<string, AppointmentHistoryEntry[]> = {
  "client-sophia": [
    { id: "ah-1", treatmentName: "HydraFacial Deluxe", dateLabel: "Jun 19, 2026", timeLabel: "9:00 AM", provider: "Dr. Kim", status: "completed" },
    { id: "ah-2", treatmentName: "Vitamin C Peel", dateLabel: "May 12, 2026", timeLabel: "10:30 AM", provider: "Dr. Kim", status: "completed" },
    { id: "ah-3", treatmentName: "Dermal Filler — Lips", dateLabel: "Mar 28, 2026", timeLabel: "2:00 PM", provider: "Dr. Reyes", status: "completed" },
    { id: "ah-4", treatmentName: "Consultation", dateLabel: "Feb 28, 2026", timeLabel: "11:00 AM", provider: "Dr. Kim", status: "completed" },
  ],
};

export const mockClinicalNotes: Record<string, ClinicalNoteRecord[]> = {
  "client-sophia": [
    { id: "note-1", dateLabel: "Feb 02, 2026", timeLabel: "9:00 AM", provider: "Dr. Kim", treatmentName: "HydraFacial Deluxe", room: "Suite A", durationLabel: "60 min", lastSavedLabel: "Feb 02, 2026 · 9:52 AM", preview: "Client skin showed mild dehydration...", treatmentDetails: "HydraFacial Deluxe performed using HydraFacial MD device. Full 3-step cleanse, extract, and hydrate protocol. Boost serum: Britenol for brightening.", providerNotes: "Client skin showed mild dehydration on arrival. Post-treatment response strong, no visible redness. Recommended increasing at-home water intake.", productsUsed: ["HydraFacial Cleanse Solution", "Britenol Brightening Serum"] },
    { id: "note-2", dateLabel: "Mar 12, 2026", timeLabel: "9:00 AM", provider: "Dr. Sophie", treatmentName: "Vitamin C Peel", room: "Suite B", durationLabel: "45 min", lastSavedLabel: "Mar 12, 2026 · 9:48 AM", preview: "Client skin showed mild dehydration...", treatmentDetails: "Vitamin C Peel applied in two passes. Mild tingling reported, resolved within 5 minutes. Skin visibly brighter immediately post-treatment.", providerNotes: "Client tolerated the peel well. Advised SPF 50 for the next 72 hours and to avoid direct sun exposure.", productsUsed: ["Vitamin C 20% Peel Solution", "SPF 50 Post-Care Screen"] },
    { id: "note-3", dateLabel: "Apr 19, 2026", timeLabel: "9:00 AM", provider: "Dr. Kent", treatmentName: "Dermal Filler — Lips", room: "Suite A", durationLabel: "50 min", lastSavedLabel: "Apr 19, 2026 · 9:55 AM", preview: "Client skin showed mild dehydration...", treatmentDetails: "0.8ml Juvederm Volbella injected symmetrically. Ice applied pre and post injection to minimize bruising.", providerNotes: "Client very satisfied with symmetry and volume. No adverse reactions observed. Follow-up offered at 2-week mark if needed.", productsUsed: ["Juvederm Volbella", "Arnica Gel"] },
    { id: "note-4", dateLabel: "May 16, 2026", timeLabel: "9:00 AM", provider: "Dr. Asher", treatmentName: "Vitamin C Peel", room: "Suite B", durationLabel: "45 min", lastSavedLabel: "May 16, 2026 · 9:47 AM", preview: "Client skin showed mild dehydration...", treatmentDetails: "Vitamin C Peel, standard protocol. Slight redness on cheeks post-treatment, resolved within 2 hours.", providerNotes: "Consistent positive response across sessions. Client interested in adding brightening serum to at-home routine.", productsUsed: ["Vitamin C 20% Peel Solution", "CTGF Growth Factor"] },
    {
      id: "note-5", dateLabel: "Jun 19, 2026", timeLabel: "9:00 AM", provider: "Dr. Kim", treatmentName: "HydraFacial Deluxe", room: "Suite A", durationLabel: "60 min", lastSavedLabel: "Jun 19, 2026 · 6:24 PM", preview: "Client skin showed mild dehydration...",
      treatmentDetails: "HydraFacial Deluxe performed using HydraFacial MD device. Full 3-step cleanse, extract, and hydrate protocol. Boost serum: Britenol for brightening. Jlo Beauty Booster applied post-treatment. Vortex extraction achieved excellent clearance on T-zone.",
      providerNotes: "Client skin showed mild dehydration on arrival. Post-treatment response excellent — strong glow with no visible redness. Recommended 72h SPF protocol and introduced Vitamin C serum to home care routine. Client interested in adding a Perk Eye treatment next session. No adverse reactions observed.",
      productsUsed: ["HydraFacial Cleanse Solution", "Dermabuilder Boost Serum", "Britenol Brightening Serum", "CTGF Growth Factor", "SPF 50 Post-Care Screen"],
      nextRecommendedVisit: { dateLabel: "July 17, 2026", treatmentType: "HydraFacial Maintenance" },
    },
  ],
};

export const mockClientAIInsights: Record<string, ClientAIInsight> = {
  "client-sophia": { engagementScore: 92, retentionRisk: "Low", recommendedNext: { treatmentName: "Vitamin C Brightening Booster", dateLabel: "Jul 17" }, narrative: "Sophia is highly engaged and consistent. Recommend introducing the Perk Eye Treatment add-on at her next session to increase average spend." },
  "client-mia": { engagementScore: 78, retentionRisk: "Low", recommendedNext: { treatmentName: "Microneedling RF", dateLabel: "Jul 10" }, narrative: "Mia visits regularly and responds well to skincare treatments. A loyalty tier upgrade may improve long-term retention." },
  "client-elena": { engagementScore: 34, retentionRisk: "High", recommendedNext: { treatmentName: "Re-engagement Consultation", dateLabel: "This week" }, narrative: "Elena has not visited in 62 days after previously visiting monthly. A personalized outreach message is likely to recover this relationship." },
  "client-ava": { engagementScore: 61, retentionRisk: "Medium", recommendedNext: { treatmentName: "Laser Skin Resurfacing", dateLabel: "Jul 5" }, narrative: "Ava's visit frequency has slowed slightly. Consider a check-in message ahead of her laser series renewal." },
  "client-priya": { engagementScore: 29, retentionRisk: "High", recommendedNext: { treatmentName: "Re-engagement Consultation", dateLabel: "This week" }, narrative: "Priya's visit cadence has dropped significantly. Recommend a retention campaign before the relationship lapses further." },
  "client-isabella": { engagementScore: 71, retentionRisk: "Low", recommendedNext: { treatmentName: "Vitamin IV Drip", dateLabel: "Jul 8" }, narrative: "Isabella is a newer client with strong early engagement. Good candidate for a membership upsell." },
  "client-camille": { engagementScore: 88, retentionRisk: "Low", recommendedNext: { treatmentName: "Dermal Filler Touch-Up", dateLabel: "Jul 20" }, narrative: "Camille is a highly consistent Platinum member with strong treatment adherence." },
  "client-rachel": { engagementScore: 40, retentionRisk: "Medium", recommendedNext: { treatmentName: "Skincare Consultation", dateLabel: "This week" }, narrative: "Rachel's visits have become less frequent. A tailored check-in could help re-establish her routine." },
  "client-danielle": { engagementScore: 37, retentionRisk: "Medium", recommendedNext: { treatmentName: "Facial Consultation", dateLabel: "This week" }, narrative: "Danielle has gone quiet after a strong start. Early outreach is recommended before risk increases further." },
  "client-nadia": { engagementScore: 66, retentionRisk: "Low", recommendedNext: { treatmentName: "Skincare Follow-Up", dateLabel: "Jul 12" }, narrative: "Nadia is a new Platinum member with a strong start. Focus on a great second-visit experience." },
  "client-grace": { engagementScore: 12, retentionRisk: "High", recommendedNext: { treatmentName: "Win-Back Offer", dateLabel: "N/A" }, narrative: "Grace is currently inactive. Historical records are preserved but she is not counted in active retention efforts." },
  "client-chloe": { engagementScore: 58, retentionRisk: "Medium", recommendedNext: { treatmentName: "Chemical Peel Pro", dateLabel: "Jul 15" }, narrative: "Chloe engages steadily. A seasonal skincare promotion could increase visit frequency." },
};
