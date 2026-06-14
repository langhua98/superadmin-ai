"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatContext } from "@/context/ChatContext";
import { simulateStream } from "@/lib/streamSimulator";
import { pickMockResponse } from "@/lib/mockResponses";
import { makeTitle, uid } from "@/lib/utils";
import type { Conversation, Message } from "@/types";

export function useChat() {
  const { state, dispatch } = useChatContext();
  const cleanupRef = useRef<(() => void) | null>(null);

  // 卸载时中止任何进行中的流式输出
  useEffect(() => {
    return () => cleanupRef.current?.();
  }, []);

  const newConversation = useCallback((): string => {
    const conv: Conversation = {
      id: uid(),
      title: "新对话",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: "CREATE_CONVERSATION", payload: conv });
    return conv.id;
  }, [dispatch]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      // 中止上一条仍在流式输出的回复
      cleanupRef.current?.();

      // 确定目标对话（无激活对话则新建）
      const isNew = !state.activeConversationId;
      const conversationId = state.activeConversationId ?? uid();
      if (isNew) {
        const conv: Conversation = {
          id: conversationId,
          title: makeTitle(trimmed),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        dispatch({ type: "CREATE_CONVERSATION", payload: conv });
      }

      // 1. 立即追加用户消息
      const userMsg: Message = {
        id: uid(),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
      };
      dispatch({ type: "ADD_MESSAGE", payload: { conversationId, message: userMsg } });

      // 如对话已存在但仍是默认标题，则用首条消息更新标题
      if (!isNew) {
        const conv = state.conversations.find((c) => c.id === conversationId);
        if (conv && conv.messages.length === 0) {
          dispatch({
            type: "UPDATE_TITLE",
            payload: { conversationId, title: makeTitle(trimmed) },
          });
        }
      }

      // 2. 追加空的助手占位消息
      const assistantMsg: Message = {
        id: uid(),
        role: "assistant",
        content: "",
        isStreaming: true,
        createdAt: Date.now(),
      };
      dispatch({
        type: "ADD_MESSAGE",
        payload: { conversationId, message: assistantMsg },
      });

      // 3. 模拟流式输出
      const responseText = pickMockResponse();
      cleanupRef.current = simulateStream(
        responseText,
        (partial) =>
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: {
              conversationId,
              messageId: assistantMsg.id,
              content: partial,
              isStreaming: true,
            },
          }),
        () => {
          dispatch({
            type: "UPDATE_MESSAGE",
            payload: {
              conversationId,
              messageId: assistantMsg.id,
              content: responseText,
              isStreaming: false,
            },
          });
          cleanupRef.current = null;
        },
      );
    },
    [state.activeConversationId, state.conversations, dispatch],
  );

  return { sendMessage, newConversation };
}
