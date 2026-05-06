'use client';

import { useState } from 'react';

import type { EmbeddingWord } from '@/lib/types';

interface Props {
  words: EmbeddingWord[];
  realDim: number;
}

// 让用户感受"一个 token = 一组数字"，重点在两件事：
// 1. 真实维度有 1536 / 3072 这么多——人眼根本看不全
// 2. 不同词的向量值不同，但相近语义的词部分维度会接近
export default function VectorSliceViz({ words, realDim }: Props) {
  // 默认选 3 个有代表性的词（来自不同类别 + 一对同类）让用户能看出对比
  const candidates = ['苹果', '橘子', '北京', '今天', '猫'].filter((w) =>
    words.some((x) => x.word === w),
  );
  const [selected, setSelected] = useState(candidates[0] ?? words[0]?.word ?? '苹果');

  const word = words.find((w) => w.word === selected);
  if (!word) return null;

  return (
    <div className="space-y-4">
      {/* 词选择器 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">选个词看它的向量：</span>
        {candidates.map((w) => (
          <button
            key={w}
            onClick={() => setSelected(w)}
            className={[
              'px-3 py-1 text-sm rounded-full border transition-colors',
              selected === w
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {w}
          </button>
        ))}
      </div>

      {/* 向量展示 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="font-serif text-2xl text-ink-dark">"{word.word}"</span>
          <span className="text-text-muted">→</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-ember/10 text-ember-dark border border-ember/30 font-mono">
            {realDim} 维向量
          </span>
        </div>

        {/* 8 维示意：每维一个色块 */}
        <div className="grid grid-cols-8 gap-1.5 mb-2">
          {word.sample8.map((v, i) => {
            const intensity = Math.min(Math.abs(v) * 1.4, 1);
            const bg =
              v >= 0
                ? `rgba(44, 81, 66, ${0.15 + intensity * 0.7})`
                : `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
            return (
              <div
                key={i}
                className="aspect-square rounded flex items-center justify-center text-[10px] font-mono text-cream-50 font-medium"
                style={{ backgroundColor: bg }}
                title={`第 ${i + 1} 维：${v.toFixed(3)}`}
              >
                {v.toFixed(2)}
              </div>
            );
          })}
        </div>

        {/* 省略号示意：还有更多维度 */}
        <div className="flex items-center gap-2 text-text-muted text-xs">
          <span className="font-mono">[</span>
          <span>第 1-8 维</span>
          <span className="flex-1 text-center text-text-muted/60">…还有 {realDim - 8} 维…</span>
          <span>第 {realDim} 维</span>
          <span className="font-mono">]</span>
        </div>
      </div>

      {/* 解读 */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 每个数字代表一个"特征维度"——但<strong className="text-text">人类看不懂这些维度的具体含义</strong>。
        模型自己学出来的内部表示，不对应任何人类可解释的概念（不是"甜度=0.62"、"颜色=-0.31"那种）。
        我们能利用的只是 <strong className="text-text">向量之间的距离 / 夹角 </strong>——这是下一节要讲的。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        ※ 这里展示的 8 个数字是<strong>示意 mock 值</strong>。真实 OpenAI text-embedding-3-small 的向量是 1536 维浮点数，每维数值各不相同。可以去 OpenAI Cookbook 跑真实例子。
      </p>
    </div>
  );
}
