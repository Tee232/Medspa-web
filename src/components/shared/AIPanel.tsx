import type { ReactNode } from "react";
import { Bot, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIAskInput } from "@/components/shared/AIAskInput";
import type { AIChatMessage } from "@/features/ai/types";

export interface AIPanelProps {
  contextLabel: string;
  userFirstName: string;
  children?: ReactNode;
  insightsLabel?: string | null;
  /** Conversation transcript — same array passed to AIPanelExpanded,
   *  so expanding mid-chat continues it rather than starting over. */
  messages?: AIChatMessage[];
  onAsk: (message: string) => void;
  isAsking?: boolean;
  onExpand?: () => void;
  onViewAllInsights?: () => void;
  className?: string;
}

/**
 * Docked AI assistant panel. The greeting shows until the first
 * message is sent, then switches to a real transcript — answers
 * come from features/ai/answerQuery, grounded in the page's actual
 * data, not generic placeholder text.
 */
export function AIPanel({
  contextLabel,
  userFirstName,
  children,
  insightsLabel = "Contextual Insights",
  messages = [],
  onAsk,
  isAsking = false,
  onExpand,
  onViewAllInsights,
  className,
}: AIPanelProps) {
  const hasInsights = Boolean(children);
  const hasConversation = messages.length > 0;

  return (
    <aside className={cn("flex h-full w-[300px] flex-col border-l border-[#E8E4DF] bg-white", className)} aria-label="AI Assistant">
      <div className="flex items-center gap-2.5 border-b border-[#E8E4DF] px-4 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1A6B52]">
          <Bot className="h-4 w-4 text-white" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-heading text-[13px] font-bold text-[#1C1C1A]">AI Assistant</div>
          <div className="flex items-center gap-1.5 font-body text-[11px] text-[#6B7280]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" aria-hidden="true" />
            {contextLabel}
          </div>
        </div>
        {onExpand && (
          <button
            type="button"
            onClick={onExpand}
            aria-label="Expand AI Assistant"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[#9CA3AF] hover:bg-[#F3F0EB] hover:text-[#6B7280]"
          >
            <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
        {hasInsights && !hasConversation && (
          <div className="shrink-0">
            {insightsLabel && (
              <p className="mb-2.5 font-body text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">{insightsLabel}</p>
            )}
            <div className="flex flex-col gap-2.5">{children}</div>
            {onViewAllInsights && (
              <button type="button" onClick={onViewAllInsights} className="mt-3 w-full text-center font-body text-xs font-medium text-[#1A6B52] hover:underline">
                View all Insights →
              </button>
            )}
          </div>
        )}

        {hasConversation ? (
          <div className="flex flex-1 flex-col justify-end gap-2.5">
            {messages.map((m) => <ChatBubble key={m.id} message={m} />)}
            {isAsking && <TypingBubble />}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="font-heading text-lg font-bold text-[#1C1C1A]">Hey {userFirstName}!</p>
            <p className="font-body text-sm text-[#6B7280]">How can I assist you?</p>
          </div>
        )}
      </div>

      <div className="border-t border-[#E8E4DF] p-3">
        <AIAskInput onSubmit={onAsk} isLoading={isAsking} />
      </div>
    </aside>
  );
}

export function ChatBubble({ message }: { message: AIChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-[14px] px-3.5 py-2.5 font-body text-xs leading-relaxed",
        isUser ? "self-end rounded-br-[4px] bg-[#1A6B52] text-white" : "self-start rounded-bl-[4px] bg-[#F3F0EB] text-[#1C1C1A]"
      )}
    >
      {message.content}
    </div>
  );
}

export function TypingBubble() {
  return (
    <div className="flex w-fit items-center gap-1 self-start rounded-[14px] rounded-bl-[4px] bg-[#F3F0EB] px-3.5 py-3">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9CA3AF] [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9CA3AF] [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9CA3AF]" />
    </div>
  );
}
