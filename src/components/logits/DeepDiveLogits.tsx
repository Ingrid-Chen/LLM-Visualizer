'use client';

import { useState } from 'react';

export default function DeepDiveLogits() {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">想了解更多 Logits / Softmax 的细节？</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-2">Weight Tying：embedding = unembedding 转置</h4>
            <p className="text-sm">
              很多模型让最开始的 embedding 矩阵和最后的 unembedding 矩阵<strong className="text-text">共享权重</strong>——
              数学上 unembedding = embedding 的转置。原因有两个：① 节省 d × |vocab| 的参数量（对一个 d=4096 + 100k 词表的中型 LLM ≈ 4 亿参数）；
              ② 概念上自然——embedding 是"token 到向量"，unembedding 是"向量到 token"，是同一个映射的两个方向。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">Temperature 在数学上的位置</h4>
            <p className="text-sm">
              <strong className="text-text">temperature 不是新计算</strong>——它就是在 softmax 之前把每个 logit
              <strong className="text-text"> 除以 T</strong>：
            </p>
            <p className="font-mono text-xs text-text bg-cream-100 border border-ink/10 rounded p-2 mt-1">
              P(token i) = exp(logit_i / T) / Σⱼ exp(logit_j / T)
            </p>
            <p className="text-sm mt-1">
              T &lt; 1 → logits 差距被放大 → 分布更尖锐（更确定）；T &gt; 1 → logits 差距被压平 → 分布更平（更随机）。
              所以 temperature 调的不是模型本身，是这一步 softmax 的"陡峭程度"。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">Top-K / Top-P 实际在做什么</h4>
            <p className="text-sm">
              这两个参数在 softmax <strong className="text-text">之后</strong>对概率分布做截断：
            </p>
            <ul className="text-sm space-y-1 mt-1 list-disc pl-5">
              <li><strong className="text-text">Top-K</strong>：只保留概率最高的 k 个，其余置 0，剩下的重新归一化</li>
              <li><strong className="text-text">Top-P</strong>（nucleus）：按概率从高到低累加，超过 p 的那批保留，其余置 0</li>
            </ul>
            <p className="text-sm mt-1">
              这两个参数不影响 logits 本身——它们是 sampling 阶段在概率空间里的过滤器。下一步 Sampling 模块详细讲。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">词表大小演变</h4>
            <ul className="text-sm space-y-1 list-disc pl-5">
              <li><strong className="text-text">GPT-2 (r50k_base)</strong>: 50,257 tokens — 主要是英文</li>
              <li><strong className="text-text">GPT-3.5 / GPT-4 (cl100k_base)</strong>: 100,277 — 加入大量中文等多语言</li>
              <li><strong className="text-text">GPT-4o (o200k_base)</strong>: 200,019 — 进一步优化多语言压缩</li>
              <li><strong className="text-text">Llama 3</strong>: 128,256 tokens</li>
              <li><strong className="text-text">Qwen 2.5</strong>: 151,936 tokens</li>
            </ul>
            <p className="text-sm mt-1">
              词表越大 → 多语言压缩越好（每字符 token 数更少）；但每步 softmax 计算量越大。是 LLM 设计的基础 trade-off。
            </p>
          </div>

          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">可以接着读</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="https://platform.openai.com/docs/api-reference/chat/create#chat-create-logprobs" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  OpenAI logprobs API 文档 →
                </a>{' '}
                <span className="text-text-muted/80">实际怎么调 API 拿 logprobs</span>
              </li>
              <li>
                <a href="https://cookbook.openai.com/examples/using_logprobs" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  OpenAI Cookbook · Using Logprobs →
                </a>{' '}
                <span className="text-text-muted/80">用 logprobs 做模型确定性评估、约束生成等场景</span>
              </li>
              <li>
                <a href="https://arxiv.org/abs/1608.05859" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Weight Tying 论文（Press &amp; Wolf 2017） →
                </a>{' '}
                <span className="text-text-muted/80">为什么共享 embedding 和 unembedding 不损失效果</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
