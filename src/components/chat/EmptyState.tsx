"use client";

import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "用 TypeScript 写一个快速排序",
  "解释一下 JavaScript 闭包",
  "对比 Python 和 Rust 的优缺点",
  "React 状态管理有哪些方案？",
];

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-fg">
        <Sparkles size={28} />
      </div>
      <h1 className="mb-8 text-2xl font-semibold text-primary">
        今天我能帮你什么？
      </h1>
      <div className="grid w-full max-w-xl grid-cols-1 gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onPick(text)}
            className="rounded-xl border border-border bg-surface px-4 py-3 text-left text-sm text-primary transition-colors hover:bg-hover"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
