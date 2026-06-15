"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { InputBar } from "./InputBar";

gsap.registerPlugin(useGSAP);

const SUGGESTIONS = [
  "用 TypeScript 写一个快速排序",
  "解释一下 JavaScript 闭包",
  "对比 Python 和 Rust 的优缺点",
  "React 状态管理有哪些方案？",
];

function greeting(): string {
  const h = new Date().getHours();
  if (h >= 5  && h < 11) return "早上好";
  if (h >= 11 && h < 13) return "中午好";
  if (h >= 13 && h < 18) return "下午好";
  return "晚上好";
}

export function EmptyState({ onPick }: { onPick: (text: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // 问候语 — 从下方淡入
      gsap.from("[data-anim='greeting']", {
        y: 28, autoAlpha: 0, duration: 0.7, ease: "power3.out",
      });
      // 输入框 — 稍后跟上
      gsap.from("[data-anim='input']", {
        y: 18, autoAlpha: 0, duration: 0.55, delay: 0.14, ease: "power2.out",
      });
      // 建议气泡 — 依次错开
      gsap.from("[data-anim='suggestion']", {
        y: 10, autoAlpha: 0, stagger: 0.07, duration: 0.4, delay: 0.26, ease: "power2.out",
      });
    });
    // 关闭动画偏好时：直接显示（autoAlpha 保持）
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set("[data-anim='greeting'],[data-anim='input'],[data-anim='suggestion']", {
        autoAlpha: 1, y: 0,
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-[680px] flex-1 flex-col justify-center gap-5 px-5 pb-20"
    >
      <h1
        data-anim="greeting"
        className="font-display text-center text-[2.1rem] font-normal leading-tight text-primary sm:text-[2.5rem]"
      >
        {greeting()}
      </h1>

      <div data-anim="input">
        <InputBar onSend={onPick} placeholder="给 Claude 发消息…" />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            data-anim="suggestion"
            onClick={() => onPick(text)}
            className="min-h-[40px] rounded-full border border-border bg-elevated px-4 py-2 text-sm text-muted hover:bg-hover hover:text-primary active:scale-95"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
