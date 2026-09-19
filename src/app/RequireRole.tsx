import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/app/AuthContext";
import type { UserRole } from "@/components/shared/Sidebar";

interface RequireRoleProps {
  allow: UserRole[];
  children: ReactNode;
}

/**
 * Gates a route to specific roles (e.g. Retention is manager-only
 * per the approved user flow). Redirects rather than rendering a
 * blocked state — a front desk user hitting /retention should land
 * back on their dashboard, not see a permissions error.
 */
export function RequireRole({ allow, children }: RequireRoleProps) {
  const { user } = useAuth();

  if (!user || !allow.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
