import Link from 'next/link';

import DeepDiveLogits from '@/components/logits/DeepDiveLogits';
import EmbeddingUnembeddingRelation from '@/components/logits/EmbeddingUnembeddingRelation';
import LogitsToProb from '@/components/logits/LogitsToProb';
import PMPerspectiveCards from '@/components/logits/PMPerspectiveCards';
import SoftmaxDemo from '@/components/logits/SoftmaxDemo';
import UnembeddingDiagram from '@/components/logits/UnembeddingDiagram';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';

export default function LogitsPage() {
  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航 */}
      <nav className="mb-8 flex items-center justify-between text-sm">
        <Link href="/" className="text-text-muted hover:text-ink-dark transition-colors">
          ← LLM Visualizer 首页
        </Link>
        <span className="text-text-muted font-mono">05 / 08</span>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">输出层 · Logits</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          从最后一层向量到
          <span className="relative inline-block text-ember-dark mx-1">
            词表概率分布
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">
          走完 N 层 Transformer 后，每个位置都是一个 d 维向量。
          这一步的任务：把<strong className="text-text">最后一个位置的向量</strong>映射成
          <strong className="text-text">"下一个 token 是哪个词的概率"</strong>。
          数学上就两件事：① 乘以 unembedding 矩阵 → logits；② 过 softmax → 概率。
        </p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：Unembedding === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            从向量到 <span className="relative inline-block text-ember-dark mx-0.5">Logits<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            把最后一层向量映射成 logits 的关键，是 <strong className="text-text">unembedding 矩阵</strong>。
            先讲清楚这个矩阵从哪来、跟开头的 embedding 矩阵是什么关系——再看它怎么用。
          </p>

          {/* 1.1 · 矩阵从哪来 */}
          <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">1.1 · Unembedding 矩阵从哪来？跟 Embedding 是什么关系？</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">
            模型最开头有一个 <strong className="text-text">Embedding 矩阵</strong>把 token 翻译成向量；最末尾有个
            <strong className="text-text"> Unembedding 矩阵</strong>反过来，从向量找回最匹配的 token。它们其实是同一映射的两个方向。
          </p>
          <EmbeddingUnembeddingRelation />

          {/* 1.2 · 矩阵怎么用 */}
          <h3 className="font-serif text-base font-semibold text-ink-dark mt-8 mb-2">1.2 · 矩阵怎么用？得到 Logits</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">
            最后一层向量乘以 W_U → 得到词表大小的 logits 向量。每一行的"匹配模板"跟向量做点积，分数高 = 这个 token 跟当前上下文匹配。
          </p>
          <UnembeddingDiagram />
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 2：Softmax === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">Softmax<SquiggleUnderline className="text-ember/70" /></span>：把 logits 变成概率
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            Logits 是任意实数（负无穷到正无穷）——不能直接当概率用。
            Softmax 把它们映射到 [0, 1] 区间且总和为 1。拖滑块感受一下。
          </p>
          <div className="stage">
            <span className="stage-label">拖滑块看概率怎么变 →</span>
            <SoftmaxDemo />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 3：完整流程 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">完整流程<SquiggleUnderline className="text-ember/70" /></span>：用真实数据走一遍
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            选个例子，看 <strong className="text-text">最后一层向量 → unembedding → logits → softmax → 概率分布</strong>整条流水线。
            这就是 OpenAI / Anthropic API 里 logprobs 的来源。
          </p>
          <div className="stage">
            <span className="stage-label">从向量到概率 →</span>
            <LogitsToProb />
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
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">从 Logits 到产品决策</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDiveLogits />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">
          有了概率分布——下一步就是从中"挑一个"。直接选概率最高的（贪婪），还是按概率随机抽（多样化）？
          这就是 Sampling 模块要解决的问题。
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/" className="btn-secondary">
            ← 回到首页
          </Link>
          <Link href="/sampling" className="btn-primary">
            下一章 · Sampling →
          </Link>
        </div>
      </section>
    </main>
  );
}
