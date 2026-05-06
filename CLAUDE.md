# LLM Visualizer 项目说明

## 项目背景

这是一个面向 LLM 入门用户的可视化交互科普网站。目标是让小白通过交互理解 LLM 内部工作原理，同时为产品经理（项目作者）的 AI 应用方向求职提供作品集。

完整需求见 `docs/PRD.md`。

## 项目目标优先级

- **P0 · 求职展示**：向 AI 应用方向招聘方证明 PM 对 LLM 机制的理解深度
- **P1 · 帮朋友入门**：为无技术背景的朋友提供友好的入门入口
- **P2 · 自我汇总**：作为作者本人的学习沉淀

## 关键设计原则（不可违反）

1. **绝对严谨**——不允许事实错误。所有为了易懂而做的简化必须明确标注。
2. **纯静态网站**——无后端、无运行时 API 调用。所有"需要模型数据"的部分都通过预生成 JSON 实现。
3. **三层阅读路径**——导览模式（招聘方）/ 入门模式（朋友）/ 深入模式（已入门），共享同一套交互 demo。
4. **统一交互骨架**——用户的输入文本贯穿整个工作流程主线（v0.1 暂用预设例子，但架构要为后续自定义输入预留接口）。

## 技术栈

- **框架**：Next.js（App Router，静态导出模式）
- **语言**：TypeScript
- **样式**：Tailwind CSS
- **可视化**：Recharts（先用这个，效果不满意再换 D3 或纯 SVG）
- **Tokenization**：js-tiktoken（前端运行）
- **状态管理**：React 内置 hooks（不用 Redux）
- **动画**：Framer Motion（按需引入）
- **数据**：预生成 JSON，存放于 `public/data/`
- **用户数据**：localStorage（学习进度）
- **统计**：暂不接入，后续考虑 Plausible 或 Umami
- **部署目标**：Cloudflare Pages（暂定）

## 项目目录结构

```
llm-visualizer/
├── CLAUDE.md                  # 本文件
├── README.md
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── docs/                      # 项目文档
│   ├── PRD.md                 # 完整产品需求
│   ├── Sampling-DevSpec.md    # 当前模块开发蓝图
│   └── ...                    # 后续模块开发蓝图
├── scripts/                   # 数据生成等辅助脚本
│   └── generate-sampling-data.py
├── public/
│   └── data/
│       └── sampling/          # Sampling 模块预生成数据
│           ├── index.json
│           └── {example_id}.json
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── page.tsx           # 首页
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── sampling/
│   │       └── page.tsx       # Sampling 模块页面
│   ├── components/
│   │   ├── shared/            # 跨模块共享组件
│   │   └── sampling/          # Sampling 模块专用组件
│   ├── lib/
│   │   └── sampling-math.ts   # 核心数学函数
│   └── styles/
└── .env.local                 # OpenAI API Key（不提交 git；仅供 scripts/ 下数据生成脚本使用，网站运行时不读取）
```

## 当前开发阶段

正在开发 **Sampling 模块**（MVP 第一个模块）。其他 7 个模块（Tokenization / Embedding / Positional Encoding / Transformer / 输出层 / Detokenization / Prompt 结构）尚未开始。

## 工作准则

1. **写代码前先读相关文档**——尤其是 `docs/Sampling-DevSpec.md`，它包含了所有交互细节、数学公式、组件骨架建议
2. **数学公式不能错**——`docs/Sampling-DevSpec.md` 第 6.3 节的 temperature 公式严格成立的前提是数据生成时使用 `temperature=1.0`，请严格遵守
3. **事实陈述必须有依据**——所有展示给用户的数字（如 token 价格、上下文窗口大小）不能凭印象写，要么标注来源，要么用占位符让作者自己填
4. **文案中的简化必须明确标注**——任何为了易懂做的近似都要在 UI 上明确说明这是简化版
5. **UI 文字默认中文**
6. **代码注释也写中文**——便于作者本人阅读维护
7. **遇到不确定的决策点请询问而不是猜测**——尤其是涉及视觉风格、文案语气、产品取舍的部分

## 协作风格

- **优先级**：可工作 > 优雅；MVP > 完美
- **对每一段较长的代码生成**：先简短解释你要做什么，再写代码
- **遇到工程层面的决策**（比如选用哪个库、文件结构怎么放）：可以直接做决定，但要说明理由
- **遇到产品层面的决策**（比如交互细节、文案）：停下来询问

## 关于作者

- 产品经理，新手开发者
- 会简单的 Python 和 SQL，不会复杂前端代码
- 这个项目主要是为 AI 应用方向求职做的作品集
- 喜欢清晰的解释和直接的方案
- 不喜欢苏格拉底式提问——遇到具体问题请直接给答案

## 不在范围内的事

以下事项不要在当前阶段处理：

- 训练流程相关内容（属于第二期）
- 用户自定义输入（v0.1 仅用预设例子，但架构要预留接口）
- 用户自由路径的连续生成（v0.1 第一步基于真实分布按温度采样，第二步起按预生成的 greedy 路径演示——见 docs/Sampling-DevSpec.md 第 6.7 节）
- 后端服务（项目坚持纯静态）
- SEO、性能优化、可访问性的精细调优（先做出来，后期迭代）