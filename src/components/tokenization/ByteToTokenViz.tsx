'use client';

import { useMemo, useState } from 'react';

import { TOKENIZER_META, useMultiTokenCount, type TokenizerName } from '@/lib/useTokenizer';
import { useT } from '@/lib/i18n/LangContext';

const SAMPLES: { char: string; label: string }[] = [
  { char: 'a', label: 'a' },
  { char: '模型', label: '模型' },
  { char: '🍕', label: '🍕' },
  { char: '𝕩', label: '𝕩' },
];

const ENCODINGS: TokenizerName[] = ['r50k_base', 'cl100k_base', 'o200k_base'];

export default function ByteToTokenViz() {
  const t = useT();
  const [char, setChar] = useState('模型');

  const bytes = useMemo(() => {
    const arr = new TextEncoder().encode(char);
    return Array.from(arr);
  }, [char]);

  const counts = useMultiTokenCount(char, ENCODINGS);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">{t('tokenization.comp.byteToToken.pickPrompt')}</span>
        {SAMPLES.map((s, i) => (
          <button
            key={s.char}
            onClick={() => setChar(s.char)}
            className={[
              'px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-2',
              char === s.char ? 'border-ink bg-cream-100' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            <span className="font-serif text-xl">{s.label}</span>
            <span className="text-[10px] text-text-muted">{t(`tokenization.comp.byteToToken.sampleNotes.${i}`)}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">{t('tokenization.comp.byteToToken.layer1Title')}</div>
          <div className="flex items-center justify-center flex-1 py-2">
            <span className="font-serif text-5xl text-ink-dark">{char}</span>
          </div>
          <div className="text-xs text-text-muted text-center mt-2">{t('tokenization.comp.byteToToken.layer1Caption')}</div>
        </div>

        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
            {t('tokenization.comp.byteToToken.layer2TitlePrefix')}（{bytes.length} {t('tokenization.comp.byteToToken.layer2BytesLabel')}）
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap flex-1 py-2">
            {bytes.map((b, i) => (
              <div key={i} className="px-2 py-1.5 rounded bg-ink/10 border border-ink/30 font-mono text-xs text-ink-dark min-w-[38px] text-center">
                <div className="font-bold">{b.toString(16).toUpperCase().padStart(2, '0')}</div>
                <div className="text-[9px] text-text-muted">{t('tokenization.comp.byteToToken.layer2BytePrefix')} {i + 1}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-text-muted text-center mt-2">{t('tokenization.comp.byteToToken.layer2Caption')}</div>
        </div>

        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-ember-dark mb-1.5">{t('tokenization.comp.byteToToken.layer3Title')}</div>
          <div className="space-y-1.5 flex-1 py-1">
            {ENCODINGS.map((enc) => {
              const meta = TOKENIZER_META[enc];
              const c = counts[enc];
              return (
                <div key={enc} className="flex items-center gap-2 text-xs">
                  <span className="text-text-muted/80 w-28 shrink-0 text-[10px] truncate">
                    {meta.modelEra.split('（')[0]}
                  </span>
                  <span className="font-mono font-bold text-ember-dark w-7 text-right">{c}</span>
                  <span className="text-text-muted">{c === 1 ? t('tokenization.comp.byteToToken.tokenSingular') : t('tokenization.comp.byteToToken.tokenPlural')}</span>
                  <MergeBadge tokens={c} bytes={bytes.length} />
                </div>
              );
            })}
          </div>
          <div className="text-xs text-text-muted text-center mt-2">{t('tokenization.comp.byteToToken.layer3Caption')}</div>
        </div>
      </div>

      <ByteTokenInsight char={char} bytes={bytes} counts={counts} />
    </div>
  );
}

function ByteTokenInsight({
  char,
  bytes,
  counts,
}: {
  char: string;
  bytes: number[];
  counts: Record<TokenizerName, number>;
}) {
  const t = useT();
  const r50 = counts.r50k_base;
  const cl = counts.cl100k_base;
  const o2 = counts.o200k_base;
  const vars = { char, bytes: bytes.length, r50, cl, o2 };

  let key: string;
  if (bytes.length === 1) {
    key = 'insightAscii';
  } else if (r50 > cl && cl > o2 && o2 === 1) {
    key = 'insightProgressive';
  } else if (r50 > o2 && o2 === 1) {
    key = 'insightStrongContrast';
  } else if (r50 > o2) {
    key = 'insightWeakContrast';
  } else if (r50 === o2 && r50 > 1) {
    key = 'insightUnmerged';
  } else {
    key = 'insightDefault';
  }

  return (
    <div className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded-lg p-3">
      💡 {t(`tokenization.comp.byteToToken.${key}`, vars)}
    </div>
  );
}

function MergeBadge({ tokens, bytes }: { tokens: number; bytes: number }) {
  const t = useT();
  if (tokens === 1 && bytes > 1) {
    return <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">{t('tokenization.comp.byteToToken.badgeMerged')}</span>;
  }
  if (tokens > 1 && tokens < bytes) {
    return <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">{t('tokenization.comp.byteToToken.badgePartial')}</span>;
  }
  if (tokens === bytes && bytes > 1) {
    return <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">{t('tokenization.comp.byteToToken.badgeUnmerged')}</span>;
  }
  return null;
}
