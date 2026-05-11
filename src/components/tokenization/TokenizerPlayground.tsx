'use client';

import { useState } from 'react';

import { TOKENIZER_META, useTokenize, type TokenizerName } from '@/lib/useTokenizer';
import { useT } from '@/lib/i18n/LangContext';

// Texts are kept as-is (demo data — not translated), labels/hints come from dict
const PRESET_TEXTS = [
  '中国的首都是北京。',
  'The capital of China is Beijing.',
  'The weather today is really nice. 今天的天气真好。',
  '我们一起去吃 pizza 🍕 吧！',
  '䶮龘齉爨饕餮鬱鬰',
  'def hello(name: str) -> None:\n    print(f"Hello, {name}!")',
];

const PALETTE = [
  'bg-ink/15 border-ink/30 text-ink-dark',
  'bg-ember/15 border-ember/30 text-ember-dark',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
];

function colorFor(id: number): string {
  return PALETTE[Math.abs(id) % PALETTE.length];
}

interface Props {
  initialText?: string;
  initialEncoding?: TokenizerName;
}

export default function TokenizerPlayground({
  initialText = '中国的首都是北京。',
  initialEncoding = 'cl100k_base',
}: Props) {
  const t = useT();
  const [text, setText] = useState(initialText);
  const [encoding, setEncoding] = useState<TokenizerName>(initialEncoding);
  const result = useTokenize(text, encoding);

  return (
    <div className="space-y-5">
      <p className="text-[11px] text-text-muted/80 bg-cream-100 border border-ink/10 rounded px-3 py-1.5 inline-block">
        {t('tokenization.comp.playground.realityNote')}
      </p>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-text-muted self-center mr-1">{t('tokenization.comp.playground.tryPrompt')}</span>
        {PRESET_TEXTS.map((preset, i) => (
          <button
            key={i}
            onClick={() => setText(preset)}
            className="text-xs px-3 py-1 rounded-full border border-ink/15 bg-cream-50 hover:border-ink/40 hover:bg-cream-100 transition-colors"
            title={t(`tokenization.comp.playground.presets.${i}.hint`)}
          >
            {t(`tokenization.comp.playground.presets.${i}.label`)}
          </button>
        ))}
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">{t('tokenization.comp.playground.inputLabel')}</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-lg border-2 border-ink/15 bg-cream-50 font-serif text-base resize-y focus:outline-none focus:border-ink/50 transition-colors"
          placeholder={t('tokenization.comp.playground.inputPlaceholder')}
        />
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">{t('tokenization.comp.playground.tokenizerSelectLabel')}</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(TOKENIZER_META) as TokenizerName[]).map((name) => {
            const meta = TOKENIZER_META[name];
            const active = encoding === name;
            return (
              <button
                key={name}
                onClick={() => setEncoding(name)}
                className={[
                  'text-left p-2.5 rounded-lg border-2 transition-all',
                  active
                    ? 'border-ink bg-cream-100 shadow-[2px_3px_0_rgba(44,81,66,0.15)]'
                    : 'border-ink/15 bg-cream-50 hover:border-ink/40',
                ].join(' ')}
              >
                <div className="font-mono text-sm text-text">{meta.label}</div>
                <div className="text-[10px] text-text-muted leading-tight mt-0.5">{meta.modelEra}</div>
                <div className="text-[10px] text-text-muted/70 leading-tight">{meta.usedBy}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <h3 className="font-serif text-base text-ink-dark">{t('tokenization.comp.playground.splitHeading')}</h3>
          <div className="flex items-center gap-3 text-xs">
            <Stat label={t('tokenization.comp.playground.statChars')} value={result.charCount} />
            <Stat label={t('tokenization.comp.playground.statBytes')} value={result.byteCount} />
            <Stat label={t('tokenization.comp.playground.statTokens')} value={result.tokenCount} highlight />
          </div>
        </div>

        {result.tokens.length === 0 ? (
          <p className="text-sm text-text-muted py-6 text-center">{t('tokenization.comp.playground.emptyHint')}</p>
        ) : (
          <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
            <div className="flex flex-wrap gap-1">
              {result.tokens.map((tok, i) => (
                <span
                  key={i}
                  className={['inline-flex items-center px-2 py-0.5 rounded border text-sm font-mono', colorFor(tok.id)].join(' ')}
                  title={`token id: ${tok.id}`}
                >
                  <span className="font-serif">{visualize(tok.str)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {result.tokenCount > 0 && (
          <p className="text-[11px] text-text-muted/80 mt-2">
            <strong className="text-text">{(result.charCount / result.tokenCount).toFixed(2)}</strong>
            {t('tokenization.comp.playground.ratioHint')}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
      <span className={['font-mono font-bold', highlight ? 'text-ember-dark text-lg' : 'text-text text-sm'].join(' ')}>
        {value}
      </span>
    </div>
  );
}

function visualize(s: string): string {
  return s.replace(/ /g, '␣').replace(/\n/g, '⏎').replace(/\t/g, '⇥');
}
