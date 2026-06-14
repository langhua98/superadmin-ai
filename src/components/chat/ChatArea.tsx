"use client";

import { useChatContext } from "@/context/ChatContext";
import { useChat } from "@/hooks/useChat";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { EmptyState } from "./EmptyState";

export function ChatArea() {
  const { state } = useChatContext();
  const { sendMessage } = useChat();

  const active = state.conversations.find(
    (c) => c.id === state.activeConversationId,
  );
  const messages = active?.messages ?? [];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {messages.length === 0 ? (
        <EmptyState onPick={sendMessage} />
      ) : (
        <MessageList messages={messages} />
      )}
      <InputBar onSend={sendMessage} />
    </div>
  );
}
