import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import type { Client, ClientAIInsight } from "@/features/clients/types";

export interface MessageComposerModalProps {
  open: boolean;
  client: Client | null;
  aiInsight?: ClientAIInsight;
  onClose: () => void;
}

function draftMessage(client: Client, aiInsight?: ClientAIInsight): string {
  const firstName = client.name.split(" ")[0];
  if (aiInsight) {
    return `Hi ${firstName}, it's been a little while since your last visit! Based on your treatment history, you may be due for ${aiInsight.recommendedNext.treatmentName} around ${aiInsight.recommendedNext.dateLabel}. We'd love to see you back — let us know if you'd like to book your next appointment.`;
  }
  return `Hi ${firstName}, we wanted to check in and see if you'd like to schedule your next visit with us. Let us know what works for you!`;
}

/**
 * AI drafts, Front Desk approves. The draft is editable before
 * sending; nothing is sent without an explicit click on Send. For
 * this MVP, sending is simulated — no external messaging provider.
 */
export function MessageComposerModal({ open, client, aiInsight, onClose }: MessageComposerModalProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (client && open) {
      setMessage(draftMessage(client, aiInsight));
      setSent(false);
    }
  }, [client, aiInsight, open]);

  if (!client) return null;

  function handleClose() {
    setSent(false);
    onClose();
  }

  function handleSend() {
    if (!message.trim()) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSent(true);
    }, 700);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Send Message"
      size="sm"
      footer={
        sent ? undefined : (
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" size="sm" isLoading={isSending} disabled={!message.trim()} onClick={handleSend}>Send</Button>
          </div>
        )
      }
    >
      {sent ? (
        <div className="flex flex-col items-center py-6 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F4F0]">
            <CheckCircle2 className="h-6 w-6 text-[#1A6B52]" aria-hidden="true" />
          </div>
          <p className="font-heading text-sm font-bold text-[#1C1C1A]">Message Sent</p>
          <p className="mt-1 font-body text-xs text-[#6B7280]">{client.name} will receive this outreach message shortly.</p>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <Avatar name={client.name} size="sm" />
            <div>
              <div className="font-body text-sm font-semibold text-[#1C1C1A]">{client.name}</div>
              <div className="font-body text-xs text-[#6B7280]">{client.phone}</div>
            </div>
          </div>

          <div className="mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#7C6FCD]" aria-hidden="true" />
            <span className="font-body text-[11px] font-medium text-[#7C6FCD]">AI-drafted — review and edit before sending</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full resize-none rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 font-body text-sm text-[#1C1C1A] outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#1A6B52]"
          />
        </div>
      )}
    </Modal>
  );
}
