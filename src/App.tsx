import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/app/AuthContext";
import { AppointmentsProvider } from "@/features/appointments/AppointmentsContext";
import { ClientsProvider } from "@/features/clients/ClientsContext";
import { NotificationsProvider } from "@/features/notifications/NotificationsContext";
import { RequestsProvider } from "@/features/requests/RequestsContext";
import { CampaignsProvider } from "@/features/campaigns/CampaignsContext";
import { AppRoutes } from "@/app/routes";

export default function App() {
  return (
    <AuthProvider>
      <AppointmentsProvider>
        <ClientsProvider>
          <NotificationsProvider>
            <RequestsProvider>
              <CampaignsProvider>
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </CampaignsProvider>
            </RequestsProvider>
          </NotificationsProvider>
        </ClientsProvider>
      </AppointmentsProvider>
    </AuthProvider>
  );
}
