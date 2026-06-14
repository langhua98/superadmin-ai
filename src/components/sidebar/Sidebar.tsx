"use client";

import { PenSquare } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useChat } from "@/hooks/useChat";
import { ClaudeLogo } from "@/components/ClaudeLogo";
import { ConversationItem } from "./ConversationItem";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface Props {
  /** 移动端选择后关闭侧边栏 */
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: Props) {
  const { state, dispatch } = useChatContext();
  const { newConversation } = useChat();

  const handleNew = () => {
    newConversation();
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col">
      {/* 顶部品牌 */}
      <div className="flex items-center gap-2 px-4 pb-2 pt-4">
        <ClaudeLogo size={22} className="text-accent" />
        <span className="font-display text-lg text-primary">SuperAdmin</span>
      </div>

      {/* 新建对话 */}
      <div className="px-3 pt-2">
        <button
          onClick={handleNew}
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-accent transition-colors hover:bg-hover"
        >
          <PenSquare size={17} />
          新建对话
        </button>
      </div>

      {/* 对话列表 */}
      <div className="mt-4 flex-1 overflow-hidden">
        <p className="px-5 pb-1 text-xs font-medium text-muted">最近</p>
        <nav className="scrollbar-thin h-full space-y-0.5 overflow-y-auto px-3 pb-4">
          {state.conversations.length === 0 ? (
            <p className="px-2.5 py-2 text-xs text-muted">暂无对话记录</p>
          ) : (
            state.conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conversation={conv}
                active={conv.id === state.activeConversationId}
                onSelect={() => {
                  dispatch({ type: "SET_ACTIVE", payload: conv.id });
                  onNavigate?.();
                }}
                onDelete={() =>
                  dispatch({ type: "DELETE_CONVERSATION", payload: conv.id })
                }
              />
            ))
          )}
        </nav>
      </div>

      {/* 底部：主题切换 */}
      <div className="border-t border-border p-3">
        <ThemeToggle />
      </div>
    </div>
  );
}
