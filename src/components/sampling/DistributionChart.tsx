'use client';

import { useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ComputedToken } from '@/lib/types';

interface Props {
  distribution: ComputedToken[];
  /** 高亮某一个 token（采样命中后用），按当前 data index */
  highlightIndex?: number | null;
  /** 图表高度，默认 260px */
  height?: number;
}

export default function DistributionChart({ distribution, highlightIndex, height = 260 }: Props) {
  const [showCaveat, setShowCaveat] = useState(false);
  const data = distribution.map((d, i) => ({
    name: displayToken(d.token),
    rawToken: d.token,
    prob: d.prob,
    isKept: d.isKept,
    index: i,
  }));

  return (
    <div className="w-full">
      <div style={{ height }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 8, left: 8, bottom: 24 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#6B5F50' }}
              interval={0}
              angle={-30}
              textAnchor="end"
              height={42}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#6B5F50' }}
              tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
              domain={[0, 'auto']}
              width={36}
            />
            <Tooltip
              cursor={{ fill: 'rgba(44, 81, 66, 0.05)' }}
              formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, '概率']}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item?.rawToken ?? label;
              }}
              contentStyle={{
                backgroundColor: '#FBF8F1',
                border: '1px solid #2C5142',
                borderRadius: 6,
                fontSize: 13,
              }}
            />
            <Bar dataKey="prob" radius={[3, 3, 0, 0]} animationDuration={300}>
              {data.map((d, i) => {
                const isHighlight = highlightIndex === i;
                const fill = !d.isKept
                  ? '#E0D6C2'
                  : isHighlight
                    ? '#D97742'
                    : '#2C5142';
                return <Cell key={i} fill={fill} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 简化版"近似说明"——默认折叠，用户主动展开 */}
      <button
        type="button"
        onClick={() => setShowCaveat(!showCaveat)}
        className="text-[11px] text-text-muted/80 hover:text-text-muted mt-1 underline-offset-2 hover:underline"
      >
        ⓘ 这是真实数据吗？{showCaveat ? '收起' : '展开'}
      </button>
      {showCaveat && (
        <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed bg-cream-100 border border-cream-200 rounded p-2">
          展示的是 OpenAI API 返回的 <strong>top 20 候选词</strong>真实概率（temperature=1.0 调用）。
          调温度时只在这 20 个词之间重新分配概率——完整词表的尾部分布在调高温度时会有偏差，是为教学演示做的近似。
        </p>
      )}
    </div>
  );
}

function displayToken(t: string): string {
  if (t === ' ') return '␣';
  if (t === '\n') return '⏎';
  if (t === '\t') return '⇥';
  if (t.length > 6) return t.slice(0, 5) + '…';
  return t;
}
