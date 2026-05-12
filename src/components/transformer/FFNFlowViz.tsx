'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

// demo token 名保持中文（属于演示数据）
const TOKEN_NAMES = ['"Lucy"', '"苹果"', '"北京"', '"巴黎"'];
const TOKEN_VECS = [
  [0.6, -0.3, 0.8, 0.1, -0.5, 0.4, 0.2, -0.7],
  [-0.4, 0.7, -0.2, 0.5, 0.3, -0.6, 0.8, 0.1],
  [0.3, 0.9, -0.5, -0.2, 0.6, 0.1, -0.4, 0.7],
  [0.5, 0.8, -0.3, -0.1, 0.7, 0.2, -0.5, 0.6],
];

const D = 8;
const MID = 24;

function valueToBlue(v: number): string {
  return `rgba(217, 119, 66, ${0.05 + Math.min(Math.abs(v), 1) * 0.85})`;
}

function valueToGreen(v: number): string {
  return v >= 0
    ? `rgba(44, 81, 66, ${0.1 + Math.min(Math.abs(v), 1) * 0.7})`
    : `rgba(217, 119, 66, ${0.1 + Math.min(Math.abs(v), 1) * 0.7})`;
}

export default function FFNFlowViz() {
  const t = useT();
  const [tokenIdx, setTokenIdx] = useState(0);
  const tokenName = TOKEN_NAMES[tokenIdx];
  const tokenVec = TOKEN_VECS[tokenIdx];

  const midActivation = useMemo(() => {
    const seed = tokenName.charCodeAt(0) + tokenName.charCodeAt(1);
    return Array.from({ length: MID }, (_, i) => {
      const raw = Math.sin(seed * 0.17 + i * 0.41) * 0.5 + 0.5;
      return raw < 0.4 ? 0 : Number((raw - 0.3).toFixed(2));
    });
  }, [tokenName]);

  const output = useMemo(() => {
    return tokenVec.map((v, i) => {
      const sum = midActivation.reduce((s, m, j) => s + m * Math.cos((i * j) * 0.3), 0);
      return Number((v * 0.6 + sum * 0.05).toFixed(2));
    });
  }, [tokenVec, midActivation]);

  const activeCount = midActivation.filter((v) => v > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">{t('transformer.comp.ffnFlow.tokenPrompt')}</span>
        {TOKEN_NAMES.map((name, i) => (
          <button
            key={name}
            onClick={() => setTokenIdx(i)}
            className={[
              'px-3 py-1 text-sm rounded-full border transition-colors',
              tokenIdx === i ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 overflow-x-auto">
        <svg viewBox="0 0 820 280" className="w-full h-auto" style={{ minWidth: '600px' }}>
          <FlowSection
            x={30}
            label={t('transformer.comp.ffnFlow.inputLabel')}
            sublabel={t('transformer.comp.ffnFlow.inputSublabel', { token: tokenName, d: D })}
            cellsLabel={t('transformer.comp.ffnFlow.cellsLabel', { n: tokenVec.length })}
            tooltipFn={(n, v) => t('transformer.comp.ffnFlow.dimTooltip', { n, value: v })}
            cells={tokenVec}
            cellColor={valueToGreen}
            cols={D}
          />

          <ArrowWith
            label={t('transformer.comp.ffnFlow.w1Label')}
            sub={t('transformer.comp.ffnFlow.w1Sub', { mid: MID })}
            x1={180}
            x2={260}
            y={130}
          />

          <FlowSection
            x={270}
            label={t('transformer.comp.ffnFlow.midLabel')}
            sublabel={t('transformer.comp.ffnFlow.midSublabel', { mid: MID, active: activeCount })}
            cellsLabel={t('transformer.comp.ffnFlow.cellsLabel', { n: midActivation.length })}
            tooltipFn={(n, v) => t('transformer.comp.ffnFlow.dimTooltip', { n, value: v })}
            cells={midActivation}
            cellColor={valueToBlue}
            cols={6}
            wide
          />

          <ArrowWith
            label={t('transformer.comp.ffnFlow.w2Label')}
            sub={t('transformer.comp.ffnFlow.w2Sub')}
            x1={520}
            x2={600}
            y={130}
          />

          <FlowSection
            x={620}
            label={t('transformer.comp.ffnFlow.outputLabel')}
            sublabel={t('transformer.comp.ffnFlow.outputSublabel')}
            cellsLabel={t('transformer.comp.ffnFlow.cellsLabel', { n: output.length })}
            tooltipFn={(n, v) => t('transformer.comp.ffnFlow.dimTooltip', { n, value: v })}
            cells={output}
            cellColor={valueToGreen}
            cols={D}
          />
        </svg>
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">{t('transformer.comp.ffnFlow.insight')}</p>
      <p className="text-[11px] text-text-muted/70 italic">{t('transformer.comp.ffnFlow.caveat')}</p>
    </div>
  );
}

function FlowSection({
  x,
  label,
  sublabel,
  cellsLabel,
  tooltipFn,
  cells,
  cellColor,
  cols,
  wide = false,
}: {
  x: number;
  label: string;
  sublabel: string;
  cellsLabel: string;
  tooltipFn: (n: number, v: string) => string;
  cells: number[];
  cellColor: (v: number) => string;
  cols: number;
  wide?: boolean;
}) {
  const cellSize = wide ? 36 : 18;
  const gap = 2;
  const sectionW = cols * (cellSize + gap);
  const rows = Math.ceil(cells.length / cols);

  return (
    <g>
      <text x={x + sectionW / 2} y={70} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#1F1A14">
        {label}
      </text>
      <text x={x + sectionW / 2} y={84} textAnchor="middle" fontSize="9" fill="#6B5F50">
        {sublabel}
      </text>
      {cells.map((v, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <rect
            key={i}
            x={x + col * (cellSize + gap)}
            y={100 + row * (cellSize + gap)}
            width={cellSize}
            height={cellSize}
            rx={3}
            fill={cellColor(v)}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={0.5}
          >
            <title>{tooltipFn(i + 1, v.toFixed(2))}</title>
          </rect>
        );
      })}
      <text x={x + sectionW / 2} y={100 + rows * (cellSize + gap) + 14} textAnchor="middle" fontSize="9" fill="#9C9183">
        {cellsLabel}
      </text>
    </g>
  );
}

function ArrowWith({ label, sub, x1, x2, y }: { label: string; sub: string; x1: number; x2: number; y: number }) {
  return (
    <g>
      <defs>
        <marker id={`ffn-arrow-${x1}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
        </marker>
      </defs>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#2C5142" strokeWidth={1.5} markerEnd={`url(#ffn-arrow-${x1})`} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize="10" fontFamily="serif" fontWeight={600} fill="#1F3B30">
        {label}
      </text>
      <text x={(x1 + x2) / 2} y={y + 18} textAnchor="middle" fontSize="9" fill="#6B5F50">
        {sub}
      </text>
    </g>
  );
}
