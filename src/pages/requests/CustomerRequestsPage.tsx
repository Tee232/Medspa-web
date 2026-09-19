import { useState, useMemo } from "react";
import {
  Inbox,
  Clock,
  MessageSquare,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SearchBar } from "@/components/ui/SearchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { Avatar } from "@/components/ui/Avatar";
import { useRequestsContext } from "@/features/requests/RequestsContext";
import { useAppointmentsContext } from "@/features/appointments/AppointmentsContext";
import { CustomerRequestDetailModal } from "@/components/requests/CustomerRequestDetailModal";
import { NewAppointmentWizard } from "@/components/appointments/NewAppointmentWizard";
import type { CustomerRequest } from "@/features/requests/types";
import type { Client } from "@/features/clients/types";
import type { AppointmentClient } from "@/features/appointments/types";

type TabFilter = "all" | "consultation" | "inquiry" | "pending" | "responded" | "converted";

export function CustomerRequestsPage() {
  const { requests, stats } = useRequestsContext();
  const { appointments, create: createAppointment } = useAppointmentsContext();

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<CustomerRequest | null>(null);

  // Appointment wizard state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [preselectedClientForWizard, setPreselectedClientForWizard] = useState<AppointmentClient | undefined>(undefined);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      // Tab filter
      if (activeTab === "consultation" && r.requestType !== "consultation") return false;
      if (activeTab === "inquiry" && r.requestType !== "general_inquiry") return false;
      if (activeTab === "pending" && r.status !== "pending") return false;
      if (activeTab === "responded" && r.status !== "responded") return false;
      if (activeTab === "converted" && r.status !== "converted") return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = r.name.toLowerCase().includes(q);
        const matchEmail = r.email.toLowerCase().includes(q);
        const matchPhone = r.phone.includes(q);
        const matchTreatment = r.requestedTreatment?.toLowerCase().includes(q) || false;
        const matchMessage = r.message.toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone || matchTreatment || matchMessage;
      }

      return true;
    });
  }, [requests, activeTab, searchQuery]);

  const handleBookAppointmentFromDetail = (client: Client) => {
    // Map client to AppointmentClient for NewAppointmentWizard
    const apptClient: AppointmentClient = {
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
    };

    setPreselectedClientForWizard(apptClient);
    setIsWizardOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Title & Actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-[#1C1C1A]">
              Customer Requests
            </h1>
            <span className="rounded-full bg-[#1A6B52]/10 px-2.5 py-0.5 font-heading text-xs font-bold text-[#1A6B52]">
              {stats.pending} New Pending
            </span>
          </div>
          <p className="mt-1 font-body text-sm text-[#6B7280]">
            Review incoming website inquiries & consultation requests, reply to prospects, and convert leads into clients.
          </p>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-medium text-[#6B7280]">Total Requests</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#F3F0EB] text-[#6B7280]">
              <Inbox className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-[#1C1C1A]">{stats.total}</div>
          <div className="mt-1 font-body text-[11px] text-[#9CA3AF]">Website submissions</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-medium text-amber-700">Pending Review</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-[#1C1C1A]">{stats.pending}</div>
          <div className="mt-1 font-body text-[11px] text-amber-600">Action required</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-medium text-blue-700">Responded</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-[#1C1C1A]">{stats.responded}</div>
          <div className="mt-1 font-body text-[11px] text-[#9CA3AF]">Awaiting booking</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-medium text-emerald-700">Converted</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 font-heading text-2xl font-bold text-[#1C1C1A]">{stats.converted}</div>
          <div className="mt-1 font-body text-[11px] text-emerald-600">Converted to clients</div>
        </Card>
      </div>

      {/* Filter Tabs & Search Bar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SegmentedTabs
            options={[
              { value: "all", label: "All", count: stats.total },
              { value: "consultation", label: "Consultations", count: stats.consultations },
              { value: "inquiry", label: "Inquiries", count: stats.inquiries },
              { value: "pending", label: "Pending", count: stats.pending },
              { value: "responded", label: "Responded", count: stats.responded },
              { value: "converted", label: "Converted", count: stats.converted },
            ]}
            value={activeTab}
            onChange={(val) => setActiveTab(val as TabFilter)}
          />

          <SearchBar
            placeholder="Search by name, email, treatment, or message..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full lg:w-80"
          />
        </div>
      </Card>

      {/* Customer Requests Table */}
      <Card className="overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3F0EB] text-[#6B7280]">
              <Inbox className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-[#1C1C1A]">No Requests Found</h3>
            <p className="mt-1 max-w-sm font-body text-xs text-[#6B7280]">
              {searchQuery
                ? `No request matches "${searchQuery}". Try adjusting your search query.`
                : "No customer requests currently match this tab filter."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left font-body text-sm">
              <thead>
                <tr className="border-b border-[#E8E4DF] bg-[#FDFCFB] text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
                  <th className="py-3.5 pl-6 pr-4">Requester</th>
                  <th className="px-4 py-3.5">Type</th>
                  <th className="px-4 py-3.5">Requested Treatment</th>
                  <th className="px-4 py-3.5">Submitted Date</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F2EF]">
                {filteredRequests.map((req) => {
                  const dateLabel = new Date(req.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  });

                  return (
                    <tr
                      key={req.id}
                      className="transition-colors hover:bg-[#F9F7F4]/80 cursor-pointer"
                      onClick={() => setSelectedRequest(req)}
                    >
                      <td className="py-4 pl-6 pr-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={req.name} size="md" />
                          <div>
                            <div className="font-heading font-bold text-[#1C1C1A]">{req.name}</div>
                            <div className="text-xs text-[#6B7280]">
                              {req.email} · {req.phone}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            req.requestType === "consultation"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {req.requestType === "consultation" ? "Consultation" : "Inquiry"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center rounded-full bg-[#F3F0EB] px-2.5 py-1 text-xs font-semibold text-[#1A6B52]">
                          {req.requestedTreatment || "General Consultation"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-[#6B7280]">{dateLabel}</td>

                      <td className="px-4 py-4">
                        <StatusBadge
                          status={
                            req.status === "pending"
                              ? "at_risk"
                              : req.status === "responded"
                              ? "new"
                              : "active"
                          }
                          label={
                            req.status === "pending"
                              ? "Pending Review"
                              : req.status === "responded"
                              ? "Responded"
                              : "Converted"
                          }
                        />
                      </td>

                      <td className="py-4 pl-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedRequest(req)}
                        >
                          View &amp; Process
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Customer Request Detail Modal */}
      <CustomerRequestDetailModal
        open={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        request={selectedRequest}
        onBookAppointment={handleBookAppointmentFromDetail}
      />

      {/* Existing Appointment Creation Wizard */}
      <NewAppointmentWizard
        open={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setPreselectedClientForWizard(undefined);
        }}
        existingAppointments={appointments}
        onCreate={createAppointment}
        onBooked={() => {
          setIsWizardOpen(false);
          setPreselectedClientForWizard(undefined);
        }}
        preselectedClient={preselectedClientForWizard}
      />
    </div>
  );
}
