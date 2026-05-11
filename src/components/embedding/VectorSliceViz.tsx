'use client';

import { useState } from 'react';

import { useT } from '@/lib/i18n/LangContext';
import type { EmbeddingWord } from '@/lib/types';

interface Props {
  words: EmbeddingWord[];
  realDim: number;
}

export default function VectorSliceViz({ words, realDim }: Props) {
  const t = useT();
  // demo 词保持中文不变（属于演示数据）
  const candidates = ['苹果', '橘子', '北京', '今天', '猫'].filter((w) =>
    words.some((x) => x.word === w),
  );
  const [selected, setSelected] = useState(candidates[0] ?? words[0]?.word ?? '苹果');

  const word = words.find((w) => w.word === selected);
  if (!word) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">{t('embedding.comp.vectorSlice.pickPrompt')}</span>
        {candidates.map((w) => (
          <button
            key={w}
            onClick={() => setSelected(w)}
            className={[
              'px-3 py-1 text-sm rounded-full border transition-colors',
              selected === w ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {w}
          </button>
        ))}
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="font-serif text-2xl text-ink-dark">"{word.word}"</span>
          <span className="text-text-muted">→</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-ember/10 text-ember-dark border border-ember/30 font-mono">
            {t('embedding.comp.vectorSlice.dimensionBadge', { n: realDim })}
          </span>
        </div>

        <div className="grid grid-cols-8 gap-1.5 mb-2">
          {word.sample8.map((v, i) => {
            const intensity = Math.min(Math.abs(v) * 1.4, 1);
            const bg = v >= 0
              ? `rgba(44, 81, 66, ${0.15 + intensity * 0.7})`
              : `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
            return (
              <div
                key={i}
                className="aspect-square rounded flex items-center justify-center text-[10px] font-mono text-cream-50 font-medium"
                style={{ backgroundColor: bg }}
                title={t('embedding.comp.vectorSlice.dimTooltip', { n: i + 1, value: v.toFixed(3) })}
              >
                {v.toFixed(2)}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-text-muted text-xs">
          <span className="font-mono">[</span>
          <span>{t('embedding.comp.vectorSlice.dim1To8')}</span>
          <span className="flex-1 text-center text-text-muted/60">{t('embedding.comp.vectorSlice.dimMore', { n: realDim - 8 })}</span>
          <span>{t('embedding.comp.vectorSlice.dimLast', { n: realDim })}</span>
          <span className="font-mono">]</span>
        </div>
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">
        {t('embedding.comp.vectorSlice.insightBody')}
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        {t('embedding.comp.vectorSlice.caveat')}
      </p>
    </div>
  );
}
