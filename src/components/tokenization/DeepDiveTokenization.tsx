'use client';

import { useState } from 'react';

// 深入模式 —— 简介 BPE + 外链
// 严格按 CLAUDE.md 准则：事实陈述给来源；简化必须明确标注

export default function DeepDiveTokenization() {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">想了解 BPE 是怎么"学"出这些切分的？</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-2">BPE（Byte-Pair Encoding）一句话原理</h4>
            <p className="text-sm">
              在大规模文本上反复做这件事：找到出现频率最高的 byte 对（比如"th"在英文里很常见），把它合并成一个新的 token。
              重复几万次，就得到了一个大小固定的"词表"。这个词表里既有完整词（"capital"），也有词缀（"ing"），也有单字节（生僻字 fallback 用）。
            </p>
            <p className="text-xs text-text-muted/80 italic mt-2">
              ※ 这是一个高度简化的描述。OpenAI / Anthropic 的实际 tokenizer 还做了 unicode 归一化、特殊 token、pre-tokenization 等额外处理。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">为什么 GPT-4o 的中文 token 数远小于 GPT-3</h4>
            <p className="text-sm">
              不是模型变聪明了——是 BPE 训练数据里加入了大量中文。频繁出现的"中国""首都"这类常见词组的 byte 序列被合并成了单个 token，
              所以同样的中文文本，新 tokenizer 的 token 数明显减少。同样的事也发生在代码（缩进、关键词）和数学符号上。
            </p>
          </div>

          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">可以接着读 / 玩</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a
                  href="https://tiktokenizer.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-ember-dark underline-offset-2 hover:underline"
                >
                  Tiktokenizer →
                </a>{' '}
                <span className="text-text-muted/80">
                  本模块同款交互的更全面版本，可对比更多 tokenizer 包括 Llama / Mistral 等开源模型
                </span>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/watch?v=zduSFxRajkE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-ember-dark underline-offset-2 hover:underline"
                >
                  Karpathy · Let's build the GPT Tokenizer →
                </a>{' '}
                <span className="text-text-muted/80">2 小时手把手实现一个 BPE tokenizer</span>
              </li>
              <li>
                <a
                  href="https://arxiv.org/abs/1508.07909"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-ember-dark underline-offset-2 hover:underline"
                >
                  Sennrich et al. 2015 · BPE 原始论文 →
                </a>{' '}
                <span className="text-text-muted/80">把 BPE 引入 NLP 的开山之作</span>
              </li>
              <li>
                <a
                  href="https://github.com/openai/tiktoken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink hover:text-ember-dark underline-offset-2 hover:underline"
                >
                  OpenAI tiktoken（Python 库）→
                </a>{' '}
                <span className="text-text-muted/80">本模块前端用的是 js-tiktoken，是这个 Python 库的纯 JS port</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
