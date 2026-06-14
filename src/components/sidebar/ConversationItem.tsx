"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types";

interface Props {
  conversation: Conversation;
  active: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConversationItem({ conversation, active, onSelect, onDelete }: Props) {
  return (
    <div
      onClick={onSelect}
      className={cn(
        "group flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        active ? "bg-hover text-primary" : "text-muted hover:bg-hover hover:text-primary",
      )}
    >
      <span className="flex-1 truncate">{conversation.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 rounded p-1 text-muted opacity-0 transition-opacity hover:text-primary group-hover:opacity-100"
        aria-label="删除对话"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
