import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Client } from "@/features/clients/types";
import type { UpdateClientInput } from "@/features/clients/useClients";

export interface EditClientModalProps {
  client: Client | null;
  onClose: () => void;
  onSave: (input: UpdateClientInput) => void;
}

export function EditClientModal({ client, onClose, onSave }: EditClientModalProps) {
  const [draft, setDraft] = useState({ name: "", phone: "", email: "" });
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (client) {
      setDraft({ name: client.name, phone: client.phone, email: client.email });
      setShowSuccess(false);
    }
  }, [client]);

  if (!client) return null;

  function handleSave() {
    if (!client || !draft.name.trim() || !draft.phone.trim()) return;
    onSave({ clientId: client.id, name: draft.name.trim(), phone: draft.phone.trim(), email: draft.email.trim() });
    setShowSuccess(true);
    setTimeout(onClose, 900);
  }

  return (
    <Modal
      open={Boolean(client)}
      onClose={onClose}
      title="Edit Client"
      size="sm"
      footer={
        showSuccess ? undefined : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="primary" size="sm" disabled={!draft.name.trim() || !draft.phone.trim()} onClick={handleSave}>Save Changes</Button>
          </div>
        )
      }
    >
      {showSuccess ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F4F0]">
            <CheckCircle2 className="h-6 w-6 text-[#1A6B52]" aria-hidden="true" />
          </div>
          <p className="font-heading text-sm font-bold text-[#1C1C1A]">Client Updated</p>
          <p className="mt-1 font-body text-xs text-[#6B7280]">Changes saved successfully.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input label="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Input label="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          <Input label="Email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        </div>
      )}
    </Modal>
  );
}
