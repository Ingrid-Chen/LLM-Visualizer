'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import AttentionMatrixViz from '@/components/transformer/AttentionMatrixViz';
import DeepDiveTransformer from '@/components/transformer/DeepDiveTransformer';
import FFNCard from '@/components/transformer/FFNCard';
import NormResidualExplainer from '@/components/transformer/NormResidualExplainer';
import OverviewDiagram from '@/components/transformer/OverviewDiagram';
import PMPerspectiveCards from '@/components/transformer/PMPerspectiveCards';
import QKVDemo from '@/components/transformer/QKVDemo';
import TransformerBlockDiagram from '@/components/transformer/TransformerBlockDiagram';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';
import type { AttentionData } from '@/lib/types';

export default function TransformerPage() {
  const t = useT();
  const lang = useLang();
  const [attentionData, setAttentionData] = useState<AttentionData | null>(null);

  useEffect(() => {
    fetch('/data/transformer/attention.json')
      .then((r) => r.json() as Promise<AttentionData>)
      .then(setAttentionData)
      .catch((err) => console.error('加载 attention 数据失败：', err));
  }, []);

  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航 */}
      <nav className="mb-8 flex items-center justify-between text-sm gap-3">
        <Link href={localizedHref(lang, '/')} className="text-text-muted hover:text-ink-dark transition-colors">
          {t('transformer.nav.backToHome')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <span className="text-text-muted font-mono">{t('transformer.nav.pageIndex')}</span>
        </div>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">{t('transformer.eyebrow')}</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          {t('transformer.hero.title1')}
          <span className="relative inline-block text-ember-dark mx-1">
            {t('transformer.hero.titleHighlight')}
            <SquiggleUnderline className="text-ember" />
          </span>
          {' '}{t('transformer.hero.title2')}
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">{t('transformer.hero.lede')}</p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：概览（先讲两个核心模块的作用） === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            一层 Transformer = <span className="relative inline-block text-ember-dark mx-0.5">两件事<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            先建立直觉：这一层在做什么。本章不讲数学、不讲实现细节——
            只用一张图 + 两个生活化比喻让你抓住核心机制。
          </p>
          <OverviewDiagram />
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 2：QKV 角色分工 —— Attention 内部 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            Attention 内部：<span className="relative inline-block text-ember-dark">Q / K / V<SquiggleUnderline className="text-ember/70" /></span> 三个角色
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            Attention 的"沟通"具体怎么做？每个 token 同时扮演三个角色：Query（问什么）、Key（看哪里）、Value（取什么）。
            用一个具体例子讲清它们怎么配合解决"指代消解"。
          </p>
          <div className="stage">
            <span className="stage-label">三个角色的分工 →</span>
            <QKVDemo />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 3：注意力可视化（互动主菜） === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">每个 token "看"哪里<SquiggleUnderline className="text-ember/70" /></span>——互动可视化
          </h2>
          <p className="text-sm text-text-muted mb-4 max-w-prose">
            实际句子里，attention 最有意思的地方是处理<strong className="text-text">三类"困难情况"</strong>——
            如果模型不"看上下文"，这三类问题就答不对。下面三个例子各对应一类，看看 attention 怎么解决：
          </p>

          {/* 三类语言现象的解释卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            <div className="p-3 rounded-lg border-2 border-cream-200 bg-cream-50">
              <div className="text-[11px] uppercase tracking-wider text-ember-dark font-medium mb-1">指代消解</div>
              <p className="text-xs text-text-muted leading-relaxed">
                代词或泛指词究竟指前面哪个具体的人 / 物。
                <span className="block mt-1 text-text">例：「她」指 Lucy 还是 Mary？</span>
              </p>
            </div>
            <div className="p-3 rounded-lg border-2 border-cream-200 bg-cream-50">
              <div className="text-[11px] uppercase tracking-wider text-ember-dark font-medium mb-1">长距离依赖</div>
              <p className="text-xs text-text-muted leading-relaxed">
                一个动词的真正对象被一堆修饰词隔开。
                <span className="block mt-1 text-text">例：「看到」一只流浪的小黑「猫」</span>
              </p>
            </div>
            <div className="p-3 rounded-lg border-2 border-cream-200 bg-cream-50">
              <div className="text-[11px] uppercase tracking-wider text-ember-dark font-medium mb-1">上下文歧义</div>
              <p className="text-xs text-text-muted leading-relaxed">
                一个多义词得靠上下文判断到底是哪个意思。
                <span className="block mt-1 text-text">例：「苹果」是水果还是公司？</span>
              </p>
            </div>
          </div>

          <p className="text-sm text-text-muted mb-4 max-w-prose">
            选个例子，鼠标悬停某个 token，看它在<strong className="text-text">不同层</strong>的注意力权重分布——
            观察 attention 怎么从第 1 层"看邻居"逐层进化到第 3 层"跨距离理解语义"。
          </p>

          {/* 预备知识：层 vs 头 */}
          <div className="rounded-lg bg-cream-100 border border-ink/15 p-3 text-xs leading-relaxed space-y-2 mb-5">
            <div className="text-[10px] uppercase tracking-wider text-text-muted/80">📚 进入交互前先分清两个名词</div>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-text shrink-0">🧱 层（Layer）</span>
              <span className="text-text-muted">= 纵向堆叠的处理阶段——前一层输出给后一层做输入。每往上一层，理解更"深"。</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-text shrink-0">🎭 头（Head）</span>
              <span className="text-text-muted">= 同一层内并行的"视角"——一个层里 N 个头同时看不同关系（语法 / 指代 / 情感）。</span>
            </div>
            <div className="text-text-muted/80 pt-1.5 border-t border-ink/10">
              下面演示的是 <strong className="text-text">"层"</strong>（实际模型有 24-120 层；这里简化成 3 层代表早 / 中 / 深的典型行为）。
              每层内部的多个头被平均了——这样图能简化到一根连线，而不是 32 根。
            </div>
          </div>

          <div className="stage">
            <span className="stage-label">悬停 token 看连线 →</span>
            {attentionData ? (
              <AttentionMatrixViz data={attentionData} />
            ) : (
              <p className="text-text-muted">加载中…</p>
            )}
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 4：FFN === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="04" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            前馈网络（<span className="relative inline-block text-ember-dark">FFN<SquiggleUnderline className="text-ember/70" /></span>）：每个 token 自己"消化"
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            Attention 让 token 之间沟通后，FFN 让每个 token 单独做一遍"思考"——
            从自身向量里提取相关知识 / 特征。结构远比 attention 简单，但参数量占整个模型的 2/3+。
          </p>
          <FFNCard />
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 5：归一化 + 残差连接 ——"工程支持" === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="05" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            外面还要包：<span className="relative inline-block text-ember-dark">归一化 + 残差连接<SquiggleUnderline className="text-ember/70" /></span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            到这里你已经理解 Attention 和 FFN 是核心机制。但实际模型不是简单地「Attention → FFN」串起来——
            外面还包了两层<strong className="text-text">工程支持</strong>，没有它们超过几层的网络就训不起来。
          </p>

          {/* 两个概念卡片：是什么 + 数学 + 目的 */}
          <NormResidualExplainer />

          {/* 然后展示它们在 Block 中的位置 */}
          <p className="text-sm text-text-muted mt-8 mb-3 max-w-prose">
            理解了两个概念后，看看它们在一个 Block 中具体长什么样：
          </p>
          <div className="stage">
            <span className="stage-label">完整 Block 流程 →</span>
            <TransformerBlockDiagram />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 6：PM 视角 === */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="06" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">PM 视角</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">从 Transformer 到产品决策</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDiveTransformer />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">{t('transformer.outro.body')}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={localizedHref(lang, '/')} className="btn-secondary">
            {t('transformer.outro.backHome')}
          </Link>
          <Link href={localizedHref(lang, '/logits')} className="btn-primary">
            {t('transformer.outro.next')}
          </Link>
        </div>
      </section>
    </main>
  );
}
