"use client";

import { useRef, useState } from "react";
import { Menu, X, PenSquare } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { ClaudeLogo } from "@/components/ClaudeLogo";
import { useChat } from "@/hooks/useChat";

gsap.registerPlugin(useGSAP);

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { newConversation } = useChat();
  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // GSAP 控制侧边栏滑入/滑出 + 遮罩淡入/淡出
  useGSAP(() => {
    const sidebar = sidebarRef.current;
    const overlay = overlayRef.current;
    if (!sidebar || !overlay) return;

    if (sidebarOpen) {
      // 显示遮罩
      gsap.set(overlay, { display: "block" });
      gsap.to(overlay, { autoAlpha: 1, duration: 0.25, ease: "power2.out" });
      // 侧边栏滑入
      gsap.to(sidebar, { x: 0, duration: 0.32, ease: "power3.out" });
    } else {
      // 侧边栏滑出
      gsap.to(sidebar, { x: "-100%", duration: 0.28, ease: "power3.in" });
      // 遮罩淡出后隐藏
      gsap.to(overlay, {
        autoAlpha: 0, duration: 0.22, ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }
  }, { dependencies: [sidebarOpen] });

  return (
    <div className="flex h-screen overflow-hidden bg-base text-primary">
      {/* 移动端遮罩（GSAP 控制显隐） */}
      <div
        ref={overlayRef}
        onClick={() => setSidebarOpen(false)}
        className="fixed inset-0 z-20 hidden bg-black/30 md:hidden"
        aria-hidden
      />

      {/* 侧边栏：初始位置 x:-100%，GSAP 控制 */}
      <aside
        ref={sidebarRef}
        className="fixed inset-y-0 left-0 z-30 w-72 -translate-x-full border-r border-border bg-surface md:static md:w-64 md:translate-x-0"
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* 主区域 */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* 移动端顶栏 */}
        <div className="flex h-14 items-center border-b border-border px-1 md:hidden">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-hover active:bg-hover"
            aria-label="菜单"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="flex flex-1 items-center justify-center gap-2">
            <ClaudeLogo size={20} className="text-accent" />
            <span className="font-display text-[17px] text-primary">Claude</span>
          </div>

          <button
            onClick={() => { newConversation(); setSidebarOpen(false); }}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-hover active:bg-hover"
            aria-label="新建对话"
          >
            <PenSquare size={20} />
          </button>
        </div>

        <ChatArea />
      </main>
    </div>
  );
}
