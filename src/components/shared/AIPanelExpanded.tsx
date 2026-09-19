import type { ReactNode } from "react";
import { Bot, X, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AIAskInput } from "@/components/shared/AIAskInput";
import { ChatBubble, TypingBubble } from "@/components/shared/AIPanel";
import type { AIChatMessage } from "@/features/ai/types";

export interface AIPanelExpandedProps {
  open: boolean;
  onClose: () => void;
  title: string;
  timestampLabel: string;
  children: ReactNode;
  /** Same transcript array passed to the docked AIPanel — expanding
   *  mid-conversation continues it rather than starting a new one. */
  messages?: AIChatMessage[];
  onAsk: (message: string) => void;
  isAsking?: boolean;
  className?: string;
}

export function AIPanelExpanded({ open, onClose, title, timestampLabel, children, messages = [], onAsk, isAsking = false, className }: AIPanelExpandedProps) {
  const hasConversation = messages.length > 0;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.18 }}
            className={cn("relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl", className)}
          >
            <div className="flex items-center justify-between border-b border-[#E8E4DF] px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1A6B52]">
                  <Bot className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="font-heading text-sm font-bold text-[#1C1C1A]">{title}</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#6B7280] hover:bg-[#F3F0EB] hover:text-[#1C1C1A]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              <h3 className="mb-1 font-heading text-lg font-bold text-[#1C1C1A]">Schedule Overview</h3>
              <div className="mb-5 flex items-center gap-4 font-body text-xs text-[#6B7280]">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {timestampLabel}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  AI Insights
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">{children}</div>

              {hasConversation && (
                <div className="mt-5 flex flex-col gap-2.5 border-t border-[#E8E4DF] pt-5">
                  {messages.map((m) => <ChatBubble key={m.id} message={m} />)}
                  {isAsking && <TypingBubble />}
                </div>
              )}
            </div>

            <div className="border-t border-[#E8E4DF] p-4">
              <AIAskInput onSubmit={onAsk} isLoading={isAsking} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
