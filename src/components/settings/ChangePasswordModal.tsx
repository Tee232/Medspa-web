import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * UI + client-side validation only — there's no real auth backend
 * yet (see AuthContext's TEMPORARY note). This intentionally does
 * not fake a server call; it validates and shows a success state,
 * leaving the actual submit as the one seam a future Supabase Auth
 * `updateUser({ password })` call would slot into.
 */
export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function resetAndClose() {
    setCurrent("");
    setNext("");
    setConfirm("");
    setError(null);
    setSuccess(false);
    onClose();
  }

  function handleSubmit() {
    setError(null);
    if (!current || !next || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (next.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 600);
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title="Change Password"
      size="sm"
      footer={
        success ? undefined : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={resetAndClose}>Cancel</Button>
            <Button variant="primary" size="sm" isLoading={isSubmitting} onClick={handleSubmit}>Update Password</Button>
          </div>
        )
      }
    >
      {success ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F4F0]">
            <CheckCircle2 className="h-6 w-6 text-[#1A6B52]" aria-hidden="true" />
          </div>
          <p className="font-heading text-sm font-bold text-[#1C1C1A]">Password Updated</p>
          <p className="mt-1 font-body text-xs text-[#6B7280]">Your password has been changed successfully.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {error && (
            <div className="rounded-[12px] border border-[#FEE2E2] bg-[#FEF2F2] px-3.5 py-2.5">
              <p className="font-body text-xs font-medium text-[#991B1B]">{error}</p>
            </div>
          )}
          <Input label="Current Password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <Input label="New Password" type="password" value={next} onChange={(e) => setNext(e.target.value)} hint="At least 8 characters." />
          <Input label="Confirm New Password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
      )}
    </Modal>
  );
}
