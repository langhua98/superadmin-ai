"use client";

import { useState } from "react";
import { Menu, X, PenSquare } from "lucide-react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { ClaudeLogo } from "@/components/ClaudeLogo";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { newConversation } = useChat();

  return (
    <div className="flex h-screen overflow-hidden bg-base text-primary">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 transform border-r border-border bg-surface transition-transform duration-250 ease-in-out md:static md:w-64 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* 主区域 */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* 移动端顶栏 — 仿 Claude 居中布局 */}
        <div className="flex h-14 items-center border-b border-border px-1 md:hidden">
          {/* 左：汉堡 */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition-colors hover:bg-hover active:bg-hover"
            aria-label="菜单"
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* 中：Logo + 名称 */}
          <div className="flex flex-1 items-center justify-center gap-2">
            <ClaudeLogo size={20} className="text-accent" />
            <span className="font-display text-[17px] text-primary">Claude</span>
          </div>

          {/* 右：新建对话 */}
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
