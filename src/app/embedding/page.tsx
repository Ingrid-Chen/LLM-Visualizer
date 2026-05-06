'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import CosineSimilarityViz from '@/components/embedding/CosineSimilarityViz';
import DeepDiveEmbedding from '@/components/embedding/DeepDiveEmbedding';
import EmbeddingMatrixIntro from '@/components/embedding/EmbeddingMatrixIntro';
import PMPerspectiveCards from '@/components/embedding/PMPerspectiveCards';
import SemanticScatter from '@/components/embedding/SemanticScatter';
import VectorSliceViz from '@/components/embedding/VectorSliceViz';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import type { EmbeddingData } from '@/lib/types';

export default function EmbeddingPage() {
  const [data, setData] = useState<EmbeddingData | null>(null);

  useEffect(() => {
    fetch('/data/embedding/words.json')
      .then((r) => r.json() as Promise<EmbeddingData>)
      .then(setData)
      .catch((err) => console.error('加载 embedding 数据失败：', err));
  }, []);

  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航 */}
      <nav className="mb-8 flex items-center justify-between text-sm">
        <Link href="/" className="text-text-muted hover:text-ink-dark transition-colors">
          ← LLM Visualizer 首页
        </Link>
        <span className="text-text-muted font-mono">02 / 08</span>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">嵌入 · Embedding</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          每个 token 都被变成
          <span className="relative inline-block text-ember-dark mx-1">
            一组数字
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">
          切完 token，模型还看不懂。它要先把每个 token 映射成一个<strong className="text-text">高维向量</strong>
          （说人话：<strong className="text-text">一组浮点数</strong>，比如 4096 个数字串成一行）——
          这就是模型"理解"这个 token 的<strong className="text-text">内部表示</strong>。
          语义相近的词，向量在这个高维空间里方向也相近——这就是 RAG / 语义搜索的全部魔法。
        </p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：一个 token 长什么样的"向量" === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            一个 token 长什么样的<span className="relative inline-block text-ember-dark mx-0.5">"向量"<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            先讲清楚向量从哪里来（一个查表操作 + 一个可学习的矩阵），再具体看它长什么样。
          </p>

          {/* 1.1 · 矩阵从哪来 */}
          <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">1.1 · 向量从哪里来？— Embedding 矩阵</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">
            每个 token 都对应一个固定的向量——这些向量集中存储在一个叫 <strong className="text-text">Embedding 矩阵</strong>的地方。
            它是一个被模型训练出来的可学习参数表，是 LLM 整个网络最开头的一层。
          </p>
          <EmbeddingMatrixIntro />

          {/* 1.2 · 具体看一个向量长什么样 */}
          <h3 className="font-serif text-base font-semibold text-ink-dark mt-8 mb-2">1.2 · 具体看一个向量长什么样</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">
            知道了它从哪里来，看个具体的——选个词，把它的向量"切"开几维看一眼。
          </p>
          <div className="stage">
            <span className="stage-label">向量切片 · 一个 token 内部 →</span>
            {data ? (
              <VectorSliceViz words={data.words} realDim={data.realDim} />
            ) : (
              <p className="text-text-muted">加载中…</p>
            )}
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 2：2D 散点图 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            语义相近 = <span className="relative inline-block text-ember-dark">向量距离近<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            高维向量不可视化——但我们可以把它降维到 2D 让你"看见"这种聚类感。
            下面用 OpenAI text-embedding-3-small（1536 维）的语义示例数据：水果聚一起、动物聚一起、城市聚一起、时间词聚一起——这就是"语义"在向量空间里的样子。
          </p>
          <div className="stage">
            <span className="stage-label">点击词看最近邻 →</span>
            {data ? <SemanticScatter words={data.words} /> : <p className="text-text-muted">加载中…</p>}
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 3：余弦相似度 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            怎么算"距离近"——<span className="relative inline-block text-ember-dark">余弦相似度<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            两个向量之间的"夹角"决定了它们的相似度——夹角越小，余弦值越接近 1，语义越接近。
            选两个词看看它们的夹角和相似度数值。
          </p>
          <div className="stage">
            <span className="stage-label">选两个词看夹角 →</span>
            {data ? <CosineSimilarityViz words={data.words} /> : <p className="text-text-muted">加载中…</p>}
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 4：PM 视角 === */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="04" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">PM 视角</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">从向量到产品决策</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDiveEmbedding />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">
          每个 token 现在都是一个高维向量了。但 Transformer 处理输入时是"并行看所有 token"——它本身不知道谁前谁后。
          下一步要给每个位置加一个独特的"指纹"，让模型分得清"我打你"和"你打我"。
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/" className="btn-secondary">
            ← 回到首页
          </Link>
          <Link href="/positional" className="btn-primary">
            下一章 · Positional Encoding →
          </Link>
        </div>
      </section>
    </main>
  );
}
