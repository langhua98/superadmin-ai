"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import { simulateStream } from "@/lib/streamSimulator";
import { pickMockResponse } from "@/lib/mockResponses";
import { makeTitle, uid } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

export function useChat() {
  const { state, dispatch } = useChatContext();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  /** 当前激活对话中是否有正在流式输出的消息 */
  const isStreaming = useMemo(() => {
    const active = state.conversations.find(c => c.id === state.activeConversationId);
    return active?.messages.some(m => m.isStreaming) ?? false;
  }, [state.conversations, state.activeConversationId]);

  const newConversation = useCallback((): string => {
    const conv: Conversation = {
      id: uid(), title: "新对话", messages: [],
      createdAt: Date.now(), updatedAt: Date.now(),
    };
    dispatch({ type: "CREATE_CONVERSATION", payload: conv });
    return conv.id;
  }, [dispatch]);

  /** 中止当前流式输出，保留已生成的内容 */
  const stopStreaming = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    const conv = state.conversations.find(c => c.id === state.activeConversationId);
    if (!conv) return;
    const streamingMsg = conv.messages.find(m => m.isStreaming);
    if (!streamingMsg) return;
    dispatch({
      type: "UPDATE_MESSAGE",
      payload: {
        conversationId: conv.id,
        messageId: streamingMsg.id,
        content: streamingMsg.content,
        isStreaming: false,
      },
    });
  }, [state.activeConversationId, state.conversations, dispatch]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      cleanupRef.current?.();

      const isNew = !state.activeConversationId;
      const conversationId = state.activeConversationId ?? uid();
      if (isNew) {
        const conv: Conversation = {
          id: conversationId, title: makeTitle(trimmed), messages: [],
          createdAt: Date.now(), updatedAt: Date.now(),
        };
        dispatch({ type: "CREATE_CONVERSATION", payload: conv });
      }

      const userMsg: Message = {
        id: uid(), role: "user", content: trimmed, createdAt: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: { conversationId, message: userMsg } });

      if (!isNew) {
        const conv = state.conversations.find(c => c.id === conversationId);
        if (conv && conv.messages.length === 0) {
          dispatch({ type: "UPDATE_TITLE", payload: { conversationId, title: makeTitle(trimmed) } });
        }
      }

      const assistantMsg: Message = {
        id: uid(), role: "assistant", content: "", isStreaming: true, createdAt: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: { conversationId, message: assistantMsg } });

      const responseText = pickMockResponse();
      cleanupRef.current = simulateStream(
        responseText,
        (partial) => dispatch({
          type: "UPDATE_MESSAGE",
          payload: { conversationId, messageId: assistantMsg.id, content: partial, isStreaming: true },
        }),
        () => {
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: { conversationId, messageId: assistantMsg.id, content: responseText, isStreaming: false },
          });
          cleanupRef.current = null;
        },
      );
    },
    [state.activeConversationId, state.conversations, dispatch],
  );

  return { sendMessage, newConversation, stopStreaming, isStreaming };
}
