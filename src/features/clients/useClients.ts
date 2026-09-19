import { useMemo, useState } from "react";
import type { Client, MembershipTier } from "@/features/clients/types";
import { mockClients } from "@/features/clients/mockData";

export interface UpdateClientInput {
  clientId: string;
  name: string;
  phone: string;
  email: string;
}

export interface CreateClientInput {
  name: string;
  phone: string;
  email: string;
  membership?: MembershipTier;
}

/**
 * Owns the client list as real React state, mirroring
 * useAppointments. `create` deliberately does not touch appointment
 * state — Add Client creates a client record only, never an
 * appointment (see AddClientModal / ClientsPage for the explicit
 * "Schedule Appointment" follow-up action that's separate on purpose).
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>(mockClients);

  function getById(id: string): Client | undefined {
    return clients.find((c) => c.id === id);
  }

  function update({ clientId, name, phone, email }: UpdateClientInput) {
    setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, name, phone, email } : c)));
  }

  function deactivate(clientId: string) {
    setClients((prev) => prev.map((c) => (c.id === clientId ? { ...c, status: "inactive" as const } : c)));
  }

  function create(input: CreateClientInput): Client {
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: input.name,
      phone: input.phone,
      email: input.email,
      membership: input.membership ?? "Standard",
      status: "new",
      visitCount: 0,
      lastVisitLabel: "No visits yet",
      memberSinceLabel: new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" }),
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  }

  const stats = useMemo(() => {
    const active = clients.filter((c) => c.status === "active").length;
    const atRisk = clients.filter((c) => c.status === "at_risk").length;
    return { total: clients.length, active, atRisk };
  }, [clients]);

  return { clients, stats, getById, update, deactivate, create };
}
