'use client';

import { useState } from 'react';

export default function DeepDiveLoop() {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">想了解循环背后的工程优化？</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-2">KV Cache：每步不重新算前面的 token</h4>
            <p className="text-sm">
              一个朴素的"自回归循环"会很慢——每生成一个新 token，都要把之前所有 token 重新过一遍 Transformer。
              <strong className="text-text">KV Cache</strong> 的优化是：每个 token 进入 Transformer 后，把它在每一层的 K 和 V 矩阵存起来。
              下一个 token 只算自己的 K/V + 用 cache 里的旧 K/V 做 attention——前面 token 的计算完全跳过。
            </p>
            <p className="text-sm mt-1">
              这是为什么 LLM 推理时<strong className="text-text">第一个 token 慢（叫 prefill），后续 token 快</strong>（叫 decode）。
              你看到的"思考一会儿，然后流式蹦字"——前者是 prefill 全部 input、后者是 decode 一个 token。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">Speculative Decoding：用小模型猜，大模型核对</h4>
            <p className="text-sm">
              既然 decode 是"一次一个 token"严格串行，怎么提速？
              <strong className="text-text">Speculative Decoding</strong>：让一个小模型快速猜出未来 N 个 token，
              然后大模型并行验证这 N 个——如果都猜对，N 个 token 一次性出来；如果猜错就回退到第一个错的位置。
              典型能给 decode 提速 2-3 倍。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">Batch 推理：多个请求一起跑</h4>
            <p className="text-sm">
              LLM 推理服务（如 vLLM、TGI）会把多个用户的请求<strong className="text-text">合并成 batch</strong>一起跑。
              GPU 一次能算多个请求的同一个 token——平均吞吐能高几倍。代价是延迟略增（要等 batch 凑齐）。
              这就是为什么 OpenAI / Anthropic 的 API 在高峰期偶尔变慢——不是模型变慢，是 batch 排队等。
            </p>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">早期偏差放大（"越说越跑偏"）</h4>
            <p className="text-sm">
              因为每一步都基于之前的所有输出，<strong className="text-text">第一个 token 选错可能让整段都跑偏</strong>。
              这是 LLM hallucination 的机制根源之一——模型一旦说了"巴黎是德国首都"，
              后面就会顺着这个错误编出一堆理由。"链式推理（CoT）"的鲁棒性就是被这种早期偏差打折扣的。
            </p>
            <p className="text-sm mt-1">
              缓解方法：beam search（同时维护多条候选路径）、self-consistency（采样多次取共识）、retrieval（让模型看真实信息）。
            </p>
          </div>

          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">可以接着读</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="https://github.com/vllm-project/vllm" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  vLLM →
                </a>{' '}
                <span className="text-text-muted/80">最流行的开源 LLM 推理引擎，KV cache + PagedAttention + speculative decoding 都做了</span>
              </li>
              <li>
                <a href="https://arxiv.org/abs/2211.17192" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Speculative Decoding 论文（Leviathan 2022） →
                </a>{' '}
                <span className="text-text-muted/80">小模型猜 + 大模型核对的原始想法</span>
              </li>
              <li>
                <a href="https://platform.openai.com/docs/guides/streaming-responses" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  OpenAI Streaming API 文档 →
                </a>{' '}
                <span className="text-text-muted/80">怎么在产品里实际接 streaming（SSE 协议）</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
