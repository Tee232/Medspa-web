import { createContext, useContext, type ReactNode } from "react";
import { useRequests } from "./useRequests";

type RequestsContextValue = ReturnType<typeof useRequests>;

const RequestsContext = createContext<RequestsContextValue | null>(null);

export function RequestsProvider({ children }: { children: ReactNode }) {
  const value = useRequests();
  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}

export function useRequestsContext() {
  const ctx = useContext(RequestsContext);
  if (!ctx) throw new Error("useRequestsContext must be used within RequestsProvider");
  return ctx;
}
