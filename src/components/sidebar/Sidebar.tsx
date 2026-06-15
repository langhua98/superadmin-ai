"use client";

import { useState } from "react";
import { PenSquare, Search, X } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useChat } from "@/hooks/useChat";
import { ClaudeLogo } from "@/components/ClaudeLogo";
import { ConversationItem } from "./ConversationItem";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface Props {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: Props) {
  const { state, dispatch } = useChatContext();
  const { newConversation } = useChat();
  const [query, setQuery] = useState("");

  const handleNew = () => {
    newConversation();
    setQuery("");
    onNavigate?.();
  };

  const filtered = query.trim()
    ? state.conversations.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase())
      )
    : state.conversations;

  return (
    <div className="flex h-full flex-col">
      {/* 顶部 Logo */}
      <div className="flex items-center justify-between px-4 pb-1 pt-5">
        <div className="flex items-center gap-2">
          <ClaudeLogo size={20} className="text-accent" animate />
          <span className="font-display text-[17px] text-primary">Claude</span>
        </div>
        <button
          onClick={handleNew}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-colors hover:bg-hover hover:text-primary active:bg-hover"
          aria-label="新建对话"
        >
          <PenSquare size={18} />
        </button>
      </div>

      {/* 搜索框 */}
      <div className="px-3 pt-3">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-elevated px-3 py-2">
          <Search size={14} className="shrink-0 text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索对话"
            className="flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-muted"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-muted hover:text-primary">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 对话列表 */}
      <div className="mt-3 flex-1 overflow-hidden">
        {!query && <p className="px-5 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted">最近</p>}
        <nav className="scrollbar-thin h-full space-y-0.5 overflow-y-auto px-2 pb-4">
          {filtered.length === 0 ? (
            <p className="px-3 py-3 text-xs text-muted">
              {query ? "未找到相关对话" : "暂无对话记录"}
            </p>
          ) : (
            filtered.map(conv => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                active={conv.id === state.activeConversationId}
                onSelect={() => {
                  dispatch({ type: "SET_ACTIVE", payload: conv.id });
                  onNavigate?.();
                }}
                onDelete={() => dispatch({ type: "DELETE_CONVERSATION", payload: conv.id })}
              />
            ))
          )}
        </nav>
      </div>

      {/* 底部主题切换 */}
      <div className="border-t border-border p-2">
        <ThemeToggle />
      </div>
    </div>
  );
}
