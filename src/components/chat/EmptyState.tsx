"use client";

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
    <div className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center gap-5 px-5 pb-20">
      {/* 大号问候语 — 和 Claude 一样，纯文字，衬线，居中 */}
      <h1 className="font-display text-center text-[2rem] font-normal leading-tight text-primary sm:text-[2.4rem]">
        {greeting()}
      </h1>

      {/* 输入框 */}
      <InputBar onSend={onPick} placeholder="给 Claude 发消息…" />

      {/* 建议气泡 */}
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            onClick={() => onPick(text)}
            className="min-h-[40px] rounded-full border border-border bg-elevated px-4 py-2 text-sm text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
