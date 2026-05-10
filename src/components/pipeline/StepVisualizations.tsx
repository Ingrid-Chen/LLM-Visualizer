'use client';

// 7 个步骤各自的可视化子组件 —— 简化版：emoji + 一两个数据快照即可，深度版留给各模块详情页

import { useState } from 'react';
import type { PipelineData } from '@/lib/types';
import { useT } from '@/lib/i18n/LangContext';

// ==================== 01 · Tokenization ====================

export function TokenizationViz({ data }: { data: PipelineData['steps']['tokenization'] }) {
  const t = useT();
  const [showMyth, setShowMyth] = useState(false);
  const palette = ['bg-ink/15 border-ink/30 text-ink-dark', 'bg-ember/15 border-ember/30 text-ember-dark', 'bg-amber-100 border-amber-300 text-amber-800', 'bg-blue-100 border-blue-300 text-blue-800', 'bg-emerald-100 border-emerald-300 text-emerald-800', 'bg-pink-100 border-pink-300 text-pink-800'];
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          {t('home.stepViz.tokenization.header', { n: data.tokens.length })}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.tokens.map((tok, i) => (
            <span
              key={i}
              className={[
                'inline-flex flex-col items-center px-3 py-1.5 rounded-lg border-2 font-mono text-sm',
                palette[i % palette.length],
              ].join(' ')}
            >
              <span className="font-serif">{tok}</span>
              <span className="text-[10px] opacity-70 mt-0.5">id: {data.token_ids[i]}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">{t('home.stepViz.tokenization.caption')}</p>

      <button
        type="button"
        onClick={() => setShowMyth(!showMyth)}
        className="text-xs text-ember-dark hover:text-ember-dark font-medium underline-offset-2 hover:underline"
      >
        {showMyth ? t('home.stepViz.tokenization.mythToggleHide') : t('home.stepViz.tokenization.mythToggleShow')}
      </button>
      {showMyth && (
        <div className="space-y-3 p-3 rounded-lg bg-ember/5 border border-ember/20 text-xs text-text leading-relaxed">
          <div>
            <div className="font-medium text-ember-dark mb-1">{t('home.stepViz.tokenization.myth1Title')}</div>
            <p className="text-text-muted">{t('home.stepViz.tokenization.myth1Body')}</p>
          </div>
          <div className="text-[11px] text-text-muted/80 font-mono">
            {t('home.stepViz.tokenization.myth1Example')}
          </div>
          <div className="border-t border-ember/15 pt-3">
            <div className="font-medium text-ember-dark mb-1">{t('home.stepViz.tokenization.myth2Title')}</div>
            <p className="text-text-muted">{t('home.stepViz.tokenization.myth2Body')}</p>
          </div>
          <div className="text-[11px] text-text-muted/80 font-mono">
            {t('home.stepViz.tokenization.myth2Example')}
          </div>
          <div className="text-[10px] text-text-muted/70 italic pt-1">
            {t('home.stepViz.tokenization.mythCaveat')}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 02 · Embedding ====================

export function EmbeddingViz({
  data,
  firstToken,
}: {
  data: PipelineData['steps']['embedding'];
  firstToken: string;
}) {
  const t = useT();
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          {t('home.stepViz.embedding.header', { token: firstToken, dim: data.dim })}
        </div>
        <div className="grid grid-cols-8 gap-1">
          {data.sample_first_token.map((v, i) => {
            const intensity = Math.min(Math.abs(v) * 1.5, 1);
            const bg = v >= 0
              ? `rgba(44, 81, 66, ${intensity})`
              : `rgba(217, 119, 66, ${intensity})`;
            return (
              <div
                key={i}
                className="aspect-square rounded flex items-center justify-center text-[9px] font-mono text-cream-50"
                style={{ backgroundColor: bg }}
                title={t('home.stepViz.embedding.dimTooltip', { n: i + 1, value: v.toFixed(3) })}
              >
                {v.toFixed(2)}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">{t('home.stepViz.embedding.caption', { dim: data.dim })}</p>
    </div>
  );
}

// ==================== 03 · Positional Encoding ====================

export function PositionalViz({
  data,
  tokens,
}: {
  data: PipelineData['steps']['positional_encoding'];
  tokens: string[];
}) {
  const t = useT();
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          {t('home.stepViz.positional.header')}
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          {tokens.map((tok, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-serif text-sm px-2 py-1 rounded bg-cream-100 border border-ink/15">
                {tok}
              </span>
              <span className="text-[10px] text-ember-dark font-mono mt-1">pos = {data.positions[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">{t('home.stepViz.positional.caption')}</p>
    </div>
  );
}

// ==================== 04 · Transformer ====================

export function TransformerViz({ data }: { data: PipelineData['steps']['transformer'] }) {
  const t = useT();
  const max = Math.max(...data.attention_sample.weights.map((w) => w.w));
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-[11px] text-text-muted">
        <span>{t('home.stepViz.transformer.layersLabel')} <strong className="text-text font-mono">{data.layers}</strong></span>
        <span>{t('home.stepViz.transformer.headsLabel')} <strong className="text-text font-mono">{data.heads}</strong></span>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          {t('home.stepViz.transformer.header', { token: data.attention_sample.from_token })}
        </div>
        <div className="space-y-1.5">
          {data.attention_sample.weights.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-serif text-sm w-12 shrink-0">{w.to}</span>
              <div className="flex-1 h-4 bg-cream-100 rounded overflow-hidden">
                <div
                  className="h-full bg-ink rounded"
                  style={{ width: `${(w.w / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-text-muted w-10 text-right">
                {(w.w * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">{t('home.stepViz.transformer.caption')}</p>
    </div>
  );
}

// ==================== 05 · 输出层 / Logits ====================

export function LogitsViz({ data }: { data: PipelineData['steps']['logits_top'] }) {
  const t = useT();
  const max = Math.max(...data.map((d) => d.prob));
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          {t('home.stepViz.logits.header')}
        </div>
        <div className="space-y-1.5">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-serif text-sm w-14 shrink-0 truncate">{d.token}</span>
              <div className="flex-1 h-4 bg-cream-100 rounded overflow-hidden">
                <div
                  className="h-full bg-ember rounded"
                  style={{ width: `${(d.prob / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-text-muted w-12 text-right">
                {(d.prob * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">{t('home.stepViz.logits.caption')}</p>
    </div>
  );
}

// ==================== 06 · Sampling ====================

export function SamplingViz({ data }: { data: PipelineData['steps']['sampling'] }) {
  const t = useT();
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-ember/10 border-2 border-dashed border-ember/30">
        <span className="text-2xl">🎲</span>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider text-text-muted">{t('home.stepViz.sampling.header')}</div>
          <div className="font-serif text-xl text-ember-dark">{data.selected_token}</div>
        </div>
        <div className="text-[10px] text-text-muted text-right">
          {t('home.stepViz.sampling.strategyLabel')}<br />
          <span className="font-mono text-text">{data.method}</span>
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">{t('home.stepViz.sampling.caption')}</p>
    </div>
  );
}

// ==================== 07 · Detokenization ====================

export function DetokenizationViz({
  data,
  prompt,
}: {
  data: PipelineData['steps']['detokenization'];
  prompt: string;
}) {
  const t = useT();
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          {t('home.stepViz.detokenization.header')}
        </div>
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10 font-serif text-base leading-relaxed">
          <span className="text-text-muted">{prompt}</span>
          <span className="text-ember font-bold mx-0.5">{data.decoded_text}</span>
          {data.will_loop && (
            <span className="text-text-muted/40 ml-1">{t('home.stepViz.detokenization.loopHint')}</span>
          )}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">{t('home.stepViz.detokenization.caption')}</p>
    </div>
  );
}
