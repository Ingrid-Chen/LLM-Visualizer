'use client';

import { useMemo, useState } from 'react';

import { useT } from '@/lib/i18n/LangContext';
import type { AttentionData, AttentionExample } from '@/lib/types';

interface Props {
  data: AttentionData;
}

export default function AttentionMatrixViz({ data }: Props) {
  const t = useT();
  const [exampleId, setExampleId] = useState<string>(data.examples[0]?.id ?? '');
  const example = data.examples.find((e) => e.id === exampleId) ?? data.examples[0];
  const [layerIdx, setLayerIdx] = useState(2);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const fromIdx = hoverIdx ?? example.defaultFromIdx;
  const matrix = example.layers[layerIdx];
  const weights = matrix[fromIdx];

  const topTargets = useMemo(() => {
    return weights
      .map((w, i) => ({ token: example.tokens[i], idx: i, w }))
      .filter((tt) => tt.idx !== fromIdx)
      .sort((a, b) => b.w - a.w)
      .slice(0, 3);
  }, [weights, fromIdx, example.tokens]);

  const layerLabel = (i: number) => t(`transformer.comp.attentionMatrix.layerLabels.${i}`);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">{t('transformer.comp.attentionMatrix.examplePickerLabel')}</label>
        <div className="flex flex-wrap gap-2">
          {data.examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                setExampleId(ex.id);
                setHoverIdx(null);
              }}
              className={[
                'text-left px-3 py-1.5 rounded-lg border-2 transition-all text-sm',
                exampleId === ex.id ? 'border-ink bg-cream-100 shadow-[2px_3px_0_rgba(44,81,66,0.15)]' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {ex.label}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed mt-2 px-1">
          {t('transformer.comp.attentionMatrix.examplePickerHintPrefix')} {example.highlight}
          {' '}{t('transformer.comp.attentionMatrix.examplePickerHintEnd')}
        </p>
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">{t('transformer.comp.attentionMatrix.layerPickerLabel')}</label>
        <div className="flex flex-wrap gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setLayerIdx(i)}
              className={[
                'text-xs px-3 py-1 rounded-full border transition-colors',
                layerIdx === i ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {layerLabel(i)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">{t('transformer.comp.attentionMatrix.mainHeading')}</div>
        <div className="flex items-center gap-4 mb-2 text-[11px] text-text-muted flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-ember" />
            {t('transformer.comp.attentionMatrix.legendFrom')}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-cream-100 border border-text-muted/40" />
            {t('transformer.comp.attentionMatrix.legendTo')}
          </span>
        </div>
        <AttentionFlowSvg example={example} weights={weights} fromIdx={fromIdx} onHover={setHoverIdx} />
        <div className="mt-3 p-3 rounded bg-ember/5 border border-ember/20 text-xs leading-relaxed">
          {t('transformer.comp.attentionMatrix.currentSelected')}
          <strong className="text-ember-dark">「{example.tokens[fromIdx]}」</strong>
          {t('transformer.comp.attentionMatrix.currentPositionPart', { n: fromIdx })}
          <strong className="text-text">{layerLabel(layerIdx)}</strong>
          {t('transformer.comp.attentionMatrix.currentLayerSuffix')}
          <span className="ml-1">
            {topTargets.map((tt, i) => (
              <span key={tt.idx}>
                {i > 0 && '、'}
                <strong className="text-text">「{tt.token}」</strong>({(tt.w * 100).toFixed(0)}%)
              </span>
            ))}
          </span>
        </div>

        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-text-muted hover:text-text transition-colors">
            {t('transformer.comp.attentionMatrix.showMatrix')}
          </summary>
          <div className="mt-2">
            <MatrixGrid example={example} matrix={matrix} highlightFromIdx={fromIdx} />
          </div>
        </details>
      </div>

      <p className="text-xs text-text-muted/80 leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        {t('transformer.comp.attentionMatrix.crossLayerInsight')}
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        {t('transformer.comp.attentionMatrix.caveat')}
      </p>
    </div>
  );
}

function AttentionFlowSvg({
  example,
  weights,
  fromIdx,
  onHover,
}: {
  example: AttentionExample;
  weights: number[];
  fromIdx: number;
  onHover: (idx: number | null) => void;
}) {
  const n = example.tokens.length;
  const W = 700;
  const H = 200;
  const xs = Array.from({ length: n }, (_, i) => 30 + ((W - 60) / Math.max(n - 1, 1)) * i);
  const yTop = 28;
  const yBot = H - 28;
  const tokenBoxH = 28;

  const maxW = Math.max(...weights, 0.001);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: '240px' }}>
      {weights.map((w, j) => {
        if (j === fromIdx) return null;
        const opacity = Math.max(0.1, w / maxW);
        const strokeW = 1 + (w / maxW) * 5;
        return (
          <line key={j} x1={xs[fromIdx]} y1={yTop + tokenBoxH} x2={xs[j]} y2={yBot - 2} stroke="#D97742" strokeWidth={strokeW} strokeOpacity={opacity} />
        );
      })}

      {example.tokens.map((tok, i) => {
        const isFrom = i === fromIdx;
        return (
          <g
            key={`top-${i}`}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect x={xs[i] - 22} y={yTop} width={44} height={tokenBoxH} rx={6} fill={isFrom ? '#D97742' : '#F5EFE2'} stroke={isFrom ? '#B85A2A' : '#6B5F50'} strokeWidth={isFrom ? 2 : 1} />
            <text x={xs[i]} y={yTop + 18} textAnchor="middle" fontSize="13" fontFamily="serif" fill={isFrom ? '#FBF8F1' : '#1F1A14'} fontWeight={isFrom ? 700 : 400}>
              {tok}
            </text>
          </g>
        );
      })}

      {example.tokens.map((tok, j) => {
        const w = weights[j];
        const intensity = Math.min(w / maxW, 1);
        const isHighlighted = intensity > 0.4;
        const fill = `rgba(217, 119, 66, ${0.05 + intensity * 0.45})`;
        return (
          <g key={`bot-${j}`}>
            <rect x={xs[j] - 22} y={yBot} width={44} height={tokenBoxH} rx={6} fill={fill} stroke={isHighlighted ? '#D97742' : '#9C9183'} strokeWidth={isHighlighted ? 2 : 1} />
            <text x={xs[j]} y={yBot + 18} textAnchor="middle" fontSize="13" fontFamily="serif" fill="#1F1A14" fontWeight={isHighlighted ? 600 : 400}>
              {tok}
            </text>
            <text x={xs[j]} y={yBot + 42} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#6B5F50">
              {(w * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function MatrixGrid({ example, matrix, highlightFromIdx }: { example: AttentionExample; matrix: number[][]; highlightFromIdx: number }) {
  const n = example.tokens.length;
  const cellSize = 28;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${(n + 1) * cellSize + 10} ${(n + 1) * cellSize + 10}`} style={{ minWidth: '320px', maxWidth: '600px' }}>
        {example.tokens.map((tok, j) => (
          <text key={`col-${j}`} x={cellSize + j * cellSize + cellSize / 2} y={cellSize - 6} textAnchor="middle" fontSize="9" fill="#6B5F50">
            {tok.length > 3 ? tok.slice(0, 3) + '…' : tok}
          </text>
        ))}
        {matrix.map((row, i) => (
          <g key={`row-${i}`}>
            <text x={cellSize - 6} y={cellSize + i * cellSize + cellSize / 2 + 3} textAnchor="end" fontSize="9" fill="#6B5F50" fontWeight={i === highlightFromIdx ? 700 : 400}>
              {example.tokens[i].length > 3 ? example.tokens[i].slice(0, 3) + '…' : example.tokens[i]}
            </text>
            {row.map((v, j) => {
              const intensity = Math.min(v * 2.5, 1);
              const isHighlightRow = i === highlightFromIdx;
              return (
                <g key={`cell-${i}-${j}`}>
                  <rect x={cellSize + j * cellSize} y={cellSize + i * cellSize} width={cellSize - 2} height={cellSize - 2} fill={`rgba(217, 119, 66, ${0.1 + intensity * 0.8})`} stroke={isHighlightRow ? '#2C5142' : 'none'} strokeWidth={1} />
                  <text x={cellSize + j * cellSize + cellSize / 2} y={cellSize + i * cellSize + cellSize / 2 + 3} textAnchor="middle" fontSize="8" fill="#1F1A14" fontWeight={500}>
                    {v < 0.05 ? '' : (v * 100).toFixed(0)}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
