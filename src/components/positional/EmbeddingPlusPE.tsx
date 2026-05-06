'use client';

import { useMemo, useState } from 'react';

import { sinusoidalPE } from '@/lib/positional-encoding';

const DIM = 16; // 展示 16 维示意（实际 LLM 通常 4096+ 维，这里要让用户能看清色块差异）

// "我"的 mock embedding（前 16 维示意）—— 跟 Embedding 模块的方法保持一致
function mockEmbeddingFor(token: string): number[] {
  const charSum = token.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return Array.from({ length: DIM }, (_, i) =>
    Number((Math.sin(charSum * 0.13 + i * 0.7) * 0.5).toFixed(3)),
  );
}

function valueToColor(v: number): string {
  const intensity = Math.min(Math.abs(v), 1);
  if (v >= 0) return `rgba(44, 81, 66, ${0.15 + intensity * 0.7})`;
  return `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
}

export default function EmbeddingPlusPE() {
  const [pos1, setPos1] = useState(0);
  const [pos2, setPos2] = useState(2);
  const token = '我';

  const tokenEmbedding = useMemo(() => mockEmbeddingFor(token), [token]);
  const pe1 = useMemo(() => sinusoidalPE(pos1, DIM), [pos1]);
  const pe2 = useMemo(() => sinusoidalPE(pos2, DIM), [pos2]);

  // 加法
  const final1 = tokenEmbedding.map((v, i) => v + pe1[i]);
  const final2 = tokenEmbedding.map((v, i) => v + pe2[i]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted leading-relaxed">
        同一个 token <strong className="text-text">「{token}」</strong>，在不同位置上会得到不同的最终向量——
        因为 <strong className="text-text">embedding + PE = 输入向量</strong>。下面是它在两个位置上的对比：
      </p>

      {/* 位置选择 */}
      <div className="grid grid-cols-2 gap-3">
        <PositionPicker label="位置 A" value={pos1} onChange={setPos1} colorClass="text-ink-dark" />
        <PositionPicker label="位置 B" value={pos2} onChange={setPos2} colorClass="text-ember-dark" />
      </div>

      {/* 公式视图 */}
      <div className="space-y-3">
        {/* token embedding（共用） */}
        <VectorRow label={`token "${token}" 的 embedding`} subtitle="同一个 token 的语义向量（不变）" values={tokenEmbedding} />

        {/* 位置 A */}
        <div className="rounded-lg border-2 border-ink/20 bg-ink/5 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-ink-dark font-medium">在位置 A（pos = {pos1}）</div>
          <VectorRow label={`位置 ${pos1} 的 PE`} subtitle="位置 A 的「指纹」" values={pe1} compact />
          <div className="text-center text-text-muted text-xs">⊕ 加在一起 ⊕</div>
          <VectorRow label="最终输入向量 A" subtitle={`= 「${token}」 embedding + 位置 ${pos1} PE`} values={final1} compact highlight />
        </div>

        {/* 位置 B */}
        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium">在位置 B（pos = {pos2}）</div>
          <VectorRow label={`位置 ${pos2} 的 PE`} subtitle="位置 B 的「指纹」" values={pe2} compact />
          <div className="text-center text-text-muted text-xs">⊕ 加在一起 ⊕</div>
          <VectorRow label="最终输入向量 B" subtitle={`= 「${token}」 embedding + 位置 ${pos2} PE`} values={final2} compact highlight />
        </div>
      </div>

      {/* 解读 */}
      <p className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        💡 注意看：<strong className="text-text">"最终输入向量 A" 和 "最终输入向量 B" 明显不同</strong>——
        即使输入的是同一个 token "{token}"。这就是模型区分"我打你"和"你打我"的机制：每个位置的 PE 不同，加完之后整个向量就不同了。
      </p>
      <p className="text-[11px] text-text-muted/70 italic">
        ※ 这里 token embedding 是 mock，PE 是真实 sinusoidal 值（前 {DIM} 维示意）。真实 LLM 通常 4096+ 维。
      </p>
    </div>
  );
}

function PositionPicker({
  label,
  value,
  onChange,
  colorClass,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  colorClass: string;
}) {
  return (
    <div>
      <label className={['text-xs uppercase tracking-wider block mb-1', colorClass].join(' ')}>{label} · pos = {value}</label>
      <input
        type="range"
        min={0}
        max={31}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink"
      />
    </div>
  );
}

function VectorRow({
  label,
  subtitle,
  values,
  compact = false,
  highlight = false,
}: {
  label: string;
  subtitle?: string;
  values: number[];
  compact?: boolean;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1 gap-2">
        <span className={['text-xs', highlight ? 'font-medium text-text' : 'text-text-muted'].join(' ')}>{label}</span>
        {subtitle && <span className="text-[10px] text-text-muted/70">{subtitle}</span>}
      </div>
      <div className={['grid gap-1', compact ? 'grid-cols-16' : 'grid-cols-16'].join(' ')} style={{ gridTemplateColumns: `repeat(${values.length}, minmax(0, 1fr))` }}>
        {values.map((v, i) => (
          <div
            key={i}
            className="aspect-square rounded flex items-center justify-center text-[8px] font-mono text-cream-50 font-medium"
            style={{ backgroundColor: valueToColor(v) }}
            title={`第 ${i + 1} 维：${v.toFixed(3)}`}
          >
            {v.toFixed(1)}
          </div>
        ))}
      </div>
    </div>
  );
}
