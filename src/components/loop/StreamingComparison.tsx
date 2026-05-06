'use client';

import { useEffect, useRef, useState } from 'react';

// Streaming on/off 对比演示：左边逐字出 / 右边等同样时间整段出
// 强调"总耗时一样，但感知差很多"

const FULL_TEXT = '中国的首都是北京，也是中国的政治、经济、文化中心。';
const TOKENS = ['中', '国', '的', '首', '都', '是', '北京', '，', '也', '是', '中', '国', '的', '政', '治', '、', '经', '济', '、', '文', '化', '中', '心', '。'];
const TOKEN_INTERVAL_MS = 120; // 每个 token 间隔
const TOTAL_TIME_MS = TOKENS.length * TOKEN_INTERVAL_MS;

export default function StreamingComparison() {
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

  // 主驱动 loop：用 requestAnimationFrame 做时间驱动
  useEffect(() => {
    if (!running) return;

    const tick = () => {
      const now = performance.now();
      const elapsed = startTimeRef.current ? now - startTimeRef.current : 0;
      setElapsedMs(elapsed);

      // 左边 streaming：根据时间出 token
      const tokensToShow = Math.min(Math.floor(elapsed / TOKEN_INTERVAL_MS), TOKENS.length);
      setStreamedTokens(TOKENS.slice(0, tokensToShow));

      // 右边 non-streaming：等所有时间过完才显示
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

  return (
    <div className="space-y-4">
      {/* 控制 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="text-xs text-text-muted leading-relaxed max-w-prose">
          下面两边模拟<strong className="text-text">同一个 LLM 后端</strong>处理同一个请求。
          总计算时间一样（{(TOTAL_TIME_MS / 1000).toFixed(1)}s），区别只在<strong className="text-text">前端是否一边收一边显示</strong>。
        </div>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="btn-secondary text-xs">↺ 重置</button>
          <button onClick={start} className="btn-primary text-xs" disabled={running}>
            {running ? '⏳ 进行中' : finished ? '↻ 再来一次' : '▶ 开始对比'}
          </button>
        </div>
      </div>

      {/* 时间进度条 */}
      <div>
        <div className="flex items-baseline justify-between text-[10px] text-text-muted mb-1">
          <span>已用时间</span>
          <span className="font-mono">{(elapsedMs / 1000).toFixed(1)}s / {(TOTAL_TIME_MS / 1000).toFixed(1)}s</span>
        </div>
        <div className="h-1.5 bg-cream-100 rounded-full overflow-hidden">
          <div className="h-full bg-ink rounded-full transition-none" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* 两栏对比 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左：streaming */}
        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium tracking-wider">streaming = ON</span>
            <span className="text-[10px] text-text-muted">{streamedTokens.length} / {TOKENS.length} token</span>
          </div>
          <div className="min-h-[120px] p-3 rounded bg-cream-50 border border-ember/20 font-serif text-base leading-relaxed text-text">
            {streamedTokens.length === 0 && !running && <span className="text-text-muted/50 italic">等待开始…</span>}
            {streamedTokens.map((t, i) => (
              <span key={i} className="animate-[fadeSlide_0.2s_ease-out]">
                {t}
              </span>
            ))}
            {running && streamedTokens.length < TOKENS.length && <span className="inline-block w-1 h-4 bg-ember-dark animate-pulse ml-0.5 align-middle" />}
          </div>
          <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
            ✨ <strong className="text-text">用户感知</strong>：第一个字几乎立刻就到了——很有"AI 在思考"的体感。
          </p>
        </div>

        {/* 右：non-streaming */}
        <div className="rounded-lg border-2 border-ink/20 bg-ink/5 p-4">
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs px-2 py-0.5 rounded-full bg-ink text-cream-50 font-medium tracking-wider">streaming = OFF</span>
            <span className="text-[10px] text-text-muted">{nonStreamingDone ? `${TOKENS.length} / ${TOKENS.length}` : `0 / ${TOKENS.length}`} token</span>
          </div>
          <div className="min-h-[120px] p-3 rounded bg-cream-50 border border-ink/15 font-serif text-base leading-relaxed text-text relative">
            {!nonStreamingDone ? (
              <div className="flex items-center justify-center h-full">
                {running ? (
                  <span className="text-text-muted text-sm">
                    <span className="inline-block animate-spin">⏳</span> 等待中…（{((TOTAL_TIME_MS - elapsedMs) / 1000).toFixed(1)}s）
                  </span>
                ) : (
                  <span className="text-text-muted/50 italic text-sm">等待开始…</span>
                )}
              </div>
            ) : (
              <span>{FULL_TEXT}</span>
            )}
          </div>
          <p className="text-[11px] text-text-muted mt-2 leading-relaxed">
            ⏳ <strong className="text-text">用户感知</strong>：等了 {(TOTAL_TIME_MS / 1000).toFixed(1)}s 才看到任何东西——感觉很慢。
          </p>
        </div>
      </div>

      {/* 解读（紧凑） */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 <strong className="text-text">关键认知</strong>：两边后端工作量完全一样，token 实际按相同速度生成。
        差异只在前端要不要"一边收一边显示"。streaming 是<strong className="text-text">感知性能</strong>的经典案例——总时间不变，但用户体验差异巨大。
      </p>
    </div>
  );
}
