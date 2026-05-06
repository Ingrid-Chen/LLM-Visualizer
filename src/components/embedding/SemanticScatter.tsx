'use client';

import { useMemo, useState } from 'react';

import type { EmbeddingCategory, EmbeddingWord } from '@/lib/types';

interface Props {
  words: EmbeddingWord[];
}

const CATEGORIES: { id: EmbeddingCategory; label: string; color: string; bgClass: string }[] = [
  { id: 'fruit', label: '水果', color: '#D97742', bgClass: 'bg-ember/10 text-ember-dark border-ember/30' },
  { id: 'animal', label: '动物', color: '#2C5142', bgClass: 'bg-ink/10 text-ink-dark border-ink/30' },
  { id: 'city', label: '城市', color: '#1e3a8a', bgClass: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'time', label: '时间', color: '#a16207', bgClass: 'bg-amber-100 text-amber-800 border-amber-300' },
];

const CATEGORY_COLOR: Record<EmbeddingCategory, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.color]),
) as Record<EmbeddingCategory, string>;

// 视图坐标系：-5..5 → 24..376（含边距）
const SIZE = 400;
const PAD = 24;
const SCALE = (SIZE - PAD * 2) / 10;
const mapX = (x: number) => PAD + (x + 5) * SCALE;
const mapY = (y: number) => SIZE - PAD - (y + 5) * SCALE; // y 翻转

export default function SemanticScatter({ words }: Props) {
  const [activeCats, setActiveCats] = useState<Set<EmbeddingCategory>>(
    new Set(['fruit', 'animal', 'city', 'time']),
  );
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = words.filter((w) => activeCats.has(w.category));
  const selectedWord = useMemo(() => words.find((w) => w.word === selected) ?? null, [selected, words]);

  // 最近邻 5 个（按 2D 欧氏距离，排除自己；只考虑当前可见类别）
  const neighbors = useMemo(() => {
    if (!selectedWord) return [];
    return filtered
      .filter((w) => w.word !== selected)
      .map((w) => ({ ...w, dist: Math.hypot(w.x - selectedWord.x, w.y - selectedWord.y) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5);
  }, [selectedWord, selected, filtered]);
  const neighborSet = useMemo(() => new Set(neighbors.map((n) => n.word)), [neighbors]);

  const toggleCategory = (cat: EmbeddingCategory) => {
    setActiveCats((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* 类别筛选 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-text-muted self-center mr-1">显示类别：</span>
        {CATEGORIES.map((cat) => {
          const active = activeCats.has(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggleCategory(cat.id)}
              className={[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-all',
                active ? cat.bgClass : 'bg-cream-50 text-text-muted/60 border-ink/10',
              ].join(' ')}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color, opacity: active ? 1 : 0.3 }} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* SVG 散点图 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-2 sm:p-4">
        <div className="relative w-full max-w-[460px] mx-auto">
          <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-auto">
            {/* 中心十字线 */}
            <line x1={PAD} y1={SIZE / 2} x2={SIZE - PAD} y2={SIZE / 2} stroke="#EBE2CD" strokeDasharray="3 3" />
            <line x1={SIZE / 2} y1={PAD} x2={SIZE / 2} y2={SIZE - PAD} stroke="#EBE2CD" strokeDasharray="3 3" />

            {/* 选中词到最近邻的连线 */}
            {selectedWord &&
              neighbors.map((n) => (
                <line
                  key={`line-${n.word}`}
                  x1={mapX(selectedWord.x)}
                  y1={mapY(selectedWord.y)}
                  x2={mapX(n.x)}
                  y2={mapY(n.y)}
                  stroke="#D97742"
                  strokeWidth={1}
                  strokeOpacity={0.45}
                  strokeDasharray="4 3"
                />
              ))}

            {/* 数据点 + 标签 */}
            {filtered.map((w) => {
              const px = mapX(w.x);
              const py = mapY(w.y);
              const isSelected = w.word === selected;
              const isNeighbor = neighborSet.has(w.word);
              const radius = isSelected ? 9 : isNeighbor ? 6 : 5;
              const dimmed = selected && !isSelected && !isNeighbor;
              return (
                <g
                  key={w.word}
                  onClick={() => setSelected(isSelected ? null : w.word)}
                  className="cursor-pointer"
                  style={{ opacity: dimmed ? 0.25 : 1, transition: 'opacity 0.2s' }}
                >
                  <circle
                    cx={px}
                    cy={py}
                    r={radius}
                    fill={CATEGORY_COLOR[w.category]}
                    stroke={isSelected ? '#1F1A14' : 'white'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={px + radius + 3}
                    y={py + 4}
                    fontSize={11}
                    fontFamily="serif"
                    fill={isSelected ? '#1F1A14' : '#3C2F22'}
                    fontWeight={isSelected ? 700 : 500}
                  >
                    {w.word}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 当前选中状态 */}
        {selectedWord ? (
          <div className="mt-3 p-3 rounded-lg bg-ember/5 border border-ember/20 text-xs">
            <p className="leading-relaxed">
              <strong className="text-ember-dark">选中：「{selectedWord.word}」</strong> · 它最近的 5 个邻居（按 2D 距离）：
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {neighbors.map((n) => (
                <span
                  key={n.word}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cream-50 border border-ink/15 font-serif"
                >
                  {n.word}
                  <span className="text-[10px] text-text-muted font-mono">{n.dist.toFixed(2)}</span>
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-text-muted/80 text-center mt-2">
            点击任意一个词看它的"最近邻"
          </p>
        )}
      </div>

      {/* 必明示的 caveat */}
      <p className="text-[11px] text-text-muted/80 leading-relaxed bg-cream-100 border border-ink/10 rounded p-2.5">
        ⚠️ <strong className="text-text">这是从 1536 维降维到 2D 的简化示意</strong>。请不要把 2D 平面上的距离当作精确语义距离——
        真实模型在 1536 维空间里比对，2D 投影丢失了大量信息。这里的目的只是让你"看见"语义聚类的<strong className="text-text">直觉</strong>。
      </p>
    </div>
  );
}
