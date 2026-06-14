"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { Message } from "@/types";

export function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-accent px-4 py-2.5 text-sm text-accent-fg">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-fg">
        <Sparkles size={16} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
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
