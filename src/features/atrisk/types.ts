export type RiskLevel = "Critical" | "High" | "Medium";
export type FollowUpChannel = "SMS" | "Email";

export interface AtRiskClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  memberSinceLabel: string;
  lastVisit: string;
  lastTreatment: string;
  riskScore: number;
  riskLevel: RiskLevel;
  ltv: number;
  visitCount: number;
  aiRecommendation: string;
}