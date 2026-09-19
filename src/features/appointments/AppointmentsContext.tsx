import { createContext, useContext, type ReactNode } from "react";
import { useAppointments } from "@/features/appointments/useAppointments";

type AppointmentsContextValue = ReturnType<typeof useAppointments>;

const AppointmentsContext = createContext<AppointmentsContextValue | null>(null);

/** Mounted once, high up the tree (see App.tsx), so every route shares one live appointment list. */
export function AppointmentsProvider({ children }: { children: ReactNode }) {
  const value = useAppointments();
  return <AppointmentsContext.Provider value={value}>{children}</AppointmentsContext.Provider>;
}

export function useAppointmentsContext() {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error("useAppointmentsContext must be used within AppointmentsProvider");
  return ctx;
}
