import { useEffect, useState } from "react";
import { Check, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PERMISSIONS_LIST, ROLE_PERMISSIONS, TEAM_ROLE_OPTIONS, teamRoleLabel } from "@/features/team/mockData";
import type { TeamMember, TeamRole } from "@/features/team/types";
import { cn } from "@/lib/utils";

export interface InviteTeamMemberModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; role: TeamRole }) => void;
  editingMember?: TeamMember | null;
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function InviteTeamMemberModal({ open, onClose, onSubmit, editingMember }: InviteTeamMemberModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<TeamRole>("provider");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const isEdit = Boolean(editingMember);

  useEffect(() => {
    if (!open) return;
    setName(editingMember?.name ?? "");
    setEmail(editingMember?.email ?? "");
    setRole(editingMember?.role ?? "provider");
    setError(null);
    setIsSubmitting(false);
    setSaved(false);
  }, [open, editingMember]);

  function resetAndClose() {
    setName("");
    setEmail("");
    setRole("provider");
    setError(null);
    setIsSubmitting(false);
    setSaved(false);
    onClose();
  }

  function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    setError(null);
    if (!trimmedName) {
      setError("Full name is required.");
      return;
    }
    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSaved(true);
      onSubmit({ name: trimmedName, email: trimmedEmail, role });
    }, 500);
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={isEdit ? "Edit Staff" : "Invite Team Member"}
      size="md"
      footer={
        saved ? undefined : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={resetAndClose}>Cancel</Button>
            <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSubmit}>
              {isEdit ? "Update" : "Send Invite"}
            </Button>
          </div>
        )
      }
    >
      {saved ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F4F0]">
            <CheckCircle2 className="h-6 w-6 text-[#1A6B52]" aria-hidden="true" />
          </div>
          <p className="font-heading text-sm font-bold text-[#1C1C1A]">{isEdit ? "Changes Saved" : "Invite Sent"}</p>
          <p className="mt-1 max-w-xs font-body text-xs text-[#6B7280]">
            {isEdit
              ? "Team member details have been updated successfully."
              : `An invitation was emailed to ${email}. They'll appear as “Pending Invite” until accepted.`}
          </p>
          <Button variant="primary" size="sm" className="mt-5" onClick={resetAndClose}>Done</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {error && (
            <div className="rounded-[12px] border border-[#FEE2E2] bg-[#FEF2F2] px-3.5 py-2.5">
              <p className="font-body text-xs font-medium text-[#991B1B]">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Full Name" placeholder="e.g. Jordan Smith" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email Address" type="email" placeholder="name@lumiere.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-body text-xs font-medium text-[#1C1C1A]">Role</span>
            <div className="flex flex-col gap-2">
              {TEAM_ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-[12px] border p-3.5 text-left transition-colors",
                    role === opt.value ? "border-[#1A6B52] bg-[#E8F4F0]/40" : "border-[#E5E7EB] bg-white hover:border-[#9CA3AF]"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block font-body text-sm font-medium text-[#1C1C1A]">{opt.label}</span>
                    <span className="mt-0.5 block font-body text-xs text-[#6B7280]">{opt.description}</span>
                  </span>
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
                      role === opt.value ? "border-[#1A6B52] bg-[#1A6B52] text-white" : "border-[#D1D5DB] text-transparent"
                    )}
                    aria-hidden="true"
                  >
                    <Check className="h-3 w-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[12px] border border-[#E8E4DF] bg-[#FAFAF9] p-4">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#1A6B52]" aria-hidden="true" />
              <span className="font-body text-xs font-semibold text-[#1C1C1A]">Available to {teamRoleLabel(role)}</span>
            </div>
            <ul className="flex flex-col gap-2">
              {PERMISSIONS_LIST.map((permission) => {
                const granted = ROLE_PERMISSIONS[role].includes(permission);
                return (
                  <li key={permission} className="flex items-center gap-2.5 font-body text-sm">
                    {granted ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />
                    ) : (
                      <X className="h-4 w-4 shrink-0 text-[#9CA3AF]" aria-hidden="true" />
                    )}
                    <span className={granted ? "text-[#1C1C1A]" : "text-[#9CA3AF]"}>{permission}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </Modal>
  );
}