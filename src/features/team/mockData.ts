import type { TeamMember, TeamRole } from "./types";

export const PERMISSIONS_LIST = ["Clinical Charts", "Checkout & POS", "Revenue Reports", "System Settings"] as const;

export const ROLE_PERMISSIONS: Record<TeamRole, readonly string[]> = {
  admin: ["Clinical Charts", "Checkout & POS", "Revenue Reports", "System Settings"],
  provider: ["Clinical Charts", "Revenue Reports"],
  front_desk: ["Checkout & POS"],
};

export const TEAM_ROLE_OPTIONS: { value: TeamRole; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full access to clinic operations, staff, and finances." },
  { value: "provider", label: "Provider", description: "Injectors & estheticians — clinical care and client records." },
  { value: "front_desk", label: "Front Desk", description: "Scheduling, checkouts, and day-to-day client contact." },
];

export function teamRoleLabel(role: TeamRole): string {
  return TEAM_ROLE_OPTIONS.find((o) => o.value === role)?.label ?? role;
}

export const mockTeamMembers: TeamMember[] = [
  { id: "tm-sarah-chen", name: "Dr. Sarah Chen", email: "sarah.chen@lumiere.com", role: "provider", services: "Botox & Fillers", status: "active" },
  { id: "tm-maya-lin", name: "Maya Lin", email: "maya.lin@lumiere.com", role: "front_desk", services: "Scheduling & Billing", status: "active" },
  { id: "tm-alex-rivera", name: "Alex Rivera", email: "alex.rivera@lumiere.com", role: "admin", services: "Full Access", status: "active" },
  { id: "tm-james-okafor", name: "James Okafor", email: "james.okafor@lumiere.com", role: "provider", services: "Laser & Skin Treatments", status: "active" },
  { id: "tm-priya-patel", name: "Priya Patel", email: "priya.patel@lumiere.com", role: "front_desk", services: "Scheduling & Billing", status: "pending" },
];