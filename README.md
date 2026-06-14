# SuperAdmin AI — Claude 风格聊天 UI

一个仿 [Claude.ai](https://claude.ai) 的 AI 聊天界面，使用 Next.js 14 + TypeScript + Tailwind CSS 构建。**纯 UI 演示**，回复内容为模拟数据，逐字流式输出，无需真实 AI 后端。

## 功能特性

- 💬 **聊天对话界面** —— 支持 Markdown 渲染（代码高亮、表格、列表、引用等）
- 📚 **对话历史侧边栏** —— 新建、切换、删除对话，自动生成标题
- ⌨️ **模拟流式输出** —— 助手回复逐字显示的打字机效果
- 🌗 **深色 / 浅色主题** —— 一键切换，自动持久化到 localStorage
- 📱 **响应式布局** —— 移动端侧边栏可收起

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 框架 | Next.js 14（App Router） |
| 语言 | TypeScript |
| 样式 | Tailwind CSS |
| 主题 | next-themes |
| Markdown | react-markdown + remark-gfm |
| 代码高亮 | react-syntax-highlighter |
| 图标 | lucide-react |

## 快速开始

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看效果。

## 项目结构

```
src/
├── app/              # Next.js 路由、布局、全局样式
├── components/
│   ├── layout/       # AppShell、主题切换
│   ├── sidebar/      # 对话历史侧边栏
│   └── chat/         # 聊天区、消息气泡、输入栏、Markdown 渲染
├── context/          # ChatContext（useReducer + localStorage 持久化）
├── hooks/            # useChat（发送 + 流式）、useAutoScroll
├── lib/              # 流式模拟器、模拟回复、工具函数
└── types/            # TypeScript 类型定义
```

## 接入真实 AI

当前回复来自 `src/lib/mockResponses.ts` 的随机模拟数据。若需对接真实模型，可在 `src/hooks/useChat.ts` 中将 `simulateStream` 替换为对 Anthropic API（推荐 Claude 系列模型）的流式请求。
