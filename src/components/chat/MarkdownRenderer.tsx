"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { Check, Copy } from "lucide-react";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handle}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-white/10 hover:text-primary"
      aria-label="复制代码"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? "已复制" : "复制"}</span>
    </button>
  );
}

export function MarkdownRenderer({ content }: { content: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const codeStyle = isDark ? oneDark : oneLight;

  return (
    <div className="prose prose-sm max-w-none leading-relaxed text-primary
      prose-headings:text-primary prose-headings:font-semibold
      prose-p:text-primary prose-p:leading-relaxed
      prose-strong:text-primary prose-strong:font-semibold
      prose-li:text-primary prose-li:leading-relaxed
      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
      prose-blockquote:border-l-2 prose-blockquote:border-border prose-blockquote:text-muted prose-blockquote:not-italic
      prose-table:text-primary prose-th:text-primary prose-th:font-semibold
      prose-hr:border-border
      prose-pre:my-3 prose-pre:bg-transparent prose-pre:p-0
      prose-code:text-primary prose-code:font-normal">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");

            if (!match) {
              return (
                <code
                  className="rounded-md bg-hover px-1.5 py-0.5 font-mono text-[0.85em] text-primary"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <div className="group relative my-3 overflow-hidden rounded-xl border border-border">
                {/* 代码块顶栏：语言标签 + 复制按钮 */}
                <div className="flex items-center justify-between border-b border-border bg-hover px-4 py-2">
                  <span className="font-mono text-xs text-muted">{match[1]}</span>
                  <CopyButton code={codeString} />
                </div>
                <SyntaxHighlighter
                  style={codeStyle}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    padding: "1rem",
                    borderRadius: 0,
                    fontSize: "0.84rem",
                    lineHeight: "1.6",
                    background: isDark ? "#1e1e1e" : "#f8f8f6",
                  }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },
          // 表格加横向滚动容器
          table({ children }) {
            return (
              <div className="my-3 overflow-x-auto rounded-xl border border-border">
                <table className="w-full">{children}</table>
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
