import { useState } from "react";
import { CheckCircle2, CalendarPlus, UserRound } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { Avatar } from "@/components/ui/Avatar";
import type { Client, MembershipTier } from "@/features/clients/types";
import type { CreateClientInput } from "@/features/clients/useClients";

export interface AddClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateClientInput) => Client;
  onViewProfile: (client: Client) => void;
  onScheduleAppointment: (client: Client) => void;
}

const MEMBERSHIP_OPTIONS: { value: MembershipTier; label: string }[] = [
  { value: "Standard", label: "Standard" },
  { value: "Gold", label: "Gold" },
  { value: "Platinum", label: "Platinum" },
];

/**
 * Creates a client record only — never an appointment. If the new
 * client also needs one, the success state offers "Schedule
 * Appointment" as an explicit, separate next step, not something
 * that happens automatically.
 */
export function AddClientModal({ open, onClose, onCreate, onViewProfile, onScheduleAppointment }: AddClientModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [membership, setMembership] = useState<MembershipTier>("Standard");
  const [createdClient, setCreatedClient] = useState<Client | null>(null);

  function resetAndClose() {
    setName("");
    setPhone("");
    setEmail("");
    setMembership("Standard");
    setCreatedClient(null);
    onClose();
  }

  function handleCreate() {
    if (!name.trim() || !phone.trim()) return;
    const client = onCreate({ name: name.trim(), phone: phone.trim(), email: email.trim(), membership });
    setCreatedClient(client);
  }

  return (
    <Modal
      open={open}
      onClose={resetAndClose}
      title={createdClient ? "Client Added" : "Add Client"}
      size="sm"
      footer={
        createdClient ? undefined : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={resetAndClose}>Cancel</Button>
            <Button variant="primary" size="sm" disabled={!name.trim() || !phone.trim()} onClick={handleCreate}>Add Client</Button>
          </div>
        )
      }
    >
      {createdClient ? (
        <div className="flex flex-col items-center py-4 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F4F0]">
            <CheckCircle2 className="h-6 w-6 text-[#1A6B52]" aria-hidden="true" />
          </div>
          <div className="mb-1 flex items-center gap-2">
            <Avatar name={createdClient.name} size="sm" />
            <p className="font-heading text-sm font-bold text-[#1C1C1A]">{createdClient.name}</p>
          </div>
          <p className="mb-6 font-body text-xs text-[#6B7280]">
            Client record created. They now appear in the Clients list.
          </p>
          <div className="flex w-full gap-2">
            <Button
              variant="secondary"
              size="md"
              className="flex-1"
              leftIcon={<CalendarPlus className="h-4 w-4" />}
              onClick={() => onScheduleAppointment(createdClient)}
            >
              Schedule Appointment
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              leftIcon={<UserRound className="h-4 w-4" />}
              onClick={() => onViewProfile(createdClient)}
            >
              View Profile
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Input label="Full Name" placeholder="Sophia Laurent" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Phone" placeholder="(310) 555-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Email" type="email" placeholder="client@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Dropdown<MembershipTier> label="Membership" value={membership} onChange={setMembership} options={MEMBERSHIP_OPTIONS} />
        </div>
      )}
    </Modal>
  );
}
