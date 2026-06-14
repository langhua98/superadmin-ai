"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-base text-primary">
      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* 侧边栏：桌面端常驻，移动端滑入 */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform border-r border-border bg-surface transition-transform duration-200 md:static md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      {/* 主区域 */}
      <main className="flex min-w-0 flex-1 flex-col">
        {/* 移动端顶栏 */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2 md:hidden">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-md p-2 text-muted transition-colors hover:bg-hover"
            aria-label="切换侧边栏"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="text-sm font-medium">SuperAdmin AI</span>
        </div>

        <ChatArea />
      </main>
    </div>
  );
}
