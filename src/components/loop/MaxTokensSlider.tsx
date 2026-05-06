'use client';

import { useState } from 'react';

// max_tokens 截断演示：滑块控制生成长度，超出位置淡色 + 截断标记

const FULL_OUTPUT = ['中国', '的', '首都', '是', '北京', '，', '是', '一', '座', '历史', '悠久', '的', '古都', '。'];

export default function MaxTokensSlider() {
  const [maxTokens, setMaxTokens] = useState(6);

  const generated = FULL_OUTPUT.slice(0, maxTokens);
  const truncated = FULL_OUTPUT.slice(maxTokens);
  const isCutoff = maxTokens < FULL_OUTPUT.length;
  const cutoffMidSentence = isCutoff && !['。', '！', '？'].includes(FULL_OUTPUT[maxTokens - 1] ?? '');

  return (
    <div className="space-y-4">
      {/* 滑块 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="flex items-baseline justify-between mb-2">
          <label className="text-xs uppercase tracking-wider text-text-muted">max_tokens（最大输出 token 数）</label>
          <span className="font-mono text-2xl font-bold text-ember-dark">{maxTokens}</span>
        </div>
        <input
          type="range"
          min={1}
          max={FULL_OUTPUT.length}
          step={1}
          value={maxTokens}
          onChange={(e) => setMaxTokens(Number(e.target.value))}
          className="w-full accent-ink"
        />
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          <span>1 token</span>
          <span>{FULL_OUTPUT.length} token（完整输出）</span>
        </div>
      </div>

      {/* 输出展示 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">实际返回给用户的输出</div>
        <p className="font-serif text-lg leading-relaxed">
          {/* 已生成部分 */}
          {generated.map((tok, i) => (
            <span key={i} className="text-ink-dark">
              {tok}
            </span>
          ))}
          {/* 截断标记 */}
          {isCutoff && (
            <span className="inline-flex items-center mx-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-rose-100 text-rose-800 border border-rose-300 align-middle font-mono">
              ⚠️ 截断
            </span>
          )}
          {/* 被截断的"本应有但没了"的部分 */}
          {isCutoff &&
            truncated.map((tok, i) => (
              <span key={i} className="text-text-muted/30 line-through">
                {tok}
              </span>
            ))}
        </p>
        <p className="text-[11px] text-text-muted mt-3 leading-relaxed">
          {!isCutoff
            ? '✓ 模型完整输出（生成到结束）。'
            : cutoffMidSentence
              ? '⚠️ 模型在句子中间被强行截断——产品里这种"突然结束"是常见 bug。设置时要预留余量。'
              : '⚠️ max_tokens 用完了——但好在停在标点符号附近，体感不算太突兀。'}
        </p>
      </div>

      {/* 解读 + caveat（紧凑） */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 <strong className="text-text">max_tokens</strong> 是 API 调用的硬限制——模型生成到这个数就被强制停止，不管句子讲完没。
        这是产品里"半句话 bug"的元凶：设太小 → 句子中间硬切；设太大 → 占 context、偶尔模型会"凑字数"。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        ※ 实战：留 1.5-2x 估计长度的余量；后端检测 <span className="font-mono">finish_reason === 'length'</span> 时给用户友好提示（比如"回答较长，发送'继续'"）。
      </p>
    </div>
  );
}
