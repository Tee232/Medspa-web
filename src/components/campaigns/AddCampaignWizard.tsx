import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  CloudUpload,
  Mail,
  Megaphone,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  AUDIENCE_OPTIONS,
  CAMPAIGN_GOALS,
  CAMPAIGN_TYPES,
  CHANNELS,
  audienceLabel,
  goalLabel,
} from "@/features/campaigns/mockData";
import { generateCampaignMessage } from "@/features/campaigns/generateMessage";
import { useCampaignsContext } from "@/features/campaigns/CampaignsContext";
import type { CampaignChannel, CampaignDraft, CampaignGoal, CampaignType } from "@/features/campaigns/types";

export interface AddCampaignWizardProps {
  open: boolean;
  onClose: () => void;
  onViewCampaigns?: () => void;
  initialDraft?: Partial<CampaignDraft>;
}

const STEPS = ["Details", "Channel", "AI Message", "Review", "Confirm"];

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function formatLaunchDate(draft: CampaignDraft): string {
  if (!draft.sendDate) return "—";
  return new Date(`${draft.sendDate}T09:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <span className="font-body text-xs font-semibold uppercase tracking-wide text-[#1A6B52]">
        Step {step} of {STEPS.length}
      </span>
      <span className="font-body text-xs text-[#6B7280]">{STEPS[step - 1]}</span>
    </div>
  );
}

function StepProgress({ step }: { step: number }) {
  return (
    <div className="mb-5">
      <StepIndicator step={step} />
      <div className="flex items-center">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const isComplete = n < step;
          const isActive = n === step;
          return (
            <Fragment key={label}>
              {i > 0 && (
                <div className={cn("mx-1.5 h-0.5 flex-1 rounded-full sm:mx-2", n <= step ? "bg-[#1A6B52]" : "bg-[#E8E4DF]")} aria-hidden="true" />
              )}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full font-heading text-xs font-bold transition-colors",
                    isComplete ? "bg-[#1A6B52] text-white" : isActive ? "bg-[#E8F4F0] text-[#1A6B52] ring-2 ring-[#1A6B52]" : "bg-[#F3F0EB] text-[#9CA3AF]"
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : n}
                </div>
                <span
                  className={cn(
                    "hidden text-[10px] font-semibold uppercase tracking-wide sm:block",
                    isActive ? "text-[#1A6B52]" : isComplete ? "text-[#1A6B52]/70" : "text-[#9CA3AF]"
                  )}
                >
                  {label}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-body text-xs font-medium text-[#1C1C1A]">{children}</span>;
}

export function AddCampaignWizard({ open, onClose, onViewCampaigns, initialDraft }: AddCampaignWizardProps) {
  const { create } = useCampaignsContext();

  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<CampaignDraft>({
    name: "",
    goal: null,
    type: null,
    audienceType: null,
    channel: null,
    sendDate: todayStr(),
    message: "",
    aiGenerated: false,
  });
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [launchedCampaign, setLaunchedCampaign] = useState<{ name: string; audienceSize: number; channel: CampaignChannel; dateLabel: string } | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setGenerating(false);
    setHasGenerated(Boolean(initialDraft?.message));
    setLaunchedCampaign(null);
    setDraft({
      name: initialDraft?.name ? `${initialDraft.name} (Copy)` : "",
      goal: initialDraft?.goal ?? null,
      type: initialDraft?.type ?? null,
      audienceType: initialDraft?.audienceType ?? null,
      channel: initialDraft?.channel ?? null,
      sendDate: todayStr(),
      message: initialDraft?.message ?? "",
      aiGenerated: Boolean(initialDraft?.aiGenerated),
    });
  }, [open, initialDraft]);

  const detailsValid = Boolean(draft.name.trim() && draft.goal && draft.type && draft.audienceType);
  const channelValid = Boolean(draft.channel);
  const messageValid = Boolean(draft.message.trim());
  const audience = useMemo(() => AUDIENCE_OPTIONS.find((o) => o.value === draft.audienceType), [draft.audienceType]);

  function set<K extends keyof CampaignDraft>(key: K, value: CampaignDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setDraft((prev) => ({ ...prev, message: generateCampaignMessage(prev), aiGenerated: true }));
      setHasGenerated(true);
      setGenerating(false);
    }, 900);
  }

  function handleSaveDraft() {
    if (!detailsValid || !draft.channel) return;
    create({ draft, status: "draft" });
    onClose();
  }

  function handleLaunch() {
    if (!detailsValid || !draft.channel || !draft.message.trim()) return;
    const created = create({ draft, status: "active" });
    setLaunchedCampaign({
      name: created.name,
      audienceSize: audience?.size ?? created.audienceSize,
      channel: created.channel,
      dateLabel: formatLaunchDate(draft),
    });
    setStep(5);
  }

  function footer() {
    if (step === 1) {
      return (
        <div className="flex justify-end">
          <Button variant="primary" size="md" disabled={!detailsValid} onClick={() => setStep(2)}>Continue</Button>
        </div>
      );
    }

    if (step === 2 || step === 3) {
      const canContinue = step === 2 ? channelValid : messageValid;
      const continueAction = () => setStep(step + 1);
      return (
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="md" onClick={() => setStep(step - 1)}>Back</Button>
          <Button variant="primary" size="md" disabled={!canContinue} onClick={continueAction}>Continue</Button>
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="secondary" size="md" leftIcon={<CloudUpload className="h-4 w-4" />} onClick={handleSaveDraft}>Save as Draft</Button>
            <Button variant="primary" size="md" leftIcon={<Send className="h-4 w-4" />} onClick={handleLaunch}>Launch Campaign</Button>
          </div>
        </div>
      );
    }

    return undefined;
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Campaign" size="lg" footer={footer()}>
      <StepProgress step={step} />

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-heading text-base font-bold text-[#1C1C1A]">Campaign Details</h3>
            <p className="mt-0.5 font-body text-xs text-[#6B7280]">Name the campaign, choose a goal, and pick who it reaches.</p>
          </div>

          <Input label="Campaign Name" value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Summer Glow Re-engagement" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Campaign Goal</FieldLabel>
              <Dropdown<CampaignGoal>
                options={CAMPAIGN_GOALS.map((g) => ({ value: g.value, label: g.label }))}
                value={draft.goal}
                onChange={(value) => set("goal", value)}
                placeholder="Select a goal"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Campaign Type</FieldLabel>
              <Dropdown<CampaignType>
                options={CAMPAIGN_TYPES.map((t) => ({ value: t.value, label: t.label }))}
                value={draft.type}
                onChange={(value) => set("type", value)}
                placeholder="Select a type"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Audience Type</FieldLabel>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {AUDIENCE_OPTIONS.map((option) => {
                const selected = draft.audienceType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => set("audienceType", option.value)}
                    aria-pressed={selected}
                    className={cn(
                      "flex items-start gap-2.5 rounded-[12px] border px-3.5 py-3 text-left transition-colors",
                      selected ? "border-[#1A6B52] bg-[#E8F4F0] ring-1 ring-[#1A6B52]" : "border-[#E5E7EB] bg-white hover:border-[#1A6B52]/40"
                    )}
                  >
                    <Users className={cn("mt-0.5 h-4 w-4 shrink-0", selected ? "text-[#1A6B52]" : "text-[#6B7280]")} aria-hidden="true" />
                    <div className="min-w-0">
                      <div className="font-body text-sm font-medium text-[#1C1C1A]">{option.label}</div>
                      <div className="font-body text-xs text-[#9CA3AF]">{option.description}</div>
                      <div className="mt-1 font-body text-[11px] font-semibold text-[#1A6B52]">{option.size} clients</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-heading text-base font-bold text-[#1C1C1A]">Delivery Channel</h3>
            <p className="mt-0.5 font-body text-xs text-[#6B7280]">Choose how this campaign reaches its audience.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {CHANNELS.map((channel) => {
              const selected = draft.channel === channel.value;
              const Icon = channel.icon === "sms" ? MessageSquare : Mail;
              return (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() => set("channel", channel.value)}
                  aria-pressed={selected}
                  className={cn(
                    "flex flex-col gap-3 rounded-[16px] border p-5 text-left transition-colors",
                    selected ? "border-[#1A6B52] bg-[#E8F4F0] ring-1 ring-[#1A6B52]" : "border-[#E5E7EB] bg-white hover:border-[#1A6B52]/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-full", selected ? "bg-[#1A6B52] text-white" : "bg-[#F3F0EB] text-[#6B7280]")}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    {selected && (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A6B52]">
                        <Check className="h-3 w-3 text-white" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="font-heading text-sm font-bold text-[#1C1C1A]">{channel.label}</div>
                    <div className="mt-1 font-body text-xs text-[#6B7280]">{channel.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel>Delivery Date</FieldLabel>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#6B7280]" aria-hidden="true" />
              <input
                type="date"
                value={draft.sendDate}
                min={todayStr()}
                onChange={(e) => set("sendDate", e.target.value)}
                className="h-11 rounded-[12px] border border-[#E5E7EB] bg-white px-4 font-body text-sm text-[#1C1C1A] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#1A6B52]"
              />
            </div>
            <p className="font-body text-xs text-[#6B7280]">Campaigns deliver at 9:00 AM local time.</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-heading text-base font-bold text-[#1C1C1A]">AI Message Generator</h3>
            <p className="mt-0.5 font-body text-xs text-[#6B7280]">Draft an on-brand {draft.channel ?? "SMS or email"} message, then edit it before continuing.</p>
          </div>

          {!hasGenerated && !generating ? (
            <div className="rounded-[16px] border border-dashed border-[#E8E4DF] bg-[#FAFAF9] px-6 py-10 text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#E8F4F0]">
                <Sparkles className="h-5 w-5 text-[#1A6B52]" aria-hidden="true" />
              </div>
              <p className="mt-3 font-heading text-sm font-bold text-[#1C1C1A]">Write your message with AI</p>
              <p className="mx-auto mt-1 max-w-xs font-body text-xs text-[#6B7280]">
                Generate a personalized message for your {audience?.label.toLowerCase() ?? "target audience"}. You can edit anything the AI drafts.
              </p>
              <Button
                variant="ghost"
                size="md"
                className="mt-4"
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={handleGenerate}
              >
                Generate AI Message
              </Button>
            </div>
          ) : generating ? (
            <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[#E8E4DF] bg-[#FAFAF9] px-6 py-12 text-center">
              <div className="relative flex h-11 w-11 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#1A6B52]/20" aria-hidden="true" />
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#1A6B52]">
                  <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 font-heading text-sm font-bold text-[#1C1C1A]">Drafting your message…</p>
              <p className="mt-1 font-body text-xs text-[#6B7280]">Aura is tailoring the copy to your audience and goal.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 rounded-full bg-[#E8F4F0] px-3 py-1 font-body text-xs font-semibold text-[#1A6B52]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  AI Generated · Editable
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  onClick={handleGenerate}
                  disabled={generating}
                >
                  Regenerate
                </Button>
              </div>
              <textarea
                value={draft.message}
                onChange={(e) => set("message", e.target.value)}
                rows={9}
                className="w-full resize-none rounded-[16px] border border-[#E5E7EB] bg-white px-4 py-3 font-body text-sm leading-relaxed text-[#1C1C1A] placeholder:text-[#9CA3AF] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A6B52]"
              />
              <p className="text-right font-body text-xs text-[#9CA3AF]">{draft.message.length} characters</p>
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="font-heading text-base font-bold text-[#1C1C1A]">Review</h3>
            <p className="mt-0.5 font-body text-xs text-[#6B7280]">Confirm everything looks right before launching.</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ReviewRow icon={<Megaphone className="h-4 w-4" />} label="Campaign Name" value={draft.name} />
            <ReviewRow icon={<Sparkles className="h-4 w-4" />} label="Campaign Goal" value={draft.goal ? goalLabel(draft.goal) : "—"} />
            <ReviewRow icon={<Tag className="h-4 w-4" />} label="Campaign Type" value={draft.type ?? "—"} />
            <ReviewRow icon={<Users className="h-4 w-4" />} label="Audience" value={draft.audienceType ? `${audienceLabel(draft.audienceType)} · ${audience?.size ?? 0} clients` : "—"} />
            <ReviewRow
              icon={draft.channel === "Email" ? <Mail className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
              label="Delivery Channel"
              value={draft.channel ?? "—"}
            />
            <ReviewRow icon={<Calendar className="h-4 w-4" />} label="Launch Date" value={formatLaunchDate(draft)} />
          </div>

          <div>
            <FieldLabel>Message Preview</FieldLabel>
            <div className="mt-1.5 max-h-52 overflow-y-auto whitespace-pre-wrap rounded-[12px] border border-[#E8E4DF] bg-[#FAFAF9] px-4 py-3 font-body text-sm leading-relaxed text-[#374151]">
              {draft.message.trim() || "No message yet."}
            </div>
          </div>
        </div>
      )}

      {step === 5 && launchedCampaign && (
        <div className="flex flex-col items-center px-4 py-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F4F0]">
            <CheckCircle2 className="h-8 w-8 text-[#1A6B52]" aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-[#1C1C1A]">Campaign Launched</h3>
          <p className="mt-1 max-w-sm font-body text-sm text-[#6B7280]">
            “{launchedCampaign.name}” is now active. It will reach {launchedCampaign.audienceSize} clients via {launchedCampaign.channel} on {launchedCampaign.dateLabel}.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Button variant="primary" size="md" onClick={onClose}>Done</Button>
            {onViewCampaigns && (
              <Button variant="secondary" size="md" onClick={onViewCampaigns}>View Campaigns</Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function ReviewRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[12px] border border-[#E8E4DF] bg-white px-3.5 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3F0EB] text-[#6B7280]">{icon}</div>
      <div className="min-w-0">
        <div className="font-body text-[11px] uppercase tracking-wide text-[#9CA3AF]">{label}</div>
        <div className="truncate font-body text-sm font-medium text-[#1C1C1A]">{value}</div>
      </div>
    </div>
  );
}