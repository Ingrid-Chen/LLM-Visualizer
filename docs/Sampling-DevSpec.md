# Sampling 模块 · 开发蓝图（v0.1）

| 字段 | 内容 |
|---|---|
| 所属项目 | LLM Visualizer |
| 模块类型 | 重点模块 |
| 文档定位 | 开发蓝图（方案 B）—— 让 Claude Code 跑出第一个可玩版本，剩余细节边做边迭代 |
| 文档状态 | 初稿，待 v0.1 实现后回写更新 |

---

## 0. 给 Claude Code 的开工说明

如果你（Claude Code 或其他 AI 开发助手）正在读这份文档准备开工，请按以下顺序执行：

1. **先读完第 1、2、3 节**——理解模块要解决什么问题、用户路径长什么样
2. **执行第 4 节"数据准备"**——这是前置任务，不做这一步后面所有交互都是空壳
3. **按第 5 节搭建前端结构**——组件骨架、状态管理、路由
4. **按第 6 节实现核心交互**——这是模块的灵魂部分
5. **按第 7 节落地文案与视觉**——文案给的是"骨架句"，可以用更生动的表达替换；视觉是方向不是规范
6. **按第 8 节做完整性检查**——v0.1 不要求完美，但要可玩

特别提醒：**第 6.3 节的数学公式不能写错**。其他都可以迭代，唯独这个公式错了会让整个模块"在做错误的演示"，违背项目核心红线。

如果遇到这份文档没覆盖到的决策点，请优先选择**简单可玩**的方案，并在交付时列出所有"我自己决定的事项"清单，方便后续讨论调整。

---

## 1. 模块定位与目标

### 1.1 在整个网站中的位置

Sampling 是网站工作流程主线 8 个模块中的第 6 个，但作为 MVP 第一个实现的模块。它是整个网站最有可能产生"哇时刻"的部分——用户拖一下滑块就能看到模型的"性格"实时变化。

### 1.2 这个模块要让用户理解什么

按重要性排序的三个核心认知：

1. 模型每次预测下一个词时，**算的不是一个词，而是整个词表上的概率分布**
2. **Temperature** 控制这个分布的"形状"——拉平（更随机）或锐化（更确定）
3. **Top-k 和 Top-p** 控制从这个分布中采样时的"候选范围"——多大的池子里挑

附加但重要的认知（PM 视角）：

4. 不同产品场景需要不同的采样策略——客服场景和创意写作场景不能用同一套参数
5. "高 temperature ≠ 更聪明"，它只是更随机
6. Top-p 在多数应用场景下比 Top-k 更鲁棒

### 1.3 这个模块要规避什么

- **不能展示假数据**——必须用真实模型的真实概率分布
- **不能省略"分布是什么"的铺垫**——直接讲 temperature 没意义，用户得先看到"原来模型每步都在挑词"
- **不能让 PM 视角变成口号**——每个 PM 视角都要有具体场景和具体数值，不能停留在"很重要"的层面

---

## 2. 用户场景与流程

### 2.1 三类用户在本模块的差异化路径

| 用户类型 | 进入方式 | 核心体验 | 出口 |
|---|---|---|---|
| 招聘方（导览模式） | 首页直接跳到 Sampling demo | 立刻看到分布柱状图 + 拖动滑块的即时反馈 + 一张 PM 视角卡 | 跳转到下一个重点模块或回首页 |
| 入门朋友（入门模式） | 按章节顺序进入 | 完整铺垫：先讲"原来模型在做选择题"，再引出参数 | 进入下一章节"Detokenization" |
| 已入门读者（深入模式） | 在入门模式中点开"想了解更多"展开层 | 看到 typical sampling、min-p 等延伸内容 | 跳转到外部论文链接 |

### 2.2 入门模式下的完整用户流程

这是本模块的"主路径"，其他两种模式是它的子集或延伸。

**Step 1 · 引入** —— 上一章节"输出层"刚讲完模型算出了概率分布。这里承接：分布算出来了，怎么挑词？

**Step 2 · 看到分布** —— 用户从预设例子中选一个（如"中国的首都是"），看到 top 20 候选词的概率柱状图。第一次看到"原来模型不是选'北京'，而是 99% 选北京、0.5% 选上海、0.3% 选首都……"这件事本身就是认知冲击。

**Step 3 · 玩 Temperature** —— 滑块从 0 拖到 2，柱状图实时变化。低温时几乎只有 top 1 一根高柱，高温时分布被拉平。

**Step 4 · 切换不同例子** —— 切到"今天天气真"这种"低确定性"场景，看到完全不同的分布形态（很多候选词概率接近）。这是为了让用户理解"分布形态本身依赖于上下文"。

**Step 5 · 玩 Top-k / Top-p** —— 在某个有趣的分布上，演示 top-k 和 top-p 如何截断尾部。

**Step 6 · 触发采样** —— 点击"采样一次"按钮，按当前 temperature/top-k/top-p 实际从分布中采样出一个词，把它接到原文末尾。此后用户可继续点击"再生成一个 token"，从第二步起进入"演示模式"——按数据生成阶段预生成的 greedy 路径展示后续逐 token 输出（每步分布仍为真实 top 20 数据）。演示模式下温度滑块禁用并提示"演示模式温度固定"。这一设计的取舍：第一步充分展示"采样的随机性"（用户拖温度看效果），后续步骤展示"逐 token streaming 的连贯叙事"，两个体验各司其职。

**Step 7 · PM 视角卡片** —— 一张总结卡片：客服 / 创意写作 / 代码生成三个场景的参数选型对比。

**Step 8 · 出口** —— "继续学习下一章 Detokenization" / "回到首页" / "深入了解更多采样方法"三个出口。

---

## 3. 内容大纲（含关键文案骨架）

文案以"骨架句"形式给出。Claude Code 可以替换成更生动的表达，但要保留每句的核心信息和事实正确性。

### 3.1 模块开头（承接上一章）

> 上一步，模型算出了一个东西：词表里**每一个**可能的词，都有一个概率。
>
> 现在的问题是：这么多词，挑哪个？

### 3.2 看到分布（关键引导文案）

> 我们让模型补完这句话："中国的首都是 ___"
>
> 它内部实际算出了这样的分布（这里展示的是真实数据，来自 OpenAI 的 GPT-4 模型）：
>
> [柱状图]
>
> 你会发现：模型并不是"知道答案是北京"，而是给"北京"打了 99.x% 的概率，给"首都"打了 0.x%，给"上海"打了 0.x%……
>
> 也就是说——**模型每一步都在做一个加权选择题**。

### 3.3 Temperature 引入

> 那么问题来了：99% 的概率给北京，**模型一定会选北京吗**？
>
> 答案是：**不一定**。这取决于一个叫 Temperature（温度）的参数。

随后展示 Temperature = 0.1 / 1.0 / 2.0 三档预览效果。

### 3.4 Temperature 的直观解释

> Temperature 不是在"调整模型对哪个词更有信心"——模型的"信心"已经定了。
>
> Temperature 在调整的是：**这些信心被采样时，差距被放大还是被压平**。
>
> - **低 Temperature**：差距被放大，最有信心的那个词几乎一定被选中（输出更确定、更刻板）
> - **高 Temperature**：差距被压平，原本概率低的词也有机会被选中（输出更随机、更有创意，但也更容易胡说）

明确标注："这是一个简化的说法。从数学上讲，Temperature 是 softmax 函数中的一个除数。点击这里查看精确解释。"

### 3.5 Top-k 和 Top-p

> Temperature 调的是分布的形状。Top-k 和 Top-p 调的是另一件事：**从分布的多大范围里挑**。
>
> - **Top-k = 5**：只从最有可能的 5 个词里挑，剩下的全部忽略
> - **Top-p = 0.9**：把候选词按概率从高到低排，加起来超过 90% 的那些词作为候选池

通过对比 demo 让用户看到：在某些分布形态下，top-k 和 top-p 行为很像；在另一些分布形态下，差别很大。

### 3.6 PM 视角卡片（差异化核心）

这是整个模块对招聘方最有价值的一屏。建议做成**横向三栏对比卡片**：

| 场景 | Temperature | Top-p | 为什么这样选 |
|---|---|---|---|
| 客服机器人 | 0.2 - 0.4 | 0.9 | 用户期望准确、稳定的回答；不希望同一问题第二次问得到不同答复 |
| 创意写作助手 | 0.8 - 1.2 | 0.95 | 需要多样化的产出；用户主动选择来这里，预期会有惊喜 |
| 代码生成 | 0 - 0.2 | 0.95 | 代码错一个字符就跑不了；几乎不存在"创意正确"的代码 |

补充提示卡：

> 一个常被忽略的点：**Top-p 通常比 Top-k 更鲁棒**。
>
> 因为 Top-k 是固定砍一刀（"只留 5 个"），但实际分布形态差别很大——有时 top 5 已经覆盖 99% 概率，有时 top 5 才覆盖 60%。Top-p 能根据分布形态动态调整候选池大小，更能反映"模型在这一步有多确定"。

### 3.7 章节出口

> 现在你已经理解了：模型如何从概率分布里挑出下一个词。
>
> 但模型不是只挑一个词——它要把这个词加回去，再挑下一个，再下一个……直到一段话写完。
>
> 这个循环过程，下一章会讲。

### 3.8 深入模式延伸内容（可折叠）

折叠后默认显示"想了解更多 Sampling 方法？"，展开后包含：
- Typical Sampling 的简要介绍 + 论文链接
- Min-p Sampling 的简要介绍 + 论文链接
- Repetition Penalty 的概念与适用场景
- 对外链接：Hugging Face 关于采样策略的官方文档

---

## 4. 数据准备（开工前置任务）

这是模块能跑起来的前提。**先做这一步，再做前端。**

### 4.1 数据生成脚本

写一个 Python 脚本（建议放在仓库 `/scripts/generate-sampling-data.py`），完成以下任务。**注意 v0.1 要按方案 3（第一步真采样 + 后续 greedy 演示）生成多步路径数据**：

```python
# 伪代码示意
import openai

PRESET_EXAMPLES = [
    {"id": "capital_china", "prompt": "中国的首都是", "category": "high_certainty"},
    {"id": "weather_today", "prompt": "今天天气真", "category": "low_certainty"},
    {"id": "favorite_fruit", "prompt": "我最喜欢的水果是", "category": "medium_certainty"},
    # ... 共 5-10 个
]

GREEDY_STEPS = 8  # 每个例子预生成多少步 greedy 路径（含第一步）

for example in PRESET_EXAMPLES:
    current_prompt = example["prompt"]
    steps = []
    for step_index in range(GREEDY_STEPS):
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": current_prompt}],
            max_tokens=1,
            temperature=1.0,    # 每一步都必须用 temperature=1.0，否则 logprob 不能用作前端温度模拟基准
            logprobs=True,
            top_logprobs=20
        )
        top_logprobs = extract_top_logprobs(response)  # 形如 [{"token":"北京","logprob":-0.001}, ...]
        greedy_token = top_logprobs[0]["token"]        # 第一项即 top-1，作为 greedy 路径的下一步
        steps.append({"step_index": step_index, "prompt_so_far": current_prompt, "top_logprobs": top_logprobs, "greedy_token": greedy_token})
        current_prompt = current_prompt + greedy_token  # 沿 greedy 路径推进
    save_to_json({"id": example["id"], "steps": steps, ...}, example["id"])
```

**关键约束：**
- 每一步调用都必须设 `temperature=1.0`，因为前端 temperature 模拟的数学推导基于这个前提（见 6.3 节）
- `top_logprobs=20` 取 top 20 候选（OpenAI 当前上限，先用小值测试再加到 20）
- `max_tokens=1` 每步只取下一个 token 的分布
- `GREEDY_STEPS` 建议 8（够展示 streaming 视觉，又控制总调用次数在 例子数 × 8 ≤ 80 次以内，预算仍在 1 美元左右）
- 第一步的分布是用户在前端能"自由采样"的真实分布；第二步起的分布固定显示给用户看（演示模式），用户的 temperature/top-k/top-p 在演示模式下不参与计算（UI 上禁用并明示）

### 4.2 输出 JSON 数据结构

每个例子保存为一个 JSON 文件，放在 `/public/data/sampling/{example_id}.json`。**v0.1 数据结构含多步 greedy 路径**：

```json
{
  "id": "capital_china",
  "prompt": "中国的首都是",
  "prompt_zh_label": "中国的首都是",
  "category": "high_certainty",
  "model": "gpt-4o",
  "generated_at": "2026-MM-DD",
  "steps": [
    {
      "step_index": 0,
      "prompt_so_far": "中国的首都是",
      "top_logprobs": [
        {"token": "北京", "logprob": -0.001},
        {"token": "中华", "logprob": -7.2},
        {"token": "首都", "logprob": -8.1}
        // ... 共 20 项
      ],
      "greedy_token": "北京"
    },
    {
      "step_index": 1,
      "prompt_so_far": "中国的首都是北京",
      "top_logprobs": [ /* 此步的 top 20，仍为 temperature=1.0 下的真实分布 */ ],
      "greedy_token": "，"
    }
    // ... 共 GREEDY_STEPS 项
  ]
}
```

**前端使用说明：**
- 用户首次点击"采样一次"：使用 `steps[0].top_logprobs`，按用户的 temperature/top-k/top-p 实时重算分布并采样。**采到任何 token 都接受**（不强制走 greedy 路径），让用户感受随机性
- 用户继续点击"再生成一个 token"（第 i ≥ 1 次）：直接展示 `steps[i].top_logprobs` 的真实分布（显示用，不再受温度参数影响），并自动接受 `steps[i].greedy_token` 接到原文末尾。UI 标记"演示模式"
- 用户重新选择例子或点击"重置"：清空累积输出，回到第一步真采样模式

### 4.3 索引文件

`/public/data/sampling/index.json` 列出所有例子的元数据，用于前端展示选择列表：

```json
{
  "examples": [
    {"id": "capital_china", "label": "中国的首都是", "category": "high_certainty", "description": "高确定性场景"},
    {"id": "weather_today", "label": "今天天气真", "category": "low_certainty", "description": "低确定性场景"},
    // ...
  ]
}
```

### 4.4 例子选择原则

5-10 个预设例子要刻意覆盖三种"分布形态"，让用户能直观对比：

- **高确定性**（top 1 概率 > 90%）：如"中国的首都是"、"1+1=" 
- **中等确定性**（top 1 概率 30-70%）：如"我最喜欢的水果是"、"周末我打算"
- **低确定性**（top 1 概率 < 30%）：如"今天天气真"、"她说："

中英文各放一些，方便后续与 Tokenization 模块的中英文对比形成呼应。

---

## 5. 前端架构

### 5.1 组件骨架

建议拆分如下（不强求精确遵守，可以根据实际情况调整）：

```
SamplingModule/
├── SamplingPage.tsx              # 模块主页面，组织叙事流程
├── ExampleSelector.tsx            # 用户选预设例子
├── DistributionChart.tsx          # 概率分布柱状图（核心可视化）
├── TemperatureSlider.tsx          # Temperature 滑块
├── TopKControl.tsx                # Top-k 选择器
├── TopPSlider.tsx                 # Top-p 滑块
├── SampleButton.tsx               # 触发一次采样
├── GeneratedTextDisplay.tsx       # 显示采样结果累积
├── PMPerspectiveCard.tsx          # PM 视角对比卡片
└── DeepDiveCollapse.tsx           # 深入模式折叠区
```

### 5.2 关键状态结构

整个模块的状态可以集中在一个 hook 或 context 中：

```typescript
interface StepData {
  step_index: number;
  prompt_so_far: string;
  top_logprobs: { token: string; logprob: number }[];
  greedy_token: string;
}

interface SamplingState {
  selectedExampleId: string;            // 当前选中的预设例子
  steps: StepData[];                    // 从 JSON 读取的多步路径数据
  currentStepIndex: number;             // 用户当前看到的是第几步（0 开始）
  demoMode: boolean;                    // false=第一步真采样模式；true=演示模式（第二步起）
  temperature: number;                  // 0 - 2，默认 1.0
  topK: number | null;                  // null 表示不启用
  topP: number;                         // 0 - 1，默认 1.0
  generatedTokens: string[];            // 累积的采样/演示输出
  computedDistribution: ComputedToken[]; // 当前展示的分布：第一步=temperature/top-k/top-p 重算后；演示模式=直接显示当前步的真实分布
}
```

**状态机要点：**
- 选例子或点"重置" → `currentStepIndex=0`、`demoMode=false`、`generatedTokens=[]`
- 用户在 `demoMode=false` 点"采样一次" → 按用户参数从 `steps[0].top_logprobs` 重算并采样，采到的 token 入 `generatedTokens`，然后 `currentStepIndex=1`、`demoMode=true`
- 用户在 `demoMode=true` 点"再生成一个 token" → 直接 push `steps[currentStepIndex].greedy_token` 到 `generatedTokens`，然后 `currentStepIndex++`，`computedDistribution` 切换为新一步的真实分布（不再受温度参数影响）
- `currentStepIndex` 达到 `steps.length` 时，按钮禁用并提示"演示已结束"

`computedDistribution` 是核心派生状态：第一步由 `steps[0].top_logprobs` + 三个采样参数派生，演示模式下直接等于 `steps[currentStepIndex].top_logprobs`。

### 5.3 推荐技术选型

- **可视化库**：Recharts 优先（备选 D3 或纯 SVG）——先用 Recharts 跑通 v0.1，效果不满意再换
- **状态管理**：React useState + useReducer 即可，不需要 Redux
- **样式**：Tailwind CSS
- **动画**：Framer Motion（如果柱状图变化需要平滑过渡）

---

## 6. 核心交互与计算逻辑

### 6.1 数据加载

页面挂载时读取 `/public/data/sampling/index.json`，渲染例子选择器。用户选某个例子时，再异步读取对应的 `{example_id}.json`，加载到 `steps` 状态，并把 `currentStepIndex` 重置为 0、`demoMode` 设为 `false`。

### 6.2 用户输入预留接口（v0.1 不实现）

PRD 中"统一交互骨架"提到用户输入贯穿全流程。本模块 v0.1 只支持预设例子。**预留一个"自定义输入"按钮但置灰**，写明"将在后续版本支持"。这样既保持了架构开放性，又不在 MVP 阶段陷入用户任意输入的工程黑洞。

### 6.3 Temperature 重算逻辑（必须正确）

**这部分数学不能错。**

**前提：** 数据生成时使用 `temperature=1.0` 调用 API。在这个前提下，OpenAI 返回的 `logprob_i` 等价于原始 logits 减一个常数（这个常数对所有 token 一样，所以在后续 softmax 中会被消掉）。

**目标：** 给定原始 `logprob_i`（来自 API）和用户当前的 `T`（temperature），计算新的概率分布。

**正确公式：**

```
P_new_i = exp(logprob_i / T) / sum_j(exp(logprob_j / T))
```

**TypeScript 实现示例：**

```typescript
function applyTemperature(
  logprobs: number[],
  T: number
): number[] {
  // 处理 T=0 的特殊情况（避免除零）
  if (T < 0.001) {
    const maxIdx = logprobs.indexOf(Math.max(...logprobs));
    return logprobs.map((_, i) => (i === maxIdx ? 1 : 0));
  }
  
  // 数值稳定的 softmax：先减去最大值再 exp
  const scaled = logprobs.map(lp => lp / T);
  const maxScaled = Math.max(...scaled);
  const expValues = scaled.map(s => Math.exp(s - maxScaled));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  return expValues.map(e => e / sumExp);
}
```

**重要的约束与说明：**

1. **数据生成必须用 `temperature=1.0`**——否则上述公式不成立。如果数据生成脚本没遵守这个前提，整个模块的演示数学都是错的
2. **Top 20 是近似而非完整分布**——OpenAI 只返回 top 20 的 logprobs。当用户调高 temperature 时，本应有更多概率分配到尾部那些"未返回"的 token 上。我们的模拟在 T 较高时会有偏差，但对教学演示是可接受的近似
3. **必须在文案中明确说明这是近似**——在 Temperature 滑块附近放一个小提示："这里展示的是 top 20 候选词的真实概率，调温度时只重新分配这 20 个词之间的概率。完整词表分布请参见……"

### 6.4 Top-k 应用逻辑

```typescript
function applyTopK(
  probs: number[],
  k: number | null
): number[] {
  if (k === null || k >= probs.length) return probs;
  
  // 找到第 k 大的概率值作为阈值
  const sorted = [...probs].sort((a, b) => b - a);
  const threshold = sorted[k - 1];
  
  // 小于阈值的置零，剩余重新归一化
  const masked = probs.map(p => (p >= threshold ? p : 0));
  const sum = masked.reduce((a, b) => a + b, 0);
  return masked.map(p => p / sum);
}
```

### 6.5 Top-p 应用逻辑

```typescript
function applyTopP(
  probs: number[],
  p: number
): number[] {
  if (p >= 1) return probs;
  
  // 按概率降序排列，记住原始 index
  const indexed = probs.map((prob, idx) => ({ prob, idx }))
    .sort((a, b) => b.prob - a.prob);
  
  // 累积概率直到超过 p
  let cumulative = 0;
  const keptIndices = new Set<number>();
  for (const item of indexed) {
    keptIndices.add(item.idx);
    cumulative += item.prob;
    if (cumulative >= p) break;
  }
  
  // 未被保留的置零，剩余归一化
  const masked = probs.map((prob, idx) => (keptIndices.has(idx) ? prob : 0));
  const sum = masked.reduce((a, b) => a + b, 0);
  return masked.map(p => p / sum);
}
```

### 6.6 三个参数的应用顺序

按照标准做法，三个参数的应用顺序是：

1. 先按 Temperature 重算分布
2. 再按 Top-p 截断
3. 再按 Top-k 截断（如果同时启用 top-k 和 top-p，标准做法是 top-k 在 top-p 之后）

```typescript
function computeFinalDistribution(
  rawLogprobs: number[],
  T: number,
  topK: number | null,
  topP: number
): number[] {
  let probs = applyTemperature(rawLogprobs, T);
  probs = applyTopP(probs, topP);
  if (topK !== null) probs = applyTopK(probs, topK);
  return probs;
}
```

### 6.7 采样实现（方案 3：第一步真采样 + 后续 greedy 演示）

按钮点击时根据当前模式分两种行为：

**模式 A — 第一步真采样（`demoMode === false`）**

按用户 temperature/top-k/top-p 重算 `steps[0]` 的分布，从中按概率采样：

```typescript
function sampleFromDistribution(
  tokens: string[],
  probs: number[]
): string {
  const r = Math.random();
  let cumulative = 0;
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i];
    if (r < cumulative) return tokens[i];
  }
  return tokens[tokens.length - 1]; // 兜底
}
```

采到的 token 追加到 `generatedTokens`，状态切换为 `currentStepIndex=1`、`demoMode=true`。

**模式 B — 演示模式（`demoMode === true`）**

直接按预生成路径推进：

```typescript
function advanceDemoStep(state: SamplingState): SamplingState {
  const next = state.steps[state.currentStepIndex];
  if (!next) return state; // 已到末尾
  return {
    ...state,
    generatedTokens: [...state.generatedTokens, next.greedy_token],
    currentStepIndex: state.currentStepIndex + 1,
    // computedDistribution 在派生时直接读 steps[currentStepIndex].top_logprobs，不参与温度重算
  };
}
```

**关键约束：**
- 模式 A 下，用户无论采到 top-1 还是 top-20 的 token 都接受——这是"采样随机性"教学的核心
- 模式 B 下，**忽略**用户的 temperature/top-k/top-p 设置（UI 上滑块禁用并提示），始终展示 `steps[i].top_logprobs` 的真实分布、始终接续 `greedy_token`
- 当 `currentStepIndex >= steps.length` 时，"再生成一个 token"按钮禁用，提示"演示已结束，点击重置回到第一步"
- "重置"按钮把 `currentStepIndex=0`、`demoMode=false`、`generatedTokens=[]`，让用户重新体验

**为什么这样取舍：** 真实多步生成需要每步都重新调用 API 拿新分布——这就破坏了"纯静态"工程方案。方案 3 用一次性预生成的 greedy 路径换取了"逐 token streaming 的连贯叙事"，同时保留了第一步的"采样随机性"教学价值。**任何展示给用户的分布都是真实数据**（来自 temperature=1.0 的 API 调用），UI 上明示"演示模式"和"top 20 近似"两个简化点。

### 6.8 滑块拖动时的性能考虑

Temperature / Top-p 滑块拖动时会高频触发重算。Top 20 数据量很小，重算成本几乎为零，可以直接 onChange 实时更新。但柱状图的动画过渡需要平滑——建议用 Framer Motion 的 `layout` 动画或 Recharts 内置过渡，避免柱子突然跳变。

---

## 7. 视觉与文案落地

### 7.1 视觉方向（不写死数值）

延续 PRD 中确定的"温暖科普风 + 重点模块杂志级强视觉"方向。本模块作为重点模块，应做到杂志级处理：

- **主柱状图**给充足的留白（不挤在小角落里），让读者能聚焦
- **柱子颜色**建议用单一主色的渐变（比如深绿到浅绿），避免彩虹色让画面变 noise
- **当前选中或高亮的 token**用对比色突出（比如主色配暖橘）
- **滑块的视觉份量要够**——不是隐藏在角落的小控件，而是首屏就能看到、邀请用户去玩的 affordance
- **PM 视角卡片**用衬线字体的标题 + 表格化布局，做出"专业感卡片"的杂志感

具体颜色码、字号、间距等待 v0.1 跑出来后看效果再定。

### 7.2 文案统一原则

- **不用术语黑话不解释**——首次出现的术语必须有解释或链接
- **不用"显然""容易看出"等劝退用语**——这是科普网站不是论文
- **每段不超过 3 行**——超过就拆段或加图
- **数字用具体数字**——不写"很高"，写"99.x%"

### 7.3 微交互建议

- 用户第一次拖动 temperature 时，触发一个**轻微的引导动画**（如柱状图被"吹拂"的视觉），让用户理解"是我让它变化了"
- 滑块刻度上标注三个特殊值：`0.2`（保守）、`1.0`（默认）、`1.5`（创意）
- "采样一次"按钮按下时有触觉反馈（颜色变化或震动效果）

---

## 8. v0.1 完整性检查清单

跑出 v0.1 时，以下事项应当全部完成：

**功能完整性**
- [ ] 用户可以从至少 5 个预设例子中选择
- [ ] 选择例子后能看到真实的 top 20 概率柱状图（第一步）
- [ ] Temperature 滑块可拖动（第一步），柱状图实时变化
- [ ] Top-k 控件可调（第一步），柱状图正确截断
- [ ] Top-p 滑块可拖动（第一步），柱状图正确截断
- [ ] 点击"采样一次"能按当前参数采出 token 并追加到原文末尾
- [ ] 进入演示模式后可继续点击"再生成一个 token"，按 greedy 路径推进
- [ ] 演示模式下温度/top-k/top-p 控件禁用并有明确提示
- [ ] 演示模式下分布柱状图显示当前步的真实 top 20（不再受温度影响）
- [ ] "重置"按钮可清空累积输出并回到第一步真采样模式
- [ ] PM 视角卡片正常展示

**正确性**
- [ ] 数据生成脚本运行时**每一步**都使用了 `temperature=1.0`
- [ ] Temperature 重算公式实现正确（可对照本文档第 6.3 节验证）
- [ ] Top-k 和 Top-p 实现正确，分布归一化后总和为 1
- [ ] 第一步采样的随机性体感正常（多次重置后采样会得到不同结果）
- [ ] 演示模式下的 token 顺序与 JSON 中 `greedy_token` 字段一致
- [ ] 关于"top 20 是近似"的说明已在 UI 中明确呈现
- [ ] "演示模式"切换和限制已在 UI 中明确呈现

**视觉与体验**
- [ ] 整体风格符合温暖科普 + 重点模块杂志级的方向
- [ ] 移动端能正常显示（不要求像桌面端那样精致，但不能错乱）
- [ ] 滑块拖动流畅无卡顿
- [ ] 柱状图变化有平滑过渡

**未实现项（明确标注）**
- [ ] 自定义输入按钮置灰，文案"将在后续版本支持"
- [ ] 用户自由路径的连续生成（多 token 任意采样路径）暂未实现，演示模式仅按 greedy 路径
- [ ] 深入模式延伸内容可以先放占位文字

---

## 9. v0.1 之后的迭代方向（不在本次开工范围）

记录在这里防止遗漏：

- 增加用户自定义输入功能（需要后端调用 OpenAI API，或前端直接调用 API 但用户自己提供 key）
- 增加"用户自由路径的连续生成"——v0.1 第二步起强制走 greedy 路径，未来可扩展为允许用户采到非 greedy 路径上的 token 后仍能继续（需要预生成分支树，或前端调用 API）
- 增加 typical sampling 和 min-p sampling 的真实演示
- 增加多模型对比（不同模型在同一 prompt 下的分布差异）
- 接入网站全局的"统一交互骨架"——把模块输入与上一个模块输出联动

---

## 10. 已知不确定项与开放问题

文档完成时仍存在以下需要在实现过程中验证或决定的事项：

1. **OpenAI top_logprobs 上限实测** —— 调用前用小值（如 5）测试，逐步加到 20，确认实际可用上限
2. **API 费用** —— 5-10 个例子的总费用应在 1 美元内，但实际值需调用一次后确认
3. **柱状图技术选型** —— Recharts 上手快但定制弱，纯 SVG 灵活但费时间。建议先用 Recharts 跑通 v0.1，效果不满意再换
4. **预设例子的最终选定** —— 第 4.4 节的选择原则给了方向，但具体每一句要选哪些，建议跑通技术链路后用真实数据回看效果再定（有些 prompt 在小型 model 上分布很有意思，在大型 model 上几乎一边倒，反之亦然）
5. **是否在数据中包含"不同模型版本"对比** —— 目前默认只用 `gpt-4o` 一个模型。如果想做"不同模型在同一 prompt 下的差异"展示，需要扩展数据生成脚本

---

*本文档是开发蓝图，不是开发规范。实现过程中遇到任何与文档不一致的更优方案，请优先采用更优方案，并在后续版本中回写本文档。*
