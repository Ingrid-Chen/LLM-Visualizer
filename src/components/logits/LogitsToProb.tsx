'use client';

import { useEffect, useState } from 'react';

import type { ExampleData, IndexData } from '@/lib/types';

// 完整流程演示：用 Sampling 的预设数据，展示
// Transformer 输出 → unembedding → top 5 logits → softmax → 概率分布
// 直接对接 Sampling 模块

interface LogitWithProb {
  token: string;
  logprob: number;
  prob: number;
  logit: number; // 反推的"原始 logit"——其实就是 logprob 加个常数偏移
}

export default function LogitsToProb() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string>('capital_china');
  const [data, setData] = useState<ExampleData | null>(null);

  useEffect(() => {
    fetch('/data/sampling/index.json')
      .then((r) => r.json() as Promise<IndexData>)
      .then(setIndex);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/sampling/${selectedId}.json`)
      .then((r) => r.json() as Promise<ExampleData>)
      .then(setData);
  }, [selectedId]);

  if (!data) {
    return <p className="text-text-muted">加载中…</p>;
  }

  const top5 = data.steps[0].top_logprobs.slice(0, 5);
  // logprob = log(prob)，prob = exp(logprob)
  // "logit" 跟 logprob 差一个常数（softmax 不变），这里直接用 logprob 当 logit 演示
  const items: LogitWithProb[] = top5.map((t) => ({
    token: t.token,
    logprob: t.logprob,
    prob: Math.exp(t.logprob),
    logit: t.logprob, // 简化：等价
  }));
  // 归一化 prob 到 top 5 之和（因为我们只展示 top 5）
  const sumProb = items.reduce((a, b) => a + b.prob, 0);
  items.forEach((it) => (it.prob = it.prob / sumProb));

  return (
    <div className="space-y-4">
      {/* 名词解释（先帮用户分清三个名词） */}
      <div className="text-xs leading-relaxed bg-cream-100 border border-ink/10 rounded p-3 text-text-muted">
        🔤 三个名词其实是<strong className="text-text">同一信息的三种表达</strong>：
        <strong className="text-text">「分数 logit」</strong>（任意实数，越大越倾向选这个 token）
        →
        <strong className="text-text">「概率 probability」</strong>（softmax 归一化后的 0-1 值，所有概率和为 1）
        →
        <strong className="text-text">「log 概率 logprob」</strong>（取对数，便于计算）。
      </div>

      {/* 例子选择 */}
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">选个例子（来自 Sampling 模块的真实数据）</label>
        <div className="flex flex-wrap gap-2">
          {index?.examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedId(ex.id)}
              className={[
                'text-xs px-3 py-1 rounded-full border transition-colors',
                selectedId === ex.id
                  ? 'border-ink bg-ink text-cream-50'
                  : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* 流程展示 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 space-y-4">
        {/* 当前 prompt */}
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1">当前位置预测下一个 token</div>
          <p className="font-serif text-lg text-ink-dark">
            <span className="text-text-muted">{data.prompt}</span>
            <span className="text-ember-dark font-bold mx-1">[ ? ]</span>
          </p>
        </div>

        {/* 三阶段并排 */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-center">
          {/* 阶段 1: 最后一层向量 */}
          <Stage
            label="① Transformer 最后一层"
            sub="输出 d 维向量（mock 示意）"
            color="bg-ink/5 border-ink/20"
          >
            <div className="grid grid-cols-4 gap-1">
              {[0.6, -0.3, 0.8, 0.1, -0.5, 0.4, 0.2, -0.7].map((v, i) => {
                const intensity = Math.min(Math.abs(v), 1);
                const fill =
                  v >= 0
                    ? `rgba(44, 81, 66, ${0.2 + intensity * 0.7})`
                    : `rgba(217, 119, 66, ${0.2 + intensity * 0.7})`;
                return (
                  <div
                    key={i}
                    className="aspect-square rounded text-[8px] font-mono flex items-center justify-center text-cream-50 font-medium"
                    style={{ backgroundColor: fill }}
                  >
                    {v.toFixed(1)}
                  </div>
                );
              })}
            </div>
          </Stage>

          <ArrowLabel label="× W_U" sub="unembedding" />

          {/* 阶段 2: Logits */}
          <Stage label="② Logits（top 5）" sub="每个 token 一个分数" color="bg-purple-50 border-purple-300">
            <BarRows
              items={items}
              valueOf={(it) => it.logit}
              format={(v) => v.toFixed(2)}
              color="rgb(124, 58, 237)"
              minVal={Math.min(...items.map((it) => it.logit))}
              maxVal={Math.max(...items.map((it) => it.logit))}
            />
          </Stage>

          <ArrowLabel label="softmax" sub="归一化" />

          {/* 阶段 3: 概率 */}
          <Stage label="③ 概率分布（top 5）" sub="和 = 1" color="bg-ember/5 border-ember/30">
            <BarRows
              items={items}
              valueOf={(it) => it.prob}
              format={(v) => `${(v * 100).toFixed(1)}%`}
              color="#D97742"
              minVal={0}
              maxVal={Math.max(...items.map((it) => it.prob))}
            />
          </Stage>
        </div>

        {/* 解读 */}
        <p className="text-[11px] text-text-muted/80 italic text-center pt-2 border-t border-cream-200">
          ※ 这就是 OpenAI API 里 logprobs 字段的来源——它就是这一步算出来的 log(probability)。
        </p>
      </div>

      {/* 链接到 Sampling */}
      <div className="rounded-lg bg-ember/5 border-2 border-dashed border-ember/30 p-4 text-sm text-text leading-relaxed">
        <p>
          🎲 <strong className="text-ember-dark">下一步：从概率分布里挑词</strong>——直接选概率最高的（贪婪），还是按概率随机抽（有创意）？
          这就是 <strong className="text-text">Sampling 模块</strong>要解决的问题。
        </p>
        <a
          href="/sampling"
          className="inline-block mt-2 btn-primary text-sm"
        >
          进入 Sampling 模块 →
        </a>
      </div>
    </div>
  );
}

function Stage({
  label,
  sub,
  color,
  children,
}: {
  label: string;
  sub: string;
  color: string;
  children: React.ReactNode;
}) {
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
              <div
                className="h-full rounded-sm transition-all duration-200"
                style={{ width: `${Math.max(widthPct, 5)}%`, backgroundColor: color, opacity: 0.8 }}
              />
            </div>
            <span className="font-mono w-12 text-right shrink-0 text-text">{format(v)}</span>
          </div>
        );
      })}
    </div>
  );
}
