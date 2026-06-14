/**
 * 模拟流式输出：逐字（块）显示文本，营造打字机效果。
 * @returns 清理函数，用于在组件卸载或切换对话时中止流式输出
 */
export function simulateStream(
  text: string,
  onChunk: (partial: string) => void,
  onDone: () => void,
  charsPerTick = 3,
  intervalMs = 16,
): () => void {
  let index = 0;

  const id = setInterval(() => {
    if (index >= text.length) {
      clearInterval(id);
      onDone();
      return;
    }
    index = Math.min(index + charsPerTick, text.length);
    onChunk(text.slice(0, index));
  }, intervalMs);

  return () => clearInterval(id);
}
