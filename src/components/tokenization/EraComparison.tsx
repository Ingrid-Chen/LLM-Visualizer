'use client';

import { useState } from 'react';

import { TOKENIZER_META, useMultiTokenCount, type TokenizerName } from '@/lib/useTokenizer';

const COMPARE_PRESETS = [
  {
    label: '中文短句',
    text: '中国的首都是北京，是一座有三千多年历史的古城。',
  },
  {
    label: '英文同义句',
    text: 'The capital of China is Beijing, an ancient city with over 3,000 years of history.',
  },
  {
    label: '中英混合',
    text: 'GPT-4o 比 GPT-3 在中文 tokenizer 上优化了不少。',
  },
  {
    label: 'Emoji 大户',
    text: '今天好开心 🎉🎈🎊 真的很棒 ❤️✨🌟 一起庆祝吧 🥳',
  },
];

const ALL_ENCODINGS: TokenizerName[] = ['r50k_base', 'cl100k_base', 'o200k_base'];

export default function EraComparison() {
  const [text, setText] = useState(COMPARE_PRESETS[0].text);
  const counts = useMultiTokenCount(text, ALL_ENCODINGS);

  const max = Math.max(...Object.values(counts), 1);

  return (
    <div className="space-y-4">
      {/* 预设切换 */}
      <div className="flex flex-wrap gap-2">
        {COMPARE_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setText(p.text)}
            className={[
              'text-xs px-3 py-1 rounded-full border transition-colors',
              text === p.text
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 输入框 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        className="w-full p-2.5 rounded-lg border-2 border-ink/15 bg-cream-50 font-serif text-sm resize-y focus:outline-none focus:border-ink/50 transition-colors"
      />

      {/* 三档对比 */}
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
                  className={[
                    'h-full rounded transition-all duration-500',
                    isMax ? 'bg-ember' : 'bg-ink/70',
                  ].join(' ')}
                  style={{ width: `${widthPct}%` }}
                />
                <span className="absolute inset-0 flex items-center px-2 font-mono text-xs font-bold text-cream-50">
                  {c} tokens
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 解读 */}
      <p className="text-[11px] text-text-muted/80 leading-relaxed">
        ⚡ 注意看：同一段中文，GPT-2（r50k_base）的 token 数往往是 GPT-4o（o200k_base）的{' '}
        <strong className="text-text">2.5 倍以上</strong>。
        这就是"中文 token 比英文贵 2-3 倍" 这种说法的来源——
        它在 GPT-2 / GPT-3 时代成立（很多教科书 / 教程的数据基于这两代），但 GPT-4 之后已经基本拉平。
      </p>
    </div>
  );
}
