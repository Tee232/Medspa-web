import { useState } from "react";
import { Plus, Send, ShieldCheck, UserCheck, UserX, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Avatar } from "@/components/ui/Avatar";
import { StatCard } from "@/components/ui/Card";
import { InviteTeamMemberModal } from "@/components/settings/InviteTeamMemberModal";
import { mockTeamMembers } from "@/features/team/mockData";
import type { TeamMember, TeamMemberStatus, TeamRole } from "@/features/team/types";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<TeamRole, { label: string; className: string }> = {
  admin: { label: "Admin", className: "bg-[#FEF3C7] text-[#92400E]" },
  provider: { label: "Provider", className: "bg-[#E8F4F0] text-[#1A6B52]" },
  front_desk: { label: "Front Desk", className: "bg-[#EFF6FF] text-[#1D4ED8]" },
};

const STATUS_STYLES: Record<TeamMemberStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-[#E8F4F0] text-[#1A6B52]" },
  pending: { label: "Pending Invite", className: "bg-[#FEF3C7] text-[#92400E]" },
};

function RoleBadge({ role }: { role: TeamRole }) {
  const config = ROLE_STYLES[role];
  return <span className={cn("inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium", config.className)}>{config.label}</span>;
}

function StatusBadge({ status }: { status: TeamMemberStatus }) {
  const config = STATUS_STYLES[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 font-body text-xs font-medium", config.className)}>
      <span className={cn("mr-1.5 h-1.5 w-1.5 rounded-full", status === "active" ? "bg-[#1A6B52]" : "bg-[#F59E0B]")} aria-hidden="true" />
      {config.label}
    </span>
  );
}

const TABLE_GRID = "grid grid-cols-[minmax(200px,1.5fr)_100px_minmax(140px,1.2fr)_110px_48px] items-center gap-3 px-5";

function HeaderCell({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <span className={cn("font-body text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]", align === "right" && "text-right")}>
      {children}
    </span>
  );
}

export function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const activeStaff = members.filter((m) => m.status === "active").length;
  const providerCount = members.filter((m) => m.role === "provider").length;
  const frontDeskAdminCount = members.filter((m) => m.role === "front_desk" || m.role === "admin").length;

  function servicesForRole(role: TeamRole): string {
    return role === "admin" ? "Full Access" : role === "provider" ? "Clinical Services" : "Scheduling & Billing";
  }

  function openInvite() {
    setEditingMember(null);
    setInviteOpen(true);
  }

  function openEdit(member: TeamMember) {
    setEditingMember(member);
    setInviteOpen(true);
  }

  function handleSubmit(data: { name: string; email: string; role: TeamRole }) {
    if (editingMember) {
      setMembers((prev) => prev.map((m) => (m.id === editingMember.id ? { ...m, name: data.name, email: data.email, role: data.role, services: servicesForRole(data.role) } : m)));
    } else {
      setMembers((prev) => [
        ...prev,
        {
          id: `tm-${Date.now()}`,
          name: data.name,
          email: data.email,
          role: data.role,
          services: servicesForRole(data.role),
          status: "pending",
        },
      ]);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-bold text-[#1C1C1A]">Team Members & Permissions</h2>
          <p className="mt-0.5 font-body text-sm text-[#6B7280]">Manage staff roles, assigned services, and access levels.</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Plus className="h-4 w-4" />} onClick={openInvite}>
          Invite Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={<Users className="h-[18px] w-[18px]" />} iconBg="#E8F4F0" iconColor="#1A6B52" label="Total Active Staff" value={activeStaff} sub="currently active" />
        <StatCard icon={<UserCheck className="h-[18px] w-[18px]" />} iconBg="#FEF9EC" iconColor="#C9A96E" label="Providers" value={providerCount} sub="Injectors & Estheticians" />
        <StatCard icon={<ShieldCheck className="h-[18px] w-[18px]" />} iconBg="#EFF6FF" iconColor="#3B82F6" label="Front Desk & Admin" value={frontDeskAdminCount} sub="support & ops" />
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#E8E4DF] bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className={cn("border-b border-[#E8E4DF] bg-[#FAFAF9] py-2.5", TABLE_GRID)}>
              <HeaderCell>Staff</HeaderCell>
              <HeaderCell>Role</HeaderCell>
              <HeaderCell>Assigned Services</HeaderCell>
              <HeaderCell>Status</HeaderCell>
              <HeaderCell align="right">Action</HeaderCell>
            </div>

            <div className="divide-y divide-[#F5F2EF]">
              {members.map((member) => (
                <div key={member.id} className={cn("py-3.5", TABLE_GRID)}>
                  <div className="flex min-w-0 items-center gap-3 pr-2">
                    <Avatar name={member.name} size="sm" />
                    <div className="min-w-0">
                      <div className="truncate font-body text-sm font-semibold text-[#1C1C1A]">{member.name}</div>
                      <div className="truncate font-body text-xs text-[#6B7280]">{member.email}</div>
                    </div>
                  </div>
                  <span className="min-w-0"><RoleBadge role={member.role} /></span>
                  <span className="min-w-0 truncate font-body text-sm text-[#1C1C1A]">{member.services}</span>
                  <span className="min-w-0"><StatusBadge status={member.status} /></span>
                  <div className="flex justify-end">
                    <ActionMenu
                      items={[
                        { label: "Edit Role", icon: <ShieldCheck className="h-4 w-4" />, onClick: () => openEdit(member) },
                        { label: "Resend Invite", icon: <Send className="h-4 w-4" />, onClick: () => {} },
                        {
                          label: "Revoke Access",
                          icon: <UserX className="h-4 w-4" />,
                          danger: true,
                          onClick: () => setMembers((prev) => prev.filter((m) => m.id !== member.id)),
                        },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InviteTeamMemberModal open={inviteOpen} onClose={() => setInviteOpen(false)} onSubmit={handleSubmit} editingMember={editingMember} />
    </div>
  );
}