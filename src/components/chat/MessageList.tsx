"use client";

import { useAutoScroll } from "@/hooks/useAutoScroll";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/types";

export function MessageList({ messages }: { messages: Message[] }) {
  const last = messages[messages.length - 1];
  // 监听消息数量与最后一条内容长度，流式输出时持续滚动
  const bottomRef = useAutoScroll(`${messages.length}:${last?.content.length ?? 0}`);

  return (
    <div className="scrollbar-thin flex-1 overflow-y-auto">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
