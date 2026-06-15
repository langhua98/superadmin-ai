"use client";

import { ClaudeLogo } from "@/components/ClaudeLogo";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { Message } from "@/types";

export function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        {/* 用户气泡：暖灰色，右对齐 */}
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[20px] rounded-br-md bg-userbubble px-4 py-3 text-[16px] leading-relaxed text-primary">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      {/* Claude 星形头像 */}
      <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <ClaudeLogo size={18} className="text-accent" />
      </div>
      {/* 助手回复：无气泡，直接渲染文本 */}
      <div className="min-w-0 flex-1 pt-0.5">
        {message.content ? (
          <div className={cn("text-[16px] leading-relaxed", message.isStreaming && "streaming-cursor")}>
            <MarkdownRenderer content={message.content} />
          </div>
        ) : (
          <TypingDots />
        )}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-muted"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}
