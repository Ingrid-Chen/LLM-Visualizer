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

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('transformer.ch1.title1')}{' '}
            <span className="relative inline-block text-ember-dark mx-0.5">
              {t('transformer.ch1.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('transformer.ch1.body')}</p>
          <OverviewDiagram />
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('transformer.ch2.title1')}
            <span className="relative inline-block text-ember-dark">
              {t('transformer.ch2.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {' '}{t('transformer.ch2.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('transformer.ch2.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('transformer.ch2.stageLabel')}</span>
            <QKVDemo />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">
              {t('transformer.ch3.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {t('transformer.ch3.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-4 max-w-prose">{t('transformer.ch3.intro')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="p-3 rounded-lg border-2 border-cream-200 bg-cream-50">
                <div className="text-[11px] uppercase tracking-wider text-ember-dark font-medium mb-1">
                  {t(`transformer.ch3.cards.${i}.title`)}
                </div>
                <p className="text-xs text-text-muted leading-relaxed">{t(`transformer.ch3.cards.${i}.body`)}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-text-muted mb-4 max-w-prose">{t('transformer.ch3.hint')}</p>

          <div className="rounded-lg bg-cream-100 border border-ink/15 p-3 text-xs leading-relaxed space-y-2 mb-5">
            <div className="text-[10px] uppercase tracking-wider text-text-muted/80">{t('transformer.ch3.prereqHeading')}</div>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-text shrink-0">{t('transformer.ch3.prereqLayerLabel')}</span>
              <span className="text-text-muted">{t('transformer.ch3.prereqLayerBody')}</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-medium text-text shrink-0">{t('transformer.ch3.prereqHeadLabel')}</span>
              <span className="text-text-muted">{t('transformer.ch3.prereqHeadBody')}</span>
            </div>
            <div className="text-text-muted/80 pt-1.5 border-t border-ink/10">{t('transformer.ch3.prereqNote')}</div>
          </div>

          <div className="stage">
            <span className="stage-label">{t('transformer.ch3.stageLabel')}</span>
            {attentionData ? (
              <AttentionMatrixViz data={attentionData} />
            ) : (
              <p className="text-text-muted">{t('common.loading')}</p>
            )}
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="04" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('transformer.ch4.title1')}
            <span className="relative inline-block text-ember-dark">
              {t('transformer.ch4.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {t('transformer.ch4.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('transformer.ch4.body')}</p>
          <FFNCard />
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="05" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('transformer.ch5.title1')}
            <span className="relative inline-block text-ember-dark">
              {t('transformer.ch5.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('transformer.ch5.body')}</p>

          <NormResidualExplainer />

          <p className="text-sm text-text-muted mt-8 mb-3 max-w-prose">{t('transformer.ch5.blockIntro')}</p>
          <div className="stage">
            <span className="stage-label">{t('transformer.ch5.stageLabel')}</span>
            <TransformerBlockDiagram />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="06" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">{t('transformer.ch6.eyebrow')}</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">{t('transformer.ch6.title')}</h2>
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
