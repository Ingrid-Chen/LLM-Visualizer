'use client';

import { useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { useT } from '@/lib/i18n/LangContext';
import type { ComputedToken } from '@/lib/types';

interface Props {
  distribution: ComputedToken[];
  /** 高亮某一个 token（采样命中后用），按当前 data index */
  highlightIndex?: number | null;
  /** 图表高度，默认 260px */
  height?: number;
}

export default function DistributionChart({ distribution, highlightIndex, height = 260 }: Props) {
  const t = useT();
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
              formatter={(value: number) => [`${(value * 100).toFixed(2)}%`, t('sampling.components.distChart.probabilityLabel')]}
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

      <button
        type="button"
        onClick={() => setShowCaveat(!showCaveat)}
        className="text-[11px] text-text-muted/80 hover:text-text-muted mt-1 underline-offset-2 hover:underline"
      >
        {showCaveat ? t('sampling.components.distChart.caveatToggleHide') : t('sampling.components.distChart.caveatToggleShow')}
      </button>
      {showCaveat && (
        <p className="text-[11px] text-text-muted mt-1.5 leading-relaxed bg-cream-100 border border-cream-200 rounded p-2">
          {t('sampling.components.distChart.caveatBody')}
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
