import { useState } from "react";
import type { AIChatMessage, AIModuleContext } from "@/features/ai/types";
import { answerQuery } from "@/features/ai/answerQuery";

export function useAIAssistant(context: AIModuleContext) {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);

  function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { id: `msg-${Date.now()}-u`, role: "user", content: trimmed }]);
    setIsThinking(true);

    setTimeout(() => {
      const answer = answerQuery(trimmed, context);
      setMessages((prev) => [...prev, { id: `msg-${Date.now()}-a`, role: "assistant", content: answer }]);
      setIsThinking(false);
    }, 500);
  }

  return { messages, isThinking, ask };
}
