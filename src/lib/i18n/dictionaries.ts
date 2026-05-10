// 中英对照字典——所有翻译的唯一来源。
// 术语口径见 docs/i18n-glossary.md。
//
// 使用方式：
//   const t = useT();
//   t('home.hero.subtitle')
//   t('home.steps.tokenization.title')
//   t('common.next', { n: 3 })  // 占位符插值
//
// 占位符语法：模板里写 {name}，调用 t() 时传 vars: { name: ... }。
//
// "案例数据"（mock JSON 里的 token 文本、demo prompt 输入等）不在这里——
// 那些保持中文不变（中英文版本共享同一份 mock 数据）。

export type Locale = 'en' | 'zh';

export const LOCALES: Locale[] = ['en', 'zh'];
export const DEFAULT_LOCALE: Locale = 'en';

// English dictionary — the canonical, technically-precise version (tech-blog tone).
const en = {
  common: {
    siteName: 'LLM Visualizer',
    siteTagline: 'Understand how an LLM works, one mechanism at a time',
    deepDive: 'Deep dive',
    deepDiveButton: 'Deep dive into {name} →',
    deepDiveButtonGeneric: 'Deep dive →',
    inputLabel: '⬇ INPUT',
    outputLabel: '⬇ OUTPUT',
    expand: '▸ Expand',
    collapse: '▾ Collapse',
    nextChapter: 'Next chapter',
    backToHome: '← Back to home',
    note: 'Note',
    keyTakeaway: 'Key takeaway',
    productPerspective: 'Product perspective',
    practicalTakeaway: 'What this means in practice',
    tryIt: 'Try it',
    example: 'Example',
    chapter: 'Chapter',
    loading: 'Loading…',
    loadingDemo: 'Loading demo data…',
    loadingExamples: 'Loading examples…',
    langSwitch: { toEN: 'EN', toZH: '中文', ariaToEN: 'Switch to English', ariaToZH: '切换到中文' },
  },
  home: {
    hero: {
      eyebrow: 'LLM VISUALIZER · v0.1',
      title1: 'How a sentence flows through an LLM:',
      title2: '7 steps',
      subtitle:
        'From your input to the next token, a model actually does seven distinct things. Each one is a self-contained mechanism — pick an example below and watch it travel through the pipeline.',
    },
    inputBar: {
      label: 'START HERE →',
      caption: 'This text is the input for the demo',
      start: '▶ Start demo',
      skip: '⤓ Skip animation',
      restart: '↺ Restart demo',
    },
    finalOutput: {
      heading: 'The model says',
      caption: 'After these 7 steps, the next token is',
    },
    footnote:
      '※ v0.1 demo data. The Sampling step uses real model output; the other six steps use placeholder data to illustrate the flow. Detailed module pages are shipping incrementally.',
    steps: {
      tokenization: {
        title: 'Tokenization · text → tokens',
        oneLiner: "A model doesn't read by character or word — it reads by token.",
      },
      embedding: {
        title: 'Embedding · tokens → vectors',
        oneLiner: 'Each token is mapped to a high-dimensional vector. Distances between vectors reflect semantic relationships.',
      },
      positional_encoding: {
        title: 'Positional Encoding · adding position info',
        oneLiner: "Transformers don't see word order natively. Position has to be encoded into the vectors themselves.",
      },
      transformer: {
        title: 'Transformer · attention + feed-forward',
        oneLiner: 'Attention lets each token look at the other tokens that matter for understanding it.',
      },
      logits: {
        title: 'Output Layer · scoring every word in the vocabulary',
        oneLiner: 'The final layer projects the internal state back to a probability distribution over the entire vocabulary.',
      },
      sampling: {
        title: 'Sampling · pick one token from the distribution',
        oneLiner: 'Sampling strategies (temperature / top-k / top-p) decide how the next token is chosen from the distribution.',
      },
      detokenization: {
        title: 'Detokenization · token → text → loop back',
        oneLiner: 'Decode the chosen token back to text, append it to the input, and run all 7 steps again.',
      },
    },
    // Per-step input/output labels (rendered with values from the pipeline JSON).
    stepLabels: {
      tokenization: { inputPrefix: 'Original text:', outputN: '{n} tokens:' },
      embedding: {
        input: '{n} tokens (from step 1)',
        output: '{n} vectors of dimension {dim}',
      },
      positional_encoding: {
        input: '{n} {dim}-dim vectors (from step 2)',
        output: '{n} vectors with positional info',
      },
      transformer: {
        input: '{n} position-aware vectors (from step 3)',
        output: 'Vectors after {layers} layers × {heads} heads of processing',
      },
      logits: {
        input: 'Final-layer Transformer output (from step 4)',
        outputPrefix: 'Probability distribution over vocabulary, top-1 =',
        outputSuffix: '',
      },
      sampling: {
        input: 'Probability distribution (from step 5)',
        outputPrefix: 'Selected token:',
      },
      detokenization: {
        inputPrefix: 'Selected token (from step 6):',
        outputArrow: '→ appended to the input, then we run the 7 steps again',
      },
    },
  },
  // Sampling page (sampling/page.tsx) — chapter structure follows the existing CN page layout.
  // Sub-component strings (DistributionChart, ParamControls, etc.) are NOT translated in stage 1.
  sampling: {
    nav: { pageIndex: '06 / 08', backToHome: '← LLM Visualizer home' },
    eyebrow: 'CHAPTER 06 · SAMPLING',
    hero: {
      title1: 'How does a model',
      titleHighlight: 'pick',
      title2: 'the next word?',
      lede1: 'The previous step (',
      lede1Link: 'Output Layer / Logits',
      lede2: ') produced a probability distribution — the model assigns a score to ',
      ledeBold: 'every',
      lede3: ' candidate word in the vocabulary. The question now is: with so many options, which one do you pick?',
    },
    ch1: {
      title: 'Pick a starting context',
      body:
        "Different opening phrases put the model in front of very different multiple-choice problems — some are almost trivial, others genuinely ambiguous.",
    },
    ch2: {
      titlePart1: "The model doesn't",
      titleEmphasis: 'know',
      titlePart2: 'the answer — it ',
      titleHighlight: 'scores',
      titlePart3: 'every candidate',
      tryBadge: 'Try it',
      stageLabel: 'INTERACTIVE · YOUR TURN →',
      distChartTitle: 'Probability distribution over the top 20 candidates',
      demoModeLabel: 'demo mode',
      demoStepLabel: 'Step {n} · real distribution',
      paramHeading: 'Sampling parameters',
    },
    ch3: {
      title1: 'So what is',
      titleEmphasis: 'temperature',
      title2: 'actually doing?',
      body1:
        "It's not adjusting the model's confidence — those scores are already fixed. What it adjusts is: ",
      body1Bold: 'how much the gap between confidences gets amplified or flattened during sampling.',
      bullets: [
        {
          label: '↓ Low temperature:',
          text: 'gaps amplified — the most-confident token almost always wins (deterministic, repetitive)',
        },
        {
          label: '↑ High temperature:',
          text: 'gaps flattened — low-probability tokens get a real shot (more random, more creative, but more error-prone)',
        },
      ],
      caveat: '※ Simplified phrasing. Mathematically, temperature is the divisor inside softmax.',
    },
    ch4: {
      title1: 'And what about',
      titleHighlightA: 'top-k',
      titleAnd: 'and',
      titleHighlightB: 'top-p',
      title2: '?',
      body1: 'Temperature controls the ',
      body1Em: 'shape',
      body2: ' of the distribution. Top-k and top-p control something different: ',
      body2Bold: 'which slice of the distribution you sample from.',
      bullets: [
        {
          label: 'top-k = 5:',
          text: 'sample only from the 5 most likely tokens',
        },
        {
          label: 'top-p = 0.9:',
          text: 'sample from the smallest set of tokens whose cumulative probability ≥ 0.9 — flatter distributions yield bigger pools',
        },
      ],
    },
    ch5: {
      eyebrow: 'PRODUCT PERSPECTIVE',
      title: 'Choosing parameters across product scenarios',
    },
    outro: {
      body:
        "You now understand how the model picks one token from a probability distribution. But it doesn't stop after one — it appends that token back, picks the next, and keeps going until the answer is complete.",
      backHome: '← Back to home',
      next: 'Next · Detokenization →',
    },
  },
};

// 中文 dictionary — 与 en 字典 schema 完全一致；保留原中文版的叙事风格不动。
const zh = {
  common: {
    siteName: 'LLM Visualizer',
    siteTagline: '用交互理解 LLM 工作原理',
    deepDive: '深入了解',
    deepDiveButton: '深入了解 {name} →',
    deepDiveButtonGeneric: '深入了解 →',
    inputLabel: '⬇ 输入',
    outputLabel: '⬇ 输出',
    expand: '▸ 展开',
    collapse: '▾ 收起',
    nextChapter: '下一章',
    backToHome: '← 返回首页',
    note: '注',
    keyTakeaway: '主解读',
    productPerspective: 'PM 视角',
    practicalTakeaway: '实战要点',
    tryIt: '动手玩',
    example: '案例',
    chapter: '章',
    loading: '加载中…',
    loadingDemo: '正在加载演示数据…',
    loadingExamples: '正在加载例子…',
    langSwitch: { toEN: 'EN', toZH: '中文', ariaToEN: 'Switch to English', ariaToZH: '切换到中文' },
  },
  home: {
    hero: {
      eyebrow: 'LLM VISUALIZER · v0.1',
      title1: '看一段话经过 LLM 的',
      title2: '7 步流水线',
      subtitle:
        '从输入文字到下一个词冒出来，模型其实做了 7 件事。每一步都是一个独立的"机制点"——选一个例子，看它怎么走完这趟流水线。',
    },
    inputBar: {
      label: '从这里开始 →',
      caption: '这段话作为本次演示的输入',
      start: '▶ 开始演示',
      skip: '⤓ 跳过动画',
      restart: '↺ 重新演示',
    },
    finalOutput: {
      heading: '模型最终说出',
      caption: '经过这 7 步，下一个 token 是',
    },
    footnote:
      '※ v0.1 mock 数据。Sampling 步骤是已落地的真实模型数据；其他 6 步用占位数据示意流程，详细模块逐步上线。',
    steps: {
      tokenization: {
        title: 'Tokenization · 文字 → token',
        oneLiner: '模型不是按"字"或"单词"理解文字的，而是按 token。',
      },
      embedding: {
        title: 'Embedding · token → 向量',
        oneLiner: '每个 token 被映射到一个高维向量，向量的相对位置反映语义关系。',
      },
      positional_encoding: {
        title: 'Positional Encoding · 加上位置信息',
        oneLiner: 'Transformer 不区分词序，需要把"位置"也编码进向量里。',
      },
      transformer: {
        title: 'Transformer · 注意力 + 前馈',
        oneLiner: 'Attention 让每个 token 在被处理时"看向"其他相关的 token。',
      },
      logits: {
        title: '输出层 · 算出每个候选词的概率',
        oneLiner: '模型在最后一层把内部状态映射回整个词表的概率分布。',
      },
      sampling: {
        title: 'Sampling · 从分布里挑一个词',
        oneLiner: '不同采样策略（temperature / top-k / top-p）决定如何从分布挑词。',
      },
      detokenization: {
        title: 'Detokenization · token → 文字 → 接回再来',
        oneLiner: '把生成的 token 解码成文字，接回输入末尾，再走一遍 7 步。',
      },
    },
    stepLabels: {
      tokenization: { inputPrefix: '原文：', outputN: '{n} 个 token：' },
      embedding: {
        input: '{n} 个 token（来自第 1 步）',
        output: '{n} 个 {dim} 维向量',
      },
      positional_encoding: {
        input: '{n} 个 {dim} 维向量（来自第 2 步）',
        output: '{n} 个含位置信息的向量',
      },
      transformer: {
        input: '{n} 个含位置的向量（来自第 3 步）',
        output: '经过 {layers} 层 × {heads} 头处理后的向量',
      },
      logits: {
        input: 'Transformer 最后一层输出（来自第 4 步）',
        outputPrefix: '词表概率分布，top-1 =',
        outputSuffix: '',
      },
      sampling: {
        input: '概率分布（来自第 5 步）',
        outputPrefix: '选中 token：',
      },
      detokenization: {
        inputPrefix: '选中的 token（来自第 6 步）：',
        outputArrow: '→ 接回原文末尾，再走一遍这 7 步',
      },
    },
  },
  sampling: {
    nav: { pageIndex: '06 / 08', backToHome: '← LLM Visualizer 首页' },
    eyebrow: '采样 · Sampling',
    hero: {
      title1: '模型如何',
      titleHighlight: '挑出',
      title2: '下一个词？',
      lede1: '前一步（',
      lede1Link: '输出层 / Logits',
      lede2: '）算出了概率分布——模型给词表里',
      ledeBold: '每一个',
      lede3: '可能的词都打了一个分数。现在的问题是：这么多词，到底挑哪个？',
    },
    ch1: {
      title: '先选一个例子',
      body: '不同的句子开头，让模型面对的"选择题"形态完全不同——有的几乎闭眼能选，有的真的左右为难。',
    },
    ch2: {
      titlePart1: '模型不是"',
      titleEmphasis: '知道',
      titlePart2: '答案"，而是给每个候选词',
      titleHighlight: '打分',
      titlePart3: '',
      tryBadge: '动手玩',
      stageLabel: '交互区 · 你的回合 →',
      distChartTitle: 'top 20 候选词的概率分布',
      demoModeLabel: '演示模式',
      demoStepLabel: '第 {n} 步 · 真实分布',
      paramHeading: '采样参数',
    },
    ch3: {
      title1: '那么，',
      titleEmphasis: '温度',
      title2: '到底在调什么？',
      body1: '它不是在"调整模型对哪个词更有信心"——模型的信心已经定了。它在调的是：',
      body1Bold: '这些信心被采样时，差距被放大还是被压平。',
      bullets: [
        { label: '↓ 低温：', text: '差距放大，最有信心那个词几乎一定被选中（确定、刻板）' },
        { label: '↑ 高温：', text: '差距压平，低概率的词也有机会（更随机、有创意，但易胡说）' },
      ],
      caveat: '※ 这是简化说法。数学上 temperature 是 softmax 的除数。',
    },
    ch4: {
      title1: '',
      titleHighlightA: 'Top-k',
      titleAnd: '和',
      titleHighlightB: 'Top-p',
      title2: '又是什么？',
      body1: '温度调的是分布的',
      body1Em: '形状',
      body2: '。Top-k 和 Top-p 调的是另一件事：',
      body2Bold: '从分布的多大范围里挑。',
      bullets: [
        { label: 'Top-k = 5：', text: '只从最有可能的 5 个词里挑' },
        { label: 'Top-p = 0.9：', text: '从概率排序累加超 90% 的那批词里挑——分布越平，候选池越大' },
      ],
    },
    ch5: {
      eyebrow: 'PM 视角',
      title: '不同产品场景，参数选型对比',
    },
    outro: {
      body: '现在你已经理解了：模型如何从概率分布里挑出下一个词。但模型不是只挑一个词——它要把这个词加回去，再挑下一个，直到一段话写完。',
      backHome: '← 回到首页',
      next: '下一章 · Detokenization →',
    },
  },
};

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, zh };
