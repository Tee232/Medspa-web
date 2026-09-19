export type TeamRole = "admin" | "provider" | "front_desk";
export type TeamMemberStatus = "active" | "pending";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  services: string;
  status: TeamMemberStatus;
}