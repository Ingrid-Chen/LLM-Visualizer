'use client';

import { useState } from 'react';

import type { EmbeddingWord } from '@/lib/types';

interface Props {
  words: EmbeddingWord[];
}

const SIZE = 320;
const ORIGIN = { x: SIZE / 2, y: SIZE / 2 };
// 把 -5..5 投影到中央 ±120px 内
const SCALE = 24;
const mapX = (x: number) => ORIGIN.x + x * SCALE;
const mapY = (y: number) => ORIGIN.y - y * SCALE;

// 余弦相似度（基于 2D 投影计算——这是 mock 数据上的"近似"，不是真实 1536 维上的）
function cosine(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dot = a.x * b.x + a.y * b.y;
  const magA = Math.hypot(a.x, a.y);
  const magB = Math.hypot(b.x, b.y);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// 两向量夹角（度）
function angleBetween(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return (Math.acos(Math.max(-1, Math.min(1, cosine(a, b)))) * 180) / Math.PI;
}

export default function CosineSimilarityViz({ words }: Props) {
  // 默认选两个同类（应该相似度高）
  const [wordA, setWordA] = useState('苹果');
  const [wordB, setWordB] = useState('橘子');

  const a = words.find((w) => w.word === wordA);
  const b = words.find((w) => w.word === wordB);

  if (!a || !b) return null;

  const cos = cosine(a, b);
  const ang = angleBetween(a, b);
  const sameCategory = a.category === b.category;

  return (
    <div className="space-y-4">
      {/* 词选择 */}
      <div className="grid grid-cols-2 gap-3">
        <WordPicker label="向量 A" words={words} selected={wordA} onSelect={setWordA} colorClass="text-ink-dark" />
        <WordPicker label="向量 B" words={words} selected={wordB} onSelect={setWordB} colorClass="text-ember-dark" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* SVG 向量图 */}
        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-3">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">两个词作为 2D 向量</div>
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
            {/* 网格 + 中心十字 */}
            <line x1={0} y1={ORIGIN.y} x2={SIZE} y2={ORIGIN.y} stroke="#EBE2CD" strokeDasharray="2 2" />
            <line x1={ORIGIN.x} y1={0} x2={ORIGIN.x} y2={SIZE} stroke="#EBE2CD" strokeDasharray="2 2" />

            {/* 夹角弧线 */}
            <ArcBetween a={a} b={b} />

            {/* 向量 A */}
            <ArrowVector x={a.x} y={a.y} color="#2C5142" label={a.word} />
            {/* 向量 B */}
            <ArrowVector x={b.x} y={b.y} color="#D97742" label={b.word} />
          </svg>
        </div>

        {/* 数值面板 */}
        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 flex flex-col gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1">夹角 θ</div>
            <div className="font-mono text-3xl font-bold text-ink-dark">{ang.toFixed(1)}°</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1">余弦相似度 cos(θ)</div>
            <div className="font-mono text-3xl font-bold text-ember-dark">{cos.toFixed(3)}</div>
            <div className="mt-1 h-2 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500"
                style={{ width: `${((cos + 1) / 2) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-text-muted mt-0.5">
              <span>-1（相反）</span>
              <span>0（无关）</span>
              <span>+1（相同）</span>
            </div>
          </div>
          <div className="text-xs text-text-muted leading-relaxed border-t border-cream-200 pt-2 mt-auto">
            {sameCategory ? (
              <>
                ✓ 同类（都是<strong className="text-text">{categoryName(a.category)}</strong>）→ 夹角小、余弦接近 1。
                "语义相近 = 向量方向相近"。
              </>
            ) : (
              <>
                ✗ 跨类（{categoryName(a.category)} vs {categoryName(b.category)}）→ 夹角大、余弦小或负数。
                这就是"不同类别 = 向量方向不同"。
              </>
            )}
          </div>
        </div>
      </div>

      {/* 解读 + caveat */}
      <div className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded p-3 space-y-1">
        <p>
          📐 <strong className="text-text">余弦相似度</strong>看的是<strong className="text-text">两个向量的夹角</strong>，不看它们的长度——
          夹角小就相似（cos 接近 1），垂直就无关（cos = 0），相反方向就相反（cos = -1）。
          这是 RAG / 语义搜索最常用的距离度量。
        </p>
        <p className="text-[11px] text-text-muted/80">
          ※ 这里用的是 2D 投影坐标算的近似值，仅供直觉演示。真实 RAG 系统用的是完整高维向量之间的余弦相似度。完整数学公式放在深入模式。
        </p>
      </div>
    </div>
  );
}

function WordPicker({
  label,
  words,
  selected,
  onSelect,
  colorClass,
}: {
  label: string;
  words: EmbeddingWord[];
  selected: string;
  onSelect: (w: string) => void;
  colorClass: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-text-muted block mb-1">{label}</label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value)}
        className={[
          'w-full p-2 rounded-lg border-2 border-ink/15 bg-cream-50 font-serif font-medium focus:outline-none focus:border-ink/50',
          colorClass,
        ].join(' ')}
      >
        {(['fruit', 'animal', 'city', 'time'] as const).map((cat) => (
          <optgroup key={cat} label={categoryName(cat)}>
            {words
              .filter((w) => w.category === cat)
              .map((w) => (
                <option key={w.word} value={w.word}>
                  {w.word}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}

function ArrowVector({ x, y, color, label }: { x: number; y: number; color: string; label: string }) {
  const x2 = mapX(x);
  const y2 = mapY(y);
  return (
    <g>
      <defs>
        <marker
          id={`arrowhead-${label}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={ORIGIN.x}
        y1={ORIGIN.y}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2.5}
        markerEnd={`url(#arrowhead-${label})`}
      />
      <text x={x2 + (x >= 0 ? 6 : -6)} y={y2 + 4} fontSize={13} fontFamily="serif" fontWeight={600} fill={color} textAnchor={x >= 0 ? 'start' : 'end'}>
        {label}
      </text>
    </g>
  );
}

// 在原点画两向量之间的夹角弧线
function ArcBetween({
  a,
  b,
}: {
  a: { x: number; y: number };
  b: { x: number; y: number };
}) {
  const angA = Math.atan2(-a.y, a.x); // SVG y 朝下，反一下
  const angB = Math.atan2(-b.y, b.x);
  const r = 28;
  const x1 = ORIGIN.x + r * Math.cos(angA);
  const y1 = ORIGIN.y + r * Math.sin(angA);
  const x2 = ORIGIN.x + r * Math.cos(angB);
  const y2 = ORIGIN.y + r * Math.sin(angB);
  // 选小弧
  let diff = angB - angA;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  const largeArc = Math.abs(diff) > Math.PI ? 1 : 0;
  const sweep = diff > 0 ? 1 : 0;
  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2}`}
      fill="none"
      stroke="#6B5F50"
      strokeWidth={1}
      strokeDasharray="2 2"
    />
  );
}

function categoryName(c: string): string {
  return { fruit: '水果', animal: '动物', city: '城市', time: '时间' }[c] ?? c;
}
