import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/app/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
}

/**
  * Guards routes against unauthenticated access.
  * If the user is not signed in, redirects to /login while capturing
  * the current pathname so they can be redirected back after signing in.
  */
export function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
