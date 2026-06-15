"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MODELS = [
  { id: "claude-haiku-4-5",  name: "Claude Haiku 4.5",  desc: "快速轻量" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", desc: "均衡首选" },
  { id: "claude-opus-4-8",   name: "Claude Opus 4.8",   desc: "最强大" },
];

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(MODELS[1]);
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex h-9 items-center gap-1 rounded-full border border-border px-3 text-[13px] text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
      >
        <span className="max-w-[110px] truncate">{selected.name}</span>
        <ChevronDown size={13} className={cn("transition-transform duration-150", open && "rotate-180")} />
      </button>

      {open && (
        <div className="dropdown-in absolute bottom-full right-0 mb-2 w-56 overflow-hidden rounded-xl border border-border bg-elevated shadow-lg">
          {MODELS.map(m => (
            <button
              key={m.id}
              onClick={() => { setSelected(m); setOpen(false); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-hover"
            >
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">{m.name}</p>
                <p className="text-xs text-muted">{m.desc}</p>
              </div>
              {selected.id === m.id && <Check size={15} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
