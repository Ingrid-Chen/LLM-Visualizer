# i18n 术语对照表

> 本文档是 LLM Visualizer 中英对照的**唯一术语口径**。翻译时严格走这个表；遇到表外术语先扩表再翻。
>
> 来源标注遵循以下缩写：
> - **AIAYN** = Vaswani et al., *Attention Is All You Need* (2017)
> - **DLBOOK** = Goodfellow, Bengio, Courville, *Deep Learning* (2016)
> - **HF** = HuggingFace official docs (huggingface.co/docs)
> - **OAI** = OpenAI official docs (platform.openai.com/docs)
> - **RASCHKA** = Sebastian Raschka, *Build a Large Language Model (From Scratch)* (2024)

## 如何 spot-check 翻译质量

随便挑表里 1-2 个英文词，去 Google 搜索 `"<English term>" LLM` 或 `"<English term>" transformer`，看：
1. 第一页是否出现 HuggingFace / Stanford / OpenAI / arXiv / Sebastian Raschka 等权威源
2. 这些权威源用的是不是这个词

如果是 → 译法可信。如果搜不到或全是非技术内容 → 译法可疑，告诉我重审。

---

## 1. 通用 LLM 概念

| 中文 | English | 来源 |
|---|---|---|
| 大语言模型 | Large Language Model (LLM) | OAI / HF |
| 神经网络 | neural network | DLBOOK Ch 6 |
| 参数 | parameter | DLBOOK |
| 训练 | training | DLBOOK |
| 推理 | inference | OAI / HF |
| 上下文窗口 | context window | OAI |
| 隐藏维度 / 隐状态维度 | hidden dimension / hidden size | RASCHKA Ch 3 |
| 词表 | vocabulary | RASCHKA Ch 2 / HF |
| 模型 | model | — |
| 提示词 / 提示 | prompt | OAI |
| 系统提示 | system prompt | OAI |

## 2. Tokenization

| 中文 | English | 来源 |
|---|---|---|
| 分词 / 词元化 | tokenization | RASCHKA Ch 2 / HF |
| 词元 / token | token | OAI / HF |
| 子词单元 | subword unit | HF tokenizers docs |
| 字节对编码 | Byte-Pair Encoding (BPE) | Sennrich et al., 2015 / HF |
| 编码 (动词) | to encode | HF |
| 解码 (动词) | to decode | HF |
| 字节 | byte | — |
| UTF-8 | UTF-8 | — |
| tokenizer 库 | tokenizer | HF |

## 3. Embedding

| 中文 | English | 来源 |
|---|---|---|
| 词嵌入 | embedding | Mikolov et al., 2013 / DLBOOK Ch 16 |
| 嵌入矩阵 | embedding matrix | RASCHKA Ch 2 |
| 向量 | vector | DLBOOK |
| 高维空间 | high-dimensional space | DLBOOK |
| 余弦相似度 | cosine similarity | DLBOOK |
| 语义关系 | semantic relationship | — |
| 距离 (向量) | distance | DLBOOK |
| 维度 | dimension / dim | RASCHKA |

## 4. Positional Encoding

| 中文 | English | 来源 |
|---|---|---|
| 位置编码 | positional encoding | AIAYN |
| 正弦位置编码 | sinusoidal positional encoding | AIAYN |
| 旋转位置编码 | Rotary Position Embedding (RoPE) | Su et al., 2021 |
| 绝对位置编码 | absolute positional encoding | AIAYN |
| 相对位置编码 | relative positional encoding | Shaw et al., 2018 |

## 5. Transformer / Attention

| 中文 | English | 来源 |
|---|---|---|
| 注意力机制 | attention mechanism | AIAYN |
| 自注意力 | self-attention | AIAYN |
| 多头注意力 | multi-head attention | AIAYN |
| 注意力头 | attention head | AIAYN |
| 注意力分数 / 权重 | attention score / attention weight | AIAYN |
| Query / Key / Value | Query / Key / Value (Q / K / V) | AIAYN |
| 缩放点积注意力 | scaled dot-product attention | AIAYN |
| 前馈网络 | feed-forward network (FFN) | AIAYN |
| 残差连接 | residual connection | He et al., 2015 |
| 层归一化 | layer normalization | Ba et al., 2016 |
| Transformer 块 / 层 | Transformer block / layer | AIAYN / RASCHKA Ch 3 |
| 线性变换 / 投影 | linear projection | AIAYN |
| 矩阵 | matrix | DLBOOK |
| 矩阵乘法 | matrix multiplication | DLBOOK |
| 激活函数 | activation function | DLBOOK |
| GELU | GELU (Gaussian Error Linear Unit) | Hendrycks & Gimpel, 2016 |

## 6. Output Layer / Logits

| 中文 | English | 来源 |
|---|---|---|
| 输出层 | output layer | RASCHKA Ch 4 |
| 反嵌入层 / LM 头 | unembedding layer / LM head | HF |
| 原始分数 / logits | logits | RASCHKA / HF |
| 概率分布 | probability distribution | DLBOOK |
| Softmax 函数 | softmax | DLBOOK / AIAYN |
| 归一化 | normalization | DLBOOK |
| 词表大小 | vocabulary size | RASCHKA |

## 7. Sampling

| 中文 | English | 来源 |
|---|---|---|
| 采样 | sampling | HF generation docs |
| 贪心解码 / 贪心采样 | greedy decoding / greedy sampling | HF |
| argmax | argmax | DLBOOK |
| 温度 (采样参数) | temperature | OAI / HF |
| top-k 采样 | top-k sampling | Fan et al., 2018 / HF |
| top-p 采样 / 核采样 | top-p sampling / nucleus sampling | Holtzman et al., 2019 / HF |
| 候选词 | candidate token | HF |
| 概率质量 | probability mass | DLBOOK |
| 累积概率 | cumulative probability | HF (top-p docs) |
| 重复惩罚 | repetition penalty | HF |
| 随机性 / 多样性 | randomness / diversity | HF |
| 确定性输出 | deterministic output | OAI |

## 8. Decoding Loop / Detokenization

| 中文 | English | 来源 |
|---|---|---|
| 自回归生成 | autoregressive generation | RASCHKA Ch 5 |
| 解码循环 | decoding loop | HF |
| 流式输出 | streaming | OAI |
| 最大生成长度 | max_tokens / max output tokens | OAI |
| 停止条件 | stopping criteria | HF |
| 停止符 | stop sequence / stop token | OAI |
| 结束标记 | end-of-sequence token (EOS) | RASCHKA |
| `finish_reason` | `finish_reason` | OAI |
| 详细化 (token → text) | detokenization | HF |
| KV 缓存 | KV cache | HF |
| 首 token 延迟 | time to first token (TTFT) | industry term |
| 每秒 token 数 | tokens per second (TPS) | industry term |

## 9. 工程 / 产品

| 中文 | English | 来源 |
|---|---|---|
| 产品经理视角 | product perspective | — |
| 工程视角 | engineering perspective | — |
| 实战要点 | practical takeaway | — |
| API 调用 | API call | OAI |
| 模型大小 | model size | — |
| 推理成本 | inference cost | OAI / HF |
| 延迟 | latency | — |
| 吞吐 | throughput | — |
| 上下文长度 | context length | OAI |
| 温度 = 0 | temperature = 0 (deterministic) | OAI |

## 10. 站点专有术语（Site-specific naming）

这些是站点 UI 上的术语，按技术博客风格选词：

| 中文 (原) | English (chosen) | 备注 |
|---|---|---|
| 流水线 (7 步) | pipeline (7 steps) | 用 "pipeline" 而非 "workflow" — Transformer 文献惯例 |
| 深入了解 | Deep dive | HF / Sebastian Raschka 博客常用 |
| PM 视角 | Product perspective | 不直译为 "PM perspective" — 海外 audience 不一定知道 PM 缩写 |
| 实战要点 | What this means in practice | 比直译 "practical takeaway" 更口语化 / 博客风 |
| 试一试 / 演示 | Try it / Walkthrough | — |
| 案例 | Example | — |
| 章节 | Section / Chapter | — |
| 主解读 | Key takeaway | — |
| 注意 / ※ | Note | — |

## 11. 风格规则

1. **句子短而直陈**：避免"为了让...更好地理解，我们需要..."这种长前缀；直接 "X is Y. Y enables Z."
2. **段落 2–3 句**：一段一个观点；超过就拆。
3. **术语首次出现用 inline code 或 italic**：例 — *attention* 或 `softmax`。
4. **避免文学修饰**：不用 "beautifully", "elegantly", "magic" 等；用 "clean", "efficient" 等中性词。
5. **数字精准**：保留中文版的所有具体数字（GPT-2 small: 768 dim, GPT-3 davinci: 12288 dim）— 这些是事实陈述。
6. **名词短语优于问答式标题**：
   - ❌ "How does sampling work?"
   - ✅ "Sampling: from logits to next token"
7. **第二人称 "you"**：技术博客惯用 — "When you raise the temperature, ..."；避免 "we", "let's"。
8. **缩写首次出现给全称**：例 — "Feed-Forward Network (FFN)"，之后用 FFN 即可。

---

## 维护规则

- 翻译过程中遇到表里没有的术语 → **先扩这张表再翻文案**，不允许在 dictionaries.ts 里随手译。
- 任何新增条目必须有"来源"列。
- 如果用户对某个译法有异议 → 改这张表 + 全局替换。
