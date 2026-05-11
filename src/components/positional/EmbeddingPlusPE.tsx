'use client';

import { useMemo, useState } from 'react';

import { sinusoidalPE } from '@/lib/positional-encoding';
import { useT } from '@/lib/i18n/LangContext';

const DIM = 16;

function mockEmbeddingFor(token: string): number[] {
  const charSum = token.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: DIM }, (_, i) =>
    Number((Math.sin(charSum * 0.13 + i * 0.7) * 0.5).toFixed(3)),
  );
}

function valueToColor(v: number): string {
  const intensity = Math.min(Math.abs(v), 1);
  if (v >= 0) return `rgba(44, 81, 66, ${0.15 + intensity * 0.7})`;
  return `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
}

export default function EmbeddingPlusPE() {
  const t = useT();
  const [pos1, setPos1] = useState(0);
  const [pos2, setPos2] = useState(2);
  const token = '我';

  const tokenEmbedding = useMemo(() => mockEmbeddingFor(token), [token]);
  const pe1 = useMemo(() => sinusoidalPE(pos1, DIM), [pos1]);
  const pe2 = useMemo(() => sinusoidalPE(pos2, DIM), [pos2]);

  const final1 = tokenEmbedding.map((v, i) => v + pe1[i]);
  const final2 = tokenEmbedding.map((v, i) => v + pe2[i]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted leading-relaxed">
        {t('positional.comp.embeddingPlusPE.lede', { token })}
      </p>

      <div className="grid grid-cols-2 gap-3">
        <PositionPicker label={t('positional.comp.embeddingPlusPE.posALabel')} value={pos1} onChange={setPos1} colorClass="text-ink-dark" />
        <PositionPicker label={t('positional.comp.embeddingPlusPE.posBLabel')} value={pos2} onChange={setPos2} colorClass="text-ember-dark" />
      </div>

      <div className="space-y-3">
        <VectorRow
          label={t('positional.comp.embeddingPlusPE.tokenEmbeddingLabel', { token })}
          subtitle={t('positional.comp.embeddingPlusPE.tokenEmbeddingSubtitle')}
          values={tokenEmbedding}
          tooltipPrefix={t('positional.comp.embeddingPlusPE.dimTooltip', { n: 0, value: 0 }).split('{')[0]}
        />

        <div className="rounded-lg border-2 border-ink/20 bg-ink/5 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-ink-dark font-medium">
            {t('positional.comp.embeddingPlusPE.atPosA', { n: pos1 })}
          </div>
          <VectorRow label={t('positional.comp.embeddingPlusPE.peLabel', { n: pos1 })} subtitle={t('positional.comp.embeddingPlusPE.peSubtitle')} values={pe1} compact />
          <div className="text-center text-text-muted text-xs">{t('positional.comp.embeddingPlusPE.addLabel')}</div>
          <VectorRow
            label={t('positional.comp.embeddingPlusPE.finalLabel', { ab: 'A' })}
            subtitle={t('positional.comp.embeddingPlusPE.finalSubtitle', { token, n: pos1 })}
            values={final1}
            compact
            highlight
          />
        </div>

        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium">
            {t('positional.comp.embeddingPlusPE.atPosB', { n: pos2 })}
          </div>
          <VectorRow label={t('positional.comp.embeddingPlusPE.peLabel', { n: pos2 })} subtitle={t('positional.comp.embeddingPlusPE.peSubtitle')} values={pe2} compact />
          <div className="text-center text-text-muted text-xs">{t('positional.comp.embeddingPlusPE.addLabel')}</div>
          <VectorRow
            label={t('positional.comp.embeddingPlusPE.finalLabel', { ab: 'B' })}
            subtitle={t('positional.comp.embeddingPlusPE.finalSubtitle', { token, n: pos2 })}
            values={final2}
            compact
            highlight
          />
        </div>
      </div>

      <p className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        {t('positional.comp.embeddingPlusPE.insight', { token })}
      </p>
      <p className="text-[11px] text-text-muted/70 italic">
        {t('positional.comp.embeddingPlusPE.caveat', { dim: DIM })}
      </p>
    </div>
  );
}

function PositionPicker({
  label,
  value,
  onChange,
  colorClass,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  colorClass: string;
}) {
  return (
    <div>
      <label className={['text-xs uppercase tracking-wider block mb-1', colorClass].join(' ')}>{label} · pos = {value}</label>
      <input
        type="range"
        min={0}
        max={31}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink"
      />
    </div>
  );
}

function VectorRow({
  label,
  subtitle,
  values,
  compact = false,
  highlight = false,
  tooltipPrefix,
}: {
  label: string;
  subtitle?: string;
  values: number[];
  compact?: boolean;
  highlight?: boolean;
  tooltipPrefix?: string;
}) {
  void compact;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1 gap-2">
        <span className={['text-xs', highlight ? 'font-medium text-text' : 'text-text-muted'].join(' ')}>{label}</span>
        {subtitle && <span className="text-[10px] text-text-muted/70">{subtitle}</span>}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((v, i) => (
          <div
            key={i}
            className="aspect-square rounded flex items-center justify-center text-[8px] font-mono text-cream-50 font-medium"
            style={{ backgroundColor: valueToColor(v) }}
            title={tooltipPrefix ? `${tooltipPrefix}${i + 1}: ${v.toFixed(3)}` : `${i + 1}: ${v.toFixed(3)}`}
          >
            {v.toFixed(1)}
          </div>
        ))}
      </div>
    </div>
  );
}
