"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp, Plus, ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onSend: (text: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function InputBar({ onSend, placeholder = "给 Claude 发消息…", autoFocus }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasText = value.trim().length > 0;

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  };

  return (
    <div className="rounded-[1.5rem] border border-border bg-elevated p-3 shadow-sm transition-shadow focus-within:shadow-md">
      <textarea
        ref={textareaRef}
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => {
          setValue(e.target.value);
          autoGrow();
        }}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder={placeholder}
        className="scrollbar-thin max-h-[220px] w-full resize-none bg-transparent px-2 py-1 text-[15px] leading-relaxed text-primary outline-none placeholder:text-muted"
      />
      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-hover hover:text-primary"
            aria-label="添加附件"
          >
            <Plus size={17} />
          </button>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-hover hover:text-primary"
            aria-label="工具"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-[13px] text-muted transition-colors hover:bg-hover hover:text-primary">
            Claude Sonnet 4.6
            <ChevronDown size={14} />
          </button>
          <button
            onClick={submit}
            disabled={!hasText}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all",
              hasText
                ? "bg-accent text-accent-fg hover:opacity-90"
                : "bg-hover text-muted",
            )}
            aria-label="发送"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
