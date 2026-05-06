'use client';

import { useMemo, useState } from 'react';

import { sinusoidalMatrix } from '@/lib/positional-encoding';

// 把 [-1, 1] 的值映射到颜色：负 = 暖橘、正 = 墨绿、0 = 奶油
function valueToColor(v: number): string {
  const intensity = Math.min(Math.abs(v), 1);
  if (v >= 0) {
    return `rgba(44, 81, 66, ${0.1 + intensity * 0.8})`;
  } else {
    return `rgba(217, 119, 66, ${0.1 + intensity * 0.8})`;
  }
}

const SEQ_LENGTH_OPTIONS = [16, 32, 64, 128];

export default function PositionalHeatmap() {
  const [seqLength, setSeqLength] = useState(64);
  const dim = 64; // 演示用 64 维（足够看出波浪图案，但不至于太挤）

  const matrix = useMemo(() => sinusoidalMatrix(seqLength, dim), [seqLength]);

  return (
    <div className="space-y-4">
      {/* 序列长度切换 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">序列长度：</span>
        {SEQ_LENGTH_OPTIONS.map((n) => (
          <button
            key={n}
            onClick={() => setSeqLength(n)}
            className={[
              'px-3 py-1 text-xs rounded-full border transition-colors',
              seqLength === n
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {n} 个位置
          </button>
        ))}
        <span className="text-xs text-text-muted ml-2">维度：{dim}（每个位置都是 {dim} 维向量）</span>
      </div>

      {/* Heatmap */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-3">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
          每一行是一个位置的"指纹向量"（共 {seqLength} 行 × {dim} 列）
        </div>
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${dim * 6} ${seqLength * 6}`}
            className="w-full h-auto"
            style={{ minWidth: '300px', maxWidth: '720px' }}
          >
            {matrix.map((row, p) =>
              row.map((v, d) => (
                <rect
                  key={`${p}-${d}`}
                  x={d * 6}
                  y={p * 6}
                  width={6}
                  height={6}
                  fill={valueToColor(v)}
                />
              )),
            )}
          </svg>
        </div>

        {/* 轴标 */}
        <div className="flex items-center justify-between text-[10px] text-text-muted mt-1">
          <span>← 维度（0 到 {dim - 1}）→</span>
          <div className="flex items-center gap-1">
            <span>颜色：</span>
            <span className="inline-block w-4 h-3" style={{ backgroundColor: valueToColor(-1) }} />
            <span className="font-mono">-1</span>
            <span className="inline-block w-4 h-3" style={{ backgroundColor: valueToColor(0) }} />
            <span className="font-mono">0</span>
            <span className="inline-block w-4 h-3" style={{ backgroundColor: valueToColor(1) }} />
            <span className="font-mono">+1</span>
          </div>
        </div>
      </div>

      {/* 怎么看这张图（先解释怎么读，再讲含义） */}
      <div className="text-xs text-text leading-relaxed bg-cream-100 border border-ink/10 rounded p-3 space-y-2.5">
        <div>
          <p className="font-medium text-text mb-1">📖 怎么读这张图：</p>
          <ul className="text-text-muted space-y-1 list-disc pl-5">
            <li><strong className="text-text">每一行</strong>是一个位置的"指纹"（{seqLength} 行就是 {seqLength} 个位置）</li>
            <li><strong className="text-text">每一列</strong>是这个指纹向量里的一个维度（{dim} 列就是 64 维向量）</li>
            <li>颜色 = PE 值：<span className="text-ink-dark font-medium">墨绿 = 正</span> / <span className="text-ember-dark font-medium">暖橘 = 负</span> / 浅色 = 接近 0</li>
          </ul>
        </div>

        <div className="border-t border-ink/10 pt-2">
          <p className="font-medium text-text mb-1">🌊 为什么图分明显"左右两半"：</p>
          <p className="text-text-muted">
            sinusoidal 公式让<strong className="text-text">每个维度对应一个不同频率的 sin / cos 波</strong>：
          </p>
          <ul className="text-text-muted space-y-1 list-disc pl-5 mt-1">
            <li>
              <strong className="text-text">左半边（维度索引小，i 小）</strong>：频率高、波长短——
              在这 {seqLength} 个位置里能看到很多完整周期，所以颜色<strong className="text-text">快速跳变</strong>（绿橙交错）
            </li>
            <li>
              <strong className="text-text">右半边（维度索引大，i 大）</strong>：频率低、波长长——
              这 {seqLength} 个位置才走过周期里的一小段，所以颜色<strong className="text-text">几乎不变</strong>（看起来像竖条）
            </li>
          </ul>
          <p className="text-text-muted mt-2">
            这种"高频 + 低频混合"的设计很精妙：
            高频维度让模型分得清<strong className="text-text">邻近位置的细微差</strong>，
            低频维度让模型感知<strong className="text-text">远距离的整体位置</strong>。
          </p>
        </div>

        <div className="border-t border-ink/10 pt-2">
          <p className="font-medium text-text mb-1">📐 数学怎么实现的</p>
          <p className="text-text-muted">
            每个维度对应一个不同<strong className="text-text">频率的 sin / cos 波</strong>——左侧维度的波频率高（短波长，颜色快变），右侧频率低（长波长，颜色慢变）。
            完整公式（带 sin/cos/10000 等）放在深入模式。
          </p>
        </div>

        <p className="text-[11px] text-text-muted/80 italic border-t border-ink/10 pt-2">
          💡 拖动序列长度从 16 → 128，看右半边的"竖条"其实也在<strong className="text-text">缓慢变化</strong>——
          只是在短序列里看不出来，正是这个性质让模型能区分远距离的位置。
        </p>
      </div>
    </div>
  );
}
