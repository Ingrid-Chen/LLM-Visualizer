'use client';

import Link from 'next/link';

import AutoregressiveLoop from '@/components/loop/AutoregressiveLoop';
import DeepDiveLoop from '@/components/loop/DeepDiveLoop';
import MaxTokensSlider from '@/components/loop/MaxTokensSlider';
import PMPerspectiveCards from '@/components/loop/PMPerspectiveCards';
import StreamingComparison from '@/components/loop/StreamingComparison';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';

export default function LoopPage() {
  const t = useT();
  const lang = useLang();
  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航 */}
      <nav className="mb-8 flex items-center justify-between text-sm gap-3">
        <Link href={localizedHref(lang, '/')} className="text-text-muted hover:text-ink-dark transition-colors">
          {t('loop.nav.backToHome')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <span className="text-text-muted font-mono">{t('loop.nav.pageIndex')}</span>
        </div>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">{t('loop.eyebrow')}</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          {t('loop.hero.title1')}{' '}
          <span className="relative inline-block text-ember-dark mx-1">
            {t('loop.hero.titleHighlight')}
            <SquiggleUnderline className="text-ember" />
          </span>
          {' '}{t('loop.hero.title2')}
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">{t('loop.hero.lede')}</p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">
              {t('loop.ch1.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {t('loop.ch1.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('loop.ch1.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('loop.ch1.stageLabel')}</span>
            <AutoregressiveLoop />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">
              {t('loop.ch2.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {t('loop.ch2.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('loop.ch2.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('loop.ch2.stageLabel')}</span>
            <StreamingComparison />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">
              {t('loop.ch3.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {t('loop.ch3.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('loop.ch3.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('loop.ch3.stageLabel')}</span>
            <MaxTokensSlider />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="04" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">{t('loop.ch4.eyebrow')}</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">{t('loop.ch4.title')}</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDiveLoop />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">{t('loop.outro.body')}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={localizedHref(lang, '/')} className="btn-secondary">
            {t('loop.outro.backHome')}
          </Link>
          <span className="step-pill bg-cream-100 text-text-muted/60 border-ink/10">
            {t('loop.outro.next')}
          </span>
        </div>
      </section>
    </main>
  );
}
