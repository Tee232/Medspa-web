import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "@/app/AuthContext";
import { AppShell } from "@/app/AppShell";
import { RequireAuth } from "@/app/RequireAuth";
import { RequireRole } from "@/app/RequireRole";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { ForgotPasswordPage } from "@/pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "@/pages/auth/ResetPasswordPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { CustomerRequestsPage } from "@/pages/requests/CustomerRequestsPage";
import { AppointmentsPage } from "@/pages/appointments/AppointmentsPage";
import { AppointmentDetailPage } from "@/pages/appointments/AppointmentDetailPage";
import { ClientsPage } from "@/pages/clients/ClientsPage";
import { ClientProfilePage } from "@/pages/clients/ClientProfilePage";
import { RetentionLayout } from "@/pages/retention/RetentionLayout";
import { AtRiskClientsPage } from "@/pages/retention/at-risk/AtRiskClientsPage";
import { CampaignsPage } from "@/pages/retention/campaigns/CampaignsPage";
import { PerformancePage } from "@/pages/retention/performance/PerformancePage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="customer-requests" element={<CustomerRequestsPage />} />

        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="appointments/:appointmentId" element={<AppointmentDetailPage />} />

        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:clientId" element={<ClientProfilePage />} />

        <Route
          path="retention"
          element={
            <RequireRole allow={["manager"]}>
              <RetentionLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="at-risk" replace />} />
          <Route path="at-risk" element={<AtRiskClientsPage />} />
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="performance" element={<PerformancePage />} />
        </Route>

        <Route path="settings" element={<SettingsPage />} />
        {/* Profile lives inside Settings (its default tab) — redirect rather than 404 for old links. */}
        <Route path="profile" element={<Navigate to="/settings" replace />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
