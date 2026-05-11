'use client';

import { useMemo, useState } from 'react';

import { sinusoidalMatrix } from '@/lib/positional-encoding';
import { useT } from '@/lib/i18n/LangContext';

function valueToColor(v: number): string {
  const intensity = Math.min(Math.abs(v), 1);
  if (v >= 0) {
    return `rgba(44, 81, 66, ${0.1 + intensity * 0.8})`;
  } else {
    return `rgba(217, 119, 66, ${0.1 + intensity * 0.8})`;
  }
}

const SEQ_LENGTH_OPTIONS = [16, 32, 64, 128];

export default function PositionalHeatmap() {
  const t = useT();
  const [seqLength, setSeqLength] = useState(64);
  const dim = 64;

  const matrix = useMemo(() => sinusoidalMatrix(seqLength, dim), [seqLength]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">{t('positional.comp.heatmap.seqPrompt')}</span>
        {SEQ_LENGTH_OPTIONS.map((n) => (
          <button
            key={n}
            onClick={() => setSeqLength(n)}
            className={[
              'px-3 py-1 text-xs rounded-full border transition-colors',
              seqLength === n ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {n} {t('positional.comp.heatmap.seqUnit')}
          </button>
        ))}
        <span className="text-xs text-text-muted ml-2">{t('positional.comp.heatmap.dimNote', { n: dim })}</span>
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-3">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
          {t('positional.comp.heatmap.rowDesc', { seq: seqLength, dim })}
        </div>
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${dim * 6} ${seqLength * 6}`} className="w-full h-auto" style={{ minWidth: '300px', maxWidth: '720px' }}>
            {matrix.map((row, p) =>
              row.map((v, d) => (
                <rect key={`${p}-${d}`} x={d * 6} y={p * 6} width={6} height={6} fill={valueToColor(v)} />
              )),
            )}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
          <span>{t('positional.comp.heatmap.axisLabel', { n: dim - 1 })}</span>
          <div className="flex items-center gap-1">
            <span>{t('positional.comp.heatmap.colorLegend')}</span>
            <span className="inline-block w-4 h-3" style={{ backgroundColor: valueToColor(-1) }} />
            <span className="font-mono">-1</span>
            <span className="inline-block w-4 h-3" style={{ backgroundColor: valueToColor(0) }} />
            <span className="font-mono">0</span>
            <span className="inline-block w-4 h-3" style={{ backgroundColor: valueToColor(1) }} />
            <span className="font-mono">+1</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-text leading-relaxed bg-cream-100 border border-ink/10 rounded p-3 space-y-2.5">
        <div>
          <p className="font-medium text-text mb-1">{t('positional.comp.heatmap.howToRead')}</p>
          <ul className="text-text-muted space-y-1 list-disc pl-5">
            {[0, 1, 2].map((i) => (
              <li key={i}>{t(`positional.comp.heatmap.readBullets.${i}`, { seq: seqLength, dim })}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-ink/10 pt-2">
          <p className="font-medium text-text mb-1">{t('positional.comp.heatmap.wavesTitle')}</p>
          <p className="text-text-muted">{t('positional.comp.heatmap.wavesIntro')}</p>
          <ul className="text-text-muted space-y-1 list-disc pl-5 mt-1">
            {[0, 1].map((i) => (
              <li key={i}>{t(`positional.comp.heatmap.wavesBullets.${i}`, { seq: seqLength })}</li>
            ))}
          </ul>
          <p className="text-text-muted mt-2">{t('positional.comp.heatmap.wavesNote')}</p>
        </div>

        <div className="border-t border-ink/10 pt-2">
          <p className="font-medium text-text mb-1">{t('positional.comp.heatmap.mathTitle')}</p>
          <p className="text-text-muted">{t('positional.comp.heatmap.mathBody')}</p>
        </div>

        <p className="text-[11px] text-text-muted/80 italic border-t border-ink/10 pt-2">
          {t('positional.comp.heatmap.tip')}
        </p>
      </div>
    </div>
  );
}
