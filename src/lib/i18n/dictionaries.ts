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
    stepViz: {
      tokenization: {
        header: 'Split result ({n} tokens)',
        caption: '※ Each token maps to a fixed ID in the vocabulary. The same character at different positions may split into different tokens.',
        mythToggleShow: '⚡ A commonly overlooked fact — show',
        mythToggleHide: '⚡ A commonly overlooked fact — hide',
        myth1Title: '"Chinese tokens cost 2-3× more than English" is outdated',
        myth1Body:
          'That was a GPT-2 / GPT-3 era fact — back then tokenizer training data had little Chinese, and each character got byte-level split into 2-3 tokens. GPT-4 (cl100k_base) and GPT-4o (o200k_base) added massive Chinese corpora, and BPE merged common phrases like "中国" / "首都" into a single token. Equivalent Chinese and English now use comparable token counts, usually within ±20%.',
        myth1Example: '"中" in UTF-8 = 3 bytes → cl100k_base split = 1 token',
        myth2Title: '⚠️ Emojis are the real token hogs',
        myth2Body:
          "An emoji takes 4 bytes in UTF-8 and shows up far less often than common Chinese characters in tokenizer training data, so BPE doesn't merge it — it's typically split into 2-3 tokens, several times more expensive than a single Chinese character. When designing prompts: emojis used decoratively in chat UIs look free but are token hogs at billing time.",
        myth2Example: '"🍕" in UTF-8 = 4 bytes → cl100k_base split = 2-3 tokens',
        mythCaveat: '※ Verify any text yourself at tiktokenizer.vercel.app.',
      },
      embedding: {
        header: 'Vector for token "{token}" (first 8 dims shown, actually {dim}-dim)',
        caption: '※ Real vectors are {dim}-dim (only 8 shown here). Semantically similar words sit close in this high-dimensional space.',
        dimTooltip: 'Dim {n}: {value}',
      },
      positional: {
        header: 'Each token gets a position number (pos) added to its vector',
        caption: '※ Transformers don\'t see word order natively. Positional encoding is the unique "fingerprint" added per position so the model can tell "I hit you" from "you hit me."',
      },
      transformer: {
        layersLabel: 'Layers:',
        headsLabel: 'Heads:',
        header: 'Attention weights for token "{token}" (which earlier tokens it looks at)',
        caption: '※ Simplified — averaged over N layers × N heads. Real models have independent attention distributions per layer per head, attending to context from different angles in parallel.',
      },
      logits: {
        header: "Top-5 candidate tokens by probability",
        caption: '※ Real vocabularies have tens of thousands to over 100,000 tokens; only the top 5 by probability are shown.',
      },
      sampling: {
        header: 'Sampled token',
        strategyLabel: 'strategy',
        caption: '※ Sampling strategy (temperature / top-k / top-p) decides how to pick from the distribution. Greedy here always takes the highest-probability token.',
      },
      detokenization: {
        header: 'token id → text → appended to input',
        loopHint: '→ run the 7 steps again to predict the next…',
        caption: '※ A model generates one token at a time. To write a paragraph, it appends each generated token to the input and runs all 7 steps again — until an end token or max_tokens is reached.',
      },
    },
    inlineSwitcher: {
      buttonLabel: '↻ Switch example',
      ariaLabel: 'switch to another preset example',
      heading: 'Preset examples (free input not supported in v0.1)',
      certaintyHigh: 'H',
      certaintyMedium: 'M',
      certaintyLow: 'L',
    },
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
    pmCards: [
      { badge: 'Customer support bot', tempVal: '0.2 – 0.4', topPVal: '0.9', rationale: "Users expect accurate, consistent answers — nobody wants the same question to return a different answer the second time." },
      { badge: 'Creative writing assistant', tempVal: '0.8 – 1.2', topPVal: '0.95', rationale: 'Diverse output is the point; users come here actively expecting surprise.' },
      { badge: 'Code generation', tempVal: '0 – 0.2', topPVal: '0.95', rationale: "Code that's off by a single character won't run; \"creatively correct\" code essentially doesn't exist." },
    ],
    pmCallout: {
      bold: 'An often-overlooked point: ',
      body: 'Top-p is usually more robust than top-k. Top-k applies a fixed cut ("keep 5"), but real distributions vary wildly — sometimes top 5 covers 99% of probability, sometimes only 60%. Top-p dynamically resizes the candidate pool based on the shape of the distribution, better reflecting "how certain the model is at this step."',
    },
    components: {
      paramControls: {
        demoLock: '🔒 Demo mode: temperature and other parameters are frozen. From step 2 onward, the demo follows a pre-generated greedy path showing real distributions. Click "Reset" to go back to step 1 and adjust parameters.',
        tempLabel: 'Temperature',
        tempHelpShort: 'Adjusts the "shape" of the probability distribution',
        tempHelpLong: 'Low temperature = sharpens the distribution; the model almost always picks top-1 (deterministic, repetitive). High temperature = flattens the distribution; low-probability tokens get a chance (more random, more creative, but more error-prone). Mathematically, it\'s a divisor inside softmax.',
        topPLabel: 'Top-p (nucleus)',
        topPHelpShort: 'Dynamically truncate the tail (nucleus sampling)',
        topPHelpLong: 'Sort candidates by probability descending and cumulatively sum until the total exceeds p. p=0.9 means sampling only from the smallest set covering 90% probability. The more certain the distribution, the fewer tokens kept; the flatter, the more tokens kept.',
        topKLabel: 'Top-k (candidates)',
        topKHelpShort: 'Hard cap at the top-k candidates',
        topKHelpLong: "Regardless of the shape of the distribution, keep exactly k candidates. Simple but not adaptive — same top-k=5 may waste capacity in high-confidence cases and be too strict in low-confidence ones. Top-p is more robust in most scenarios.",
        showMore: 'Learn more',
        showLess: 'Hide',
        topKOff: 'off',
        topKValueLabel: 'top',
        tempMark0_2: '0.2 conservative',
        tempMark1: '1.0 default',
        tempMark1_5: '1.5 creative',
        topPMark0_5: '0.5',
        topPMark0_9: '0.9 common',
        topPMark1: '1.0 disabled',
      },
      sampleControls: {
        sampleOnce: '🎲 Sample once (with current params)',
        demoEnded: '✓ Demo complete',
        advanceDemo: '▶ Generate next token (demo)',
        reset: '↺ Reset',
      },
      generatedText: { currentText: 'CURRENT TEXT' },
      exampleSelector: {
        certaintyHigh: 'High certainty',
        certaintyMedium: 'Medium certainty',
        certaintyLow: 'Low certainty',
      },
      distChart: {
        probabilityLabel: 'probability',
        caveatToggleShow: 'ⓘ Is this real data? Show',
        caveatToggleHide: 'ⓘ Is this real data? Hide',
        caveatBody: "Showing the top 20 candidate probabilities returned by the OpenAI API (called at temperature=1.0). When you change temperature, probability is only redistributed among these 20 tokens — the full-vocabulary tail will deviate at high temperatures; this is a teaching simplification.",
      },
      floatingBar: { ariaLabel: 'sampling actions' },
    },
    deepDive: {
      toggle: 'Want more sampling methods?',
      sections: [
        { title: 'Typical Sampling', body: 'Goes beyond raw probability — also considers whether candidate tokens have "information content" close to the average. More stable than top-p in some generation tasks. (paper link TBD · v0.1 mock)' },
        { title: 'Min-p Sampling', body: "Uses a fraction of the top-1 probability as a dynamic cutoff threshold; more robust than fixed top-p in low-certainty scenarios. (paper link TBD · v0.1 mock)" },
        { title: 'Repetition Penalty', body: 'Applies a penalty to the probability of already-generated tokens, mitigating loops where the model repeats the same phrase — but may hurt outputs with legitimate fixed collocations.' },
      ],
      externalNote: 'External: HuggingFace official docs on sampling strategies (TBD · v0.1 mock)',
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
    pmCards: [
      {
        badge: 'Context window',
        title: '"4k context" ≠ 4k Chinese characters',
        body: "The context window is counted in tokens, not characters. GPT-4o's 128k window fits roughly 80–130k Chinese characters or 90–110k English words. When sizing a long-prompt product, estimate capacity in tokens.",
      },
      {
        badge: 'Product bug',
        title: 'Frontend truncating by character → API billing by token',
        body: 'Classic bug: spec says "user input max 500 chars" so the frontend truncates by `string.length`. But emojis, rare characters, and CJK/Latin mixes can produce far more tokens than 500 — overrunning `max_tokens` and getting overcharged. Truncation has to go through the tokenizer.',
      },
      {
        badge: 'Hidden cost',
        title: 'Emojis are the real token hogs',
        body: 'Decorative emojis in chat UIs look free but typically bill at 2–3 tokens each. In customer-service or social-feed style products where emojis are everywhere, they noticeably inflate API cost — more expensive than a Chinese character.',
      },
    ],
    outro: {
      body:
        "Once tokenized, the model maps each token to a high-dimensional vector (an embedding) so that semantically similar words sit close to each other in that space. That's what the Embedding module covers next.",
      backHome: '← Back to home',
      next: 'Next · Embedding →',
    },
    deepDive: {
      toggle: 'Want to know how BPE "learns" these splits?',
      sections: [
        {
          title: 'BPE (Byte-Pair Encoding) in one sentence',
          body: 'On large-scale text, repeatedly do this: find the most frequent byte pair (e.g., "th" is very common in English) and merge it into a new token. Repeat tens of thousands of times and you get a fixed-size vocabulary — containing whole words ("capital"), word fragments ("ing"), and single bytes (fallback for rare characters).',
          caveat: '※ Highly simplified. Real OpenAI / Anthropic tokenizers also do Unicode normalization, special tokens, pre-tokenization, and more.',
        },
        {
          title: "Why GPT-4o's Chinese token count is so much smaller than GPT-3's",
          body: 'Not because the model got smarter — BPE training data added massive amounts of Chinese. Frequent Chinese phrases like "中国" and "首都" got their byte sequences merged into single tokens, so the same Chinese text uses noticeably fewer tokens with the newer tokenizer. The same applies to code (indentation, keywords) and math symbols.',
        },
      ],
      linksHeading: 'Continue reading / playing',
      links: [
        { label: 'Tiktokenizer →', desc: "A more thorough version of this module's interaction — compare more tokenizers including LLaMA / Mistral and other open models" },
        { label: "Karpathy · Let's build the GPT Tokenizer →", desc: '2-hour walkthrough implementing a BPE tokenizer from scratch' },
        { label: 'Sennrich et al. 2015 · The original BPE paper →', desc: 'The paper that brought BPE to NLP' },
        { label: 'OpenAI tiktoken (Python) →', desc: 'js-tiktoken (used here) is a pure-JS port of this Python library' },
      ],
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
    ch1: {
      title1: "What does a token's",
      titleHighlight: '"vector"',
      title2: 'actually look like?',
      intro: 'First, where the vector comes from (a lookup plus a trainable matrix), then what it actually looks like.',
      section1Title: '1.1 · Where the vector comes from — the Embedding matrix',
      section1Body:
        "Every token maps to a fixed vector. These vectors all live in one place: the Embedding matrix — a trainable parameter table at the very first layer of an LLM.",
      section2Title: '1.2 · What a vector actually looks like',
      section2Body: "Now that we know where it comes from, let's look at one — pick a word and slice through a few dimensions of its vector.",
      stageLabel: 'VECTOR SLICE · INSIDE ONE TOKEN →',
    },
    ch2: {
      title1: 'Semantic similarity =',
      titleHighlight: 'short vector distance',
      body:
        "High-dimensional vectors can't be visualized — but we can project them to 2D so you can see the clustering. The example below uses OpenAI text-embedding-3-small (1536-dim) on semantic test data: fruits cluster together, animals together, cities together, time words together — that's what \"semantics\" looks like as geometry.",
      stageLabel: 'CLICK A WORD TO SEE ITS NEAREST NEIGHBORS →',
    },
    ch3: {
      title1: 'How "close" is computed —',
      titleHighlight: 'cosine similarity',
      body: 'The angle between two vectors determines their similarity — a smaller angle means the cosine is closer to 1, meaning closer in meaning. Pick two words to see their angle and similarity score.',
      stageLabel: 'PICK TWO WORDS TO SEE THE ANGLE →',
    },
    ch4: { eyebrow: 'PRODUCT PERSPECTIVE', title: 'From vectors to product decisions' },
    pmCards: [
      {
        badge: 'RAG basis',
        title: 'Why RAG can "find relevant content"',
        body: "RAG = Retrieval-Augmented Generation. Split all knowledge into passages, compute an embedding per passage, store in a vector DB. When the user asks a question, embed it too, find the passages with highest cosine similarity, and stitch them into the prompt — that's the whole magic behind giving an LLM \"instant access\" to private knowledge.",
      },
      {
        badge: 'Cross-lingual',
        title: 'Why "hello" and "你好" return the same results',
        body: 'Modern embedding models trained on multilingual data place semantically equivalent words across languages close in vector space. That\'s the mechanism behind "ask in Chinese, retrieve English docs" — multilingual embeddings are critical for international products.',
      },
      {
        badge: 'Infrastructure',
        title: 'Why vector databases took off',
        body: "Embeddings are 1536- or 3072-dim floats. Searching for cosine similarity over millions or billions of them needs purpose-built approximate-nearest-neighbor (ANN) indexes. Pinecone / Milvus / pgvector exist exactly for this — they're the storage layer of any RAG system.",
      },
    ],
    outro: {
      body:
        "Embeddings give every token a position in semantic space — but at this point the model still has no idea about word order. The next step (Positional Encoding) injects position information into these vectors.",
      backHome: '← Back to home',
      next: 'Next · Positional Encoding →',
    },
    deepDive: {
      toggle: 'Want to know more about embedding techniques?',
      sections: [
        {
          title: 'A brief history of embeddings',
          body: '· Word2Vec (2013): the first truly successful word vectors. The famous "king - man + woman ≈ queen" came from here. · GloVe (2014): a global co-occurrence matrix variant. · BERT (2018): introduced "context-sensitive" embeddings — the same word in different sentences gets different embeddings. · OpenAI text-embedding-3 / Cohere / Voyage etc. (2023+): purpose-built for retrieval — higher dimensions, multilingual, long context.',
        },
        {
          title: 'Distance metrics',
          body: '· Cosine similarity cos(θ): looks only at direction; most embedding models recommend this. · Euclidean distance L2: absolute distance, sensitive to vector magnitude. · Dot product: cosine × magnitude, fastest to compute. OpenAI docs note that for normalized embeddings, cosine and dot product are equivalent.',
        },
      ],
      linksHeading: 'Continue reading / watching',
      links: [
        { label: 'MTEB Leaderboard →', desc: 'The de-facto leaderboard for embedding models — see who wins on which task' },
        { label: 'Jay Alammar · The Illustrated Word2Vec →', desc: 'An illustrated explanation of how embeddings are trained' },
        { label: 'OpenAI Embeddings docs →', desc: 'Official embedding API: usage, dimensions, pricing, best practices' },
        { label: 'pgvector →', desc: 'Adds vector search to PostgreSQL — a practical starting point for RAG projects' },
      ],
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
    ch1: {
      title1: 'Why we need',
      titleHighlight: 'positional encoding',
      body: 'A direct counter-example: the exact same tokens in a different order mean something completely different. If a model can\'t see order, it can\'t tell these two sentences apart.',
      stageLabel: 'SAME THREE WORDS, OPPOSITE MEANING →',
    },
    ch2: {
      title1: 'What positional encoding actually looks like:',
      titleHighlight: 'classic sinusoidal',
      body:
        "The original Transformer paper (Vaswani et al., 2017) uses sin/cos functions to generate a unique vector for each position. Plot it as a heatmap and you can see the characteristic wave pattern.",
      stageLabel: 'A "FINGERPRINT" PER POSITION →',
    },
    ch3: {
      title1: 'Adding the "fingerprint"',
      titleHighlight: 'to the embedding',
      body: "Positional encoding isn't fed to the model separately — it's added directly to the token embedding to produce the final input vector. That way, the same token at different positions becomes different vectors.",
      stageLabel: 'SAME TOKEN AT DIFFERENT POSITIONS →',
    },
    ch4: { eyebrow: 'PRODUCT PERSPECTIVE', title: 'From positional encoding to product decisions' },
    pmCards: [
      {
        badge: 'Context window',
        title: '"128k context" is decided by PE',
        body: "How long an input a model can process is directly tied to PE — classic sinusoidal training fixes the max position. GPT-4o's 128k, Claude's 200k, Gemini's 1M+ contexts all trace back to evolving PE designs (RoPE and ALiBi made position extrapolation feasible).",
      },
      {
        badge: 'Product phenomenon',
        title: 'Lost in the Middle',
        body: 'Even with a long context window, models attend to the middle of a prompt noticeably less than the start or end — a position bias from PE. RAG systems commonly put the most relevant docs first/last; placing key instructions at the end of a prompt is far more effective than burying them in the middle.',
      },
      {
        badge: 'Model selection',
        title: 'RoPE / ALiBi decide "long-context capability"',
        body: 'Modern models almost universally use RoPE (Rotary Position Embedding) or ALiBi (linear bias) instead of classic sinusoidal — both let the model handle inputs far beyond training length. If your product needs extremely long input (legal docs, long papers), check which PE scheme the model uses.',
      },
    ],
    outro: {
      body:
        'Once tokens carry position information, the Transformer can use attention to relate them to each other. That\'s where the next module — the Transformer block itself — comes in.',
      backHome: '← Back to home',
      next: 'Next · Transformer →',
    },
    deepDive: {
      toggle: 'Want to know more positional encoding schemes?',
      sections: [
        {
          title: 'Comparing the three mainstream schemes',
          body: '· Sinusoidal (Vaswani 2017): the version this page demonstrates — a fixed fingerprint generated by pure math functions. Pros: parameter-free, easy to train. Cons: weak extrapolation beyond training length. · RoPE (Rotary Position Embedding, Su et al., 2021): the modern mainstream. Encodes position as a rotation matrix — each position corresponds to a specific rotation angle. LLaMA, ChatGLM, Qwen, DeepSeek all use RoPE. Key advantage: strong long-context extrapolation. · ALiBi (Press et al., 2022): does not explicitly encode position — instead, adds a linear bias to attention scores where "farther = more penalized." BLOOM, MosaicML and others use ALiBi. Key advantage: supports arbitrary-length extrapolation natively.',
        },
        {
          title: 'Why "position extrapolation" is a big deal',
          body: 'If PE was trained on length 2k, asking it to handle 32k inputs makes the model "not understand" positions beyond training range — manifesting as position amnesia or gibberish. Schemes like RoPE / ALiBi / YaRN (frequency-interpolation tricks on RoPE) all aim to make the math of position extrapolate. That\'s why "128k → 1M context" became the main battleground of model competition in 2024.',
        },
      ],
      linksHeading: 'Continue reading',
      links: [
        { label: 'Attention Is All You Need (Vaswani 2017) →', desc: 'The original Transformer paper — sinusoidal PE is in Section 3.5' },
        { label: 'RoFormer (Su 2021) →', desc: 'The original RoPE paper — used by almost every modern LLM' },
        { label: 'Train Short, Test Long: ALiBi (Press 2022) →', desc: "ALiBi paper — the other path to length extrapolation" },
        { label: 'Lost in the Middle (Liu 2023) →', desc: 'Empirical study: content in the middle of long contexts is easily ignored, related to PE' },
        { label: 'Jay Alammar · The Illustrated Transformer →', desc: "Illustrated version — see where PE sits in the overall Transformer architecture" },
      ],
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
    ch1: {
      title1: 'One Transformer layer =',
      titleHighlight: 'two things',
      body: "First, build the intuition: what is this layer actually doing? No math, no implementation details — one diagram and two everyday analogies to capture the core mechanics.",
    },
    ch2: {
      title1: 'Inside attention:',
      titleHighlight: 'Q / K / V',
      title2: 'as three roles',
      body: 'How does "communication" actually happen? Every token plays three roles at once: Query (what to ask), Key (where to look), Value (what to take). A concrete example walks through how the three cooperate to resolve a pronoun reference.',
      stageLabel: 'THREE ROLES IN ACTION →',
    },
    ch3: {
      titleHighlight: 'What each token "looks at"',
      title2: ' — interactive visualization',
      intro: 'In real sentences, attention is most interesting when handling three classes of "hard cases" — without context, a model can\'t answer any of these. The three examples below each correspond to one class; see how attention solves it:',
      cards: [
        { title: 'Coreference', body: 'Which earlier person/thing does a pronoun or generic noun actually refer to. Example: does "她" refer to Lucy or Mary?' },
        { title: 'Long-range dependency', body: 'A verb\'s real object separated by a chain of modifiers. Example: "saw" one stray little black "cat".' },
        { title: 'Contextual ambiguity', body: 'A polysemous word that needs context to disambiguate. Example: "苹果" — the fruit or the company?' },
      ],
      hint: 'Pick an example, hover a token, and watch its attention weights across layers — see attention go from "looking at neighbors" in layer 1 to "understanding meaning across distance" in layer 3.',
      prereqHeading: '📚 Two terms to keep straight before interacting',
      prereqLayerLabel: '🧱 Layer',
      prereqLayerBody: '= a vertical processing stage — the previous layer\'s output is the next layer\'s input. The further up, the deeper the understanding.',
      prereqHeadLabel: '🎭 Head',
      prereqHeadBody: '= a parallel "perspective" within one layer — within a single layer, N heads look at different relationships in parallel (syntax / coreference / sentiment).',
      prereqNote: 'The viz below shows layers (real models have 24-120; here simplified to 3, representing early / middle / deep behavior). Multiple heads per layer are averaged — this keeps the diagram to one line instead of 32.',
      stageLabel: 'HOVER A TOKEN TO SEE ITS ATTENTION →',
    },
    ch4: {
      title1: 'Feed-forward network (',
      titleHighlight: 'FFN',
      title2: '): each token digests on its own',
      body: "After attention lets tokens communicate, FFN gives each token its own pass to 'think' — extracting relevant knowledge and features from its vector. Structurally much simpler than attention, but accounts for 2/3+ of total model parameters.",
    },
    ch5: {
      title1: 'Wrapped in:',
      titleHighlight: 'normalization + residual connections',
      body: "By now you understand attention and FFN as the core mechanisms. But real models don't just chain \"attention → FFN\" directly — two layers of engineering plumbing wrap around them, and without those, networks past a few layers simply won't train.",
      blockIntro: 'With those two concepts in hand, here\'s what they look like inside a single Block:',
      stageLabel: 'FULL BLOCK FLOW →',
    },
    ch6: { eyebrow: 'PRODUCT PERSPECTIVE', title: 'From Transformer to product decisions' },
    pmCards: [
      {
        badge: 'Long-prompt phenomenon',
        title: 'Why long prompts cause "forgetting" of earlier instructions',
        body: 'When a prompt grows long, attention spreads weight across N positions and each one gets a thin slice. This is one cause of long-prompt forgetting — not the only one. PE extrapolation, softmax tail suppression, and training-time length distribution all play roles. Putting key instructions at the prompt\'s end and the most relevant docs at front/back are effective engineering mitigations in RAG.',
      },
      {
        badge: 'Model selection',
        title: 'How heads and layer count shape product experience',
        body: 'More heads = attending to more angles simultaneously (syntax / semantics / coreference); more layers = deeper abstraction and longer-range associations. Both directly inflate parameter count, inference cost, and latency — which is why "lightweight" variants like GPT-4o-mini and Haiku cut heads and layers: faster, but with measurable losses in deep semantic capability.',
      },
      {
        badge: 'Inference cost',
        title: 'Layer count ≈ per-token latency',
        body: 'Generating one token has to traverse N layers. Large LLMs run dozens to over a hundred layers (GPT-3 disclosed 96; GPT-4 / GPT-4o not officially disclosed, estimated ~120). Each layer = attention + FFN + 2 LayerNorms + 2 residuals — all sequential on GPU. More layers → longer per-token latency. Streaming improves perceived performance, but absolute reaction time is layers × per-layer time, almost linearly.',
      },
    ],
    outro: {
      body:
        'After many Transformer layers, the final token sits on a vector rich with context. The output layer then turns that vector into a probability over every word in the vocabulary.',
      backHome: '← Back to home',
      next: 'Next · Output Layer →',
    },
    deepDive: {
      toggle: 'Want more detail on normalization / residual / multi-head?',
      sections: [
        {
          title: 'Pre-Norm vs Post-Norm',
          body: 'Post-Norm (original): puts normalization after the residual. In theory, it normalizes even the "shortcut" path, producing tighter results. But in practice, deep networks easily explode gradients — you need careful learning rate warmup. Pre-Norm (modern mainstream): puts normalization before the residual — LN at every sub-layer entry. Training is more stable; you can stack 100+ layers. The cost: final-layer activations grow over depth, so models add a final LN at the end. GPT, LLaMA, Qwen, Claude all use this.',
        },
        {
          title: 'LayerNorm vs RMSNorm',
          body: 'LayerNorm: subtract mean, divide by stdev, then apply learned γ and β parameters. The original Transformer uses this. RMSNorm: divides by RMS only, no mean subtraction, no β — smaller compute, near-identical effect. LLaMA popularized it; LLaMA / Mistral / Qwen and other open models now almost all use RMSNorm. Formula: LN: y = (x - μ) / σ × γ + β  vs  RMSNorm: y = x / RMS(x) × γ',
        },
        {
          title: 'Why residual connections make deep networks trainable',
          body: "The core is the gradient highway. During backprop, gradients flow from output to input — each layer scales them by its weights. In a 50-layer network, if each layer scales gradients by 0.9×, the shallowest layer only sees 0.9^50 ≈ 0.005× — gradients essentially vanish and shallow layers learn nothing. Residual y = x + F(x) gives gradients a direct channel back to the input (the chain rule picks up a +1 term), so gradients don't decay exponentially with depth. This is why ResNet (vision) and Transformer (NLP) can both be stacked very deep.",
        },
        {
          title: 'Geometric intuition for multi-head',
          body: "With a single head, attention's output space is locked into one attention pattern. Multiple heads partition the high-dim space into N subspaces, each learning a different attention style: head1 might track syntax (verb ↔ subject), head2 coreference (pronoun ↔ noun), head3 sentiment, etc. Each subspace computes its own attention; outputs are concatenated and projected. That's why 32 heads outperform 1.",
        },
      ],
      linksHeading: 'Continue reading / watching',
      links: [
        { label: 'Jay Alammar · The Illustrated Transformer →', desc: 'The classic illustrated Transformer — every step from input to output' },
        { label: "Karpathy · Let's build GPT: from scratch, in code, spelled out →", desc: '2 hours hand-writing GPT — see how every component is built' },
        { label: 'bbycroft.net/llm · 3D LLM visualization →', desc: 'A 3D animation of every token flowing through the whole Transformer — very intuitive' },
        { label: 'Attention Is All You Need (Vaswani 2017) →', desc: 'Original Transformer paper' },
        { label: 'On Layer Normalization in Transformer (Xiong 2020) →', desc: 'Systematic comparison of Pre-Norm vs Post-Norm' },
      ],
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
    ch1: {
      title1: 'From vector to',
      titleHighlight: 'logits',
      body: 'Turning the final-layer vector into logits hinges on one thing: the unembedding matrix. First, where this matrix comes from and how it relates to the original embedding matrix — then how to use it.',
      section1Title: '1.1 · Where the unembedding matrix comes from, and how it relates to embedding',
      section1Body:
        'At the very start, an Embedding matrix translates tokens into vectors. At the very end, an Unembedding matrix reverses that — going from a vector back to the best-matching token. They are two directions of essentially the same mapping.',
      section2Title: '1.2 · How to use the matrix to get logits',
      section2Body: "Multiply the final-layer vector by W_U → you get a logits vector with one entry per vocabulary token. Each row of W_U acts as a \"match template\"; dot-producted with the input vector, a high score means that token fits the current context.",
    },
    ch2: {
      titleHighlight: 'Softmax',
      title2: ': turning logits into probabilities',
      body: "Logits are arbitrary real numbers (from -∞ to +∞) — you can't use them as probabilities directly. Softmax maps them to [0, 1] and makes them sum to 1. Drag the slider to feel it.",
      stageLabel: 'DRAG THE SLIDER TO SEE PROBABILITIES SHIFT →',
    },
    ch3: {
      titleHighlight: 'End-to-end',
      title2: ': walk through with real data',
      body: "Pick an example to see the full pipeline: final-layer vector → unembedding → logits → softmax → probability distribution. This is exactly what the `logprobs` field in the OpenAI / Anthropic APIs is returning.",
      stageLabel: 'FROM VECTOR TO PROBABILITY →',
    },
    ch4: { eyebrow: 'PRODUCT PERSPECTIVE', title: 'From logits to product decisions' },
    pmCards: [
      {
        badge: 'API transparency',
        title: 'Logprobs API lets you see the model\'s "confidence"',
        body: 'OpenAI and Anthropic logprobs APIs surface the real probability distribution at each position — that\'s the output of this step. Common use: gauge "how confident is the model in this answer" (top-1 prob 99% = very confident; only 30% = the model is guessing). Useful for automated evaluation and compliance review.',
      },
      {
        badge: 'Inference cost',
        title: 'Vocabulary size directly affects inference speed',
        body: "Every generated token requires a softmax over the entire vocabulary. GPT-2's 50k vocab vs GPT-4o's 200k vocab — 4× the compute. But a bigger vocab also means finer-grained CJK / multilingual tokenization (see Tokenization chapter). It's a classic model-design trade-off.",
      },
      {
        badge: 'Product capability',
        title: 'Multilingual capability ≈ how many languages live in the vocab',
        body: 'Characters not in the vocab get byte-level split — a typical emoji at 4 bytes or rare Chinese character at 3 bytes goes fully byte-split. When choosing a model, check vocab coverage: if your product needs Thai / Arabic / Ancient Greek, pick a model that includes them, otherwise inference cost and quality both degrade.',
      },
    ],
    outro: {
      body:
        "Now we have a probability distribution over the entire vocabulary. The next step (Sampling) decides how to pick one token from this distribution.",
      backHome: '← Back to home',
      next: 'Next · Sampling →',
    },
    deepDive: {
      toggle: 'Want more detail on Logits / Softmax?',
      sections: [
        {
          title: 'Weight tying: unembedding = transpose of embedding',
          body: 'Many models share weights between the initial embedding matrix and the final unembedding matrix — mathematically, unembedding = transpose of embedding. Two reasons: ① it saves d × |vocab| parameters (for a mid-size LLM with d=4096 and 100k vocab, that\'s ~400M parameters); ② it\'s conceptually natural — embedding goes "token → vector," unembedding goes "vector → token" — two directions of the same mapping.',
        },
        {
          title: 'Where temperature sits mathematically',
          body: 'Temperature is not a new computation — it just divides each logit by T before softmax: P(token i) = exp(logit_i / T) / Σⱼ exp(logit_j / T). T < 1 → logit gaps amplified → sharper distribution (more deterministic); T > 1 → logit gaps flattened → flatter distribution (more random). So temperature controls the "steepness" of softmax at this step, not the model itself.',
        },
        {
          title: 'What Top-K / Top-P actually do',
          body: 'Both operate after softmax, truncating the probability distribution. · Top-K: keep only the K highest-probability tokens, zero out the rest, then renormalize. · Top-P (nucleus): cumulatively sum probabilities from highest down, keep tokens whose cumulative sum reaches P, zero the rest. These do not touch logits — they\'re filters in probability space, used during sampling. Covered in detail in the next module.',
        },
        {
          title: 'Vocabulary size evolution',
          body: '· GPT-2 (r50k_base): 50,257 tokens — mostly English. · GPT-3.5 / GPT-4 (cl100k_base): 100,277 — large multilingual additions including Chinese. · GPT-4o (o200k_base): 200,019 — further multilingual compression. · LLaMA 3: 128,256 tokens. · Qwen 2.5: 151,936 tokens. Bigger vocab → better multilingual compression (fewer tokens per character); but bigger softmax compute per step. A fundamental LLM design trade-off.',
        },
      ],
      linksHeading: 'Continue reading',
      links: [
        { label: 'OpenAI logprobs API docs →', desc: 'How to actually call the API and get logprobs' },
        { label: 'OpenAI Cookbook · Using Logprobs →', desc: 'Use logprobs for model-confidence evaluation, constrained generation, etc.' },
        { label: 'Weight Tying paper (Press & Wolf 2017) →', desc: 'Why sharing embedding and unembedding does not hurt performance' },
      ],
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
    ch1: {
      titleHighlight: 'Autoregressive loop',
      title2: ': append each generated token and run again',
      body: 'Pick an example and click "next token" to step through generation — each click runs one full forward pass (the first 6 modules + decoding back to text). The data reuses the greedy path from the Sampling module.',
      stageLabel: 'CLICK TO ADVANCE ONE TOKEN AT A TIME →',
    },
    ch2: {
      titleHighlight: 'Streaming',
      title2: ': token-by-token vs all-at-once',
      body: "Since tokens are generated one at a time, you can stream them back to the user as they're produced — or wait until generation is complete and return everything at once. Total elapsed time is the same; perceived performance is wildly different.",
      stageLabel: 'CLICK START TO COMPARE →',
    },
    ch3: {
      titleHighlight: 'max_tokens',
      title2: ': the model gets cut off too',
      body: "The loop doesn't run forever — either the model generates an EOS (end-of-sequence) token, or the API's max_tokens cap is reached and generation is force-stopped. The latter is the root cause of \"answer ends mid-sentence\" bugs in production.",
      stageLabel: 'DRAG THE SLIDER TO FEEL THE TRUNCATION →',
    },
    ch4: { eyebrow: 'PRODUCT PERSPECTIVE', title: 'From the generation loop to product decisions' },
    pmCards: [
      {
        badge: 'Perceived performance',
        title: 'Streaming = the canonical perceived-performance case',
        body: "Total elapsed time doesn't change, but UX differs wildly. Whether the first token arrives fast decides the \"is the AI thinking?\" feel. Most chat products default to streaming on — users won't wait 5 seconds for a complete reply but will patiently wait 5 seconds while text streams in one character at a time.",
      },
      {
        badge: 'Streaming caveat',
        title: 'When NOT to enable streaming',
        body: 'Cases where the full output must arrive before display: ① structured output (e.g., JSON) that must be parsed first; ② must pass profanity / safety filters before showing; ③ output will be translated / post-processed / reformatted. Streaming "half-baked" output in these cases leads to inconsistent product state.',
      },
      {
        badge: 'max_tokens',
        title: 'Origin of the "answer ends mid-sentence" bug',
        body: 'Set max_tokens too low → the model gets cut off mid-sentence and the user sees half an answer. Backend should detect `finish_reason === "length"` and surface a friendly cue (e.g., "answer was long, send \'continue\'"). Set too high and the model occasionally pads to length — typical sweet spot is 1.5–2× expected length.',
      },
    ],
    outro: {
      body:
        "That's the full pipeline — input text in, one token out, repeated until done. From here, you have a complete mental model of how an LLM produces text.",
      backHome: '← Back to home',
      next: 'Back to start →',
    },
    deepDive: {
      toggle: 'Want to know the engineering optimizations behind the loop?',
      sections: [
        {
          title: 'KV Cache: stop recomputing past tokens every step',
          body: 'A naive autoregressive loop is slow — every new token would re-run the entire Transformer on all previous tokens. KV Cache caches each token\'s K and V matrices at every layer; the next token only computes its own K/V and uses the cached K/V for attention — entirely skipping past-token computation. This is why LLM inference has a slow first token (called prefill) and fast subsequent tokens (called decode). The pause-then-stream feel you experience: the pause is prefilling the input, the streaming is decoding one token at a time.',
        },
        {
          title: 'Speculative Decoding: a small model guesses, a big model verifies',
          body: 'Since decode is strictly serial (one token at a time), how do you speed it up? Speculative decoding has a small model quickly guess N future tokens, then the large model verifies all N in parallel — if all are correct, N tokens land in one step; if a guess is wrong, rollback to the first error and retry. Typically a 2-3× decode speedup.',
        },
        {
          title: 'Batched inference: multiple requests share one run',
          body: "LLM inference servers (vLLM, TGI, etc.) merge multiple users' requests into one batch. A GPU can compute the same step for several requests at once — average throughput multiplies. The cost: slight latency increase (waiting for the batch). This is why OpenAI / Anthropic APIs occasionally slow down at peak — not the model getting slower, but batches queueing.",
        },
        {
          title: 'Early-step bias amplification ("the more it says, the more it strays")',
          body: 'Because each step is conditioned on all prior outputs, picking the wrong first token can derail the whole answer. This is one mechanistic root of LLM hallucination — once the model says "Paris is the capital of Germany," it will fabricate consistent-sounding reasons afterward. Chain-of-thought robustness suffers from the same bias. Mitigations: beam search (maintain multiple candidate paths), self-consistency (sample multiple times and take the consensus), retrieval (let the model see real information).',
        },
      ],
      linksHeading: 'Continue reading',
      links: [
        { label: 'vLLM →', desc: 'The most popular open-source LLM inference engine — KV cache + PagedAttention + speculative decoding all implemented' },
        { label: 'Speculative Decoding paper (Leviathan 2022) →', desc: 'The original idea of small-model-guess + large-model-verify' },
        { label: 'OpenAI Streaming API docs →', desc: 'How to actually integrate streaming into your product (SSE protocol)' },
      ],
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
    stepViz: {
      tokenization: {
        header: '切分结果（{n} 个 token）',
        caption: '※ 每个 token 都对应词表里的一个固定编号（id）。同一个汉字在不同位置可能切成不同 token。',
        mythToggleShow: '⚡ 一个常被忽略的事实 展开',
        mythToggleHide: '⚡ 一个常被忽略的事实 收起',
        myth1Title: '"中文 token 比英文贵 2-3 倍" 是过时的认知',
        myth1Body:
          '这是 GPT-2/GPT-3 时代的事实——那会儿 tokenizer 训练数据中文少，每个汉字会被 byte-level 拆成 2-3 个 token。GPT-4（cl100k_base）和 GPT-4o（o200k_base）训练数据里加了大量中文，BPE 把"中国""首都"这种常见词组合并成 1 个 token。现在同义中英文 token 数已经基本持平，差异通常 ±20% 以内。',
        myth1Example: '"中" 字 UTF-8 = 3 字节 → cl100k_base 切分 = 1 token',
        myth2Title: '⚠️ Emoji 才是真正的 token 大户',
        myth2Body:
          '一个 emoji 在 UTF-8 里占 4 字节，且 tokenizer 训练数据里出现频率远低于常见汉字，BPE 没合并——通常被拆成 2-3 个 token，比一个汉字贵几倍。在做 prompt 时要留意：chat UI 里的 emoji 装饰看起来"免费"，实际计费时是 token 大户。',
        myth2Example: '"🍕" UTF-8 = 4 字节 → cl100k_base 切分 = 2-3 token',
        mythCaveat: '※ 实测可去 tiktokenizer.vercel.app 输入任意文本看真实切分。',
      },
      embedding: {
        header: 'token "{token}" 的向量（前 8 维示意，实际 {dim} 维）',
        caption: '※ 真实向量 {dim} 维（这里只能示意 8 维）。语义相近的词在这个高维空间里距离近。',
        dimTooltip: '第 {n} 维：{value}',
      },
      positional: {
        header: '每个 token 的位置编号（pos）会被加到向量上',
        caption: '※ Transformer 本身不区分词序——位置编码就是给每个位置加一个独特"指纹"，让模型分得清"我打你"和"你打我"。',
      },
      transformer: {
        layersLabel: '层数：',
        headsLabel: '注意力头：',
        header: 'token "{token}" 的注意力权重（看向哪些上文）',
        caption: '※ 这是 N 层 × N 头平均后的简化版。真实模型每一层每个头都有独立的注意力分布，能从不同角度同时关注上下文。',
      },
      logits: {
        header: '模型输出的 top 5 候选词概率',
        caption: '※ 完整词表有数万到十几万个 token，这里只显示概率最高的 5 个。',
      },
      sampling: {
        header: '采样结果',
        strategyLabel: '策略',
        caption: '※ 采样策略（temperature / top-k / top-p）决定从概率分布里怎么挑——这里用 greedy 永远选概率最高的那个。',
      },
      detokenization: {
        header: 'token id → 文字 → 接回输入',
        loopHint: '→ 再来一遍预测下一个…',
        caption: '※ 模型一次只生成一个 token；要写一段话，就把生成的 token 接回输入末尾、再走一遍这 7 步——直到遇到结束 token 或达到 max_tokens。',
      },
    },
    inlineSwitcher: {
      buttonLabel: '↻ 换其他文本',
      ariaLabel: '切换其他预设例子',
      heading: '预设例子（v0.1 暂不支持自由输入）',
      certaintyHigh: '高',
      certaintyMedium: '中',
      certaintyLow: '低',
    },
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
    pmCards: [
      { badge: '客服机器人', tempVal: '0.2 - 0.4', topPVal: '0.9', rationale: '用户期望准确、稳定的回答；不希望同一问题第二次问得到不同答复。' },
      { badge: '创意写作助手', tempVal: '0.8 - 1.2', topPVal: '0.95', rationale: '需要多样化产出；用户主动来这里，预期会有惊喜。' },
      { badge: '代码生成', tempVal: '0 - 0.2', topPVal: '0.95', rationale: '代码错一个字符就跑不了；几乎不存在"创意正确"的代码。' },
    ],
    pmCallout: {
      bold: '一个常被忽略的点：',
      body: 'Top-p 通常比 Top-k 更鲁棒。Top-k 是固定砍一刀（"只留 5 个"），但实际分布形态差别很大——有时 top 5 已经覆盖 99% 概率，有时 top 5 才覆盖 60%。Top-p 能根据分布形态动态调整候选池大小，更能反映"模型在这一步有多确定"。',
    },
    components: {
      paramControls: {
        demoLock: '🔒 演示模式：温度等参数已被冻结。第二步起按预生成的 greedy 路径展示真实分布。点"重置"可回到第一步重新调参。',
        tempLabel: 'Temperature（温度）',
        tempHelpShort: '调整概率分布的"形状"',
        tempHelpLong: '低温 = 锐化分布，模型几乎一定挑 top-1（输出确定、刻板）；高温 = 拉平分布，让低概率的词也有机会（输出更随机、有创意，但也更易胡说）。数学上是 softmax 里的一个除数。',
        topPLabel: 'Top-p（核采样）',
        topPHelpShort: '动态截断尾部概率（核采样）',
        topPHelpLong: '把候选词按概率从高到低排，累加直到超过 p。p=0.9 就是只在覆盖 90% 概率的那批词里挑。分布越确定，被保留的词越少；分布越平，被保留的词越多。',
        topKLabel: 'Top-k（候选数）',
        topKHelpShort: '硬性只保留前 k 个候选词',
        topKHelpLong: '不管分布形态如何，固定砍一刀只留 k 个。简单但不"自适应"——同样 top-k=5，在高确定性场景可能浪费、在低确定性场景可能太严苛。多数场景用 top-p 更鲁棒。',
        showMore: '了解更多',
        showLess: '收起',
        topKOff: '不启用',
        topKValueLabel: 'top',
        tempMark0_2: '0.2 保守',
        tempMark1: '1.0 默认',
        tempMark1_5: '1.5 创意',
        topPMark0_5: '0.5',
        topPMark0_9: '0.9 常用',
        topPMark1: '1.0 不启用',
      },
      sampleControls: {
        sampleOnce: '🎲 采样一次（按当前参数）',
        demoEnded: '✓ 演示已结束',
        advanceDemo: '▶ 再生成一个 token（演示）',
        reset: '↺ 重置',
      },
      generatedText: { currentText: '当前文本' },
      exampleSelector: {
        certaintyHigh: '高确定性',
        certaintyMedium: '中等确定性',
        certaintyLow: '低确定性',
      },
      distChart: {
        probabilityLabel: '概率',
        caveatToggleShow: 'ⓘ 这是真实数据吗？展开',
        caveatToggleHide: 'ⓘ 这是真实数据吗？收起',
        caveatBody: '展示的是 OpenAI API 返回的 top 20 候选词真实概率（temperature=1.0 调用）。调温度时只在这 20 个词之间重新分配概率——完整词表的尾部分布在调高温度时会有偏差，是为教学演示做的近似。',
      },
      floatingBar: { ariaLabel: '采样操作' },
    },
    deepDive: {
      toggle: '想了解更多 Sampling 方法？',
      sections: [
        { title: 'Typical Sampling', body: '不只看概率高低，还看候选词的"信息量"是否接近平均。在某些生成任务中比 top-p 更稳。（论文链接待补 · v0.1 mock）' },
        { title: 'Min-p Sampling', body: '按 top-1 概率的某个比例作为阈值动态截断，比固定 top-p 在低确定性场景下更鲁棒。（论文链接待补 · v0.1 mock）' },
        { title: 'Repetition Penalty', body: '对已生成过的 token 的概率施加惩罚，缓解模型反复说同一句话的问题——但可能损伤一些固定搭配的输出。' },
      ],
      externalNote: '外链：Hugging Face 关于采样策略的官方文档（待补 · v0.1 mock）',
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
    pmCards: [
      {
        badge: '上下文窗口',
        title: '"4k 上下文"≠ 4k 中文字',
        body: '上下文窗口是按 token 算的，不是按字。GPT-4o 的 128k 窗口装中文大约 80-130k 字，装英文大约 90-110k 词。做长 prompt 产品时，估算容量要按 token 数算。',
      },
      {
        badge: '产品 Bug',
        title: '前端按字符截断 → 模型按 token 计费',
        body: '常见 bug：产品定义"用户输入最多 500 字"，按 string.length 截断。但 emoji / 生僻字 / 中英混合的实际 token 数可能远超 500——既超出 max_tokens 限制、又被 API 多收费。截断逻辑要按 tokenizer 算。',
      },
      {
        badge: '隐藏成本',
        title: 'Emoji 是 token 大户',
        body: 'Chat UI 里的 emoji 装饰看着免费，实际计费时一个 emoji 通常 = 2-3 个 token。在客服 / 朋友圈风格的产品中，emoji 大量出现会显著抬高 API 成本——比一个汉字还贵。',
      },
    ],
    outro: {
      body: '切完 token，下一步模型就要把每个 token 映射成一个高维向量（embedding），让"语义相近的词在向量空间里距离近"。这是接下来 Embedding 模块要讲的事。',
      backHome: '← 回到首页',
      next: '下一章 · Embedding →',
    },
    deepDive: {
      toggle: '想了解 BPE 是怎么"学"出这些切分的？',
      sections: [
        {
          title: 'BPE（Byte-Pair Encoding）一句话原理',
          body: '在大规模文本上反复做这件事：找到出现频率最高的 byte 对（比如"th"在英文里很常见），把它合并成一个新的 token。重复几万次，就得到了一个大小固定的"词表"。这个词表里既有完整词（"capital"），也有词缀（"ing"），也有单字节（生僻字 fallback 用）。',
          caveat: '※ 这是一个高度简化的描述。OpenAI / Anthropic 的实际 tokenizer 还做了 unicode 归一化、特殊 token、pre-tokenization 等额外处理。',
        },
        {
          title: '为什么 GPT-4o 的中文 token 数远小于 GPT-3',
          body: '不是模型变聪明了——是 BPE 训练数据里加入了大量中文。频繁出现的"中国""首都"这类常见词组的 byte 序列被合并成了单个 token，所以同样的中文文本，新 tokenizer 的 token 数明显减少。同样的事也发生在代码（缩进、关键词）和数学符号上。',
        },
      ],
      linksHeading: '可以接着读 / 玩',
      links: [
        { label: 'Tiktokenizer →', desc: '本模块同款交互的更全面版本，可对比更多 tokenizer 包括 Llama / Mistral 等开源模型' },
        { label: "Karpathy · Let's build the GPT Tokenizer →", desc: '2 小时手把手实现一个 BPE tokenizer' },
        { label: 'Sennrich et al. 2015 · BPE 原始论文 →', desc: '把 BPE 引入 NLP 的开山之作' },
        { label: 'OpenAI tiktoken（Python 库）→', desc: '本模块前端用的是 js-tiktoken，是这个 Python 库的纯 JS port' },
      ],
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
    ch1: {
      title1: '一个 token 长什么样的',
      titleHighlight: '"向量"',
      title2: '',
      intro: '先讲清楚向量从哪里来（一个查表操作 + 一个可学习的矩阵），再具体看它长什么样。',
      section1Title: '1.1 · 向量从哪里来？— Embedding 矩阵',
      section1Body:
        '每个 token 都对应一个固定的向量——这些向量集中存储在一个叫 Embedding 矩阵的地方。它是一个被模型训练出来的可学习参数表，是 LLM 整个网络最开头的一层。',
      section2Title: '1.2 · 具体看一个向量长什么样',
      section2Body: '知道了它从哪里来，看个具体的——选个词，把它的向量"切"开几维看一眼。',
      stageLabel: '向量切片 · 一个 token 内部 →',
    },
    ch2: {
      title1: '语义相近 =',
      titleHighlight: '向量距离近',
      body:
        '高维向量不可视化——但我们可以把它降维到 2D 让你"看见"这种聚类感。下面用 OpenAI text-embedding-3-small（1536 维）的语义示例数据：水果聚一起、动物聚一起、城市聚一起、时间词聚一起——这就是"语义"在向量空间里的样子。',
      stageLabel: '点击词看最近邻 →',
    },
    ch3: {
      title1: '怎么算"距离近"——',
      titleHighlight: '余弦相似度',
      body: '两个向量之间的"夹角"决定了它们的相似度——夹角越小，余弦值越接近 1，语义越接近。选两个词看看它们的夹角和相似度数值。',
      stageLabel: '选两个词看夹角 →',
    },
    ch4: { eyebrow: 'PM 视角', title: '从向量到产品决策' },
    pmCards: [
      {
        badge: 'RAG 的基础',
        title: '为什么 RAG 能"找到相关内容"',
        body: 'RAG = Retrieval-Augmented Generation。把所有知识切成段落、各自算出 embedding，存进向量数据库；用户提问时把问题也算成 embedding，找余弦相似度最高的那几段拼进 prompt——这就是大模型"瞬间记住"私有知识的全部魔法。',
      },
      {
        badge: '跨语言能力',
        title: '"hello"和"你好"为什么搜出同样结果',
        body: '现代 embedding 模型在多语言数据上训练后，不同语言里语义相同的词在向量空间里距离很近。这就是"用中文问也能查到英文文档"的底层机制——多语言 embedding 是国际化产品的关键。',
      },
      {
        badge: '基础设施',
        title: '向量数据库为什么火了',
        body: 'embedding 是 1536 / 3072 维浮点数。要在百万、亿级规模上做余弦相似度搜索，需要专门的近似最近邻（ANN）索引。Pinecone / Milvus / pgvector 等向量数据库做的就是这件事——它们是 RAG 系统的存储基础设施。',
      },
    ],
    outro: {
      body: '每个 token 现在都是一个高维向量了。但 Transformer 处理输入时是"并行看所有 token"——它本身不知道谁前谁后。下一步要给每个位置加一个独特的"指纹"，让模型分得清"我打你"和"你打我"。',
      backHome: '← 回到首页',
      next: '下一章 · Positional Encoding →',
    },
    deepDive: {
      toggle: '想了解更多 embedding 技术？',
      sections: [
        {
          title: 'embedding 的演变史',
          body: '· Word2Vec (2013)：第一代真正成功的词向量。"king - man + woman ≈ queen" 就是它带火的。· GloVe (2014)：基于全局共现矩阵的版本。· BERT (2018)：引入"上下文敏感" embedding——同一个词在不同句子里 embedding 不同。· OpenAI text-embedding-3 / Cohere / Voyage 等（2023+）：专门为检索优化的模型，纬度更高、跨语言、超长上下文。',
        },
        {
          title: '距离度量方法',
          body: '· 余弦相似度 cos(θ)：只看方向，多数 embedding 模型推荐用这个。· 欧氏距离 L2：看绝对距离，对向量长度敏感。· 点积 dot product：余弦 × 长度，速度最快，OpenAI 文档推荐 cos 和 dot 都行（embedding 已 normalize 后两者相同）。',
        },
      ],
      linksHeading: '可以接着读 / 看',
      links: [
        { label: 'MTEB Leaderboard →', desc: 'embedding 模型的事实标准排行榜，看谁在哪个任务最强' },
        { label: 'Jay Alammar · The Illustrated Word2Vec →', desc: '用图解清晰解释 embedding 的训练原理' },
        { label: 'OpenAI Embeddings 文档 →', desc: '官方 embedding API 用法 + 维度 / 价格 / 最佳实践' },
        { label: 'pgvector →', desc: '直接给 PostgreSQL 加向量搜索能力——RAG 项目的实用起点' },
      ],
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
    ch1: {
      title1: '为什么需要',
      titleHighlight: '位置编码',
      body: '一个直观的反例：完全相同的 token，顺序不同语义就完全不同。如果模型看不到顺序，它就分不清这两句话。',
      stageLabel: '同样三个字，意思相反 →',
    },
    ch2: {
      title1: '位置编码长什么样：',
      titleHighlight: '经典 sinusoidal',
      body: '原始 Transformer 论文（Vaswani 2017）用 sin / cos 函数给每个位置生成一个独特向量。把它画成 heatmap，能看到典型的"波浪图案"。',
      stageLabel: '每个位置的"指纹" →',
    },
    ch3: {
      title1: '把"指纹"',
      titleHighlight: '加到 embedding 上',
      body: '位置编码不是单独传给模型的——它直接加到 token embedding 上，得到"最终输入向量"。这样同一个 token 在不同位置就变成了不同的向量。',
      stageLabel: '同一个 token 在不同位置 →',
    },
    ch4: { eyebrow: 'PM 视角', title: '从位置编码到产品决策' },
    pmCards: [
      {
        badge: '上下文窗口',
        title: '"128k 上下文" 是 PE 决定的',
        body: '模型能处理多长的输入，跟 PE 直接相关——经典 sinusoidal 训练时定了多少位置就只能处理多少。GPT-4o 的 128k、Claude 的 200k、Gemini 的 1M+ 上下文，背后都是 PE 设计的演进（RoPE、ALiBi 让位置外推变得可行）。',
      },
      {
        badge: '产品现象',
        title: 'Lost in the Middle',
        body: '即便上下文窗口够长，模型对 prompt 中间的内容关注度也明显低于开头和结尾——这是 PE 引发的位置偏置。RAG 系统中把最相关文档放最前 / 最后是常见优化策略；让 prompt 关键指令出现在结尾比埋在中间有效得多。',
      },
      {
        badge: '模型选型',
        title: 'RoPE / ALiBi 决定了"长 context 能力"',
        body: '现代模型几乎都用 RoPE（旋转位置编码）或 ALiBi（线性偏置）替代经典 sinusoidal——它们让模型能处理远超训练长度的输入。选模型时如果产品需要超长输入（法律文书、长论文），要看模型用的是哪种 PE 方案。',
      },
    ],
    outro: {
      body: '现在每个 token 都带着"语义信息（embedding）"+ "位置信息（PE）"了——下一步才是 LLM 真正的"理解"环节：Transformer 用注意力机制让每个 token 看向其他相关 token，逐层抽象出复杂语义。',
      backHome: '← 回到首页',
      next: '下一章 · Transformer →',
    },
    deepDive: {
      toggle: '想了解更多位置编码方案？',
      sections: [
        {
          title: '三种主流方案的对比',
          body: '· Sinusoidal（Vaswani 2017）：就是本页面演示的版本——纯数学函数生成的固定指纹。优点是无参数、训练简单；缺点是外推到训练长度之外效果一般。· RoPE（Rotary Position Embedding，Su et al. 2021）：现代主流。把"位置"编码成"旋转矩阵"——每个位置对应一个特定旋转角度。LLaMA、ChatGLM、Qwen、DeepSeek 都用 RoPE。它的关键优点是长 context 外推能力强。· ALiBi（Press et al. 2022）：完全不显式编码位置——而是在 attention 分数上加一个"距离越远惩罚越大"的线性偏置。BLOOM、MosaicML 等用 ALiBi。它的优点是天然支持任意长度外推。',
        },
        {
          title: '为什么"位置外推"是个大问题',
          body: '如果 PE 在 2k 长度上训练，让它处理 32k 的输入时模型会"看不懂"超出训练范围的位置——表现就是"位置失忆"或胡言乱语。RoPE / ALiBi / YaRN（基于 RoPE 的频率插值技巧）等方案的本质是让位置的数学性质能外推，这就是为什么"128k → 1M context"在 2024 年成了模型竞赛的主战场。',
        },
      ],
      linksHeading: '可以接着读',
      links: [
        { label: 'Attention Is All You Need (Vaswani 2017) →', desc: 'Transformer 原始论文，sinusoidal PE 出处（Section 3.5）' },
        { label: 'RoFormer (Su 2021) →', desc: 'RoPE 原始论文，主流大模型几乎都在用' },
        { label: 'Train Short, Test Long: ALiBi (Press 2022) →', desc: 'ALiBi 论文，长度外推的另一条路' },
        { label: 'Lost in the Middle (Liu 2023) →', desc: '实证研究：长 context 中间内容容易被忽略，背后跟 PE 有关' },
        { label: 'Jay Alammar · The Illustrated Transformer →', desc: '图解版本，看 PE 在 Transformer 整体架构里的位置' },
      ],
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
    ch1: {
      title1: '一层 Transformer =',
      titleHighlight: '两件事',
      body: '先建立直觉：这一层在做什么。本章不讲数学、不讲实现细节——只用一张图 + 两个生活化比喻让你抓住核心机制。',
    },
    ch2: {
      title1: 'Attention 内部：',
      titleHighlight: 'Q / K / V',
      title2: '三个角色',
      body: 'Attention 的"沟通"具体怎么做？每个 token 同时扮演三个角色：Query（问什么）、Key（看哪里）、Value（取什么）。用一个具体例子讲清它们怎么配合解决"指代消解"。',
      stageLabel: '三个角色的分工 →',
    },
    ch3: {
      titleHighlight: '每个 token "看"哪里',
      title2: '——互动可视化',
      intro: '实际句子里，attention 最有意思的地方是处理三类"困难情况"——如果模型不"看上下文"，这三类问题就答不对。下面三个例子各对应一类，看看 attention 怎么解决：',
      cards: [
        { title: '指代消解', body: '代词或泛指词究竟指前面哪个具体的人 / 物。例：「她」指 Lucy 还是 Mary？' },
        { title: '长距离依赖', body: '一个动词的真正对象被一堆修饰词隔开。例：「看到」一只流浪的小黑「猫」' },
        { title: '上下文歧义', body: '一个多义词得靠上下文判断到底是哪个意思。例：「苹果」是水果还是公司？' },
      ],
      hint: '选个例子，鼠标悬停某个 token，看它在不同层的注意力权重分布——观察 attention 怎么从第 1 层"看邻居"逐层进化到第 3 层"跨距离理解语义"。',
      prereqHeading: '📚 进入交互前先分清两个名词',
      prereqLayerLabel: '🧱 层（Layer）',
      prereqLayerBody: '= 纵向堆叠的处理阶段——前一层输出给后一层做输入。每往上一层，理解更"深"。',
      prereqHeadLabel: '🎭 头（Head）',
      prereqHeadBody: '= 同一层内并行的"视角"——一个层里 N 个头同时看不同关系（语法 / 指代 / 情感）。',
      prereqNote: '下面演示的是"层"（实际模型有 24-120 层；这里简化成 3 层代表早 / 中 / 深的典型行为）。每层内部的多个头被平均了——这样图能简化到一根连线，而不是 32 根。',
      stageLabel: '悬停 token 看连线 →',
    },
    ch4: {
      title1: '前馈网络（',
      titleHighlight: 'FFN',
      title2: '）：每个 token 自己"消化"',
      body: 'Attention 让 token 之间沟通后，FFN 让每个 token 单独做一遍"思考"——从自身向量里提取相关知识 / 特征。结构远比 attention 简单，但参数量占整个模型的 2/3+。',
    },
    ch5: {
      title1: '外面还要包：',
      titleHighlight: '归一化 + 残差连接',
      body: '到这里你已经理解 Attention 和 FFN 是核心机制。但实际模型不是简单地「Attention → FFN」串起来——外面还包了两层工程支持，没有它们超过几层的网络就训不起来。',
      blockIntro: '理解了两个概念后，看看它们在一个 Block 中具体长什么样：',
      stageLabel: '完整 Block 流程 →',
    },
    ch6: { eyebrow: 'PM 视角', title: '从 Transformer 到产品决策' },
    pmCards: [
      {
        badge: '长 prompt 现象',
        title: '为什么长 prompt 中模型会"忘"前面的指令',
        body: '当 prompt 超长，attention 把权重分散到 N 个位置上，每个位置分到的"关注"自然就稀薄。这是长 prompt 失忆的其中一个原因——不是唯一原因。位置编码（PE）的外推能力、softmax 的尾部抑制、训练时的长度分布都有影响。RAG 系统中把关键指令放 prompt 末尾、最相关文档放前后，是有效的工程缓解。',
      },
      {
        badge: '模型选型',
        title: 'heads 和 layers 数怎么影响产品体验',
        body: '更多 heads = 同时关注更多角度（语法 / 语义 / 指代）；更多 layers = 抽象层级更深，能建立更长距离的关联。但都直接增加参数量、推理成本和延迟——这是为什么 GPT-4o-mini / Haiku 等"轻量版"会减少 heads 和 layers，速度更快但深层语义能力会有损失。',
      },
      {
        badge: '推理成本',
        title: 'layers 数 ≈ 单 token 推理时长',
        body: '生成一个 token 要走完 N 层。大型 LLM 估计有几十到上百层（如 GPT-3 公开是 96 层；GPT-4 / GPT-4o 未公开但业界估计 ~120 层），每层包含 attention + FFN + 两次 LayerNorm + 两次残差——这些都是 GPU 顺序执行的。模型层数越多、单 token 延迟越长。streaming 输出能让感知性能不那么差，但绝对的"模型反应时间"是 layers × 单层耗时，几乎线性。',
      },
    ],
    outro: {
      body: '走完 N 层 Transformer 之后，每个 token 都被丰富的上下文信息"灌满"了。下一步：把最后一层最后一个 token 的向量映射回整个词表的概率分布——这就是输出层 / Logits。',
      backHome: '← 回到首页',
      next: '下一章 · 输出层 / Logits →',
    },
    deepDive: {
      toggle: '想了解归一化 / 残差 / 多头的更多细节？',
      sections: [
        {
          title: 'Pre-Norm vs Post-Norm',
          body: 'Post-Norm（原始版）：把归一化放在残差之后。理论上能让信号"绕过去"的部分也被归一化，效果更紧致。但实际训练时，深层网络容易梯度爆炸——需要小心调 learning rate warmup。Pre-Norm（现代主流）：把归一化放在残差之前，把 LN 放在每个子层入口。训练更稳，能堆 100+ 层。代价是末层数值范围会越来越大——所以模型最后还需要一个 final LN。GPT、LLaMA、Qwen、Claude 等几乎都用这个。',
        },
        {
          title: 'LayerNorm vs RMSNorm',
          body: 'LayerNorm：减均值、除标准差、再加可学习的 γ 和 β 参数。原始 Transformer 用这个。RMSNorm：只除"均方根"，不减均值、不要 β——计算量更小、效果几乎相同。LLaMA 把它带火了，现在 LLaMA / Mistral / Qwen 等开源模型几乎都用 RMSNorm。公式：LN: y = (x - μ) / σ × γ + β  vs  RMSNorm: y = x / RMS(x) × γ',
        },
        {
          title: '残差连接为什么让深层网络可训',
          body: '核心是梯度高速公路。反向传播时，梯度沿网络从输出回流到输入——每经过一层，梯度都被该层的权重缩放。在 50 层网络里，如果每层都把梯度缩成 0.9 倍，最终浅层只剩 0.9^50 ≈ 0.005 倍——梯度几乎消失，浅层学不到东西。残差 y = x + F(x) 让梯度有一条直接通道从输出回流到输入（链式法则里多了一个 +1 项），不会随层数指数衰减。这是 ResNet 在视觉、Transformer 在 NLP 都能堆很深的根本原因。',
        },
        {
          title: 'Multi-Head 的几何直觉',
          body: '如果只有一个 head，attention 的输出空间被压在"单一关注模式"里。多头让模型把高维空间切成 N 个子空间，每个子空间学一种关注方式：head1 可能关注语法（动词 ↔ 主语）、head2 关注指代（代词 ↔ 名词）、head3 关注情感等。N 个子空间各算各的 attention，最后拼接 + 投影。这就是为什么 32 头比 1 头表现好。',
        },
      ],
      linksHeading: '可以接着读 / 看',
      links: [
        { label: 'Jay Alammar · The Illustrated Transformer →', desc: '最经典的图解 Transformer，从输入到输出每步都画' },
        { label: "Karpathy · Let's build GPT: from scratch, in code, spelled out →", desc: '2 小时手写 GPT，看每个组件怎么写出来' },
        { label: 'bbycroft.net/llm · 3D 可视化 LLM →', desc: '每个 token 经过整个 Transformer 的 3D 动画——非常直观' },
        { label: 'Attention Is All You Need (Vaswani 2017) →', desc: '原始 Transformer 论文' },
        { label: 'On Layer Normalization in Transformer (Xiong 2020) →', desc: 'Pre-Norm vs Post-Norm 的系统比较' },
      ],
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
    ch1: {
      title1: '从向量到',
      titleHighlight: 'Logits',
      body: '把最后一层向量映射成 logits 的关键，是 unembedding 矩阵。先讲清楚这个矩阵从哪来、跟开头的 embedding 矩阵是什么关系——再看它怎么用。',
      section1Title: '1.1 · Unembedding 矩阵从哪来？跟 Embedding 是什么关系？',
      section1Body: '模型最开头有一个 Embedding 矩阵把 token 翻译成向量；最末尾有个 Unembedding 矩阵反过来，从向量找回最匹配的 token。它们其实是同一映射的两个方向。',
      section2Title: '1.2 · 矩阵怎么用？得到 Logits',
      section2Body: '最后一层向量乘以 W_U → 得到词表大小的 logits 向量。每一行的"匹配模板"跟向量做点积，分数高 = 这个 token 跟当前上下文匹配。',
    },
    ch2: {
      titleHighlight: 'Softmax',
      title2: '：把 logits 变成概率',
      body: 'Logits 是任意实数（负无穷到正无穷）——不能直接当概率用。Softmax 把它们映射到 [0, 1] 区间且总和为 1。拖滑块感受一下。',
      stageLabel: '拖滑块看概率怎么变 →',
    },
    ch3: {
      titleHighlight: '完整流程',
      title2: '：用真实数据走一遍',
      body: '选个例子，看最后一层向量 → unembedding → logits → softmax → 概率分布整条流水线。这就是 OpenAI / Anthropic API 里 logprobs 的来源。',
      stageLabel: '从向量到概率 →',
    },
    ch4: { eyebrow: 'PM 视角', title: '从 Logits 到产品决策' },
    pmCards: [
      {
        badge: 'API 透明度',
        title: 'Logprobs API 让你看到模型的"信心"',
        body: 'OpenAI、Anthropic 的 logprobs API 让你看到模型在每个位置的真实概率分布——它就是这一步的输出。最常见的用法：判断"模型对这个回答有多有把握"（top-1 概率 99% = 很自信；只有 30% = 模型在猜）。这对自动化评估、合规审查很有用。',
      },
      {
        badge: '推理成本',
        title: '词表大小直接影响推理速度',
        body: '每生成一个 token 都要算一次 vocab 大小的 softmax。GPT-2 的 50k 词表 vs GPT-4o 的 200k 词表——计算量翻 4 倍。但词表大也意味着更精细的中文 / 多语言切分（前面 Tokenization 章节看过）。这是模型设计的经典 trade-off。',
      },
      {
        badge: '产品能力',
        title: '多语言能力 ≈ 词表里有多少种语言',
        body: '词表里没收录的字符会按 byte 拆——典型 emoji 一个 4 字节、生僻字一个 3 字节，全部按字节级拆开。所以选模型时看词表覆盖：如果产品要支持泰语 / 阿拉伯语 / 古希腊语，得选词表里包含的模型，否则推理成本和质量都会变差。',
      },
    ],
    outro: {
      body: '有了概率分布——下一步就是从中"挑一个"。直接选概率最高的（贪婪），还是按概率随机抽（多样化）？这就是 Sampling 模块要解决的问题。',
      backHome: '← 回到首页',
      next: '下一章 · Sampling →',
    },
    deepDive: {
      toggle: '想了解更多 Logits / Softmax 的细节？',
      sections: [
        {
          title: 'Weight Tying：embedding = unembedding 转置',
          body: '很多模型让最开始的 embedding 矩阵和最后的 unembedding 矩阵共享权重——数学上 unembedding = embedding 的转置。原因有两个：① 节省 d × |vocab| 的参数量（对一个 d=4096 + 100k 词表的中型 LLM ≈ 4 亿参数）；② 概念上自然——embedding 是"token 到向量"，unembedding 是"向量到 token"，是同一个映射的两个方向。',
        },
        {
          title: 'Temperature 在数学上的位置',
          body: 'temperature 不是新计算——它就是在 softmax 之前把每个 logit 除以 T：P(token i) = exp(logit_i / T) / Σⱼ exp(logit_j / T)。T < 1 → logits 差距被放大 → 分布更尖锐（更确定）；T > 1 → logits 差距被压平 → 分布更平（更随机）。所以 temperature 调的不是模型本身，是这一步 softmax 的"陡峭程度"。',
        },
        {
          title: 'Top-K / Top-P 实际在做什么',
          body: '这两个参数在 softmax 之后对概率分布做截断：· Top-K：只保留概率最高的 k 个，其余置 0，剩下的重新归一化。· Top-P（nucleus）：按概率从高到低累加，超过 p 的那批保留，其余置 0。这两个参数不影响 logits 本身——它们是 sampling 阶段在概率空间里的过滤器。下一步 Sampling 模块详细讲。',
        },
        {
          title: '词表大小演变',
          body: '· GPT-2 (r50k_base)：50,257 tokens — 主要是英文。· GPT-3.5 / GPT-4 (cl100k_base)：100,277 — 加入大量中文等多语言。· GPT-4o (o200k_base)：200,019 — 进一步优化多语言压缩。· Llama 3：128,256 tokens。· Qwen 2.5：151,936 tokens。词表越大 → 多语言压缩越好（每字符 token 数更少）；但每步 softmax 计算量越大。是 LLM 设计的基础 trade-off。',
        },
      ],
      linksHeading: '可以接着读',
      links: [
        { label: 'OpenAI logprobs API 文档 →', desc: '实际怎么调 API 拿 logprobs' },
        { label: 'OpenAI Cookbook · Using Logprobs →', desc: '用 logprobs 做模型确定性评估、约束生成等场景' },
        { label: 'Weight Tying 论文（Press & Wolf 2017）→', desc: '为什么共享 embedding 和 unembedding 不损失效果' },
      ],
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
    ch1: {
      titleHighlight: '自回归循环',
      title2: '：每生成一个 token 接回去再来一遍',
      body: '选个例子，点"下一个 token"逐步看模型的生成过程——每点一次就走完一整轮前向计算（前面 6 个模块 + 解码成文字）。数据复用 Sampling 模块的 greedy 路径。',
      stageLabel: '点击逐 token 推进 →',
    },
    ch2: {
      titleHighlight: 'Streaming',
      title2: '：一字一字蹦出 vs 等齐了再出',
      body: '既然 token 是一个一个生成的，那就可以一边生成一边返回给用户（streaming），或者等所有 token 都生成完一次性返回。两种模式总耗时相同，但用户感知天差地别。',
      stageLabel: '点开始看对比 →',
    },
    ch3: {
      titleHighlight: 'max_tokens',
      title2: '：模型也会被强行打断',
      body: '循环不会无限走下去——要么模型自己生成 EOS 结束 token，要么达到 API 设的 max_tokens 上限被强制停。后者是产品里"半句话 bug"的元凶。',
      stageLabel: '拖滑块感受截断 →',
    },
    ch4: { eyebrow: 'PM 视角', title: '从生成循环到产品决策' },
    pmCards: [
      {
        badge: '感知性能',
        title: 'Streaming = 感知性能的经典案例',
        body: '总耗时不变，但用户体验差异巨大。第一个 token 是否快速到达决定"AI 是否在思考"的体感。多数对话产品默认开 streaming——用户不会等 5 秒看一个完整回答，但能耐心等 5 秒看一个一字字蹦出的回答。',
      },
      {
        badge: 'Streaming 副作用',
        title: '什么时候不该开 streaming？',
        body: '需要"看到完整输出再展示"的场景：① 输出是 JSON 等结构化数据，必须解析完才能用；② 需要敏感词 / 安全过滤后再展示；③ 输出会被翻译 / 后处理 / 重新排版。这些场景下流式吐出来的"半成品"反而会让产品状态不一致。',
      },
      {
        badge: 'max_tokens',
        title: '"半句话 bug" 的元凶',
        body: 'max_tokens 设小了 → 模型在句子中间硬切，用户看到"半截答案"。后端要检测 finish_reason === "length" 给用户友好提示（比如"回答较长，发送 \'继续\'"）；设大了又会偶尔被模型"凑字数"——典型 1.5-2x 预估长度。',
      },
    ],
    outro: {
      body: '走到这里，你已经理解了 LLM 从输入到输出的完整流水线 + 循环机制。最后一个模块是 Prompt 结构——讲 system / user / assistant 三个角色，以及 prompt 注入安全。',
      backHome: '← 回到首页',
      next: '下一章 · Prompt 结构（待开发）',
    },
    deepDive: {
      toggle: '想了解循环背后的工程优化？',
      sections: [
        {
          title: 'KV Cache：每步不重新算前面的 token',
          body: '一个朴素的"自回归循环"会很慢——每生成一个新 token，都要把之前所有 token 重新过一遍 Transformer。KV Cache 的优化是：每个 token 进入 Transformer 后，把它在每一层的 K 和 V 矩阵存起来。下一个 token 只算自己的 K/V + 用 cache 里的旧 K/V 做 attention——前面 token 的计算完全跳过。这是为什么 LLM 推理时第一个 token 慢（叫 prefill），后续 token 快（叫 decode）。你看到的"思考一会儿，然后流式蹦字"——前者是 prefill 全部 input、后者是 decode 一个 token。',
        },
        {
          title: 'Speculative Decoding：用小模型猜，大模型核对',
          body: '既然 decode 是"一次一个 token"严格串行，怎么提速？Speculative Decoding：让一个小模型快速猜出未来 N 个 token，然后大模型并行验证这 N 个——如果都猜对，N 个 token 一次性出来；如果猜错就回退到第一个错的位置。典型能给 decode 提速 2-3 倍。',
        },
        {
          title: 'Batch 推理：多个请求一起跑',
          body: 'LLM 推理服务（如 vLLM、TGI）会把多个用户的请求合并成 batch 一起跑。GPU 一次能算多个请求的同一个 token——平均吞吐能高几倍。代价是延迟略增（要等 batch 凑齐）。这就是为什么 OpenAI / Anthropic 的 API 在高峰期偶尔变慢——不是模型变慢，是 batch 排队等。',
        },
        {
          title: '早期偏差放大（"越说越跑偏"）',
          body: '因为每一步都基于之前的所有输出，第一个 token 选错可能让整段都跑偏。这是 LLM hallucination 的机制根源之一——模型一旦说了"巴黎是德国首都"，后面就会顺着这个错误编出一堆理由。"链式推理（CoT）"的鲁棒性就是被这种早期偏差打折扣的。缓解方法：beam search（同时维护多条候选路径）、self-consistency（采样多次取共识）、retrieval（让模型看真实信息）。',
        },
      ],
      linksHeading: '可以接着读',
      links: [
        { label: 'vLLM →', desc: '最流行的开源 LLM 推理引擎，KV cache + PagedAttention + speculative decoding 都做了' },
        { label: 'Speculative Decoding 论文（Leviathan 2022）→', desc: '小模型猜 + 大模型核对的原始想法' },
        { label: 'OpenAI Streaming API 文档 →', desc: '怎么在产品里实际接 streaming（SSE 协议）' },
      ],
    },
  },
};

export type Dictionary = typeof en;

export const dictionaries: Record<Locale, Dictionary> = { en, zh };
