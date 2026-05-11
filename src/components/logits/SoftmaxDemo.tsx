'use client';

import { useMemo, useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

// demo tokens 保持中文（演示数据）
const TOKENS = ['北京', '上海', '中国', '首都', '历史'];
const INITIAL_LOGITS = [9.2, 1.8, 1.1, -1.5, -3.2];

function softmax(logits: number[]): number[] {
  const maxL = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxL));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

function formatProb(p: number): string {
  const pct = p * 100;
  if (pct >= 10) return pct.toFixed(1) + '%';
  if (pct >= 0.1) return pct.toFixed(2) + '%';
  if (pct >= 0.001) return pct.toFixed(4) + '%';
  if (pct > 0) return '<0.001%';
  return '0%';
}

export default function SoftmaxDemo() {
  const t = useT();
  const [logits, setLogits] = useState<number[]>(INITIAL_LOGITS);
  const probs = useMemo(() => softmax(logits), [logits]);

  const setLogit = (i: number, v: number) => {
    setLogits((prev) => prev.map((x, j) => (j === i ? v : x)));
  };

  const reset = () => setLogits(INITIAL_LOGITS);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] uppercase tracking-wider text-text-muted">{t('logits.comp.softmax.inputLabel')}</div>
            <button onClick={reset} className="text-xs text-text-muted hover:text-text underline-offset-2 hover:underline">
              {t('logits.comp.softmax.reset')}
            </button>
          </div>
          <div className="space-y-3">
            {TOKENS.map((tok, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-serif text-sm text-text">{tok}</span>
                  <span className="font-mono text-xs text-ember-dark font-bold">{logits[i].toFixed(2)}</span>
                </div>
                <input type="range" min={-10} max={10} step={0.1} value={logits[i]} onChange={(e) => setLogit(i, Number(e.target.value))} className="w-full accent-ink" />
                <div className="flex justify-between text-[9px] text-text-muted/70">
                  <span>-10</span>
                  <span>0</span>
                  <span>+10</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4">
          <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium mb-3">{t('logits.comp.softmax.outputLabel')}</div>
          <div className="space-y-2.5">
            {TOKENS.map((tok, i) => {
              const p = probs[i];
              return (
                <div key={i}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-serif text-sm text-text">{tok}</span>
                    <span className="font-mono text-xs text-ember-dark font-bold">{formatProb(p)}</span>
                  </div>
                  <div className="h-3 bg-cream-100 rounded-full overflow-hidden">
                    <div className="h-full bg-ember rounded-full transition-all duration-150" style={{ width: `max(2px, ${p * 100}%)` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-ember/15 space-y-1">
            <div className="text-[11px] text-text-muted">
              {t('logits.comp.softmax.totalLabel')}<span className="font-mono text-text font-bold">{probs.reduce((a, b) => a + b, 0).toFixed(4)}</span>
            </div>
            <p className="text-[10px] text-text-muted/80 italic leading-relaxed">
              {t('logits.comp.softmax.warningSmall', { pct: '<0.001%' })}
            </p>
          </div>
        </div>
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">{t('logits.comp.softmax.insight')}</p>
      <p className="text-[11px] text-text-muted/70 italic">{t('logits.comp.softmax.tip')}</p>
    </div>
  );
}
