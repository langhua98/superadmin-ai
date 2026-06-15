"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ChevronDown, Check } from "lucide-react";

gsap.registerPlugin(useGSAP);

const MODELS = [
  { id: "claude-haiku-4-5",  name: "Claude Haiku 4.5",  desc: "快速轻量" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", desc: "均衡首选" },
  { id: "claude-opus-4-8",   name: "Claude Opus 4.8",   desc: "最强大" },
];

export function ModelSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(MODELS[1]);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);

  // 点击外部关闭
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // GSAP 控制下拉动画 + 箭头旋转
  useGSAP(() => {
    if (!dropRef.current) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (open) {
        gsap.set(dropRef.current, { display: "block" });
        gsap.fromTo(dropRef.current,
          { autoAlpha: 0, y: -8, scale: 0.96, transformOrigin: "top right" },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.2, ease: "power2.out" },
        );
        gsap.to(chevronRef.current, { rotation: 180, duration: 0.2, ease: "power2.inOut" });
      } else {
        gsap.to(dropRef.current, {
          autoAlpha: 0, y: -4, scale: 0.98, duration: 0.15, ease: "power2.in",
          onComplete: () => gsap.set(dropRef.current, { display: "none" }),
        });
        gsap.to(chevronRef.current, { rotation: 0, duration: 0.2, ease: "power2.inOut" });
      }
    });
    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(dropRef.current, { display: open ? "block" : "none", autoAlpha: open ? 1 : 0 });
      gsap.set(chevronRef.current, { rotation: open ? 180 : 0 });
    });
  }, { scope: wrapRef, dependencies: [open] });

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex h-9 items-center gap-1 rounded-full border border-border px-3 text-[13px] text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
      >
        <span className="max-w-[110px] truncate">{selected.name}</span>
        <ChevronDown ref={chevronRef} size={13} />
      </button>

      {/* 下拉菜单：初始隐藏，GSAP 控制 */}
      <div
        ref={dropRef}
        className="absolute bottom-full right-0 mb-2 hidden w-56 overflow-hidden rounded-xl border border-border bg-elevated shadow-lg"
      >
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
    </div>
  );
}
