import { useState } from "react";
import {
  Sparkles,
  Send,
  UserCheck,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  CalendarClock,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useRequestsContext } from "@/features/requests/RequestsContext";
import { useClientsContext } from "@/features/clients/ClientsContext";
import type { CustomerRequest } from "@/features/requests/types";
import type { Client } from "@/features/clients/types";

interface CustomerRequestDetailModalProps {
  open: boolean;
  onClose: () => void;
  request: CustomerRequest | null;
  onBookAppointment: (client: Client, treatmentName?: string) => void;
}

export function CustomerRequestDetailModal({
  open,
  onClose,
  request,
  onBookAppointment,
}: CustomerRequestDetailModalProps) {
  const { replyToRequest, markAsConverted } = useRequestsContext();
  const { create: createClient, clients } = useClientsContext();

  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Schedule for Later state
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledAt, setScheduledAt] = useState<string | null>(null);

  if (!request) return null;

  // Get today's date in YYYY-MM-DD format for min attribute
  const todayStr = new Date().toISOString().split("T")[0];

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime) return;

    setIsScheduling(true);
    setTimeout(() => {
      const formatted = new Date(`${scheduleDate}T${scheduleTime}`).toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      setScheduledAt(formatted);
      setShowScheduler(false);
      setIsScheduling(false);
    }, 600);
  };

  const handleCancelScheduler = () => {
    setShowScheduler(false);
    setScheduleDate("");
    setScheduleTime("");
  };

  // Find if already converted
  const existingConvertedClient = request.convertedClientId
    ? clients.find((c) => c.id === request.convertedClientId)
    : undefined;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsReplying(true);
    setTimeout(() => {
      replyToRequest(request.id, replyText.trim());
      setIsReplying(false);
      setReplyText("");
    }, 400);
  };

  const handleConvertToClient = () => {
    setIsConverting(true);
    setTimeout(() => {
      // Reuses submitted info automatically
      const newClient = createClient({
        name: request.name,
        phone: request.phone,
        email: request.email,
        membership: "Standard",
      });

      markAsConverted(request.id, newClient.id);
      setIsConverting(false);
    }, 400);
  };

  const handleBookAppointmentClick = () => {
    let clientToBook = existingConvertedClient;

    // If not converted yet, convert first then book!
    if (!clientToBook) {
      clientToBook = createClient({
        name: request.name,
        phone: request.phone,
        email: request.email,
        membership: "Standard",
      });
      markAsConverted(request.id, clientToBook.id);
    }

    onClose();
    onBookAppointment(clientToBook, request.requestedTreatment);
  };

  const formattedDate = new Date(request.createdAt).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Modal open={open} onClose={onClose} title="Customer Request Details" size="lg">
      <div className="flex flex-col gap-5">
        {/* Top Header Card */}
        <div className="flex flex-col gap-3 rounded-2xl border border-[#E8E4DF] bg-[#FDFCFB] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A6B52] font-heading font-bold text-white shadow-sm">
              {request.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-lg font-bold text-[#1C1C1A]">{request.name}</h3>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    request.requestType === "consultation"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {request.requestType === "consultation" ? "Consultation Request" : "General Inquiry"}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-[#9CA3AF]" /> {request.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-[#9CA3AF]" /> {request.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1.5 sm:items-end">
            <StatusBadge
              status={
                request.status === "pending"
                  ? "at_risk"
                  : request.status === "responded"
                  ? "new"
                  : "active"
              }
              label={
                request.status === "pending"
                  ? "Pending Review"
                  : request.status === "responded"
                  ? "Responded"
                  : "Converted to Client"
              }
            />
            <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
              <Clock className="h-3 w-3" /> Submitted {formattedDate}
            </span>
          </div>
        </div>

        {/* Requested Service & Submitted Message */}
        <div className="rounded-2xl border border-[#E8E4DF] bg-white p-4">
          <div className="mb-2 flex items-center justify-between border-b border-[#F5F2EF] pb-2">
            <span className="text-xs font-semibold text-[#6B7280]">Requested Treatment:</span>
            <span className="rounded-full bg-[#F3F0EB] px-3 py-1 font-heading text-xs font-bold text-[#1A6B52]">
              {request.requestedTreatment || "General Consultation"}
            </span>
          </div>
          <div className="mt-3">
            <label className="mb-1 block text-xs font-semibold text-[#374151]">Message / Inquiry:</label>
            <div className="rounded-xl bg-[#F9F7F4] p-3.5 text-sm text-[#1C1C1A] leading-relaxed">
              "{request.message}"
            </div>
          </div>
        </div>

        {/* AI Lead Insights Box */}
        <div className="rounded-2xl border border-emerald-200 bg-[#E8F4F0] p-4 text-xs text-[#1A6B52]">
          <div className="mb-1.5 flex items-center gap-2 font-heading font-bold text-[#1A6B52]">
            <Sparkles className="h-4 w-4" /> AI Lead Insights
          </div>
          <p className="leading-relaxed">
            High intent lead requesting <strong>{request.requestedTreatment}</strong>. Recommended action:
            Send greeting SMS/Email and convert to client profile to book their preferred 30-min consultation slot.
          </p>
        </div>

        {/* Status Action Workflow: Convert / Client Exists Notice */}
        {request.status === "converted" || existingConvertedClient ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-4 w-4 text-[#1A6B52]" />
              <span>Converted into official clinic client record!</span>
            </div>
            <Link
              to={`/clients/${existingConvertedClient?.id || request.convertedClientId}`}
              className="flex items-center gap-1 font-semibold text-[#1A6B52] underline hover:text-[#135743]"
            >
              View Client Profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-[#E8E4DF] bg-[#FDFCFB] p-3.5">
            <div className="text-xs text-[#6B7280]">
              <span className="font-semibold text-[#1C1C1A]">Convert to Client Record:</span> Reuses submitted name, email, and phone without manual re-entry.
            </div>
            <Button
              variant="secondary"
              size="sm"
              isLoading={isConverting}
              leftIcon={<UserCheck className="h-4 w-4 text-[#1A6B52]" />}
              onClick={handleConvertToClient}
            >
              Convert to Client
            </Button>
          </div>
        )}

        {/* Reply Section */}
        <div className="rounded-2xl border border-[#E8E4DF] bg-white p-4">
          <h4 className="mb-2 font-heading text-xs font-bold text-[#1C1C1A] flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-[#1A6B52]" /> Reply to Requester
          </h4>

          {request.replyMessage && (
            <div className="mb-3 rounded-xl bg-emerald-50/70 p-3 border border-emerald-100 text-xs text-[#1C1C1A]">
              <div className="font-semibold text-[#1A6B52] mb-1">Previous Reply Sent:</div>
              <p className="italic">"{request.replyMessage}"</p>
            </div>
          )}

          <form onSubmit={handleSendReply} className="flex flex-col gap-2.5">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Hi ${request.name.split(" ")[0]}, thank you for contacting Lumière MedSpa...`}
              className="w-full rounded-xl border border-[#E8E4DF] bg-white p-3 text-sm text-[#1C1C1A] placeholder-[#9CA3AF] outline-none focus:border-[#1A6B52]"
            />
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                type="submit"
                disabled={!replyText.trim()}
                isLoading={isReplying}
                leftIcon={<Send className="h-3.5 w-3.5" />}
              >
                Send Reply
              </Button>
            </div>
          </form>
        </div>

        {/* Schedule for Later — Date/Time Picker */}
        {showScheduler && (
          <div className="rounded-2xl border border-[#D1C9BE] bg-[#FDFCFB] p-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[#1A6B52]" />
                <span className="font-heading text-sm font-bold text-[#1C1C1A]">Schedule Follow-up</span>
              </div>
              <button
                type="button"
                onClick={handleCancelScheduler}
                className="rounded-lg p-1 text-[#9CA3AF] transition-colors hover:bg-[#F3F0EB] hover:text-[#1C1C1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mb-3 text-xs text-[#6B7280]">
              Choose when to follow up with <strong className="text-[#1C1C1A]">{request.name.split(" ")[0]}</strong> about their request.
            </p>
            <form onSubmit={handleScheduleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Date</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E4DF] bg-white px-3 py-2.5 text-sm text-[#1C1C1A] outline-none focus:border-[#1A6B52] focus:ring-2 focus:ring-[#1A6B52]/10 transition-all cursor-pointer"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">Time</label>
                  <input
                    type="time"
                    required
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full rounded-xl border border-[#E8E4DF] bg-white px-3 py-2.5 text-sm text-[#1C1C1A] outline-none focus:border-[#1A6B52] focus:ring-2 focus:ring-[#1A6B52]/10 transition-all cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-0.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCancelScheduler}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isScheduling}
                  disabled={!scheduleDate || !scheduleTime}
                  leftIcon={<CalendarClock className="h-3.5 w-3.5" />}
                >
                  Confirm Schedule
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Scheduled Confirmation Banner */}
        {scheduledAt && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <div className="flex-1">
              <p className="font-heading text-xs font-bold text-emerald-800">Follow-up Scheduled!</p>
              <p className="mt-0.5 text-[11px] text-emerald-700">
                A reminder to follow up with <strong>{request.name.split(" ")[0]}</strong> is set for{" "}
                <strong>{scheduledAt}</strong>.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setScheduledAt(null)}
              className="shrink-0 rounded p-0.5 text-emerald-500 hover:text-emerald-700 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between border-t border-[#E8E4DF] pt-4">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="md"
              leftIcon={<CalendarClock className="h-4 w-4" />}
              onClick={() => {
                setShowScheduler((prev) => !prev);
                setScheduledAt(null);
              }}
            >
              Schedule for Later
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<CalendarPlus className="h-4 w-4" />}
              onClick={handleBookAppointmentClick}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
