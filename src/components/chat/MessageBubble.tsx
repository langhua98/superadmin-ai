"use client";

import { ClaudeLogo } from "@/components/ClaudeLogo";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { Message } from "@/types";

export function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl bg-userbubble px-4 py-2.5 text-[15px] leading-relaxed text-primary">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-base text-accent">
        <ClaudeLogo size={16} />
      </div>
      <div className="min-w-0 flex-1">
        {message.content ? (
          <div className={cn(message.isStreaming && "streaming-cursor")}>
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
    <div className="flex items-center gap-1 py-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 animate-bounce rounded-full bg-muted"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}
