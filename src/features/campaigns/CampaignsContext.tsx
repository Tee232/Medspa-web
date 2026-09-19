import { createContext, useContext, type ReactNode } from "react";
import { useCampaigns } from "./useCampaigns";

type CampaignsContextValue = ReturnType<typeof useCampaigns>;

const CampaignsContext = createContext<CampaignsContextValue | null>(null);

export function CampaignsProvider({ children }: { children: ReactNode }) {
  const value = useCampaigns();
  return <CampaignsContext.Provider value={value}>{children}</CampaignsContext.Provider>;
}

export function useCampaignsContext() {
  const ctx = useContext(CampaignsContext);
  if (!ctx) throw new Error("useCampaignsContext must be used within CampaignsProvider");
  return ctx;
}