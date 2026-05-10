'use client';

import Link from 'next/link';

import ByteToTokenViz from '@/components/tokenization/ByteToTokenViz';
import CostEstimator from '@/components/tokenization/CostEstimator';
import DeepDiveTokenization from '@/components/tokenization/DeepDiveTokenization';
import EraComparison from '@/components/tokenization/EraComparison';
import PMPerspectiveCards from '@/components/tokenization/PMPerspectiveCards';
import TokenizerPlayground from '@/components/tokenization/TokenizerPlayground';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';

export default function TokenizationPage() {
  const t = useT();
  const lang = useLang();
  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航条 */}
      <nav className="mb-8 flex items-center justify-between text-sm gap-3">
        <Link href={localizedHref(lang, '/')} className="text-text-muted hover:text-ink-dark transition-colors">
          {t('tokenization.nav.backToHome')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <span className="text-text-muted font-mono">{t('tokenization.nav.pageIndex')}</span>
        </div>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">{t('tokenization.eyebrow')}</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          {t('tokenization.hero.title1')}
          <span className="relative inline-block text-ember-dark mx-1">
            {t('tokenization.hero.titleHighlight')}
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">{t('tokenization.hero.lede')}</p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：先决知识 字节-字符-token === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('tokenization.ch1.title1')}
            <span className="relative inline-block text-ember-dark">
              {t('tokenization.ch1.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {' '}{t('tokenization.ch1.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('tokenization.ch1.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('tokenization.ch1.stageLabel')}</span>
            <ByteToTokenViz />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 2：自由切分 playground === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">{t('tokenization.ch2.title')}</h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('tokenization.ch2.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('tokenization.ch2.stageLabel')}</span>
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
            {t('tokenization.ch3.title1')}
            <span className="relative inline-block text-ember-dark">
              {t('tokenization.ch3.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('tokenization.ch3.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('tokenization.ch3.stageLabel')}</span>
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
            {t('tokenization.ch4.title1')}
            <span className="relative inline-block text-ember-dark mx-0.5">
              {t('tokenization.ch4.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('tokenization.ch4.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('tokenization.ch4.stageLabel')}</span>
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
            <p className="text-sm uppercase tracking-widest text-ember-dark">{t('tokenization.ch5.eyebrow')}</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">{t('tokenization.ch5.title')}</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      {/* 深入模式 */}
      <DeepDiveTokenization />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">{t('tokenization.outro.body')}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={localizedHref(lang, '/')} className="btn-secondary">
            {t('tokenization.outro.backHome')}
          </Link>
          <Link href={localizedHref(lang, '/embedding')} className="btn-primary">
            {t('tokenization.outro.next')}
          </Link>
        </div>
      </section>
    </main>
  );
}
