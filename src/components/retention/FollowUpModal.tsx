import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Send, X, Sparkles, Phone, Mail, Calendar, Clock, DollarSign, CheckCircle2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { RISK_CONFIG, generateAIMessage } from "@/features/atrisk/mockData";
import type { AtRiskClient, FollowUpChannel } from "@/features/atrisk/types";
import { cn } from "@/lib/utils";

export interface FollowUpModalProps {
  client: AtRiskClient | null;
  onClose: () => void;
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#F0EDE8] bg-[#FAFAF9] px-3 py-2.5">
      <div className="mb-1 flex items-center gap-1.5 text-[#9CA3AF]">
        {icon}
        <span className="font-body text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="truncate font-body text-sm font-medium text-[#1C1C1A]">{value}</p>
    </div>
  );
}

export function FollowUpModal({ client, onClose }: FollowUpModalProps) {
  const [channel, setChannel] = useState<FollowUpChannel>("SMS");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [showScheduleInputs, setShowScheduleInputs] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduled, setScheduled] = useState(false);
  const [scheduledLabel, setScheduledLabel] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);

  // Reset all state when modal opens for a new client
  useEffect(() => {
    if (!client) return;
    setChannel("SMS");
    setSent(false);
    setSending(false);
    setScheduling(false);
    setShowScheduleInputs(false);
    setScheduleDate("");
    setScheduleTime("");
    setScheduled(false);
    setScheduledLabel("");
  }, [client]);

  useEffect(() => {
    if (client) setMessage(generateAIMessage(client, channel));
  }, [client, channel]);

  useEffect(() => {
    if (!client) return;
    const prev = document.activeElement as HTMLElement;
    dialogRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [client, onClose]);

  const todayStr = new Date().toISOString().split("T")[0];

  function handleSendNow() {
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); setTimeout(onClose, 1200); }, 1500);
  }

  function handleScheduleToggle() {
    setShowScheduleInputs((prev) => !prev);
    setScheduled(false);
  }

  function handleScheduleConfirm(e: React.FormEvent) {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) return;
    setScheduling(true);
    setTimeout(() => {
      const formatted = new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      setScheduledLabel(formatted);
      setScheduled(true);
      setShowScheduleInputs(false);
      setScheduling(false);
      setTimeout(onClose, 1800);
    }, 700);
  }

  const isOpen = client !== null;
  const risk = client ? RISK_CONFIG[client.riskLevel] : null;

  return createPortal(
    <AnimatePresence>
      {isOpen && client && risk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="followup-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#F0EDE8] px-6 py-5">
              <div className="flex items-center gap-3">
                <Avatar name={client.name} size="lg" />
                <div>
                  <h2 id="followup-modal-title" className="font-heading text-lg font-bold text-[#1C1C1A]">{client.name}</h2>
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-body text-xs font-semibold", risk.bg, risk.color)}>
                    {client.riskLevel} Risk
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#9CA3AF] transition-colors hover:bg-[#F3F0EB] hover:text-[#1C1C1A]"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
              {/* Client info grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <InfoCard icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={client.phone} />
                <InfoCard icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={client.email} />
                <InfoCard icon={<Calendar className="h-3.5 w-3.5" />} label="Member Since" value={client.memberSinceLabel} />
                <InfoCard icon={<Clock className="h-3.5 w-3.5" />} label="Last Visit" value={client.lastVisit} />
                <InfoCard icon={<Sparkles className="h-3.5 w-3.5" />} label="Last Treatment" value={client.lastTreatment} />
                <InfoCard icon={<DollarSign className="h-3.5 w-3.5" />} label="LTV" value={`$${client.ltv.toLocaleString()}`} />
              </div>

              {/* Risk Score */}
              <div className="rounded-2xl border border-[#F0EDE8] bg-[#FAFAF9] p-4">
                <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">Risk Score</p>
                <div className="flex items-center gap-4">
                  <span className={cn("font-heading text-4xl font-bold", risk.color)}>{client.riskScore}</span>
                  <div className="flex-1">
                    <div className="h-2 overflow-hidden rounded-full bg-[#E8E4DF]">
                      <div
                        className={cn("h-full rounded-full transition-all", risk.bar)}
                        style={{ width: `${Math.min(client.riskScore, 100)}%` }}
                      />
                    </div>
                    <p className={cn("mt-1 font-body text-xs font-semibold", risk.color)}>{client.riskLevel}</p>
                  </div>
                </div>
              </div>

              {/* AI Recommendation */}
              <div className="rounded-2xl border border-[#D1FAE5] bg-gradient-to-br from-[#F0FDF4] to-[#ECFDF5] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1A6B52]/10">
                    <Sparkles className="h-3.5 w-3.5 text-[#1A6B52]" />
                  </div>
                  <p className="font-body text-xs font-semibold uppercase tracking-wide text-[#1A6B52]">AI Recommendation</p>
                </div>
                <p className="font-body text-sm leading-relaxed text-[#374151]">{client.aiRecommendation}</p>
              </div>

              {/* Channel selector */}
              <div>
                <p className="mb-2 font-body text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Communication Channel</p>
                <div className="flex gap-2">
                  {(["SMS", "Email"] as FollowUpChannel[]).map((ch) => (
                    <button
                      key={ch}
                      onClick={() => setChannel(ch)}
                      className={cn(
                        "flex items-center gap-2 rounded-full border px-4 py-2 font-body text-sm font-medium transition-all",
                        channel === ch
                          ? "border-[#1A6B52] bg-[#1A6B52] text-white shadow-sm"
                          : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#1A6B52] hover:text-[#1A6B52]"
                      )}
                    >
                      {ch === "SMS" ? <MessageSquare className="h-3.5 w-3.5" /> : <Mail className="h-3.5 w-3.5" />}
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI-generated message */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-body text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Message</p>
                  <span className="flex items-center gap-1 font-body text-xs font-medium text-[#1A6B52]">
                    <Sparkles className="h-3 w-3" />
                    AI Generated · Editable
                  </span>
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={channel === "SMS" ? 4 : 7}
                  className="w-full resize-none rounded-2xl border border-[#E5E7EB] bg-[#FAFAF9] px-4 py-3 font-body text-sm leading-relaxed text-[#1C1C1A] transition-all placeholder-[#9CA3AF] focus:border-[#1A6B52] focus:outline-none focus:ring-2 focus:ring-[#1A6B52]/20"
                />
                <p className="mt-1 text-right font-body text-xs text-[#9CA3AF]">{message.length} chars</p>
              </div>
            </div>

            {/* Schedule for Later — Inline Date/Time Picker */}
            <AnimatePresence>
              {showScheduleInputs && (
                <motion.div
                  key="scheduler"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden border-t border-[#F0EDE8] bg-[#FAFAF9]"
                >
                  <form onSubmit={handleScheduleConfirm} className="space-y-3 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-[#1A6B52]" />
                        <p className="font-heading text-sm font-bold text-[#1C1C1A]">
                          Schedule Follow-up Message
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowScheduleInputs(false)}
                        className="rounded-full p-1 text-[#9CA3AF] transition-colors hover:bg-[#F3F0EB] hover:text-[#1C1C1A]"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="font-body text-xs text-[#6B7280]">
                      Pick when to send this {channel} to{" "}
                      <strong className="text-[#1C1C1A]">{client?.name.split(" ")[0]}</strong>.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                          Date
                        </label>
                        <input
                          type="date"
                          required
                          min={todayStr}
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full cursor-pointer rounded-xl border border-[#E8E4DF] bg-white px-3 py-2.5 font-body text-sm text-[#1C1C1A] outline-none focus:border-[#1A6B52] focus:ring-2 focus:ring-[#1A6B52]/10 transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-body text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                          Time
                        </label>
                        <input
                          type="time"
                          required
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full cursor-pointer rounded-xl border border-[#E8E4DF] bg-white px-3 py-2.5 font-body text-sm text-[#1C1C1A] outline-none focus:border-[#1A6B52] focus:ring-2 focus:ring-[#1A6B52]/10 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-0.5">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowScheduleInputs(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        size="sm"
                        isLoading={scheduling}
                        disabled={!scheduleDate || !scheduleTime}
                        leftIcon={<Calendar className="h-3.5 w-3.5" />}
                      >
                        Confirm Schedule
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex items-center gap-3 border-t border-[#F0EDE8] bg-white px-6 py-4">
              {sent ? (
                <div className="flex flex-1 items-center justify-center gap-2 font-body font-semibold text-[#1A6B52]">
                  <CheckCircle2 className="h-5 w-5" />
                  Message sent!
                </div>
              ) : scheduled ? (
                <div className="flex flex-1 items-center justify-center gap-2 font-body font-semibold text-[#1A6B52]">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Scheduled for <strong>{scheduledLabel}</strong></span>
                </div>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={handleScheduleToggle}
                    leftIcon={<Calendar className="h-4 w-4" />}
                    className="flex-1"
                  >
                    Schedule for Later
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleSendNow}
                    isLoading={sending}
                    leftIcon={<Send className="h-4 w-4" />}
                    className="flex-1"
                  >
                    Send Now
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}