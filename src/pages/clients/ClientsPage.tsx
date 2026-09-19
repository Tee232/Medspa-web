import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  AlertTriangle,
  Filter,
  Download,
  Plus,
  Eye,
  Pencil,
  Ban,
  Bot,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { StatCard } from "@/components/ui/Card";
import { Table, type TableColumn } from "@/components/ui/Table";
import { Avatar } from "@/components/ui/Avatar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { SearchBar } from "@/components/ui/SearchBar";
import { Button } from "@/components/ui/Button";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Pagination } from "@/components/ui/Pagination";
import { AIPanel } from "@/components/shared/AIPanel";
import { AIPanelExpanded } from "@/components/shared/AIPanelExpanded";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { EditClientModal, DeactivateClientModal, AddClientModal } from "@/components/clients";
import { NewAppointmentWizard, AppointmentSuccessModal } from "@/components/appointments";
import { useAuth } from "@/app/AuthContext";
import { useClientsContext } from "@/features/clients/ClientsContext";
import { useAppointmentsContext } from "@/features/appointments/AppointmentsContext";
import { useAIAssistant } from "@/features/ai/useAIAssistant";
import type { Client, MembershipTier } from "@/features/clients/types";

type TabFilter = "all" | "active" | "at_risk" | "new" | "vip";
const PAGE_SIZE = 8;

const MEMBERSHIP_COLOR: Record<MembershipTier, string> = {
  Platinum: "#92720C",
  Gold: "#B08D57",
  Standard: "#6B7280",
};

export function ClientsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user.name.split(" ")[0];
  const { clients, stats, update, deactivate, create } = useClientsContext();
  const { appointments, create: createAppointment, getById: getAppointmentById } = useAppointmentsContext();

  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deactivatingClient, setDeactivatingClient] = useState<Client | null>(null);
  const [addClientOpen, setAddClientOpen] = useState(false);
  const [expandedInsightsOpen, setExpandedInsightsOpen] = useState(false);

  const [schedulingForClient, setSchedulingForClient] = useState<Client | null>(null);
  const [confirmedAppointmentId, setConfirmedAppointmentId] = useState<string | null>(null);

  const { messages, isThinking, ask } = useAIAssistant({ module: "clients", clients });

  const filtered = useMemo(() => {
    let list = clients;
    if (activeTab === "vip") list = list.filter((c) => c.membership === "Platinum");
    else if (activeTab !== "all") list = list.filter((c) => c.status === activeTab);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q));
    return list;
  }, [clients, activeTab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageClients = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleTabChange(tab: TabFilter) {
    setActiveTab(tab);
    setPage(1);
  }

  const columns: TableColumn<Client>[] = [
    {
      key: "client",
      header: "Client",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <div className="truncate font-body text-sm font-medium text-[#1C1C1A]">{row.name}</div>
            <div className="font-body text-xs text-[#6B7280]">{row.visitCount} visits</div>
          </div>
        </div>
      ),
    },
    { key: "phone", header: "Phone", width: "140px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.phone}</span> },
    { key: "email", header: "Email", render: (row) => <span className="truncate font-body text-sm text-[#6B7280]">{row.email}</span> },
    { key: "lastVisit", header: "Last Visit", width: "110px", render: (row) => <span className="font-body text-sm text-[#6B7280]">{row.lastVisitLabel}</span> },
    {
      key: "membership",
      header: "Membership",
      width: "100px",
      render: (row) => <span className="font-body text-sm font-medium" style={{ color: MEMBERSHIP_COLOR[row.membership] }}>{row.membership}</span>,
    },
    { key: "status", header: "Status", width: "100px", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      width: "56px",
      render: (row) => (
        <ActionMenu
          items={[
            { label: "View Client", icon: <Eye className="h-4 w-4" />, onClick: () => navigate(`/clients/${row.id}`) },
            { label: "Edit Client", icon: <Pencil className="h-4 w-4" />, onClick: () => setEditingClient(row) },
            { label: "Deactivate Client", icon: <Ban className="h-4 w-4" />, danger: true, onClick: () => setDeactivatingClient(row) },
          ]}
        />
      ),
    },
  ];

  const confirmedAppointment = confirmedAppointmentId ? getAppointmentById(confirmedAppointmentId) ?? null : null;

  return (
    <div className="flex h-full flex-col xl:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-5 sm:p-6 lg:p-8 xl:pr-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-[#1C1C1A]">Clients</h1>
              <p className="mt-1 font-body text-sm text-[#6B7280]">View and manage all clients.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" leftIcon={<Filter className="h-4 w-4" />}>Filter</Button>
              <Button variant="secondary" leftIcon={<Download className="h-4 w-4" />}>Export</Button>
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setAddClientOpen(true)}>Add Client</Button>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard icon={<Users className="h-[18px] w-[18px]" />} iconBg="#E8F4F0" iconColor="#1A6B52" label="Clients" value={stats.total} />
            <StatCard icon={<UserCheck className="h-[18px] w-[18px]" />} iconBg="#EFF6FF" iconColor="#3B82F6" label="Active Clients" value={stats.active} />
            <StatCard icon={<AlertTriangle className="h-[18px] w-[18px]" />} iconBg="#FEF9EC" iconColor="#C9A96E" label="At-Risk Clients" value={stats.atRisk} />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <SegmentedTabs<TabFilter>
              value={activeTab}
              onChange={handleTabChange}
              options={[
                { value: "all", label: "All" },
                { value: "active", label: "Active" },
                { value: "at_risk", label: "At-Risk" },
                { value: "vip", label: "VIP" },
                { value: "new", label: "New" },
              ]}
            />
            <SearchBar placeholder="Search clients..." value={query} onChange={(v) => { setQuery(v); setPage(1); }} className="max-w-xs flex-1" aria-label="Search clients" />
          </div>

          <div className="overflow-x-auto">
            <Table
              className="min-w-[820px]"
              columns={columns}
              data={pageClients}
              getRowId={(row) => row.id}
              onRowClick={(row) => navigate(`/clients/${row.id}`)}
              emptyState={<p className="text-center font-body text-sm text-[#6B7280]">No clients match this filter.</p>}
            />
          </div>

          <div className="mt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      </div>

      <div className="hidden xl:block">
        <AIPanel contextLabel="Client insights" userFirstName={firstName} messages={messages} onAsk={ask} isAsking={isThinking} onExpand={() => setExpandedInsightsOpen(true)} onViewAllInsights={() => setExpandedInsightsOpen(true)}>
          <AIInsightCard
            variant="gold"
            icon={<TrendingDown />}
            title="Re-engagement Needed"
            description={`${stats.atRisk} clients haven't visited in 30+ days. A personalized message could recover them.`}
            ctaLabel="View At-Risk Clients"
            onCtaClick={() => handleTabChange("at_risk")}
          />
        </AIPanel>
      </div>

      <button type="button" onClick={() => setExpandedInsightsOpen(true)} aria-label="Open AI Assistant" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A6B52] text-white shadow-xl transition-transform hover:scale-105 xl:hidden">
        <Bot className="h-6 w-6" aria-hidden="true" />
      </button>

      <AIPanelExpanded open={expandedInsightsOpen} onClose={() => setExpandedInsightsOpen(false)} title="Ask Aura AI Assistant" timestampLabel="Client Insights" messages={messages} onAsk={ask} isAsking={isThinking}>
        <AIInsightCard variant="gold" icon={<TrendingDown />} title="Re-engagement Needed" description={`${stats.atRisk} clients haven't visited in 30+ days. A personalized message could recover them.`} ctaLabel="View At-Risk Clients" onCtaClick={() => { setExpandedInsightsOpen(false); handleTabChange("at_risk"); }} />
        <AIInsightCard variant="purple" icon={<Sparkles />} title="VIP clients trending up" description="Platinum-tier clients have increased their average visit frequency this month." ctaLabel="View VIP Clients" onCtaClick={() => { setExpandedInsightsOpen(false); handleTabChange("vip"); }} />
      </AIPanelExpanded>

      <EditClientModal client={editingClient} onClose={() => setEditingClient(null)} onSave={update} />
      <DeactivateClientModal client={deactivatingClient} onClose={() => setDeactivatingClient(null)} onConfirm={(client) => { deactivate(client.id); setDeactivatingClient(null); }} />

      {/* Add Client creates a client record only — it never books an
          appointment on its own. "Schedule Appointment" from the
          success state is an explicit, separate next step. */}
      <AddClientModal
        open={addClientOpen}
        onClose={() => setAddClientOpen(false)}
        onCreate={create}
        onViewProfile={(client) => { setAddClientOpen(false); navigate(`/clients/${client.id}`); }}
        onScheduleAppointment={(client) => {
          setAddClientOpen(false);
          setSchedulingForClient(client);
        }}
      />

      <NewAppointmentWizard
        open={Boolean(schedulingForClient)}
        onClose={() => setSchedulingForClient(null)}
        existingAppointments={appointments}
        onCreate={createAppointment}
        preselectedClient={
          schedulingForClient
            ? { id: schedulingForClient.id, name: schedulingForClient.name, phone: schedulingForClient.phone, email: schedulingForClient.email }
            : undefined
        }
        onBooked={(booked) => {
          setSchedulingForClient(null);
          setConfirmedAppointmentId(booked.id);
        }}
      />

      <AppointmentSuccessModal appointment={confirmedAppointment} onClose={() => setConfirmedAppointmentId(null)} />
    </div>
  );
}
