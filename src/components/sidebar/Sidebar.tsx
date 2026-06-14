"use client";

import { Plus, Sparkles } from "lucide-react";
import { useChatContext } from "@/context/ChatContext";
import { useChat } from "@/hooks/useChat";
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
      <div className="flex items-center gap-2 px-4 py-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-accent-fg">
          <Sparkles size={16} />
        </div>
        <span className="font-semibold">SuperAdmin AI</span>
      </div>

      {/* 新建对话 */}
      <div className="px-3">
        <button
          onClick={handleNew}
          className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-hover"
        >
          <Plus size={16} />
          新建对话
        </button>
      </div>

      {/* 对话列表 */}
      <nav className="scrollbar-thin mt-4 flex-1 space-y-1 overflow-y-auto px-3">
        {state.conversations.length === 0 ? (
          <p className="px-3 py-2 text-xs text-muted">暂无对话记录</p>
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

      {/* 底部：主题切换 */}
      <div className="border-t border-border p-3">
        <ThemeToggle />
      </div>
    </div>
  );
}
