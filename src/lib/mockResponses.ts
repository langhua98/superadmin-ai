/**
 * 模拟的助手回复内容。覆盖多种 Markdown 特性：
 * 代码块、列表、表格、加粗、引用等，便于展示渲染效果。
 * 真实场景下应替换为对接 Anthropic API 的流式响应。
 */
const MOCK_RESPONSES: string[] = [
  `当然可以！这是一个用 **TypeScript** 编写的快速排序示例：

\`\`\`typescript
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const [pivot, ...rest] = arr;
  const left = rest.filter((n) => n < pivot);
  const right = rest.filter((n) => n >= pivot);
  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([5, 2, 9, 1, 7])); // [1, 2, 5, 7, 9]
\`\`\`

它的平均时间复杂度是 \`O(n log n)\`。还需要我解释其中的递归逻辑吗？`,

  `很好的问题！React 中的状态管理可以分为几个层次：

1. **组件本地状态** —— 使用 \`useState\`，适合单个组件
2. **跨组件共享** —— 使用 \`Context\` + \`useReducer\`
3. **全局复杂状态** —— 使用 Zustand、Redux 等库

> 经验法则：先从最简单的方案开始，只在真正需要时才引入更重的工具。

对于中小型应用，\`Context\` 通常就足够了。`,

  `这是几种常见编程语言的对比：

| 语言       | 类型系统 | 主要用途           | 上手难度 |
| ---------- | -------- | ------------------ | -------- |
| Python     | 动态     | 数据科学、脚本     | ⭐        |
| TypeScript | 静态     | Web 前端、全栈     | ⭐⭐       |
| Rust       | 静态     | 系统编程、高性能   | ⭐⭐⭐⭐     |
| Go         | 静态     | 后端服务、云原生   | ⭐⭐       |

每种语言都有其适用场景，选择时应结合团队经验和项目需求。`,

  `让我帮你梳理一下这个概念。

**闭包（Closure）** 是指函数能够记住并访问其词法作用域，即使该函数在其作用域之外执行。

\`\`\`javascript
function counter() {
  let count = 0;
  return () => ++count;
}

const next = counter();
next(); // 1
next(); // 2
\`\`\`

这里返回的箭头函数"捕获"了 \`count\` 变量，每次调用都能访问并修改它。这正是闭包的核心价值所在。`,

  `没问题，下面是实现这个功能的几个关键步骤：

- 首先，明确输入和输出的数据结构
- 其次，处理边界情况（空值、异常输入）
- 然后，编写核心逻辑并保持函数纯粹
- 最后，补充单元测试覆盖主要路径

如果你能提供更具体的需求，我可以给出更贴合的代码实现。`,

  `这是一个很有深度的话题。简单来说：

异步编程让程序在等待耗时操作（如网络请求、文件读取）时不会阻塞主线程。在 JavaScript 中，主要通过 \`Promise\` 和 \`async/await\` 实现：

\`\`\`javascript
async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error("请求失败");
  return res.json();
}
\`\`\`

\`await\` 会"暂停"函数执行直到 Promise 完成，但不会阻塞整个程序，这就是它的精妙之处。`,
];

/** 随机返回一条模拟回复 */
export function pickMockResponse(): string {
  return MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
}
