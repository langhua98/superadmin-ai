"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import type { ChatAction, ChatState } from "@/types";

const STORAGE_KEY = "superadmin-ai:chat-state";

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "CREATE_CONVERSATION":
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
        activeConversationId: action.payload.id,
      };

    case "SET_ACTIVE":
      return { ...state, activeConversationId: action.payload };

    case "ADD_MESSAGE":
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id !== action.payload.conversationId
            ? conv
            : {
                ...conv,
                messages: [...conv.messages, action.payload.message],
                updatedAt: Date.now(),
              },
        ),
      };

    case "UPDATE_MESSAGE":
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id !== action.payload.conversationId
            ? conv
            : {
                ...conv,
                messages: conv.messages.map((msg) =>
                  msg.id !== action.payload.messageId
                    ? msg
                    : {
                        ...msg,
                        content: action.payload.content,
                        isStreaming: action.payload.isStreaming,
                      },
                ),
                updatedAt: Date.now(),
              },
        ),
      };

    case "UPDATE_TITLE":
      return {
        ...state,
        conversations: state.conversations.map((conv) =>
          conv.id !== action.payload.conversationId
            ? conv
            : { ...conv, title: action.payload.title },
        ),
      };

    case "DELETE_CONVERSATION": {
      const conversations = state.conversations.filter(
        (conv) => conv.id !== action.payload,
      );
      const activeConversationId =
        state.activeConversationId === action.payload
          ? (conversations[0]?.id ?? null)
          : state.activeConversationId;
      return { ...state, conversations, activeConversationId };
    }

    default:
      return state;
  }
}

interface ChatContextValue {
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  // 首次挂载时从 localStorage 恢复状态
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatState;
        // 恢复时清除任何残留的流式标记
        parsed.conversations.forEach((conv) =>
          conv.messages.forEach((msg) => {
            msg.isStreaming = false;
          }),
        );
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // 解析失败则忽略，使用初始状态
    }
  }, []);

  // 状态变化时持久化到 localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChatContext 必须在 ChatProvider 内部使用");
  }
  return ctx;
}
