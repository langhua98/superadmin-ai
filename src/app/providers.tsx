"use client";

import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/context/ChatContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  );
}
