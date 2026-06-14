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

  // 空状态：居中的问候语 + 输入框（输入框由 EmptyState 内部渲染）
  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <EmptyState onPick={sendMessage} />
      </div>
    );
  }

  // 对话进行中：消息列表 + 底部输入框
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <MessageList messages={messages} />
      <div className="px-4 pb-4">
        <div className="mx-auto max-w-3xl">
          <InputBar onSend={sendMessage} />
          <p className="mt-2 text-center text-xs text-muted">
            这是 UI 演示，回复内容为模拟数据。
          </p>
        </div>
      </div>
    </div>
  );
}
