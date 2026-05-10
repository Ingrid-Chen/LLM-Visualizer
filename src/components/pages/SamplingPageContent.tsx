'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import DeepDiveSampling from '@/components/sampling/DeepDiveSampling';
import DistributionChart from '@/components/sampling/DistributionChart';
import ExampleSelector from '@/components/sampling/ExampleSelector';
import FloatingSampleBar from '@/components/sampling/FloatingSampleBar';
import GeneratedTextDisplay from '@/components/sampling/GeneratedTextDisplay';
import InlineExampleSwitcher from '@/components/sampling/InlineExampleSwitcher';
import ParamControls from '@/components/sampling/ParamControls';
import PMPerspectiveCards from '@/components/sampling/PMPerspectiveCards';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import {
  ChapterNumber,
  SquiggleUnderline,
  TryBadge,
  WavyDivider,
} from '@/components/ui/SketchDecor';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';
import { pickSampledIndex, useSamplingState } from '@/lib/useSamplingState';
import type { ExampleData, IndexData } from '@/lib/types';

export default function SamplingPageContent() {
  const t = useT();
  const lang = useLang();
  const [index, setIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const { state, dispatch, derived } = useSamplingState();

  useEffect(() => {
    fetch('/data/sampling/index.json')
      .then((r) => r.json() as Promise<IndexData>)
      .then((data) => {
        setIndex(data);
        if (data.examples.length > 0 && !selectedId) {
          setSelectedId(data.examples[0].id);
        }
      })
      .catch((err) => console.error('failed to load index.json:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/sampling/${selectedId}.json`)
      .then((r) => r.json() as Promise<ExampleData>)
      .then((data) => {
        dispatch({ type: 'EXAMPLE_LOADED', data });
        setHighlightIndex(null);
      })
      .catch((err) => console.error(`failed to load ${selectedId}.json:`, err));
  }, [selectedId, dispatch]);

  const handleSampleFirst = () => {
    const probs = derived.distribution.map((d) => d.prob);
    const idx = pickSampledIndex(probs);
    setHighlightIndex(idx);
    dispatch({ type: 'SAMPLE_FIRST', tokenIndex: idx });
  };

  const handleAdvanceDemo = () => {
    setHighlightIndex(null);
    dispatch({ type: 'ADVANCE_DEMO' });
  };

  const handleReset = () => {
    setHighlightIndex(null);
    dispatch({ type: 'RESET' });
  };

  return (
    <>
      <main className="container-wide py-8 sm:py-12 pb-28 sm:pb-32">
        {/* 顶部导航条 */}
        <nav className="mb-8 flex items-center justify-between text-sm gap-3">
          <Link href={localizedHref(lang, '/')} className="text-text-muted hover:text-ink-dark transition-colors">
            {t('sampling.nav.backToHome')}
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <span className="text-text-muted font-mono">{t('sampling.nav.pageIndex')}</span>
          </div>
        </nav>

        {/* === Hero（紧凑） === */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">{t('sampling.eyebrow')}</span>
            <span className="flex-1 h-px bg-ember/30" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
            {t('sampling.hero.title1')}
            <span className="relative inline-block text-ember-dark mx-1">
              {t('sampling.hero.titleHighlight')}
              <SquiggleUnderline className="text-ember" />
            </span>
            {t('sampling.hero.title2')}
          </h1>
          <p className="text-base text-text-muted max-w-prose leading-relaxed">
            {t('sampling.hero.lede1')}
            <Link href={localizedHref(lang, '/logits')} className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
              {t('sampling.hero.lede1Link')}
            </Link>
            {t('sampling.hero.lede2')}
            <strong className="text-text">{t('sampling.hero.ledeBold')}</strong>
            {t('sampling.hero.lede3')}
          </p>
        </header>

        <WavyDivider className="text-ink/20 mb-8" />

        {/* === 章节 1：选例子（紧凑） === */}
        <section className="mb-8 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="01" />
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-1.5">
              {t('sampling.ch1.title')}
            </h2>
            <p className="text-sm text-text-muted mb-4 max-w-prose">
              {t('sampling.ch1.body')}
            </p>
            {index ? (
              <ExampleSelector
                examples={index.examples}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ) : (
              <p className="text-text-muted">{t('common.loadingExamples')}</p>
            )}
          </div>
        </section>

        <WavyDivider className="text-ink/20 mb-8" />

        {/* === 章节 2：主交互舞台（紧凑） === */}
        <section className="mb-8 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="02" />
          <div>
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">
                {t('sampling.ch2.titlePart1')}
                <em className="not-italic font-medium text-ink-dark">{t('sampling.ch2.titleEmphasis')}</em>
                {t('sampling.ch2.titlePart2')}
                <span className="relative inline-block text-ink mx-0.5">
                  {t('sampling.ch2.titleHighlight')}
                  <SquiggleUnderline className="text-ink/60" />
                </span>
                {t('sampling.ch2.titlePart3')}
              </h2>
              <TryBadge>{t('sampling.ch2.tryBadge')}</TryBadge>
            </div>

            {state.exampleData && (
              <div className="stage">
                <span className="stage-label">{t('sampling.ch2.stageLabel')}</span>

                {/* 紧凑版当前文本（一行） + 右侧"换其他文本"快捷入口 */}
                <GeneratedTextDisplay
                  prompt={state.exampleData.prompt}
                  generated={state.generatedTokens}
                  compact
                  trailing={
                    index ? (
                      <InlineExampleSwitcher
                        examples={index.examples}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                      />
                    ) : null
                  }
                />

                {/* 上下布局：柱状图横满 → 参数横向 3 列 */}
                <div className="mt-3">
                  <div className="flex items-baseline justify-between mb-1.5 gap-2 flex-wrap">
                    <h3 className="font-serif text-sm text-ink-dark">
                      {state.demoMode
                        ? t('sampling.ch2.demoStepLabel', { n: state.currentStepIndex + 1 })
                        : t('sampling.ch2.distChartTitle')}
                    </h3>
                    {state.demoMode && (
                      <span className="step-pill bg-ember/15 text-ember-dark border-ember/30">{t('sampling.ch2.demoModeLabel')}</span>
                    )}
                  </div>
                  <DistributionChart
                    distribution={derived.distribution}
                    highlightIndex={highlightIndex}
                    height={240}
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-ink/10">
                  <h3 className="font-serif text-sm text-ink-dark mb-2.5">{t('sampling.ch2.paramHeading')}</h3>
                  <ParamControls
                    temperature={state.temperature}
                    topK={state.topK}
                    topP={state.topP}
                    disabled={state.demoMode}
                    onTemperatureChange={(v) => dispatch({ type: 'SET_TEMPERATURE', value: v })}
                    onTopKChange={(v) => dispatch({ type: 'SET_TOPK', value: v })}
                    onTopPChange={(v) => dispatch({ type: 'SET_TOPP', value: v })}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <WavyDivider className="text-ink/20 mb-10" />

        {/* === 章节 3：温度叙事 === */}
        <section className="mb-10 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="03" />
          <div className="max-w-prose">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-3">
              {t('sampling.ch3.title1')}
              <span className="relative inline-block text-ember-dark">
                {t('sampling.ch3.titleEmphasis')}
                <SquiggleUnderline className="text-ember/70" />
              </span>
              {' '}{t('sampling.ch3.title2')}
            </h2>
            <p className="text-text-muted leading-relaxed mb-3">
              {t('sampling.ch3.body1')}
              <strong className="text-text">{t('sampling.ch3.body1Bold')}</strong>
            </p>
            <ul className="space-y-2 mb-4 text-text-muted">
              <li>
                <strong className="text-text">{t('sampling.ch3.bullets.0.label')}</strong>{t('sampling.ch3.bullets.0.text')}
              </li>
              <li>
                <strong className="text-text">{t('sampling.ch3.bullets.1.label')}</strong>{t('sampling.ch3.bullets.1.text')}
              </li>
            </ul>
            <p className="text-xs text-text-muted/70 italic">
              {t('sampling.ch3.caveat')}
            </p>
          </div>
        </section>

        {/* === 章节 4：Top-k / Top-p === */}
        <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="04" />
          <div className="max-w-prose">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-3">
              {t('sampling.ch4.title1')}
              <span className="relative inline-block text-ember-dark">
                {t('sampling.ch4.titleHighlightA')}
                <SquiggleUnderline className="text-ember/70" />
              </span>
              {' '}{t('sampling.ch4.titleAnd')}{' '}
              <span className="relative inline-block text-ember-dark">
                {t('sampling.ch4.titleHighlightB')}
                <SquiggleUnderline className="text-ember/70" />
              </span>
              {' '}{t('sampling.ch4.title2')}
            </h2>
            <p className="text-text-muted leading-relaxed mb-3">
              {t('sampling.ch4.body1')}
              <em>{t('sampling.ch4.body1Em')}</em>
              {t('sampling.ch4.body2')}
              <strong className="text-text">{t('sampling.ch4.body2Bold')}</strong>
            </p>
            <ul className="space-y-2 text-text-muted">
              <li>
                <strong className="text-text">{t('sampling.ch4.bullets.0.label')}</strong>{t('sampling.ch4.bullets.0.text')}
              </li>
              <li>
                <strong className="text-text">{t('sampling.ch4.bullets.1.label')}</strong>{t('sampling.ch4.bullets.1.text')}
              </li>
            </ul>
          </div>
        </section>

        <WavyDivider className="text-ink/20 mb-10" />

        {/* === 章节 5：PM 视角 === */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <ChapterNumber n="05" />
            <div>
              <p className="text-sm uppercase tracking-widest text-ember-dark">{t('sampling.ch5.eyebrow')}</p>
              <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">{t('sampling.ch5.title')}</h2>
            </div>
          </div>
          <PMPerspectiveCards />
        </section>

        <WavyDivider className="text-ink/20 my-10" />

        <DeepDiveSampling />

        {/* 章节出口 */}
        <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
          <p className="text-text-muted leading-relaxed mb-5 max-w-prose">
            {t('sampling.outro.body')}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={localizedHref(lang, '/')} className="btn-secondary">
              {t('sampling.outro.backHome')}
            </Link>
            <Link href={localizedHref(lang, '/loop')} className="btn-primary">
              {t('sampling.outro.next')}
            </Link>
          </div>
        </section>
      </main>

      {/* 页面级浮动操作条：始终常驻视口底部 */}
      <FloatingSampleBar
        visible={!!state.exampleData}
        demoMode={state.demoMode}
        isAtEnd={derived.isAtEnd}
        hasGenerated={state.generatedTokens.length > 0}
        onSampleFirst={handleSampleFirst}
        onAdvanceDemo={handleAdvanceDemo}
        onReset={handleReset}
      />
    </>
  );
}
