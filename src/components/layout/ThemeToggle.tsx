"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 SSR 与客户端主题不一致导致的图标闪烁
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex min-h-[44px] w-full items-center gap-2.5 rounded-lg px-3 text-sm text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
      aria-label="切换主题"
    >
      {mounted && isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{mounted && isDark ? "浅色模式" : "深色模式"}</span>
    </button>
  );
}
