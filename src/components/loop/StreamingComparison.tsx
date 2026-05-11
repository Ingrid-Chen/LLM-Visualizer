'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

// demo 文本保持中文不变（属于演示数据）
const FULL_TEXT = '中国的首都是北京，也是中国的政治、经济、文化中心。';
const TOKENS = ['中', '国', '的', '首', '都', '是', '北京', '，', '也', '是', '中', '国', '的', '政', '治', '、', '经', '济', '、', '文', '化', '中', '心', '。'];
const TOKEN_INTERVAL_MS = 120;
const TOTAL_TIME_MS = TOKENS.length * TOKEN_INTERVAL_MS;

export default function StreamingComparison() {
  const t = useT();
  const [running, setRunning] = useState(false);
  const [streamedTokens, setStreamedTokens] = useState<string[]>([]);
  const [nonStreamingDone, setNonStreamingDone] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const reset = () => {
    setRunning(false);
    setStreamedTokens([]);
    setNonStreamingDone(false);
    setElapsedMs(0);
    startTimeRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  const start = () => {
    reset();
    setRunning(true);
    startTimeRef.current = performance.now();
  };

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      const now = performance.now();
      const elapsed = startTimeRef.current ? now - startTimeRef.current : 0;
      setElapsedMs(elapsed);

      const tokensToShow = Math.min(Math.floor(elapsed / TOKEN_INTERVAL_MS), TOKENS.length);
      setStreamedTokens(TOKENS.slice(0, tokensToShow));

      if (elapsed >= TOTAL_TIME_MS) {
        setNonStreamingDone(true);
        setRunning(false);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const progressPct = Math.min((elapsedMs / TOTAL_TIME_MS) * 100, 100);
  const finished = elapsedMs >= TOTAL_TIME_MS;
  const totalSec = (TOTAL_TIME_MS / 1000).toFixed(1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-text-muted leading-relaxed max-w-prose">
          <strong className="text-text">{t('loop.comp.streaming.introBold')}</strong>
          {t('loop.comp.streaming.introMid', { sec: totalSec })}
          <strong className="text-text">{t('loop.comp.streaming.introEm')}</strong>。
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="btn-secondary text-xs">{t('loop.comp.streaming.reset')}</button>
          <button onClick={start} className="btn-primary text-xs" disabled={running}>
            {running ? t('loop.comp.streaming.inProgress') : finished ? t('loop.comp.streaming.again') : t('loop.comp.streaming.start')}
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between text-[10px] text-text-muted mb-1">
          <span>{t('loop.comp.streaming.elapsedLabel')}</span>
          <span className="font-mono">{(elapsedMs / 1000).toFixed(1)}s / {totalSec}s</span>
        </div>
        <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
          <div className="h-full bg-ink rounded-full transition-none" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium tracking-wider">{t('loop.comp.streaming.leftBadge')}</span>
            <span className="text-[10px] text-text-muted">{streamedTokens.length} / {TOKENS.length} token</span>
          </div>
          <div className="min-h-[120px] p-3 rounded bg-cream-50 border border-ember/20 font-serif text-base leading-relaxed text-text">
            {streamedTokens.length === 0 && !running && <span className="text-text-muted/50 italic">{t('loop.comp.streaming.emptyHint')}</span>}
            {streamedTokens.map((tok, i) => (
              <span key={i} className="animate-[fadeSlide_0.2s_ease-out]">{tok}</span>
            ))}
            {running && streamedTokens.length < TOKENS.length && <span className="inline-block w-1 h-4 bg-ember-dark animate-pulse ml-0.5 align-middle" />}
          </div>
          <p className="text-[11px] text-text-muted mt-2 leading-relaxed">{t('loop.comp.streaming.leftPerception')}</p>
        </div>

        <div className="rounded-lg border-2 border-ink/20 bg-ink/5 p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-ink text-cream-50 font-medium tracking-wider">{t('loop.comp.streaming.rightBadge')}</span>
            <span className="text-[10px] text-text-muted">{nonStreamingDone ? `${TOKENS.length} / ${TOKENS.length}` : `0 / ${TOKENS.length}`} token</span>
          </div>
          <div className="min-h-[120px] p-3 rounded bg-cream-50 border border-ink/15 font-serif text-base leading-relaxed text-text relative">
            {!nonStreamingDone ? (
              <div className="flex items-center justify-center h-full">
                {running ? (
                  <span className="text-text-muted text-sm">
                    <span className="inline-block animate-spin">⏳</span> {t('loop.comp.streaming.waitingPrefix')}{((TOTAL_TIME_MS - elapsedMs) / 1000).toFixed(1)}{t('loop.comp.streaming.waitingSuffix')}
                  </span>
                ) : (
                  <span className="text-text-muted/50 italic text-sm">{t('loop.comp.streaming.emptyHint')}</span>
                )}
              </div>
            ) : (
              <span>{FULL_TEXT}</span>
            )}
          </div>
          <p className="text-[11px] text-text-muted mt-2 leading-relaxed">{t('loop.comp.streaming.rightPerception', { sec: totalSec })}</p>
        </div>
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">{t('loop.comp.streaming.keyTakeaway')}</p>
    </div>
  );
}
