'use client';

import { useT } from '@/lib/i18n/LangContext';

// demo tokens 保持中文不变（属于演示数据）
const PAIR_TOKENS: string[][] = [['我', '打', '你'], ['你', '打', '我']];

const TOKEN_COLOR: Record<string, string> = {
  我: 'bg-ink/15 border-ink/30 text-ink-dark',
  打: 'bg-ember/15 border-ember/30 text-ember-dark',
  你: 'bg-amber-100 border-amber-300 text-amber-800',
};

export default function WordOrderDemo() {
  const t = useT();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PAIR_TOKENS.map((tokens, i) => (
          <div key={i} className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">{t('positional.comp.wordOrder.originalLabel')}</div>
            <p className="font-serif text-2xl text-ink-dark mb-3">{t(`positional.comp.wordOrder.pair.${i}.prompt`)}</p>
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              {tokens.map((tok, j) => (
                <span
                  key={j}
                  className={[
                    'inline-flex items-center px-2.5 py-1 rounded border text-base font-mono',
                    TOKEN_COLOR[tok] ?? 'bg-ink/10 border-ink/30',
                  ].join(' ')}
                >
                  <span className="font-serif">{tok}</span>
                </span>
              ))}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{t(`positional.comp.wordOrder.pair.${i}.meaning`)}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-ember/5 border-2 border-dashed border-ember/30">
        <p className="text-sm leading-relaxed">{t('positional.comp.wordOrder.keyPoint1')}</p>
        <p className="text-sm leading-relaxed mt-2">{t('positional.comp.wordOrder.keyPoint2')}</p>
        <p className="text-sm leading-relaxed mt-2 text-ink-dark font-medium">{t('positional.comp.wordOrder.keyPoint3')}</p>
      </div>
    </div>
  );
}
