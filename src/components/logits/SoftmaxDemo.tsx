'use client';

import { useMemo, useState } from 'react';

// Softmax 互动 demo：用户拖 5 个 logit 滑块，看实时概率分布变化

const TOKENS = ['北京', '上海', '中国', '首都', '历史'];
const INITIAL_LOGITS = [9.2, 1.8, 1.1, -1.5, -3.2];

function softmax(logits: number[]): number[] {
  const maxL = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxL)); // 数值稳定
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

// 自适应精度：避免极小值被四舍五入成 0.0% 而误导用户
function formatProb(p: number): string {
  const pct = p * 100;
  if (pct >= 10) return pct.toFixed(1) + '%';
  if (pct >= 0.1) return pct.toFixed(2) + '%';
  if (pct >= 0.001) return pct.toFixed(4) + '%';
  if (pct > 0) return '<0.001%'; // 但永远 > 0
  return '0%';
}

export default function SoftmaxDemo() {
  const [logits, setLogits] = useState<number[]>(INITIAL_LOGITS);
  const probs = useMemo(() => softmax(logits), [logits]);

  const setLogit = (i: number, v: number) => {
    setLogits((prev) => prev.map((x, j) => (j === i ? v : x)));
  };

  const reset = () => setLogits(INITIAL_LOGITS);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左：5 个 logit 滑块 */}
        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] uppercase tracking-wider text-text-muted">输入 · 5 个 token 的 logit</div>
            <button onClick={reset} className="text-xs text-text-muted hover:text-text underline-offset-2 hover:underline">
              ↺ 重置
            </button>
          </div>
          <div className="space-y-3">
            {TOKENS.map((tok, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-serif text-sm text-text">{tok}</span>
                  <span className="font-mono text-xs text-ember-dark font-bold">{logits[i].toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min={-10}
                  max={10}
                  step={0.1}
                  value={logits[i]}
                  onChange={(e) => setLogit(i, Number(e.target.value))}
                  className="w-full accent-ink"
                />
                <div className="flex justify-between text-[9px] text-text-muted/70">
                  <span>-10</span>
                  <span>0</span>
                  <span>+10</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右：概率柱状图 */}
        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4">
          <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium mb-3">
            Softmax 输出 · 概率分布（和 = 1.000）
          </div>
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
                    <div
                      className="h-full bg-ember rounded-full transition-all duration-150"
                      style={{ width: `max(2px, ${p * 100}%)` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 pt-2 border-t border-ember/15 space-y-1">
            <div className="text-[11px] text-text-muted">
              合计：<span className="font-mono text-text font-bold">{probs.reduce((a, b) => a + b, 0).toFixed(4)}</span>
            </div>
            <p className="text-[10px] text-text-muted/80 italic leading-relaxed">
              ⚠️ 看到 <span className="font-mono">{'<0.001%'}</span> 不代表概率为 0——softmax 永远输出 &gt; 0 的正数。
              这里只是十分小，被精度截断了。柱状图最短画 2px 让你看到它"还在那里"。
            </p>
          </div>
        </div>
      </div>

      {/* 解读 + caveat（紧凑） */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 <strong className="text-text">Softmax 在做什么</strong>：把每个 logit "取指数"再除以总和——所有 token 的概率自动加起来等于 1。
        关键性质：<strong className="text-text">指数放大差距</strong>（logit 9 vs 2 的概率差 ~1500 倍）、
        <strong className="text-text">永远 &gt; 0</strong>（负 logit 变小但不为 0）、
        <strong className="text-text">单调</strong>（logit 越大概率越大）。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        🎚️ 试试拖「北京」的滑块——logit 从 9 降到 0，看概率从 99% 急速跌到 ~50%（指数函数的剧烈变化）。完整数学公式放在深入模式。
      </p>
    </div>
  );
}
