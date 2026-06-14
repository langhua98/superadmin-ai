"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
}

export function InputBar({ onSend }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  return (
    <div className="px-4 pb-4">
      <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-border bg-surface p-2 shadow-sm focus-within:border-accent">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            autoGrow();
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="给 SuperAdmin AI 发送消息…"
          className="scrollbar-thin max-h-[200px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-primary outline-none placeholder:text-muted"
        />
        <button
          onClick={submit}
          disabled={!value.trim()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-fg transition-opacity disabled:opacity-30"
          aria-label="发送"
        >
          <ArrowUp size={18} />
        </button>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted">
        这是 UI 演示，回复内容为模拟数据。
      </p>
    </div>
  );
}
