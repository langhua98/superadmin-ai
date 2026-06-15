"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Square, Paperclip, Search } from "lucide-react";
import { ModelSelector } from "@/components/ui/ModelSelector";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (text: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
}

export function InputBar({
  onSend, onStop, isStreaming = false,
  placeholder = "给 Claude 发消息…", autoFocus,
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  const submit = () => {
    const text = value.trim();
    if (!text || isStreaming) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isStreaming) { onStop?.(); return; }
      submit();
    }
  };

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="rounded-3xl border border-border bg-elevated shadow-sm transition-all duration-150 focus-within:border-primary/30 focus-within:shadow-md">
      {/* 文本区 */}
      <div className="px-5 pt-4">
        <textarea
          ref={textareaRef}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => { setValue(e.target.value); autoGrow(); }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          className="scrollbar-thin max-h-[200px] w-full resize-none bg-transparent text-[16px] leading-relaxed text-primary outline-none placeholder:text-muted"
        />
      </div>

      {/* 底部工具栏 */}
      <div className="flex items-center justify-between px-3 pb-3 pt-1">
        {/* 左：附件 + 搜索 */}
        <div className="flex items-center gap-0.5">
          <button
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
            aria-label="添加附件"
          >
            <Paperclip size={18} />
            <span className="tooltip">添加附件</span>
          </button>
          <button
            className="group relative flex h-10 items-center gap-1.5 rounded-full px-3 text-sm text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
            aria-label="搜索"
          >
            <Search size={15} />
            <span>搜索</span>
          </button>
        </div>

        {/* 右：模型选择 + 发送/停止 */}
        <div className="flex items-center gap-2">
          <ModelSelector />

          {isStreaming ? (
            // 停止生成按钮
            <button
              onClick={onStop}
              className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary text-primary transition-all hover:bg-hover active:scale-95"
              aria-label="停止生成"
            >
              <Square size={14} fill="currentColor" />
            </button>
          ) : (
            // 发送按钮
            <button
              onClick={submit}
              disabled={!hasText}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-95",
                hasText
                  ? "bg-send-on text-base hover:opacity-80"
                  : "cursor-not-allowed bg-hover text-muted",
              )}
              aria-label="发送 (Enter)"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
