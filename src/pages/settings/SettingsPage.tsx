import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Camera,
  Lock,
  ShieldCheck,
  CalendarClock,
  AlertTriangle,
  Sparkles,
  Users,
  CheckCircle2,
  Bot,
  Settings as SettingsIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Switch } from "@/components/ui/Switch";
import { AIPanel } from "@/components/shared/AIPanel";
import { AIPanelExpanded } from "@/components/shared/AIPanelExpanded";
import { AIInsightCard } from "@/components/shared/AIInsightCard";
import { ChangePasswordModal } from "@/components/settings/ChangePasswordModal";
import { cn } from "@/lib/utils";
import { useAuth, type NotificationPreferences } from "@/app/AuthContext";
import { useAIAssistant } from "@/features/ai/useAIAssistant";
import type { UserRole } from "@/components/shared/Sidebar";
import { TeamTab } from "@/pages/settings/TeamTab";

interface SettingsTab {
  key: string;
  label: string;
  role?: UserRole;
}

const TABS: SettingsTab[] = [
  { key: "profile", label: "Profile" },
  { key: "clinic", label: "Clinic", role: "manager" },
  { key: "notifications", label: "Notifications" },
  { key: "integrations", label: "Integrations", role: "manager" },
  { key: "team", label: "Team & Access", role: "manager" },
];

/**
 * Settings shell with role-filtered tabs. Front Desk only ever sees
 * Profile + Notifications — manager-only tabs are filtered out of
 * the list entirely, not just disabled.
 */
export function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [expandedInsightsOpen, setExpandedInsightsOpen] = useState(false);

  const visibleTabs = TABS.filter((t) => !t.role || t.role === user.role);
  const firstName = user.name.split(" ")[0];

  const { messages, isThinking, ask } = useAIAssistant({ module: "settings" });

  return (
    <div className="flex h-full flex-col xl:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="p-5 sm:p-6 lg:p-8 xl:pr-6">
          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-[#1C1C1A]">Settings</h1>
            <p className="mt-1 font-body text-sm text-[#6B7280]">Manage your account, clinic, and platform preferences.</p>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row">
            <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto sm:w-[180px] sm:flex-col sm:overflow-visible">
              {visibleTabs.map((tab) => {
                const isActive = tab.key === activeTab;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-[12px] px-3.5 py-2.5 text-left font-body text-sm transition-colors",
                      isActive ? "bg-[#E8F4F0] font-semibold text-[#1A6B52]" : "text-[#6B7280] hover:bg-[#F3F0EB] hover:text-[#1C1C1A]"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            <div className="min-w-0 flex-1">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "notifications" && <NotificationsTab />}
              {activeTab === "team" && <TeamTab />}
              {(activeTab === "clinic" || activeTab === "integrations") && (
                <Card className="p-10 text-center">
                  <SettingsIcon className="mx-auto mb-3 h-8 w-8 text-[#9CA3AF]" aria-hidden="true" />
                  <p className="font-heading text-sm font-bold text-[#1C1C1A]">Manager Settings coming soon</p>
                  <p className="mt-1 font-body text-xs text-[#6B7280]">This section is reserved for the upcoming Manager Settings module.</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden xl:block">
        <AIPanel contextLabel="Setup tips" userFirstName={firstName} messages={messages} onAsk={ask} isAsking={isThinking} onExpand={() => setExpandedInsightsOpen(true)} onViewAllInsights={() => setExpandedInsightsOpen(true)}>
          <AIInsightCard variant="green" icon={<ShieldCheck />} title="Secure Your Account" description="Two-factor authentication adds an extra layer of protection to your account." ctaLabel="Review Security" onCtaClick={() => setActiveTab("profile")} />
        </AIPanel>
      </div>

      <button type="button" onClick={() => setExpandedInsightsOpen(true)} aria-label="Open AI Assistant" className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#1A6B52] text-white shadow-xl transition-transform hover:scale-105 xl:hidden">
        <Bot className="h-6 w-6" aria-hidden="true" />
      </button>

      <AIPanelExpanded open={expandedInsightsOpen} onClose={() => setExpandedInsightsOpen(false)} title="Ask Aura AI Assistant" timestampLabel="Setup tips" messages={messages} onAsk={ask} isAsking={isThinking}>
        <AIInsightCard variant="green" icon={<ShieldCheck />} title="Secure Your Account" description="Two-factor authentication adds an extra layer of protection to your account." ctaLabel="Review Security" onCtaClick={() => { setExpandedInsightsOpen(false); setActiveTab("profile"); }} />
        <AIInsightCard variant="purple" icon={<Sparkles />} title="Stay on top of updates" description="Enable AI insight notifications to catch scheduling opportunities as they happen." ctaLabel="Manage Notifications" onCtaClick={() => { setExpandedInsightsOpen(false); setActiveTab("notifications"); }} />
      </AIPanelExpanded>
    </div>
  );
}

function ProfileTab() {
  const { user, updateProfile, updateAvatar } = useAuth();
  const [draft, setDraft] = useState({ name: user.name, email: user.email, phone: user.phone });
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSave() {
    if (!draft.name.trim()) return;
    updateProfile({ name: draft.name.trim(), email: draft.email.trim(), phone: draft.phone.trim() });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  }

  function handlePhotoSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSavePhoto() {
    if (!photoPreview) return;
    // Frontend-only persistence for the MVP — stored on AuthContext,
    // which is what Navbar/Sidebar already read `avatarUrl` from, so
    // the change appears everywhere immediately.
    updateAvatar(photoPreview);
    setPhotoPreview(null);
  }

  const displayedAvatarUrl = photoPreview ?? user.avatarUrl;

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Avatar name={user.name} imageUrl={displayedAvatarUrl} size="lg" />
            <div>
              <div className="font-heading text-base font-bold text-[#1C1C1A]">{user.name}</div>
              <div className="font-body text-xs text-[#6B7280]">
                {user.role === "manager" ? "Operations Manager" : "Front Desk Staff"} · Lumière MedSpa
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {photoPreview && (
              <>
                <Button variant="secondary" size="sm" onClick={() => setPhotoPreview(null)}>Cancel</Button>
                <Button variant="primary" size="sm" onClick={handleSavePhoto}>Save Photo</Button>
              </>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoSelected} className="hidden" />
            <Button variant="secondary" size="sm" leftIcon={<Camera className="h-4 w-4" />} onClick={() => fileInputRef.current?.click()}>
              Change Photo
            </Button>
          </div>
        </div>

        {showSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-[12px] bg-[#E8F4F0] px-3.5 py-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-[#1A6B52]" aria-hidden="true" />
            <span className="font-body text-xs font-medium text-[#1A6B52]">Profile updated successfully.</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <Input label="Role" value={user.role === "manager" ? "Operations Manager" : "Front Desk Staff"} disabled />
          <Input label="Email" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
          <Input label="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="primary" size="md" disabled={!draft.name.trim()} onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>

      <Card className="p-5 sm:p-6">
        <h3 className="mb-4 font-heading text-sm font-bold text-[#1C1C1A]">Security</h3>
        <div className="flex flex-col gap-3">
          <SecurityRow icon={<Lock className="h-4 w-4" />} label="Change Password" sub="Last changed 30 days ago" onUpdate={() => setPasswordModalOpen(true)} />
          <SecurityRow icon={<ShieldCheck className="h-4 w-4" />} label="Two-Factor Auth" sub="Enabled via SMS" />
        </div>
      </Card>

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
}

function SecurityRow({ icon, label, sub, onUpdate }: { icon: ReactNode; label: string; sub: string; onUpdate?: () => void }) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-[#E8E4DF] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F4F0] text-[#1A6B52]">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="font-body text-sm font-medium text-[#1C1C1A]">{label}</div>
        <div className="font-body text-xs text-[#6B7280]">{sub}</div>
      </div>
      <Button variant="secondary" size="sm" onClick={onUpdate}>Update</Button>
    </div>
  );
}

function NotificationsTab() {
  const { user, updateNotificationPreferences } = useAuth();
  const prefs = user.notificationPreferences;

  function toggle(key: keyof NotificationPreferences) {
    updateNotificationPreferences({ ...prefs, [key]: !prefs[key] });
  }

  return (
    <Card className="p-5 sm:p-6">
      <h3 className="mb-1 font-heading text-sm font-bold text-[#1C1C1A]">Notification Preferences</h3>
      <p className="mb-5 font-body text-xs text-[#6B7280]">Choose which updates you want to receive.</p>
      <div className="flex flex-col gap-4">
        <NotificationRow icon={<CalendarClock className="h-4 w-4" />} label="Appointment Updates" description="Confirmations, reschedules, and cancellations." checked={prefs.appointmentUpdates} onToggle={() => toggle("appointmentUpdates")} />
        <NotificationRow icon={<AlertTriangle className="h-4 w-4" />} label="Scheduling Alerts" description="Conflicts, no-show risk, and capacity warnings." checked={prefs.schedulingAlerts} onToggle={() => toggle("schedulingAlerts")} />
        <NotificationRow icon={<Sparkles className="h-4 w-4" />} label="AI Insights" description="Scheduling recommendations and open-slot alerts." checked={prefs.aiInsights} onToggle={() => toggle("aiInsights")} />
        <NotificationRow icon={<Users className="h-4 w-4" />} label="Client Activity" description="At-risk flags and client status changes." checked={prefs.clientActivity} onToggle={() => toggle("clientActivity")} />
      </div>
    </Card>
  );
}

function NotificationRow({ icon, label, description, checked, onToggle }: { icon: ReactNode; label: string; description: string; checked: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-3.5 rounded-[12px] border border-[#E8E4DF] p-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F3F0EB] text-[#6B7280]">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="font-body text-sm font-medium text-[#1C1C1A]">{label}</div>
        <div className="font-body text-xs text-[#6B7280]">{description}</div>
      </div>
      <Switch checked={checked} onChange={onToggle} ariaLabel={label} />
    </div>
  );
}
