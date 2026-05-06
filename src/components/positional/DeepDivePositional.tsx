'use client';

import { useState } from 'react';

export default function DeepDivePositional() {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">想了解更多位置编码方案？</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-2">三种主流方案的对比</h4>
            <ul className="text-sm space-y-2 list-disc pl-5">
              <li>
                <strong className="text-text">Sinusoidal（Vaswani 2017）：</strong>
                就是本页面演示的版本——纯数学函数生成的固定指纹。优点是无参数、训练简单；缺点是外推到训练长度之外效果一般。
              </li>
              <li>
                <strong className="text-text">RoPE（Rotary Position Embedding，Su et al. 2021）：</strong>
                现代主流。把"位置"编码成"旋转矩阵"——每个位置对应一个特定旋转角度。LLaMA、ChatGLM、Qwen、DeepSeek 都用 RoPE。它的关键优点是<strong className="text-text">长 context 外推能力强</strong>。
              </li>
              <li>
                <strong className="text-text">ALiBi（Press et al. 2022）：</strong>
                完全不显式编码位置——而是在 attention 分数上加一个"距离越远惩罚越大"的线性偏置。BLOOM、MosaicML 等用 ALiBi。它的优点是<strong className="text-text">天然支持任意长度外推</strong>。
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">为什么"位置外推"是个大问题</h4>
            <p className="text-sm">
              如果 PE 在 2k 长度上训练，让它处理 32k 的输入时模型会"看不懂"超出训练范围的位置——表现就是"位置失忆"或胡言乱语。
              RoPE / ALiBi / YaRN（基于 RoPE 的频率插值技巧）等方案的本质是<strong className="text-text">让位置的数学性质能外推</strong>，
              这就是为什么"128k → 1M context"在 2024 年成了模型竞赛的主战场。
            </p>
          </div>

          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">可以接着读</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Attention Is All You Need (Vaswani 2017) →
                </a>{' '}
                <span className="text-text-muted/80">Transformer 原始论文，sinusoidal PE 出处（Section 3.5）</span>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2104.09864" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  RoFormer (Su 2021) →
                </a>{' '}
                <span className="text-text-muted/80">RoPE 原始论文，主流大模型几乎都在用</span>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2108.12409" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Train Short, Test Long: ALiBi (Press 2022) →
                </a>{' '}
                <span className="text-text-muted/80">ALiBi 论文，长度外推的另一条路</span>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2307.03172" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Lost in the Middle (Liu 2023) →
                </a>{' '}
                <span className="text-text-muted/80">实证研究：长 context 中间内容容易被忽略，背后跟 PE 有关</span>
              </li>
              <li>
                <a href="https://jalammar.github.io/illustrated-transformer/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Jay Alammar · The Illustrated Transformer →
                </a>{' '}
                <span className="text-text-muted/80">图解版本，看 PE 在 Transformer 整体架构里的位置</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
