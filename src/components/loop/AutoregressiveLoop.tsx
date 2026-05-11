'use client';

import { useEffect, useRef, useState } from 'react';

import { useT } from '@/lib/i18n/LangContext';
import type { ExampleData, IndexData } from '@/lib/types';

const STEP_INTERVAL_MS = 1000;

export default function AutoregressiveLoop() {
  const t = useT();
  const [index, setIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string>('capital_china');
  const [data, setData] = useState<ExampleData | null>(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/data/sampling/index.json').then((r) => r.json() as Promise<IndexData>).then(setIndex);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/sampling/${selectedId}.json`).then((r) => r.json() as Promise<ExampleData>).then((d) => {
      setData(d);
      setStepIdx(0);
      setIsPlaying(false);
    });
  }, [selectedId]);

  useEffect(() => {
    if (!isPlaying || !data) return;
    if (stepIdx >= data.steps.length) {
      setIsPlaying(false);
      return;
    }
    playTimerRef.current = setTimeout(() => {
      setStepIdx((s) => s + 1);
    }, STEP_INTERVAL_MS);
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, stepIdx, data]);

  if (!data) return <p className="text-text-muted">{t('loop.comp.autoregressive.loading')}</p>;

  const totalSteps = data.steps.length;
  const isFinished = stepIdx >= totalSteps;
  const generatedTokens = data.steps.slice(0, stepIdx).map((s) => s.greedy_token);
  const nextToken = isFinished ? null : data.steps[stepIdx]?.greedy_token;
  const currentText = data.prompt + generatedTokens.join('');

  const handleNext = () => {
    if (stepIdx < totalSteps) {
      setStepIdx((s) => s + 1);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (isFinished) {
      setStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const handleReset = () => {
    setStepIdx(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">{t('loop.comp.autoregressive.examplePickerLabel')}</label>
        <div className="flex flex-wrap gap-2">
          {index?.examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedId(ex.id)}
              className={[
                'text-xs px-3 py-1 rounded-full border transition-colors',
                selectedId === ex.id ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <CircuitDiagram currentText={currentText} nextToken={nextToken} isFinished={isFinished} stepIdx={stepIdx} totalSteps={totalSteps} />
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">{t('loop.comp.autoregressive.currentTextLabel')}</div>
        <p className="font-serif text-xl leading-relaxed">
          <span className="text-text-muted">{data.prompt}</span>
          {generatedTokens.map((tok, i) => (
            <span key={i} className={i === stepIdx - 1 ? 'text-ember-dark font-bold animate-[pulse_1s_ease-out_1]' : 'text-ink-dark font-semibold'}>
              {tok}
            </span>
          ))}
          {nextToken && <span className="text-text-muted/40 italic">[ {nextToken} ]</span>}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-text-muted">
            {t('loop.comp.autoregressive.progressLabel')}<strong className="text-text font-mono">{stepIdx} / {totalSteps}</strong> {t('loop.comp.autoregressive.tokenSuffix')}
            {isFinished && <span className="ml-2 text-ember-dark">{t('loop.comp.autoregressive.completed')}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="btn-secondary text-xs">{t('loop.comp.autoregressive.reset')}</button>
            <button onClick={handleNext} disabled={isFinished} className="btn-secondary text-xs disabled:opacity-40">{t('loop.comp.autoregressive.nextToken')}</button>
            <button onClick={handlePlay} className="btn-primary text-xs">
              {isPlaying ? t('loop.comp.autoregressive.pause') : isFinished ? t('loop.comp.autoregressive.replay') : t('loop.comp.autoregressive.play')}
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-text-muted/80 leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        {t('loop.comp.autoregressive.insight')}
      </p>
    </div>
  );
}

function CircuitDiagram({
  currentText,
  nextToken,
  isFinished,
  stepIdx,
  totalSteps,
}: {
  currentText: string;
  nextToken: string | null;
  isFinished: boolean;
  stepIdx: number;
  totalSteps: number;
}) {
  const t = useT();
  const W = 720;
  const H = 200;
  const displayText = currentText.length > 22 ? '…' + currentText.slice(-22) : currentText;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: '500px' }}>
      <defs>
        <marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
        </marker>
      </defs>

      <rect x={20} y={70} width={200} height={60} rx={8} fill="#F5EFE2" stroke="#6B5F50" strokeWidth={1.5} />
      <text x={120} y={88} textAnchor="middle" fontSize="10" fill="#6B5F50">
        {t('loop.comp.autoregressive.diagramCurrentInput')}
      </text>
      <text x={120} y={110} textAnchor="middle" fontSize="13" fontFamily="serif" fill="#1F1A14" fontWeight={500}>
        {displayText || t('loop.comp.autoregressive.diagramEmpty')}
      </text>

      <line x1={220} y1={100} x2={300} y2={100} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#loop-arrow)" />

      <rect x={310} y={70} width={150} height={60} rx={8} fill="#FFF7ED" stroke="#D97742" strokeWidth={2} />
      <text x={385} y={92} textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight={700} fill="#B85A2A">
        {t('loop.comp.autoregressive.diagramLLMTitle')}
      </text>
      <text x={385} y={108} textAnchor="middle" fontSize="9" fill="#6B5F50">
        {t('loop.comp.autoregressive.diagramLLMLine1')}
      </text>
      <text x={385} y={120} textAnchor="middle" fontSize="9" fill="#6B5F50">
        {t('loop.comp.autoregressive.diagramLLMLine2')}
      </text>

      <line x1={460} y1={100} x2={540} y2={100} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#loop-arrow)" />

      <rect x={550} y={70} width={150} height={60} rx={8} fill={isFinished ? '#F5EFE2' : '#FFF7ED'} stroke={isFinished ? '#9C9183' : '#D97742'} strokeWidth={isFinished ? 1.5 : 2.5} />
      <text x={625} y={88} textAnchor="middle" fontSize="10" fill="#6B5F50">
        {t('loop.comp.autoregressive.diagramNewToken')}
      </text>
      <text x={625} y={114} textAnchor="middle" fontSize="20" fontFamily="serif" fontWeight={700} fill={isFinished ? '#9C9183' : '#B85A2A'}>
        {isFinished ? t('loop.comp.autoregressive.diagramDone') : nextToken ? `「${nextToken}」` : '?'}
      </text>

      {!isFinished && nextToken && (
        <>
          <path d={`M 625 130 Q 625 170, 380 170 Q 120 170, 120 135`} fill="none" stroke="#D97742" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#loop-arrow)" />
          <text x={385} y={185} textAnchor="middle" fontSize="11" fill="#B85A2A" fontWeight={600} fontStyle="italic">
            {t('loop.comp.autoregressive.diagramLoopHint')}
          </text>
        </>
      )}

      <text x={W / 2} y={28} textAnchor="middle" fontSize="11" fill="#6B5F50">
        {t('loop.comp.autoregressive.diagramStepProgress', { current: stepIdx + 1, total: totalSteps })}
      </text>
    </svg>
  );
}
