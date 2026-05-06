'use client';

import { useState } from 'react';

export default function DeepDiveEmbedding() {
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">想了解更多 embedding 技术？</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-2">embedding 的演变史</h4>
            <ul className="text-sm space-y-1.5 list-disc pl-5">
              <li>
                <strong className="text-text">Word2Vec (2013)：</strong>第一代真正成功的词向量。"king - man + woman ≈ queen" 就是它带火的。
              </li>
              <li>
                <strong className="text-text">GloVe (2014)：</strong>基于全局共现矩阵的版本。
              </li>
              <li>
                <strong className="text-text">BERT (2018)：</strong>引入"上下文敏感" embedding——同一个词在不同句子里 embedding 不同。
              </li>
              <li>
                <strong className="text-text">OpenAI text-embedding-3 / Cohere / Voyage 等（2023+）：</strong>专门为检索优化的模型，纬度更高、跨语言、超长上下文。
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-text mb-2">距离度量方法</h4>
            <ul className="text-sm space-y-1.5 list-disc pl-5">
              <li>
                <strong className="text-text">余弦相似度 cos(θ)</strong>：只看方向，多数 embedding 模型推荐用这个
              </li>
              <li>
                <strong className="text-text">欧氏距离 L2</strong>：看绝对距离，对向量长度敏感
              </li>
              <li>
                <strong className="text-text">点积 dot product</strong>：余弦 × 长度，速度最快，OpenAI 文档推荐 cos 和 dot 都行（embedding 已 normalize 后两者相同）
              </li>
            </ul>
          </div>

          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">可以接着读 / 看</h4>
            <ul className="text-sm space-y-2">
              <li>
                <a href="https://huggingface.co/spaces/mteb/leaderboard" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  MTEB Leaderboard →
                </a>{' '}
                <span className="text-text-muted/80">embedding 模型的事实标准排行榜，看谁在哪个任务最强</span>
              </li>
              <li>
                <a href="https://jalammar.github.io/illustrated-word2vec/" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  Jay Alammar · The Illustrated Word2Vec →
                </a>{' '}
                <span className="text-text-muted/80">用图解清晰解释 embedding 的训练原理</span>
              </li>
              <li>
                <a href="https://platform.openai.com/docs/guides/embeddings" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  OpenAI Embeddings 文档 →
                </a>{' '}
                <span className="text-text-muted/80">官方 embedding API 用法 + 维度 / 价格 / 最佳实践</span>
              </li>
              <li>
                <a href="https://github.com/pgvector/pgvector" target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                  pgvector →
                </a>{' '}
                <span className="text-text-muted/80">直接给 PostgreSQL 加向量搜索能力——RAG 项目的实用起点</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
