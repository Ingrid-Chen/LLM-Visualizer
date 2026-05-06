'use client';

import { useState } from 'react';

export default function DeepDiveTransformer() {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">想了解归一化 / 残差 / 多头的更多细节？</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-2">Pre-Norm vs Post-Norm</h4>
            <p className="text-sm">
              <strong className="text-text">Post-Norm</strong>（原始版）：把归一化放在残差<em>之后</em>。理论上能让信号"绕过去"的部分也被归一化，效果更紧致。
              但实际训练时，深层网络容易梯度爆炸——需要小心调 learning rate warmup。
            </p>
            <p className="text-sm mt-2">
              <strong className="text-text">Pre-Norm</strong>（现代主流）：把归一化放在残差<em>之前</em>，把 LN 放在每个子层入口。
              训练更稳，能堆 100+ 层。代价是末层数值范围会越来越大——所以模型最后还需要一个 final LN。
              GPT、LLaMA、Qwen、Claude 等几乎都用这个。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">LayerNorm vs RMSNorm</h4>
            <p className="text-sm">
              <strong className="text-text">LayerNorm</strong>：减均值、除标准差、再加可学习的 γ 和 β 参数。原始 Transformer 用这个。
            </p>
            <p className="text-sm mt-1">
              <strong className="text-text">RMSNorm</strong>：只除"均方根"，不减均值、不要 β——计算量更小、效果几乎相同。
              LLaMA 把它带火了，现在 LLaMA / Mistral / Qwen 等开源模型几乎都用 RMSNorm。
            </p>
            <p className="text-sm mt-1 font-mono text-[12px]">
              LN: y = (x - μ) / σ × γ + β &nbsp; vs &nbsp; RMSNorm: y = x / RMS(x) × γ
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">残差连接为什么让深层网络可训</h4>
            <p className="text-sm">
              核心是<strong className="text-text">梯度高速公路</strong>。反向传播时，梯度沿网络从输出回流到输入——每经过一层，梯度都被该层的权重缩放。
              在 50 层网络里，如果每层都把梯度缩成 0.9 倍，最终浅层只剩 0.9^50 ≈ 0.005 倍——梯度几乎消失，浅层学不到东西。
            </p>
            <p className="text-sm mt-1">
              残差 y = x + F(x) 让<strong className="text-text">梯度有一条直接通道</strong>从输出回流到输入（链式法则里多了一个 +1 项），不会随层数指数衰减。
              这是 ResNet 在视觉、Transformer 在 NLP 都能堆很深的根本原因。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">Multi-Head 的几何直觉</h4>
            <p className="text-sm">
              如果只有一个 head，attention 的输出空间被压在"单一关注模式"里。多头让模型把<strong className="text-text">高维空间切成 N 个子空间</strong>，
              每个子空间学一种关注方式：head1 可能关注语法（动词 ↔ 主语）、head2 关注指代（代词 ↔ 名词）、head3 关注情感等。
              N 个子空间各算各的 attention，最后拼接 + 投影。这就是为什么 32 头比 1 头表现好。
            </p>
          </div>

          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">可以接着读 / 看</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="https://jalammar.github.io/illustrated-transformer/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Jay Alammar · The Illustrated Transformer →
                </a>{' '}
                <span className="text-text-muted/80">最经典的图解 Transformer，从输入到输出每步都画</span>
              </li>
              <li>
                <a href="https://www.youtube.com/watch?v=kCc8FmEb1nY" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Karpathy · Let's build GPT: from scratch, in code, spelled out →
                </a>{' '}
                <span className="text-text-muted/80">2 小时手写 GPT，看每个组件怎么写出来</span>
              </li>
              <li>
                <a href="https://bbycroft.net/llm" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  bbycroft.net/llm · 3D 可视化 LLM →
                </a>{' '}
                <span className="text-text-muted/80">每个 token 经过整个 Transformer 的 3D 动画——非常直观</span>
              </li>
              <li>
                <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Attention Is All You Need (Vaswani 2017) →
                </a>{' '}
                <span className="text-text-muted/80">原始 Transformer 论文</span>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2002.04745" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  On Layer Normalization in Transformer (Xiong 2020) →
                </a>{' '}
                <span className="text-text-muted/80">Pre-Norm vs Post-Norm 的系统比较</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
