import { useParams } from "react-router-dom";
import { PagePlaceholder } from "@/pages/_shared/PagePlaceholder";
export function AppointmentDetailPage() {
  const { appointmentId } = useParams();
  return <PagePlaceholder title="Appointment Detail" description={`Detail and reschedule flow for appointment ${appointmentId} will render here.`} />;
}
