"use client";

import { useEffect, useRef } from "react";

/**
 * 当依赖项变化时（新消息或流式内容增长），平滑滚动到底部哨兵元素。
 */
export function useAutoScroll<T>(deps: T) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [deps]);

  return bottomRef;
}
