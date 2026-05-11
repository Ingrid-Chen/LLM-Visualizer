'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

// demo 文本保持中文（演示数据）
const FULL_OUTPUT = ['中国', '的', '首都', '是', '北京', '，', '是', '一', '座', '历史', '悠久', '的', '古都', '。'];

export default function MaxTokensSlider() {
  const t = useT();
  const [maxTokens, setMaxTokens] = useState(6);

  const generated = FULL_OUTPUT.slice(0, maxTokens);
  const truncated = FULL_OUTPUT.slice(maxTokens);
  const isCutoff = maxTokens < FULL_OUTPUT.length;
  const cutoffMidSentence = isCutoff && !['。', '！', '？'].includes(FULL_OUTPUT[maxTokens - 1] ?? '');

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs uppercase tracking-wider text-text-muted">{t('loop.comp.maxTokens.sliderLabel')}</label>
          <span className="font-mono text-2xl font-bold text-ember-dark">{maxTokens}</span>
        </div>
        <input
          type="range"
          min={1}
          max={FULL_OUTPUT.length}
          step={1}
          value={maxTokens}
          onChange={(e) => setMaxTokens(Number(e.target.value))}
          className="w-full accent-ink"
        />
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          <span>{t('loop.comp.maxTokens.sliderMin')}</span>
          <span>{t('loop.comp.maxTokens.sliderMax', { n: FULL_OUTPUT.length })}</span>
        </div>
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">{t('loop.comp.maxTokens.outputLabel')}</div>
        <p className="font-serif text-lg leading-relaxed">
          {generated.map((tok, i) => (
            <span key={i} className="text-ink-dark">
              {tok}
            </span>
          ))}
          {isCutoff && (
            <span className="inline-flex items-center mx-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 text-rose-800 border border-rose-300 align-middle font-mono">
              {t('loop.comp.maxTokens.cutoffBadge')}
            </span>
          )}
          {isCutoff &&
            truncated.map((tok, i) => (
              <span key={i} className="text-text-muted/30 line-through">
                {tok}
              </span>
            ))}
        </p>
        <p className="text-[11px] text-text-muted mt-3 leading-relaxed">
          {!isCutoff
            ? t('loop.comp.maxTokens.noCutoffMessage')
            : cutoffMidSentence
              ? t('loop.comp.maxTokens.cutoffMidMessage')
              : t('loop.comp.maxTokens.cutoffOkMessage')}
        </p>
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 <strong className="text-text">{t('loop.comp.maxTokens.insightBold')}</strong>{t('loop.comp.maxTokens.insightBody')}
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        {t('loop.comp.maxTokens.practicalCaveatStart')}
        <span className="font-mono">{t('loop.comp.maxTokens.practicalCaveatCode')}</span>
        {t('loop.comp.maxTokens.practicalCaveatEnd')}
      </p>
    </div>
  );
}
