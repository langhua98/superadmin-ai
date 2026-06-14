"use client";

import { ClaudeLogo } from "@/components/ClaudeLogo";
import { InputBar } from "./InputBar";

const SUGGESTIONS = [
  "用 TypeScript 写一个快速排序",
  "解释一下 JavaScript 闭包",
  "对比 Python 和 Rust 的优缺点",
  "React 状态管理有哪些方案？",
];

function greeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return "早上好";
  if (h >= 11 && h < 13) return "中午好";
  if (h >= 13 && h < 18) return "下午好";
  return "晚上好";
}

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-4 pb-24">
      {/* 问候语 */}
      <div className="mb-7 flex items-center justify-center gap-3">
        <ClaudeLogo size={34} className="text-accent" />
        <h1 className="font-display text-[2.1rem] font-normal leading-none text-primary">
          {greeting()}
        </h1>
      </div>

      {/* 居中的大输入框 */}
      <InputBar onSend={onPick} autoFocus placeholder="今天我能帮你什么？" />

      {/* 建议 */}
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onPick(text)}
            className="min-h-[40px] rounded-full border border-border bg-base px-4 py-2 text-sm text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
