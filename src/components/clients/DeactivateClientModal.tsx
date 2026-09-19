import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { Client } from "@/features/clients/types";

export interface DeactivateClientModalProps {
  client: Client | null;
  onClose: () => void;
  onConfirm: (client: Client) => void;
}

export function DeactivateClientModal({ client, onClose, onConfirm }: DeactivateClientModalProps) {
  if (!client) return null;
  return (
    <Modal
      open={Boolean(client)}
      onClose={onClose}
      title="Deactivate Client"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={() => onConfirm(client)}>Deactivate Client</Button>
        </div>
      }
    >
      <p className="mb-4 font-body text-sm font-medium text-[#1C1C1A]">Deactivate {client.name}?</p>
      <div className="flex items-start gap-2.5 rounded-[12px] border border-[#FEE2E2] bg-[#FEF2F2] px-3.5 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#DC2626]" aria-hidden="true" />
        <p className="font-body text-xs leading-relaxed text-[#991B1B]">
          Deactivated clients will remain in historical records but will no longer be treated as active clients.
        </p>
      </div>
    </Modal>
  );
}
