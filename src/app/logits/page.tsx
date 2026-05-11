'use client';

import Link from 'next/link';

import DeepDiveLogits from '@/components/logits/DeepDiveLogits';
import EmbeddingUnembeddingRelation from '@/components/logits/EmbeddingUnembeddingRelation';
import LogitsToProb from '@/components/logits/LogitsToProb';
import PMPerspectiveCards from '@/components/logits/PMPerspectiveCards';
import SoftmaxDemo from '@/components/logits/SoftmaxDemo';
import UnembeddingDiagram from '@/components/logits/UnembeddingDiagram';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';

export default function LogitsPage() {
  const t = useT();
  const lang = useLang();
  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航 */}
      <nav className="mb-8 flex items-center justify-between text-sm gap-3">
        <Link href={localizedHref(lang, '/')} className="text-text-muted hover:text-ink-dark transition-colors">
          {t('logits.nav.backToHome')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <span className="text-text-muted font-mono">{t('logits.nav.pageIndex')}</span>
        </div>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">{t('logits.eyebrow')}</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          {t('logits.hero.title1')}
          <span className="relative inline-block text-ember-dark mx-1">
            {t('logits.hero.titleHighlight')}
            <SquiggleUnderline className="text-ember" />
          </span>
          {t('logits.hero.title2')}
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">{t('logits.hero.lede')}</p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('logits.ch1.title1')}{' '}
            <span className="relative inline-block text-ember-dark mx-0.5">
              {t('logits.ch1.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('logits.ch1.body')}</p>

          <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">{t('logits.ch1.section1Title')}</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">{t('logits.ch1.section1Body')}</p>
          <EmbeddingUnembeddingRelation />

          <h3 className="font-serif text-base font-semibold text-ink-dark mt-8 mb-2">{t('logits.ch1.section2Title')}</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">{t('logits.ch1.section2Body')}</p>
          <UnembeddingDiagram />
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">
              {t('logits.ch2.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {t('logits.ch2.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('logits.ch2.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('logits.ch2.stageLabel')}</span>
            <SoftmaxDemo />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">
              {t('logits.ch3.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {t('logits.ch3.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('logits.ch3.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('logits.ch3.stageLabel')}</span>
            <LogitsToProb />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="04" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">{t('logits.ch4.eyebrow')}</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">{t('logits.ch4.title')}</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDiveLogits />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">{t('logits.outro.body')}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={localizedHref(lang, '/')} className="btn-secondary">
            {t('logits.outro.backHome')}
          </Link>
          <Link href={localizedHref(lang, '/sampling')} className="btn-primary">
            {t('logits.outro.next')}
          </Link>
        </div>
      </section>
    </main>
  );
}
