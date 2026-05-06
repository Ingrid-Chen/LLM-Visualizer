import Link from 'next/link';

import ByteToTokenViz from '@/components/tokenization/ByteToTokenViz';
import CostEstimator from '@/components/tokenization/CostEstimator';
import DeepDiveTokenization from '@/components/tokenization/DeepDiveTokenization';
import EraComparison from '@/components/tokenization/EraComparison';
import PMPerspectiveCards from '@/components/tokenization/PMPerspectiveCards';
import TokenizerPlayground from '@/components/tokenization/TokenizerPlayground';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';

export default function TokenizationPage() {
  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航条 */}
      <nav className="mb-8 flex items-center justify-between text-sm">
        <Link href="/" className="text-text-muted hover:text-ink-dark transition-colors">
          ← LLM Visualizer 首页
        </Link>
        <span className="text-text-muted font-mono">01 / 08</span>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">分词 · Tokenization</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          模型不是按"字"读你的话，而是
          <span className="relative inline-block text-ember-dark mx-1">
            按 token
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">
          token 是模型的基本"识别单位"——可能是一个完整的词、一个词缀、半个汉字、或单纯的字节。
          你看到的"字数"和模型看到的"token 数"经常对不上，这个差异直接决定了 API 成本、上下文窗口的真实容量、以及大量产品 bug 的成因。
          下面 5 节带你彻底搞清楚 token 的来龙去脉。
        </p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：先决知识 字节-字符-token === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            先决知识：<span className="relative inline-block text-ember-dark">字节、字符、token<SquiggleUnderline className="text-ember/70" /></span> 是三回事
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            字节、字符、token 是三个不同层面，经常被混为一谈。下面用一个互动演示把它们的关系一次讲清——
            搞懂之后，「为什么 GPT-2 时代中文每字 ≈ 3 token」这种事实就一目了然了。
          </p>
          <div className="stage">
            <span className="stage-label">字符 → 字节 → token 三层 →</span>
            <ByteToTokenViz />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 2：自由切分 playground === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            动手玩：看模型怎么切你的句子
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            下面这个工具用的是 OpenAI 的真实 tokenizer（前端跑，无需 API）。输入任何中英文 / emoji / 代码，立刻看切分结果。
          </p>
          <div className="stage">
            <span className="stage-label">实时分词 · 你的回合 →</span>
            <TokenizerPlayground />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 3：三档 tokenizer 对比 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            "中文 token 比英文贵 2-3 倍"——
            <span className="relative inline-block text-ember-dark">这是过时的说法<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            从 GPT-2（r50k_base）到 GPT-4o（o200k_base），同一段中文的 token 数往往掉了 50%+。
            原因不是模型变聪明，而是 BPE 训练数据里加入了大量中文，常见词组被合并成了单个 token。
            如果你的学习资料里看到"中文每字 2-3 token"——那是 GPT-2 时代的事实。
          </p>
          <div className="stage">
            <span className="stage-label">三个时代的对比 →</span>
            <EraComparison />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 4：成本估算器 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="04" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            把 token 数<span className="relative inline-block text-ember-dark mx-0.5">折算成钱<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            做产品规模化估算时，要算的是"单次 token 数 × 调用次数 × 单价"。常见误区：把单次价格按"几分钱"忽略，一规模化就突然超预算。
          </p>
          <div className="stage">
            <span className="stage-label">规模化成本 →</span>
            <CostEstimator />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 5：PM 视角卡片 === */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="05" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">PM 视角</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">从 token 到产品决策</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      {/* 深入模式 */}
      <DeepDiveTokenization />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">
          切完 token，下一步模型就要把每个 token 映射成一个高维向量（embedding），让"语义相近的词在向量空间里距离近"。
          这是接下来 Embedding 模块要讲的事。
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/" className="btn-secondary">
            ← 回到首页
          </Link>
          <Link href="/embedding" className="btn-primary">
            下一章 · Embedding →
          </Link>
        </div>
      </section>
    </main>
  );
}
