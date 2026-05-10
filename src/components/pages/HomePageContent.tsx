'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import ModuleInfoModal, { type ModuleInfo } from '@/components/pipeline/ModuleInfoModal';
import PipelineStep from '@/components/pipeline/PipelineStep';
import {
  DetokenizationViz,
  EmbeddingViz,
  LogitsViz,
  PositionalViz,
  SamplingViz,
  TokenizationViz,
  TransformerViz,
} from '@/components/pipeline/StepVisualizations';
import InlineExampleSwitcher from '@/components/sampling/InlineExampleSwitcher';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import { useLang, useT } from '@/lib/i18n/LangContext';
import type { IndexData, PipelineData, PipelineIndexData } from '@/lib/types';

// step key 到字典 path 的桥——title/oneLiner 在渲染时通过 t() 动态取。
type StepKey = keyof PipelineData['steps'] | 'logits';
const STEP_META: {
  index: string;
  key: StepKey;
  status: 'live' | 'wip';
  href?: string;
  modalInfo?: ModuleInfo;
}[] = [
  { index: '01', key: 'tokenization', status: 'live', href: '/tokenization' },
  { index: '02', key: 'embedding', status: 'live', href: '/embedding' },
  { index: '03', key: 'positional_encoding', status: 'live', href: '/positional' },
  { index: '04', key: 'transformer', status: 'live', href: '/transformer' },
  { index: '05', key: 'logits', status: 'live', href: '/logits' },
  { index: '06', key: 'sampling', status: 'live', href: '/sampling' },
  { index: '07', key: 'detokenization', status: 'live', href: '/loop' },
];

export default function HomePageContent() {
  const t = useT();
  const lang = useLang();
  const [pipelineIndex, setPipelineIndex] = useState<PipelineIndexData | null>(null);
  const [samplingIndex, setSamplingIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModuleInfo | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [flowingFromIndex, setFlowingFromIndex] = useState<number | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/data/pipeline/index.json').then((r) => r.json() as Promise<PipelineIndexData>),
      fetch('/data/sampling/index.json').then((r) => r.json() as Promise<IndexData>),
    ])
      .then(([pi, si]) => {
        setPipelineIndex(pi);
        setSamplingIndex(si);
        if (pi.examples.length > 0 && !selectedId) {
          // 按当前 locale 选默认例子：英文版 → 英文 prompt；中文版 → 中文 prompt
          const preferredId = lang === 'en' ? 'capital_france_en' : 'capital_china';
          const fallback = pi.examples.find((e) => e.id === preferredId)?.id ?? pi.examples[0].id;
          setSelectedId(fallback);
        }
      })
      .catch((err) => console.error('failed to load homepage data:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/pipeline/${selectedId}.json`)
      .then((r) => r.json() as Promise<PipelineData>)
      .then((data) => {
        setPipeline(data);
        timersRef.current.forEach((t) => clearTimeout(t));
        timersRef.current = [];
        setExpandedSteps(new Set());
        setHasStarted(false);
        setActiveStepIndex(-1);
        setFlowingFromIndex(null);
      })
      .catch((err) => console.error(`failed to load pipeline ${selectedId}:`, err));
  }, [selectedId]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const STEP_DURATION_MS = 4800;
  const EXPAND_DELAY_MS = 500;
  const READ_DURATION_MS = 3500;
  const FLOW_DURATION_MS = 800;

  const handleStart = () => {
    clearTimers();
    setExpandedSteps(new Set());
    setActiveStepIndex(-1);
    setFlowingFromIndex(null);
    setHasStarted(true);

    STEP_META.forEach((step, i) => {
      const stepStart = i * STEP_DURATION_MS;

      timersRef.current.push(
        setTimeout(() => {
          setActiveStepIndex(i);
          setFlowingFromIndex(null);
        }, stepStart),
      );

      timersRef.current.push(
        setTimeout(() => {
          setExpandedSteps((prev) => new Set(prev).add(step.index));
        }, stepStart + EXPAND_DELAY_MS),
      );

      if (i < STEP_META.length - 1) {
        const flowStart = stepStart + EXPAND_DELAY_MS + READ_DURATION_MS;
        timersRef.current.push(
          setTimeout(() => {
            setFlowingFromIndex(i);
          }, flowStart),
        );
        timersRef.current.push(
          setTimeout(() => {
            setFlowingFromIndex(null);
          }, flowStart + FLOW_DURATION_MS),
        );
      }
    });

    timersRef.current.push(
      setTimeout(() => {
        setActiveStepIndex(STEP_META.length);
        setFlowingFromIndex(null);
      }, STEP_META.length * STEP_DURATION_MS),
    );
  };

  const handleSkip = () => {
    clearTimers();
    setExpandedSteps(new Set(STEP_META.map((s) => s.index)));
    setActiveStepIndex(STEP_META.length);
    setFlowingFromIndex(null);
    setHasStarted(true);
  };

  const handleToggleStep = (idx: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleCollapseAll = () => {
    clearTimers();
    setExpandedSteps(new Set());
    setHasStarted(false);
    setActiveStepIndex(-1);
    setFlowingFromIndex(null);
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const finalToken = useMemo(() => pipeline?.steps.sampling.selected_token, [pipeline]);

  return (
    <main className="container-wide py-10 sm:py-16 pb-24">
      {/* === Hero === */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">
            {t('home.hero.eyebrow')}
          </span>
          <span className="flex-1 h-px bg-ember/30" />
          <LanguageSwitcher />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink-dark leading-[1.1] mb-5">
          {t('home.hero.title1')}
          <br className="hidden sm:block" />
          <span className="relative inline-block text-ember-dark mx-1">
            {t('home.hero.title2')}
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-prose mb-6">
          {t('home.hero.subtitle')}
        </p>

        {/* 顶部输入控制条 */}
        {pipeline && samplingIndex && (
          <div className="stage flex flex-wrap items-center gap-4">
            <span className="stage-label">{t('home.inputBar.label')}</span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1">
                {t('home.inputBar.caption')}
              </div>
              <p className="font-serif text-xl sm:text-2xl text-text leading-snug truncate">
                {pipeline.prompt_zh_label}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <InlineExampleSwitcher
                examples={samplingIndex.examples}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              {!hasStarted ? (
                <button onClick={handleStart} className="btn-primary text-sm">
                  {t('home.inputBar.start')}
                </button>
              ) : activeStepIndex >= 0 && activeStepIndex < STEP_META.length ? (
                <button onClick={handleSkip} className="btn-secondary text-sm">
                  {t('home.inputBar.skip')}
                </button>
              ) : (
                <button onClick={handleCollapseAll} className="btn-secondary text-sm">
                  {t('home.inputBar.restart')}
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 7 步流水线时间轴 === */}
      <section>
        {pipeline ? (
          STEP_META.map((meta, i) => {
            const expanded = expandedSteps.has(meta.index);
            const isActive = activeStepIndex === i;
            const isDimmed = hasStarted && activeStepIndex >= 0 && activeStepIndex < STEP_META.length && !isActive;
            const labels = buildStepLabels(meta.key, pipeline, t);
            return (
              <PipelineStep
                key={meta.index}
                index={meta.index}
                title={t(`home.steps.${meta.key}.title`)}
                oneLiner={t(`home.steps.${meta.key}.oneLiner`)}
                status={meta.status}
                href={meta.href}
                onWipClick={() => meta.modalInfo && setModal(meta.modalInfo)}
                expanded={expanded}
                onToggle={() => handleToggleStep(meta.index)}
                isActive={isActive}
                isFlowingNext={flowingFromIndex === i}
                isPassed={activeStepIndex > i || activeStepIndex === STEP_META.length}
                isDimmed={isDimmed}
                isLast={i === STEP_META.length - 1}
                inputLabel={labels.input}
                outputLabel={labels.output}
              >
                {renderViz(meta.key, pipeline)}
              </PipelineStep>
            );
          })
        ) : (
          <p className="text-text-muted">{t('common.loadingDemo')}</p>
        )}
      </section>

      {/* === 输出 === */}
      {pipeline && (
        <section className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-5">
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full bg-ember text-cream-50 border-2 border-ember flex items-center justify-center font-serif text-lg shrink-0"
              style={
                activeStepIndex === STEP_META.length
                  ? { animation: 'circlePop 0.5s ease-out, finalArrive 1.6s ease-out' }
                  : undefined
              }
            >
              ✓
            </div>
          </div>
          <div className="pt-1">
            <h3 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
              {t('home.finalOutput.heading')}
            </h3>
            <div
              className="stage py-6 sm:py-8 transition-all"
              style={
                activeStepIndex === STEP_META.length
                  ? { animation: 'finalArrive 1.6s ease-out 1' }
                  : undefined
              }
            >
              <div className="text-[11px] uppercase tracking-wider text-text-muted mb-2">
                {t('home.finalOutput.caption')}
              </div>
              <p className="font-serif text-3xl sm:text-4xl text-ink-dark leading-snug">
                <span className="text-text-muted">{pipeline.prompt}</span>
                <span className="text-ember-dark ml-1 animate-pulse">{finalToken}</span>
              </p>
            </div>
          </div>
        </section>
      )}

      <p className="mt-12 text-xs text-text-muted/70 text-center">{t('home.footnote')}</p>

      <ModuleInfoModal info={modal} onClose={() => setModal(null)} />
    </main>
  );
}

// 每步的"输入/输出"标签——从 pipeline JSON 读出具体值，按当前 locale 渲染。
function buildStepLabels(
  key: StepKey,
  pipeline: PipelineData,
  t: (k: string, vars?: Record<string, string | number>) => string,
): { input: React.ReactNode; output: React.ReactNode } {
  const tokens = pipeline.steps.tokenization.tokens;
  const tokenCount = tokens.length;
  const embedDim = pipeline.steps.embedding.dim;
  const layers = pipeline.steps.transformer.layers;
  const heads = pipeline.steps.transformer.heads;
  const topToken = pipeline.steps.logits_top[0];
  const selected = pipeline.steps.sampling.selected_token;

  switch (key) {
    case 'tokenization':
      return {
        input: <>{t('home.stepLabels.tokenization.inputPrefix')}「<strong>{pipeline.prompt}</strong>」</>,
        output: <>{t('home.stepLabels.tokenization.outputN', { n: tokenCount })} [{tokens.join('｜')}]</>,
      };
    case 'embedding':
      return {
        input: <>{t('home.stepLabels.embedding.input', { n: tokenCount })}</>,
        output: <>{t('home.stepLabels.embedding.output', { n: tokenCount, dim: embedDim })}</>,
      };
    case 'positional_encoding':
      return {
        input: <>{t('home.stepLabels.positional_encoding.input', { n: tokenCount, dim: embedDim })}</>,
        output: <>{t('home.stepLabels.positional_encoding.output', { n: tokenCount })}</>,
      };
    case 'transformer':
      return {
        input: <>{t('home.stepLabels.transformer.input', { n: tokenCount })}</>,
        output: <>{t('home.stepLabels.transformer.output', { layers, heads })}</>,
      };
    case 'logits':
      return {
        input: <>{t('home.stepLabels.logits.input')}</>,
        output: (
          <>
            {t('home.stepLabels.logits.outputPrefix')} &quot;<strong>{topToken.token}</strong>&quot; {(topToken.prob * 100).toFixed(1)}%
          </>
        ),
      };
    case 'sampling':
      return {
        input: <>{t('home.stepLabels.sampling.input')}</>,
        output: (
          <>
            {t('home.stepLabels.sampling.outputPrefix')} &quot;<strong className="text-ember-dark">{selected}</strong>&quot;
          </>
        ),
      };
    case 'detokenization':
      return {
        input: <>{t('home.stepLabels.detokenization.inputPrefix')} &quot;{selected}&quot;</>,
        output: (
          <>
            &quot;<strong className="text-ember-dark">{selected}</strong>&quot; {t('home.stepLabels.detokenization.outputArrow')}
          </>
        ),
      };
    default:
      return { input: null, output: null };
  }
}

function renderViz(key: StepKey, pipeline: PipelineData): React.ReactNode {
  const tokens = pipeline.steps.tokenization.tokens;
  switch (key) {
    case 'tokenization':
      return <TokenizationViz data={pipeline.steps.tokenization} />;
    case 'embedding':
      return <EmbeddingViz data={pipeline.steps.embedding} firstToken={tokens[0]} />;
    case 'positional_encoding':
      return <PositionalViz data={pipeline.steps.positional_encoding} tokens={tokens} />;
    case 'transformer':
      return <TransformerViz data={pipeline.steps.transformer} />;
    case 'logits':
      return <LogitsViz data={pipeline.steps.logits_top} />;
    case 'sampling':
      return <SamplingViz data={pipeline.steps.sampling} />;
    case 'detokenization':
      return <DetokenizationViz data={pipeline.steps.detokenization} prompt={pipeline.prompt} />;
    default:
      return null;
  }
}
