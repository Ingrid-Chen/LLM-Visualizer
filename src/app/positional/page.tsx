import Link from 'next/link';

import DeepDivePositional from '@/components/positional/DeepDivePositional';
import EmbeddingPlusPE from '@/components/positional/EmbeddingPlusPE';
import PMPerspectiveCards from '@/components/positional/PMPerspectiveCards';
import PositionalHeatmap from '@/components/positional/PositionalHeatmap';
import WordOrderDemo from '@/components/positional/WordOrderDemo';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';

export default function PositionalPage() {
  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航 */}
      <nav className="mb-8 flex items-center justify-between text-sm">
        <Link href="/" className="text-text-muted hover:text-ink-dark transition-colors">
          ← LLM Visualizer 首页
        </Link>
        <span className="text-text-muted font-mono">03 / 08</span>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">位置编码 · Positional Encoding</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          Transformer 不区分词序——
          <br className="hidden sm:block" />
          需要给每个位置加一个
          <span className="relative inline-block text-ember-dark mx-1">
            "指纹"
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">
          embedding 把每个 token 变成了向量——但 Transformer 处理输入时是<strong className="text-text">并行看所有 token</strong>，本身没有"先后"概念。
          这一步要解决的问题：让模型分得清"我打你"和"你打我"。
        </p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：为什么需要位置编码 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            为什么需要<span className="relative inline-block text-ember-dark mx-0.5">位置编码<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            一个直观的反例：完全相同的 token，顺序不同语义就完全不同。如果模型看不到顺序，它就分不清这两句话。
          </p>
          <div className="stage">
            <span className="stage-label">同样三个字，意思相反 →</span>
            <WordOrderDemo />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 2：位置编码长什么样 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            位置编码长什么样：<span className="relative inline-block text-ember-dark">经典 sinusoidal<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            原始 Transformer 论文（Vaswani 2017）用 sin / cos 函数给每个位置生成一个独特向量。
            把它画成 heatmap，能看到典型的"波浪图案"。
          </p>
          <div className="stage">
            <span className="stage-label">每个位置的"指纹" →</span>
            <PositionalHeatmap />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 3：embedding + PE === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            把"指纹"<span className="relative inline-block text-ember-dark mx-0.5">加到 embedding 上<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            位置编码不是单独传给模型的——它直接<strong className="text-text">加</strong>到 token embedding 上，得到"最终输入向量"。
            这样同一个 token 在不同位置就变成了不同的向量。
          </p>
          <div className="stage">
            <span className="stage-label">同一个 token 在不同位置 →</span>
            <EmbeddingPlusPE />
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
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">从位置编码到产品决策</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDivePositional />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">
          现在每个 token 都带着"语义信息（embedding）"+ "位置信息（PE）"了——下一步才是 LLM 真正的"理解"环节：
          Transformer 用注意力机制让每个 token 看向其他相关 token，逐层抽象出复杂语义。
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/" className="btn-secondary">
            ← 回到首页
          </Link>
          <Link href="/transformer" className="btn-primary">
            下一章 · Transformer →
          </Link>
        </div>
      </section>
    </main>
  );
}
