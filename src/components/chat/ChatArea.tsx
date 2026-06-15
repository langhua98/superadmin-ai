"use client";

import { useChatContext } from "@/context/ChatContext";
import { useChat } from "@/hooks/useChat";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { EmptyState } from "./EmptyState";

export function ChatArea() {
  const { state } = useChatContext();
  const { sendMessage, stopStreaming, isStreaming } = useChat();

  const active = state.conversations.find(c => c.id === state.activeConversationId);
  const messages = active?.messages ?? [];

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <EmptyState onPick={sendMessage} />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <MessageList messages={messages} />
      <div className="border-t border-border/50 bg-base px-4 pb-4 pt-3">
        <div className="mx-auto max-w-3xl">
          <InputBar
            onSend={sendMessage}
            onStop={stopStreaming}
            isStreaming={isStreaming}
          />
          <p className="mt-2 text-center text-xs text-muted">
            这是 UI 演示，回复内容为模拟数据。按 Enter 发送，Shift+Enter 换行。
          </p>
        </div>
      </div>
    </div>
  );
}
