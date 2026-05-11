'use client';

import { useEffect, useState } from 'react';

import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';
import type { ExampleData, IndexData } from '@/lib/types';

interface LogitWithProb {
  token: string;
  logprob: number;
  prob: number;
  logit: number;
}

export default function LogitsToProb() {
  const t = useT();
  const lang = useLang();
  const [index, setIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string>('capital_china');
  const [data, setData] = useState<ExampleData | null>(null);

  useEffect(() => {
    fetch('/data/sampling/index.json').then((r) => r.json() as Promise<IndexData>).then(setIndex);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/sampling/${selectedId}.json`).then((r) => r.json() as Promise<ExampleData>).then(setData);
  }, [selectedId]);

  if (!data) {
    return <p className="text-text-muted">{t('logits.comp.logitsToProb.loading')}</p>;
  }

  const top5 = data.steps[0].top_logprobs.slice(0, 5);
  const items: LogitWithProb[] = top5.map((tok) => ({
    token: tok.token,
    logprob: tok.logprob,
    prob: Math.exp(tok.logprob),
    logit: tok.logprob,
  }));
  const sumProb = items.reduce((a, b) => a + b.prob, 0);
  items.forEach((it) => (it.prob = it.prob / sumProb));

  return (
    <div className="space-y-4">
      <div className="text-xs leading-relaxed bg-cream-100 border border-ink/10 rounded p-3 text-text-muted">
        {t('logits.comp.logitsToProb.terminologyCard')}
      </div>

      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">{t('logits.comp.logitsToProb.examplePickerLabel')}</label>
        <div className="flex flex-wrap gap-2">
          {index?.examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedId(ex.id)}
              className={[
                'text-xs px-3 py-1 rounded-full border transition-colors',
                selectedId === ex.id ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 space-y-4">
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1">{t('logits.comp.logitsToProb.currentPrompt')}</div>
          <p className="font-serif text-lg text-ink-dark">
            <span className="text-text-muted">{data.prompt}</span>
            <span className="text-ember-dark font-bold mx-1">[ ? ]</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-center">
          <Stage label={t('logits.comp.logitsToProb.stage1Label')} sub={t('logits.comp.logitsToProb.stage1Sub')} color="bg-ink/5 border-ink/20">
            <div className="grid grid-cols-4 gap-1">
              {[0.6, -0.3, 0.8, 0.1, -0.5, 0.4, 0.2, -0.7].map((v, i) => {
                const intensity = Math.min(Math.abs(v), 1);
                const fill = v >= 0 ? `rgba(44, 81, 66, ${0.2 + intensity * 0.7})` : `rgba(217, 119, 66, ${0.2 + intensity * 0.7})`;
                return (
                  <div key={i} className="aspect-square rounded text-[8px] font-mono flex items-center justify-center text-cream-50 font-medium" style={{ backgroundColor: fill }}>
                    {v.toFixed(1)}
                  </div>
                );
              })}
            </div>
          </Stage>

          <ArrowLabel label={t('logits.comp.logitsToProb.arrow1')} sub={t('logits.comp.logitsToProb.arrow1Sub')} />

          <Stage label={t('logits.comp.logitsToProb.stage2Label')} sub={t('logits.comp.logitsToProb.stage2Sub')} color="bg-purple-50 border-purple-300">
            <BarRows items={items} valueOf={(it) => it.logit} format={(v) => v.toFixed(2)} color="rgb(124, 58, 237)" minVal={Math.min(...items.map((it) => it.logit))} maxVal={Math.max(...items.map((it) => it.logit))} />
          </Stage>

          <ArrowLabel label={t('logits.comp.logitsToProb.arrow2')} sub={t('logits.comp.logitsToProb.arrow2Sub')} />

          <Stage label={t('logits.comp.logitsToProb.stage3Label')} sub={t('logits.comp.logitsToProb.stage3Sub')} color="bg-ember/5 border-ember/30">
            <BarRows items={items} valueOf={(it) => it.prob} format={(v) => `${(v * 100).toFixed(1)}%`} color="#D97742" minVal={0} maxVal={Math.max(...items.map((it) => it.prob))} />
          </Stage>
        </div>

        <p className="text-[11px] text-text-muted/80 italic text-center pt-2 border-t border-cream-200">
          {t('logits.comp.logitsToProb.stagesFootnote')}
        </p>
      </div>

      <div className="rounded-lg bg-ember/5 border-2 border-dashed border-ember/30 p-4 text-sm text-text leading-relaxed">
        <p>
          🎲 <strong className="text-ember-dark">{t('logits.comp.logitsToProb.nextCalloutBold')}</strong>
          {t('logits.comp.logitsToProb.nextCalloutBody')}
        </p>
        <a href={localizedHref(lang, '/sampling')} className="inline-block mt-2 btn-primary text-sm">
          {t('logits.comp.logitsToProb.nextCalloutBtn')}
        </a>
      </div>
    </div>
  );
}

function Stage({ label, sub, color, children }: { label: string; sub: string; color: string; children: React.ReactNode }) {
  return (
    <div className={['rounded-lg border-2 p-3', color].join(' ')}>
      <div className="text-xs font-medium text-text mb-0.5">{label}</div>
      <div className="text-[10px] text-text-muted mb-2">{sub}</div>
      {children}
    </div>
  );
}

function ArrowLabel({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center text-text-muted text-xs my-2 md:my-0">
      <span className="font-mono font-medium">{label}</span>
      <span className="text-[10px]">{sub}</span>
      <span className="text-base mt-0.5">→</span>
    </div>
  );
}

function BarRows({
  items,
  valueOf,
  format,
  color,
  minVal,
  maxVal,
}: {
  items: LogitWithProb[];
  valueOf: (it: LogitWithProb) => number;
  format: (v: number) => string;
  color: string;
  minVal: number;
  maxVal: number;
}) {
  const range = Math.max(maxVal - minVal, 0.001);
  return (
    <div className="space-y-1">
      {items.map((it, i) => {
        const v = valueOf(it);
        const widthPct = ((v - minVal) / range) * 100;
        return (
          <div key={i} className="flex items-center gap-1.5 text-[11px]">
            <span className="font-serif w-10 shrink-0 truncate text-text">{it.token}</span>
            <div className="flex-1 h-3 bg-white/40 rounded-sm overflow-hidden">
              <div className="h-full rounded-sm transition-all duration-200" style={{ width: `${Math.max(widthPct, 5)}%`, backgroundColor: color, opacity: 0.8 }} />
            </div>
            <span className="font-mono w-12 text-right shrink-0 text-text">{format(v)}</span>
          </div>
        );
      })}
    </div>
  );
}
