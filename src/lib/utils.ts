import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 className，处理 Tailwind 冲突 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 生成唯一 ID，兼容无 crypto.randomUUID 的环境 */
export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** 根据首条用户消息生成对话标题 */
export function makeTitle(text: string): string {
  const trimmed = text.trim().replace(/\s+/g, " ");
  return trimmed.length > 40 ? `${trimmed.slice(0, 40)}…` : trimmed || "新对话";
}
