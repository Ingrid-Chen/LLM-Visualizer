'use client';

import { useMemo, useState } from 'react';

import type { AttentionData, AttentionExample } from '@/lib/types';

interface Props {
  data: AttentionData;
}

const LAYER_LABELS = ['第 1 层（看邻居）', '第 2 层（看短词组）', '第 3 层（跨距离理解）'];

export default function AttentionMatrixViz({ data }: Props) {
  const [exampleId, setExampleId] = useState<string>(data.examples[0]?.id ?? '');
  const example = data.examples.find((e) => e.id === exampleId) ?? data.examples[0];
  const [layerIdx, setLayerIdx] = useState(2); // 默认看深层（语义关系最明显）
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const fromIdx = hoverIdx ?? example.defaultFromIdx;
  const matrix = example.layers[layerIdx];
  const weights = matrix[fromIdx];

  // 动态计算：当前 from token 在当前层最关注的 top 3（排除自身）
  const topTargets = useMemo(() => {
    return weights
      .map((w, i) => ({ token: example.tokens[i], idx: i, w }))
      .filter((t) => t.idx !== fromIdx)
      .sort((a, b) => b.w - a.w)
      .slice(0, 3);
  }, [weights, fromIdx, example.tokens]);

  return (
    <div className="space-y-4">
      {/* 例子切换 */}
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">选个有代表性的句子</label>
        <div className="flex flex-wrap gap-2">
          {data.examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => {
                setExampleId(ex.id);
                setHoverIdx(null);
              }}
              className={[
                'text-left px-3 py-1.5 rounded-lg border-2 transition-all text-sm',
                exampleId === ex.id
                  ? 'border-ink bg-cream-100 shadow-[2px_3px_0_rgba(44,81,66,0.15)]'
                  : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {ex.label}
            </button>
          ))}
        </div>
        {/* 当前例子的"教学目标"（写死，描述这个例子整体要演示什么——不随层切换变化） */}
        <p className="text-[11px] text-text-muted leading-relaxed mt-2 px-1">
          📌 <strong className="text-text">这个例子的核心看点：</strong>{example.highlight}
          （切到第 3 层时最明显——前 1、2 层 attention 还在看邻居）
        </p>
      </div>

      {/* 层切换 */}
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">切换到第几层看看</label>
        <div className="flex flex-wrap gap-2">
          {LAYER_LABELS.map((lbl, i) => (
            <button
              key={i}
              onClick={() => setLayerIdx(i)}
              className={[
                'text-xs px-3 py-1 rounded-full border transition-colors',
                layerIdx === i
                  ? 'border-ink bg-ink text-cream-50'
                  : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* 主可视化 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">
          鼠标悬停某个 token，看它"看向"哪里（连线粗细 = 注意力权重）
        </div>
        {/* 图例 */}
        <div className="flex items-center gap-4 mb-2 text-[11px] text-text-muted flex-wrap">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-ember" />
            上排 = 当前悬停的 token（From）
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded bg-cream-100 border border-text-muted/40" />
            下排 = 候选目标（To，颜色越深 = 注意力越强）
          </span>
        </div>
        <AttentionFlowSvg example={example} weights={weights} fromIdx={fromIdx} onHover={setHoverIdx} />
        <div className="mt-3 p-3 rounded bg-ember/5 border border-ember/20 text-xs leading-relaxed">
          💡 当前选中：<strong className="text-ember-dark">「{example.tokens[fromIdx]}」</strong>（位置 {fromIdx}）在 <strong className="text-text">{LAYER_LABELS[layerIdx]}</strong>的注意力分布——
          它最关注的 3 个 token：
          <span className="ml-1">
            {topTargets.map((t, i) => (
              <span key={t.idx}>
                {i > 0 && '、'}
                <strong className="text-text">「{t.token}」</strong>({(t.w * 100).toFixed(0)}%)
              </span>
            ))}
          </span>
        </div>

        {/* 数值矩阵 */}
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-text-muted hover:text-text transition-colors">
            ▸ 看完整 N×N 注意力矩阵数值
          </summary>
          <div className="mt-2">
            <MatrixGrid example={example} matrix={matrix} highlightFromIdx={fromIdx} />
          </div>
        </details>
      </div>

      {/* 跨层观察 */}
      <p className="text-xs text-text-muted/80 leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        🎯 <strong className="text-text">注意切换层会发生什么：</strong>第 1 层主要看<strong className="text-text">邻近 token</strong>（句法 / 局部修饰）；
        到第 3 层 attention 会<strong className="text-text">跨过长距离</strong>，建立"她 → Lucy"、"看到 → 猫"等语义关联。
        这就是"多层堆叠让模型逐层抽象"的具象演示。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        ※ 这是教学演示用的合理近似 mock，不是真实 GPT 输出的注意力权重。真实模型每层有 32+ 个头，每个头的权重不同；这里展示的是"多头平均后"的简化版。
      </p>
    </div>
  );
}

// ==================== 主流可视化：tokens 横排 + 连线 ====================

function AttentionFlowSvg({
  example,
  weights,
  fromIdx,
  onHover,
}: {
  example: AttentionExample;
  weights: number[];
  fromIdx: number;
  onHover: (idx: number | null) => void;
}) {
  const n = example.tokens.length;
  const W = 700;
  const H = 200;
  // 每个 token 在两行排版：上行 = 当前位置 (from)，下行 = 候选位置 (to)
  // 让 hover 决定显示哪一组连线
  const xs = Array.from({ length: n }, (_, i) => 30 + ((W - 60) / Math.max(n - 1, 1)) * i);
  const yTop = 28;
  const yBot = H - 28;
  const tokenBoxH = 28;

  const maxW = Math.max(...weights, 0.001);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: '240px' }}>
      {/* 连线（先画下方，让 token 文字在上层） */}
      {weights.map((w, j) => {
        if (j === fromIdx) return null; // 跳过自连
        const opacity = Math.max(0.1, w / maxW);
        const strokeW = 1 + (w / maxW) * 5;
        return (
          <line
            key={j}
            x1={xs[fromIdx]}
            y1={yTop + tokenBoxH}
            x2={xs[j]}
            y2={yBot - 2}
            stroke="#D97742"
            strokeWidth={strokeW}
            strokeOpacity={opacity}
          />
        );
      })}

      {/* 上行：from 位置（hover 切换） */}
      {example.tokens.map((tok, i) => {
        const isFrom = i === fromIdx;
        return (
          <g
            key={`top-${i}`}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: 'pointer' }}
          >
            <rect
              x={xs[i] - 22}
              y={yTop}
              width={44}
              height={tokenBoxH}
              rx={6}
              fill={isFrom ? '#D97742' : '#F5EFE2'}
              stroke={isFrom ? '#B85A2A' : '#6B5F50'}
              strokeWidth={isFrom ? 2 : 1}
            />
            <text x={xs[i]} y={yTop + 18} textAnchor="middle" fontSize="13" fontFamily="serif" fill={isFrom ? '#FBF8F1' : '#1F1A14'} fontWeight={isFrom ? 700 : 400}>
              {tok}
            </text>
          </g>
        );
      })}

      {/* 下行：候选 to 位置——卡片填充色深浅表示注意力权重 */}
      {example.tokens.map((tok, j) => {
        const w = weights[j];
        const intensity = Math.min(w / maxW, 1);
        const isHighlighted = intensity > 0.4;
        // 填充色用暖橘渐变：权重越高颜色越深
        const fill = `rgba(217, 119, 66, ${0.05 + intensity * 0.45})`;
        return (
          <g key={`bot-${j}`}>
            <rect
              x={xs[j] - 22}
              y={yBot}
              width={44}
              height={tokenBoxH}
              rx={6}
              fill={fill}
              stroke={isHighlighted ? '#D97742' : '#9C9183'}
              strokeWidth={isHighlighted ? 2 : 1}
            />
            <text x={xs[j]} y={yBot + 18} textAnchor="middle" fontSize="13" fontFamily="serif" fill="#1F1A14" fontWeight={isHighlighted ? 600 : 400}>
              {tok}
            </text>
            {/* 权重数值（小字） */}
            <text x={xs[j]} y={yBot + 42} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#6B5F50">
              {(w * 100).toFixed(0)}%
            </text>
          </g>
        );
      })}

    </svg>
  );
}

// ==================== 完整矩阵网格（折叠展示） ====================

function MatrixGrid({
  example,
  matrix,
  highlightFromIdx,
}: {
  example: AttentionExample;
  matrix: number[][];
  highlightFromIdx: number;
}) {
  const n = example.tokens.length;
  const cellSize = 28;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${(n + 1) * cellSize + 10} ${(n + 1) * cellSize + 10}`} style={{ minWidth: '320px', maxWidth: '600px' }}>
        {/* 列标 (to) */}
        {example.tokens.map((tok, j) => (
          <text
            key={`col-${j}`}
            x={cellSize + j * cellSize + cellSize / 2}
            y={cellSize - 6}
            textAnchor="middle"
            fontSize="9"
            fill="#6B5F50"
          >
            {tok.length > 3 ? tok.slice(0, 3) + '…' : tok}
          </text>
        ))}
        {/* 行 */}
        {matrix.map((row, i) => (
          <g key={`row-${i}`}>
            <text
              x={cellSize - 6}
              y={cellSize + i * cellSize + cellSize / 2 + 3}
              textAnchor="end"
              fontSize="9"
              fill="#6B5F50"
              fontWeight={i === highlightFromIdx ? 700 : 400}
            >
              {example.tokens[i].length > 3 ? example.tokens[i].slice(0, 3) + '…' : example.tokens[i]}
            </text>
            {row.map((v, j) => {
              const intensity = Math.min(v * 2.5, 1);
              const isHighlightRow = i === highlightFromIdx;
              return (
                <g key={`cell-${i}-${j}`}>
                  <rect
                    x={cellSize + j * cellSize}
                    y={cellSize + i * cellSize}
                    width={cellSize - 2}
                    height={cellSize - 2}
                    fill={`rgba(217, 119, 66, ${0.1 + intensity * 0.8})`}
                    stroke={isHighlightRow ? '#2C5142' : 'none'}
                    strokeWidth={1}
                  />
                  <text
                    x={cellSize + j * cellSize + cellSize / 2}
                    y={cellSize + i * cellSize + cellSize / 2 + 3}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#1F1A14"
                    fontWeight={500}
                  >
                    {v < 0.05 ? '' : (v * 100).toFixed(0)}
                  </text>
                </g>
              );
            })}
          </g>
        ))}
      </svg>
    </div>
  );
}
