'use client';

import { useState } from 'react';

import { TOKENIZER_META, useMultiTokenCount, type TokenizerName } from '@/lib/useTokenizer';
import { useT } from '@/lib/i18n/LangContext';

// 文本保持中文/英文不变（属于演示数据），label 走字典
const COMPARE_TEXTS = [
  '中国的首都是北京，是一座有三千多年历史的古城。',
  'The capital of China is Beijing, an ancient city with over 3,000 years of history.',
  'GPT-4o 比 GPT-3 在中文 tokenizer 上优化了不少。',
  '今天好开心 🎉🎈🎊 真的很棒 ❤️✨🌟 一起庆祝吧 🥳',
];

const ALL_ENCODINGS: TokenizerName[] = ['r50k_base', 'cl100k_base', 'o200k_base'];

export default function EraComparison() {
  const t = useT();
  const [text, setText] = useState(COMPARE_TEXTS[0]);
  const counts = useMultiTokenCount(text, ALL_ENCODINGS);

  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {COMPARE_TEXTS.map((preset, i) => (
          <button
            key={i}
            onClick={() => setText(preset)}
            className={[
              'text-xs px-3 py-1 rounded-full border transition-colors',
              text === preset ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {t(`tokenization.comp.era.presetLabels.${i}`)}
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full p-2.5 rounded-lg border-2 border-ink/15 bg-cream-50 font-serif text-sm resize-y focus:outline-none focus:border-ink/50 transition-colors"
      />

      <div className="space-y-2">
        {ALL_ENCODINGS.map((enc) => {
          const meta = TOKENIZER_META[enc];
          const c = counts[enc];
          const widthPct = max > 0 ? (c / max) * 100 : 0;
          const isMax = c === max && c > 0;
          return (
            <div key={enc} className="flex items-center gap-3">
              <div className="w-32 sm:w-40 shrink-0 text-xs">
                <div className="font-mono text-text">{meta.label}</div>
                <div className="text-[10px] text-text-muted leading-tight">{meta.modelEra}</div>
              </div>
              <div className="flex-1 h-7 bg-cream-100 rounded relative overflow-hidden">
                <div
                  className={['h-full rounded transition-all duration-500', isMax ? 'bg-ember' : 'bg-ink/70'].join(' ')}
                  style={{ width: `${widthPct}%` }}
                />
                <span className="absolute inset-0 flex items-center px-2 font-mono text-xs font-bold text-cream-50">
                  {c} {t('tokenization.comp.era.tokensSuffix')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-text-muted/80 leading-relaxed">
        {t('tokenization.comp.era.insight')}
      </p>
    </div>
  );
}
