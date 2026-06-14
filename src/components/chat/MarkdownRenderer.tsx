"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

export function MarkdownRenderer({ content }: { content: string }) {
  const { resolvedTheme } = useTheme();
  const codeStyle = resolvedTheme === "dark" ? oneDark : oneLight;

  return (
    <div className="prose prose-sm max-w-none text-[15px] leading-relaxed text-primary prose-headings:text-primary prose-p:text-primary prose-strong:text-primary prose-li:text-primary prose-a:text-accent prose-blockquote:border-l-accent/40 prose-blockquote:text-muted prose-table:text-primary prose-th:text-primary prose-pre:my-2 prose-pre:bg-transparent prose-pre:p-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            // react-markdown v9 不再传 inline 属性：有语言标记即视为代码块
            return match ? (
              <SyntaxHighlighter
                style={codeStyle}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  borderRadius: "0.5rem",
                  fontSize: "0.85rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="rounded bg-hover px-1.5 py-0.5 font-mono text-[0.85em]"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
