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
  // ============== TOKENIZATION ==============
  tokenization: {
    nav: { pageIndex: '01 / 08', backToHome: '← LLM Visualizer home' },
    eyebrow: 'CHAPTER 01 · TOKENIZATION',
    hero: {
      title1: "A model doesn't read your text by character — it reads",
      titleHighlight: 'by token',
      lede:
        "A token is the model's basic unit of recognition — it might be a complete word, a word fragment, half of a Chinese character, or a raw byte. The character count you see and the token count the model sees often diverge — and that gap directly drives API cost, real context-window capacity, and a long list of product bugs. The next five sections walk you through tokens end-to-end.",
    },
    ch1: {
      title1: 'First principles: ',
      titleHighlight: 'bytes, characters, and tokens',
      title2: 'are three different things',
      body:
        "Bytes, characters, and tokens sit at three different layers, and they're often conflated. The interactive demo below clarifies the relationships in one go — once you have it, statements like \"each Chinese character ≈ 3 tokens in GPT-2\" become obvious.",
      stageLabel: 'CHARACTER → BYTE → TOKEN, ALL THREE →',
    },
    ch2: {
      title: 'Try it: see how a model splits your sentence',
      body: 'The playground below uses real OpenAI tokenizers, running entirely in your browser (no API). Type any text — Chinese, English, emoji, code — and see the split instantly.',
      stageLabel: 'LIVE TOKENIZATION · YOUR TURN →',
    },
    ch3: {
      title1: '"Chinese tokens cost 2–3× more than English" — ',
      titleHighlight: "that's outdated",
      body:
        "From GPT-2 (r50k_base) to GPT-4o (o200k_base), the token count for the same Chinese text has often dropped by 50%+. Not because the model got smarter — because BPE training data absorbed massive amounts of Chinese, and common phrases collapsed into single tokens. If a learning resource says \"each Chinese character is 2–3 tokens,\" that's GPT-2-era fact.",
      stageLabel: 'THREE ERAS COMPARED →',
    },
    ch4: {
      title1: 'Turning token count into ',
      titleHighlight: 'dollars',
      body:
        'When sizing a product, the math is "tokens per call × call count × unit price." Common mistake: dismissing per-call cost as "cents," then blowing past budget the moment you scale.',
      stageLabel: 'COST AT SCALE →',
    },
    ch5: {
      eyebrow: 'PRODUCT PERSPECTIVE',
      title: 'From tokens to product decisions',
    },
    outro: {
      body:
        "Once tokenized, the model maps each token to a high-dimensional vector (an embedding) so that semantically similar words sit close to each other in that space. That's what the Embedding module covers next.",
      backHome: '← Back to home',
      next: 'Next · Embedding →',
    },
  },
  // ============== EMBEDDING ==============
  embedding: {
    nav: { pageIndex: '02 / 08', backToHome: '← LLM Visualizer home' },
    eyebrow: 'CHAPTER 02 · EMBEDDING',
    hero: {
      title1: 'Tokens are just IDs. To compute on them, we map each token into a',
      titleHighlight: 'high-dimensional vector',
      lede:
        "A model can't reason directly with the integer ID of a token. It first looks the token up in an embedding matrix and pulls out a long vector (typically 768 to 12288 numbers). The geometry of these vectors — how close two vectors are — is what lets the model capture meaning. Embedding is the gateway from \"discrete IDs\" to \"continuous space where math works.\"",
    },
    outro: {
      body:
        "Embeddings give every token a position in semantic space — but at this point the model still has no idea about word order. The next step (Positional Encoding) injects position information into these vectors.",
      backHome: '← Back to home',
      next: 'Next · Positional Encoding →',
    },
  },
  // ============== POSITIONAL ENCODING ==============
  positional: {
    nav: { pageIndex: '03 / 08', backToHome: '← LLM Visualizer home' },
    eyebrow: 'CHAPTER 03 · POSITIONAL ENCODING',
    hero: {
      title1: 'A Transformer processes all tokens in parallel — by default, it has no idea',
      titleHighlight: 'which token comes first',
      lede:
        '"She loves him" and "He loves her" share the same set of tokens. To distinguish them, the model has to know each token\'s position. The trick (Vaswani et al., 2017): add a position-specific signal directly into each token\'s embedding vector — that way, identical tokens at different positions become different inputs.',
    },
    outro: {
      body:
        'Once tokens carry position information, the Transformer can use attention to relate them to each other. That\'s where the next module — the Transformer block itself — comes in.',
      backHome: '← Back to home',
      next: 'Next · Transformer →',
    },
  },
  // ============== TRANSFORMER ==============
  transformer: {
    nav: { pageIndex: '04 / 08', backToHome: '← LLM Visualizer home' },
    eyebrow: 'CHAPTER 04 · TRANSFORMER',
    hero: {
      title1: 'The Transformer block: where every token',
      titleHighlight: 'looks at',
      title2: 'every other token, and reasons about the result',
      lede:
        'Up to here, every token holds a vector that encodes "what it is" plus "where it sits." But these vectors are still independent — they don\'t know about each other. The Transformer block changes that with two operations, repeated dozens of times: self-attention (let each token query others) and a feed-forward network (process the result). After this stack, every token carries context-aware meaning.',
    },
    outro: {
      body:
        'After many Transformer layers, the final token sits on a vector rich with context. The output layer then turns that vector into a probability over every word in the vocabulary.',
      backHome: '← Back to home',
      next: 'Next · Output Layer →',
    },
  },
  // ============== LOGITS / OUTPUT LAYER ==============
  logits: {
    nav: { pageIndex: '05 / 08', backToHome: '← LLM Visualizer home' },
    eyebrow: 'CHAPTER 05 · OUTPUT LAYER',
    hero: {
      title1: 'How does the model turn its internal vector into',
      titleHighlight: 'a probability over every word in the vocabulary',
      title2: '?',
      lede:
        "After the Transformer stack, the last token's vector encodes everything the model has \"figured out.\" To produce the next token, that vector goes through one final linear projection (the unembedding / LM head) — yielding a raw score (logit) for every word in the vocabulary — and then through softmax, which converts those scores into a probability distribution.",
    },
    outro: {
      body:
        "Now we have a probability distribution over the entire vocabulary. The next step (Sampling) decides how to pick one token from this distribution.",
      backHome: '← Back to home',
      next: 'Next · Sampling →',
    },
  },
  // ============== DECODING LOOP / DETOKENIZATION ==============
  loop: {
    nav: { pageIndex: '07 / 08', backToHome: '← LLM Visualizer home' },
    eyebrow: 'CHAPTER 07 · DETOKENIZATION & LOOP',
    hero: {
      title1: 'A model never generates a whole sentence at once — it generates',
      titleHighlight: 'one token at a time, in a loop',
      title2: '',
      lede:
        "After steps 1–6, the model has produced one token. It detokenizes that token back into text, appends it to the input, and runs all six steps again to produce the next token. This loop continues until a stop condition triggers — and that's where most of the production-engineering knobs live: streaming, max_tokens, stop sequences, KV cache.",
    },
    outro: {
      body:
        "That's the full pipeline — input text in, one token out, repeated until done. From here, you have a complete mental model of how an LLM produces text.",
      backHome: '← Back to home',
      next: 'Back to start →',
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
  // ============== TOKENIZATION ==============
  tokenization: {
    nav: { pageIndex: '01 / 08', backToHome: '← LLM Visualizer 首页' },
    eyebrow: '分词 · Tokenization',
    hero: {
      title1: '模型不是按"字"读你的话，而是',
      titleHighlight: '按 token',
      lede:
        'token 是模型的基本"识别单位"——可能是一个完整的词、一个词缀、半个汉字、或单纯的字节。你看到的"字数"和模型看到的"token 数"经常对不上，这个差异直接决定了 API 成本、上下文窗口的真实容量、以及大量产品 bug 的成因。下面 5 节带你彻底搞清楚 token 的来龙去脉。',
    },
    ch1: {
      title1: '先决知识：',
      titleHighlight: '字节、字符、token',
      title2: '是三回事',
      body:
        '字节、字符、token 是三个不同层面，经常被混为一谈。下面用一个互动演示把它们的关系一次讲清——搞懂之后，「为什么 GPT-2 时代中文每字 ≈ 3 token」这种事实就一目了然了。',
      stageLabel: '字符 → 字节 → token 三层 →',
    },
    ch2: {
      title: '动手玩：看模型怎么切你的句子',
      body: '下面这个工具用的是 OpenAI 的真实 tokenizer（前端跑，无需 API）。输入任何中英文 / emoji / 代码，立刻看切分结果。',
      stageLabel: '实时分词 · 你的回合 →',
    },
    ch3: {
      title1: '"中文 token 比英文贵 2-3 倍"——',
      titleHighlight: '这是过时的说法',
      body:
        '从 GPT-2（r50k_base）到 GPT-4o（o200k_base），同一段中文的 token 数往往掉了 50%+。原因不是模型变聪明，而是 BPE 训练数据里加入了大量中文，常见词组被合并成了单个 token。如果你的学习资料里看到"中文每字 2-3 token"——那是 GPT-2 时代的事实。',
      stageLabel: '三个时代的对比 →',
    },
    ch4: {
      title1: '把 token 数',
      titleHighlight: '折算成钱',
      body: '做产品规模化估算时，要算的是"单次 token 数 × 调用次数 × 单价"。常见误区：把单次价格按"几分钱"忽略，一规模化就突然超预算。',
      stageLabel: '规模化成本 →',
    },
    ch5: {
      eyebrow: 'PM 视角',
      title: '从 token 到产品决策',
    },
    outro: {
      body: '切完 token，下一步模型就要把每个 token 映射成一个高维向量（embedding），让"语义相近的词在向量空间里距离近"。这是接下来 Embedding 模块要讲的事。',
      backHome: '← 回到首页',
      next: '下一章 · Embedding →',
    },
  },
  // ============== EMBEDDING ==============
  embedding: {
    nav: { pageIndex: '02 / 08', backToHome: '← LLM Visualizer 首页' },
    eyebrow: '嵌入 · Embedding',
    hero: {
      title1: '每个 token 都被变成',
      titleHighlight: '一组数字',
      lede:
        '切完 token，模型还看不懂。它要先把每个 token 映射成一个高维向量（说人话：一组浮点数，比如 4096 个数字串成一行）——这就是模型"理解"这个 token 的内部表示。语义相近的词，向量在这个高维空间里方向也相近——这就是 RAG / 语义搜索的全部魔法。',
    },
    outro: {
      body: '每个 token 现在都是一个高维向量了。但 Transformer 处理输入时是"并行看所有 token"——它本身不知道谁前谁后。下一步要给每个位置加一个独特的"指纹"，让模型分得清"我打你"和"你打我"。',
      backHome: '← 回到首页',
      next: '下一章 · Positional Encoding →',
    },
  },
  // ============== POSITIONAL ENCODING ==============
  positional: {
    nav: { pageIndex: '03 / 08', backToHome: '← LLM Visualizer 首页' },
    eyebrow: '位置编码 · Positional Encoding',
    hero: {
      title1: 'Transformer 不区分词序——需要给每个位置加一个',
      titleHighlight: '"指纹"',
      lede:
        'embedding 把每个 token 变成了向量——但 Transformer 处理输入时是并行看所有 token，本身没有"先后"概念。这一步要解决的问题：让模型分得清"我打你"和"你打我"。',
    },
    outro: {
      body: '现在每个 token 都带着"语义信息（embedding）"+ "位置信息（PE）"了——下一步才是 LLM 真正的"理解"环节：Transformer 用注意力机制让每个 token 看向其他相关 token，逐层抽象出复杂语义。',
      backHome: '← 回到首页',
      next: '下一章 · Transformer →',
    },
  },
  // ============== TRANSFORMER ==============
  transformer: {
    nav: { pageIndex: '04 / 08', backToHome: '← LLM Visualizer 首页' },
    eyebrow: '变换器 · Transformer',
    hero: {
      title1: '模型怎么',
      titleHighlight: '"理解"',
      title2: '上下文',
      lede:
        '这是 LLM 真正"理解"输入的核心环节。一层 Transformer 主要做两件事：让 token 之间沟通（Attention），让每个 token 自己消化（FFN）。下面我们先建立这两件事的直觉，再讲它们怎么配合工作，最后讲外面包的"工程支持"。',
    },
    outro: {
      body: '走完 N 层 Transformer 之后，每个 token 都被丰富的上下文信息"灌满"了。下一步：把最后一层最后一个 token 的向量映射回整个词表的概率分布——这就是输出层 / Logits。',
      backHome: '← 回到首页',
      next: '下一章 · 输出层 / Logits →',
    },
  },
  // ============== LOGITS ==============
  logits: {
    nav: { pageIndex: '05 / 08', backToHome: '← LLM Visualizer 首页' },
    eyebrow: '输出层 · Logits',
    hero: {
      title1: '从最后一层向量到',
      titleHighlight: '词表概率分布',
      title2: '',
      lede:
        '走完 N 层 Transformer 后，每个位置都是一个 d 维向量。这一步的任务：把最后一个位置的向量映射成"下一个 token 是哪个词的概率"。数学上就两件事：① 乘以 unembedding 矩阵 → logits；② 过 softmax → 概率。',
    },
    outro: {
      body: '有了概率分布——下一步就是从中"挑一个"。直接选概率最高的（贪婪），还是按概率随机抽（多样化）？这就是 Sampling 模块要解决的问题。',
      backHome: '← 回到首页',
      next: '下一章 · Sampling →',
    },
  },
  // ============== LOOP ==============
  loop: {
    nav: { pageIndex: '07 / 08', backToHome: '← LLM Visualizer 首页' },
    eyebrow: '解码循环 · Detokenization & Loop',
    hero: {
      title1: '模型一次只生成一个 token——靠',
      titleHighlight: '循环',
      title2: '写出一段话',
      lede:
        '前 6 个模块讲了模型前向计算的前 6 步（Tokenization → Embedding → Positional → Transformer → Logits → Sampling），只能预测下一个 token。但 LLM 输出一段话靠的是把这个 token 接回输入末尾再走一遍——这一节讲第 7 步 detokenization + 整体循环，以及它衍生的 PM 关切点：streaming 和 max_tokens。',
    },
    outro: {
      body: '走到这里，你已经理解了 LLM 从输入到输出的完整流水线 + 循环机制。最后一个模块是 Prompt 结构——讲 system / user / assistant 三个角色，以及 prompt 注入安全。',
      backHome: '← 回到首页',
      next: '下一章 · Prompt 结构（待开发）',
    },
  },
};

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, zh };
