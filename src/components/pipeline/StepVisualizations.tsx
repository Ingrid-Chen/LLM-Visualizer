'use client';

// 7 个步骤各自的可视化子组件 —— 简化版：emoji + 一两个数据快照即可，深度版留给各模块详情页
//
// 每个 viz 接收 PipelineData 中对应 step 的字段作为 props

import { useState } from 'react';
import type { PipelineData } from '@/lib/types';

// ==================== 01 · Tokenization ====================

export function TokenizationViz({ data }: { data: PipelineData['steps']['tokenization'] }) {
  const [showMyth, setShowMyth] = useState(false);
  const palette = ['bg-ink/15 border-ink/30 text-ink-dark', 'bg-ember/15 border-ember/30 text-ember-dark', 'bg-amber-100 border-amber-300 text-amber-800', 'bg-blue-100 border-blue-300 text-blue-800', 'bg-emerald-100 border-emerald-300 text-emerald-800', 'bg-pink-100 border-pink-300 text-pink-800'];
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">切分结果（{data.tokens.length} 个 token）</div>
        <div className="flex flex-wrap gap-1.5">
          {data.tokens.map((tok, i) => (
            <span
              key={i}
              className={[
                'inline-flex flex-col items-center px-3 py-1.5 rounded-lg border-2 font-mono text-sm',
                palette[i % palette.length],
              ].join(' ')}
            >
              <span className="font-serif">{tok}</span>
              <span className="text-[10px] opacity-70 mt-0.5">id: {data.token_ids[i]}</span>
            </span>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">
        ※ 每个 token 都对应词表里的一个固定编号（id）。同一个汉字在不同位置可能切成不同 token。
      </p>

      {/* 破除常见认知误区 */}
      <button
        type="button"
        onClick={() => setShowMyth(!showMyth)}
        className="text-xs text-ember-dark hover:text-ember-dark font-medium underline-offset-2 hover:underline"
      >
        ⚡ 一个常被忽略的事实 {showMyth ? '收起' : '展开'}
      </button>
      {showMyth && (
        <div className="space-y-3 p-3 rounded-lg bg-ember/5 border border-ember/20 text-xs text-text leading-relaxed">
          <div>
            <div className="font-medium text-ember-dark mb-1">"中文 token 比英文贵 2-3 倍" 是过时的认知</div>
            <p className="text-text-muted">
              这是 GPT-2/GPT-3 时代的事实——那会儿 tokenizer 训练数据中文少，每个汉字会被 byte-level 拆成 2-3 个 token。
              GPT-4（cl100k_base）和 GPT-4o（o200k_base）训练数据里加了大量中文，BPE 把"中国""首都"这种常见词组合并成
              <strong className="text-text"> 1 个 token</strong>。现在同义中英文 token 数已经基本持平，差异通常 ±20% 以内。
            </p>
          </div>
          <div className="flex items-baseline gap-2 text-[11px] text-text-muted/80 font-mono">
            <span>"中" 字 UTF-8</span>
            <span>= 3 字节</span>
            <span className="text-text-muted/50">→</span>
            <span>cl100k_base 切分 = 1 token</span>
          </div>
          <div className="border-t border-ember/15 pt-3">
            <div className="font-medium text-ember-dark mb-1">⚠️ Emoji 才是真正的 token 大户</div>
            <p className="text-text-muted">
              一个 emoji 在 UTF-8 里占 4 字节，且 tokenizer 训练数据里出现频率远低于常见汉字，BPE 没合并——
              通常被拆成 <strong className="text-text">2-3 个 token</strong>，比一个汉字贵几倍。在做 prompt 时要留意：
              chat UI 里的 emoji 装饰看起来"免费"，实际计费时是 token 大户。
            </p>
          </div>
          <div className="flex items-baseline gap-2 text-[11px] text-text-muted/80 font-mono">
            <span>"🍕" UTF-8</span>
            <span>= 4 字节</span>
            <span className="text-text-muted/50">→</span>
            <span>cl100k_base 切分 = 2-3 token</span>
          </div>
          <div className="text-[10px] text-text-muted/70 italic pt-1">
            ※ 实测可去 tiktokenizer.vercel.app 输入任意文本看真实切分。
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 02 · Embedding ====================

export function EmbeddingViz({
  data,
  firstToken,
}: {
  data: PipelineData['steps']['embedding'];
  firstToken: string;
}) {
  // 把 8 维示意值映射成颜色块（蓝 = 负，绿 = 正，深浅按绝对值）
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          token "{firstToken}" 的向量（前 8 维示意，实际 {data.dim} 维）
        </div>
        <div className="grid grid-cols-8 gap-1">
          {data.sample_first_token.map((v, i) => {
            const intensity = Math.min(Math.abs(v) * 1.5, 1);
            const bg = v >= 0
              ? `rgba(44, 81, 66, ${intensity})`
              : `rgba(217, 119, 66, ${intensity})`;
            return (
              <div
                key={i}
                className="aspect-square rounded flex items-center justify-center text-[9px] font-mono text-cream-50"
                style={{ backgroundColor: bg }}
                title={`第 ${i + 1} 维：${v.toFixed(3)}`}
              >
                {v.toFixed(2)}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">
        ※ 真实向量 {data.dim} 维（这里只能示意 8 维）。语义相近的词在这个高维空间里距离近。
      </p>
    </div>
  );
}

// ==================== 03 · Positional Encoding ====================

export function PositionalViz({
  data,
  tokens,
}: {
  data: PipelineData['steps']['positional_encoding'];
  tokens: string[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          每个 token 的位置编号（pos）会被加到向量上
        </div>
        <div className="flex flex-wrap gap-1.5 items-center">
          {tokens.map((tok, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-serif text-sm px-2 py-1 rounded bg-cream-100 border border-ink/15">
                {tok}
              </span>
              <span className="text-[10px] text-ember-dark font-mono mt-1">pos = {data.positions[i]}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">
        ※ Transformer 本身不区分词序——位置编码就是给每个位置加一个独特"指纹"，让模型分得清"我打你"和"你打我"。
      </p>
    </div>
  );
}

// ==================== 04 · Transformer ====================

export function TransformerViz({ data }: { data: PipelineData['steps']['transformer'] }) {
  const max = Math.max(...data.attention_sample.weights.map((w) => w.w));
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 text-[11px] text-text-muted">
        <span>层数：<strong className="text-text font-mono">{data.layers}</strong></span>
        <span>注意力头：<strong className="text-text font-mono">{data.heads}</strong></span>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          token "{data.attention_sample.from_token}" 的注意力权重（看向哪些上文）
        </div>
        <div className="space-y-1.5">
          {data.attention_sample.weights.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-serif text-sm w-12 shrink-0">{w.to}</span>
              <div className="flex-1 h-4 bg-cream-100 rounded overflow-hidden">
                <div
                  className="h-full bg-ink rounded"
                  style={{ width: `${(w.w / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-text-muted w-10 text-right">
                {(w.w * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">
        ※ 这是 N 层 × N 头平均后的简化版。真实模型每一层每个头都有独立的注意力分布，能从不同角度同时关注上下文。
      </p>
    </div>
  );
}

// ==================== 05 · 输出层 / Logits ====================

export function LogitsViz({ data }: { data: PipelineData['steps']['logits_top'] }) {
  const max = Math.max(...data.map((d) => d.prob));
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          模型输出的 top 5 候选词概率
        </div>
        <div className="space-y-1.5">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-serif text-sm w-14 shrink-0 truncate">{d.token}</span>
              <div className="flex-1 h-4 bg-cream-100 rounded overflow-hidden">
                <div
                  className="h-full bg-ember rounded"
                  style={{ width: `${(d.prob / max) * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-text-muted w-12 text-right">
                {(d.prob * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">
        ※ 完整词表有数万到十几万个 token，这里只显示概率最高的 5 个。
      </p>
    </div>
  );
}

// ==================== 06 · Sampling ====================

export function SamplingViz({ data }: { data: PipelineData['steps']['sampling'] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 rounded-lg bg-ember/10 border-2 border-dashed border-ember/30">
        <span className="text-2xl">🎲</span>
        <div className="flex-1">
          <div className="text-[11px] uppercase tracking-wider text-text-muted">采样结果</div>
          <div className="font-serif text-xl text-ember-dark">{data.selected_token}</div>
        </div>
        <div className="text-[10px] text-text-muted text-right">
          策略<br />
          <span className="font-mono text-text">{data.method}</span>
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">
        ※ 采样策略（temperature / top-k / top-p）决定从概率分布里怎么挑——这里用 greedy 永远选概率最高的那个。
      </p>
    </div>
  );
}

// ==================== 07 · Detokenization ====================

export function DetokenizationViz({
  data,
  prompt,
}: {
  data: PipelineData['steps']['detokenization'];
  prompt: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1.5">
          token id → 文字 → 接回输入
        </div>
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10 font-serif text-base leading-relaxed">
          <span className="text-text-muted">{prompt}</span>
          <span className="text-ember font-bold mx-0.5">{data.decoded_text}</span>
          {data.will_loop && (
            <span className="text-text-muted/40 ml-1">→ 再来一遍预测下一个…</span>
          )}
        </div>
      </div>
      <p className="text-[11px] text-text-muted/80">
        ※ 模型一次只生成一个 token；要写一段话，就把生成的 token 接回输入末尾、再走一遍这 7 步——直到遇到结束 token 或达到 max_tokens。
      </p>
    </div>
  );
}
