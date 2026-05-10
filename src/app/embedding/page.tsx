'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import CosineSimilarityViz from '@/components/embedding/CosineSimilarityViz';
import DeepDiveEmbedding from '@/components/embedding/DeepDiveEmbedding';
import EmbeddingMatrixIntro from '@/components/embedding/EmbeddingMatrixIntro';
import PMPerspectiveCards from '@/components/embedding/PMPerspectiveCards';
import SemanticScatter from '@/components/embedding/SemanticScatter';
import VectorSliceViz from '@/components/embedding/VectorSliceViz';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';
import type { EmbeddingData } from '@/lib/types';

export default function EmbeddingPage() {
  const t = useT();
  const lang = useLang();
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
      <nav className="mb-8 flex items-center justify-between text-sm gap-3">
        <Link href={localizedHref(lang, '/')} className="text-text-muted hover:text-ink-dark transition-colors">
          {t('embedding.nav.backToHome')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <span className="text-text-muted font-mono">{t('embedding.nav.pageIndex')}</span>
        </div>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">{t('embedding.eyebrow')}</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          {t('embedding.hero.title1')}
          <span className="relative inline-block text-ember-dark mx-1">
            {t('embedding.hero.titleHighlight')}
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">{t('embedding.hero.lede')}</p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：一个 token 长什么样的"向量" === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('embedding.ch1.title1')}
            <span className="relative inline-block text-ember-dark mx-0.5">
              {t('embedding.ch1.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
            {' '}{t('embedding.ch1.title2')}
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('embedding.ch1.intro')}</p>

          <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">{t('embedding.ch1.section1Title')}</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">{t('embedding.ch1.section1Body')}</p>
          <EmbeddingMatrixIntro />

          <h3 className="font-serif text-base font-semibold text-ink-dark mt-8 mb-2">{t('embedding.ch1.section2Title')}</h3>
          <p className="text-sm text-text-muted mb-4 max-w-prose">{t('embedding.ch1.section2Body')}</p>
          <div className="stage">
            <span className="stage-label">{t('embedding.ch1.stageLabel')}</span>
            {data ? (
              <VectorSliceViz words={data.words} realDim={data.realDim} />
            ) : (
              <p className="text-text-muted">{t('common.loading')}</p>
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
            {t('embedding.ch2.title1')}{' '}
            <span className="relative inline-block text-ember-dark">
              {t('embedding.ch2.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('embedding.ch2.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('embedding.ch2.stageLabel')}</span>
            {data ? <SemanticScatter words={data.words} /> : <p className="text-text-muted">{t('common.loading')}</p>}
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 3：余弦相似度 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            {t('embedding.ch3.title1')}
            <span className="relative inline-block text-ember-dark">
              {t('embedding.ch3.titleHighlight')}
              <SquiggleUnderline className="text-ember/70" />
            </span>
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">{t('embedding.ch3.body')}</p>
          <div className="stage">
            <span className="stage-label">{t('embedding.ch3.stageLabel')}</span>
            {data ? <CosineSimilarityViz words={data.words} /> : <p className="text-text-muted">{t('common.loading')}</p>}
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 4：PM 视角 === */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="04" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">{t('embedding.ch4.eyebrow')}</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">{t('embedding.ch4.title')}</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDiveEmbedding />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">{t('embedding.outro.body')}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={localizedHref(lang, '/')} className="btn-secondary">
            {t('embedding.outro.backHome')}
          </Link>
          <Link href={localizedHref(lang, '/positional')} className="btn-primary">
            {t('embedding.outro.next')}
          </Link>
        </div>
      </section>
    </main>
  );
}
