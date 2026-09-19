import { createContext, useContext, type ReactNode } from "react";
import { useClients } from "@/features/clients/useClients";

type ClientsContextValue = ReturnType<typeof useClients>;

const ClientsContext = createContext<ClientsContextValue | null>(null);

export function ClientsProvider({ children }: { children: ReactNode }) {
  const value = useClients();
  return <ClientsContext.Provider value={value}>{children}</ClientsContext.Provider>;
}

export function useClientsContext() {
  const ctx = useContext(ClientsContext);
  if (!ctx) throw new Error("useClientsContext must be used within ClientsProvider");
  return ctx;
}
