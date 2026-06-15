"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { ClaudeLogo } from "@/components/ClaudeLogo";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { Message } from "@/types";

function CopyMsgButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-hover hover:text-primary"
      aria-label="复制消息"
    >
      {copied ? <Check size={15} className="text-accent" /> : <Copy size={15} />}
    </button>
  );
}

export function MessageBubble({ message }: { message: Message }) {
  if (message.role === "user") {
    return (
      <div className="group message-in flex items-end justify-end gap-2">
        <CopyMsgButton text={message.content} />
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-[20px] rounded-br-[6px] bg-userbubble px-4 py-3 text-[16px] leading-relaxed text-primary">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="group message-in">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
          <ClaudeLogo size={18} className="text-accent" />
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
      {/* 操作按钮：消息完成后悬浮显示 */}
      {!message.isStreaming && message.content && (
        <div className="ml-11 mt-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <CopyMsgButton text={message.content} />
        </div>
      )}
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
