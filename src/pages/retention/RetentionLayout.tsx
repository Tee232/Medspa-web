import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/retention/at-risk", label: "At-Risk Clients" },
  { to: "/retention/campaigns", label: "Campaigns" },
  { to: "/retention/performance", label: "Performance & Analytics" },
];

export function RetentionLayout() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="mb-1 font-heading text-xl font-bold text-[#1C1C1A]">Retention</h1>
      <p className="mb-5 font-body text-sm text-[#6B7280]">At-risk clients, campaigns, and revenue performance.</p>
      <nav className="mb-6 flex gap-1 border-b border-[#E8E4DF]">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "border-b-2 px-4 py-2.5 font-body text-sm transition-colors",
                isActive ? "border-[#1A6B52] font-semibold text-[#1A6B52]" : "border-transparent text-[#6B7280] hover:text-[#1C1C1A]"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
