'use client';

import { useState } from 'react';

interface Props {
  temperature: number;
  topK: number | null;
  topP: number;
  disabled: boolean; // 演示模式下整体禁用
  onTemperatureChange: (v: number) => void;
  onTopKChange: (v: number | null) => void;
  onTopPChange: (v: number) => void;
}

const PARAM_HELP = {
  temperature: {
    short: '调整概率分布的"形状"',
    long: '低温 = 锐化分布，模型几乎一定挑 top-1（输出确定、刻板）；高温 = 拉平分布，让低概率的词也有机会（输出更随机、有创意，但也更易胡说）。数学上是 softmax 里的一个除数。',
  },
  topP: {
    short: '动态截断尾部概率（核采样）',
    long: '把候选词按概率从高到低排，累加直到超过 p。p=0.9 就是只在覆盖 90% 概率的那批词里挑。分布越确定，被保留的词越少；分布越平，被保留的词越多。',
  },
  topK: {
    short: '硬性只保留前 k 个候选词',
    long: '不管分布形态如何，固定砍一刀只留 k 个。简单但不"自适应"——同样 top-k=5，在高确定性场景可能浪费、在低确定性场景可能太严苛。多数场景用 top-p 更鲁棒。',
  },
};

// 参数控制面板：水平 3 列布局，嵌在 stage 内
export default function ParamControls({
  temperature,
  topK,
  topP,
  disabled,
  onTemperatureChange,
  onTopKChange,
  onTopPChange,
}: Props) {
  return (
    <div className={disabled ? 'opacity-60' : ''}>
      {disabled && (
        <p className="text-sm text-ember-dark bg-ember/10 px-3 py-2 rounded leading-relaxed mb-4">
          🔒 演示模式：温度等参数已被冻结。第二步起按预生成的 greedy 路径展示真实分布。点"重置"可回到第一步重新调参。
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <ParamBlock label="Temperature（温度）" help={PARAM_HELP.temperature}>
          <Slider
            value={temperature}
            min={0}
            max={2}
            step={0.05}
            disabled={disabled}
            onChange={onTemperatureChange}
            marks={[
              { value: 0.2, label: '0.2 保守' },
              { value: 1.0, label: '1.0 默认' },
              { value: 1.5, label: '1.5 创意' },
            ]}
            format={(v) => v.toFixed(2)}
          />
        </ParamBlock>

        <ParamBlock label="Top-p（核采样）" help={PARAM_HELP.topP}>
          <Slider
            value={topP}
            min={0.1}
            max={1.0}
            step={0.05}
            disabled={disabled}
            onChange={onTopPChange}
            marks={[
              { value: 0.5, label: '0.5' },
              { value: 0.9, label: '0.9 常用' },
              { value: 1.0, label: '1.0 不启用' },
            ]}
            format={(v) => v.toFixed(2)}
          />
        </ParamBlock>

        <ParamBlock
          label="Top-k（候选数）"
          help={PARAM_HELP.topK}
          valueDisplay={topK === null ? '不启用' : `top ${topK}`}
        >
          <div className="flex flex-wrap gap-1.5">
            {[null, 1, 5, 10, 20].map((k) => (
              <button
                key={k === null ? 'off' : k}
                disabled={disabled}
                onClick={() => onTopKChange(k)}
                className={[
                  'px-2.5 py-1 text-xs rounded-full border transition-colors',
                  topK === k
                    ? 'border-ink bg-ink text-cream-50'
                    : 'border-ink/15 hover:border-ink-light bg-cream-50',
                  disabled ? 'cursor-not-allowed' : '',
                ].join(' ')}
              >
                {k === null ? '不启用' : `top ${k}`}
              </button>
            ))}
          </div>
        </ParamBlock>
      </div>
    </div>
  );
}

// ==================== ParamBlock（每列一个） ====================

interface ParamBlockProps {
  label: string;
  help: { short: string; long: string };
  valueDisplay?: string;
  children: React.ReactNode;
}

function ParamBlock({ label, help, valueDisplay, children }: ParamBlockProps) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between mb-0.5 gap-2">
        <label className="text-sm font-medium text-text">{label}</label>
        {valueDisplay !== undefined && <span className="text-xs text-text-muted font-mono">{valueDisplay}</span>}
      </div>
      <div className="flex items-start gap-1.5 mb-2.5">
        <p className="text-xs text-text-muted leading-relaxed flex-1 min-w-0">{help.short}</p>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-[11px] text-ink-light hover:text-ink transition-colors shrink-0 underline-offset-2 hover:underline"
          type="button"
        >
          {showDetail ? '收起' : '了解更多'}
        </button>
      </div>
      {showDetail && (
        <p className="text-[11px] text-text-muted bg-cream-100 border border-cream-200 rounded p-2 mb-3 leading-relaxed">
          {help.long}
        </p>
      )}
      {children}
    </div>
  );
}

// ==================== Slider ====================

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  marks?: { value: number; label: string }[];
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

function Slider({ value, min, max, step, disabled, marks, format, onChange }: SliderProps) {
  const display = format ? format(value) : String(value);
  return (
    <div>
      <div className="flex items-baseline justify-end mb-1">
        <span className="text-xs text-text-muted font-mono">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-ink disabled:cursor-not-allowed"
      />
      {marks && marks.length > 0 && (
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          {marks.map((m) => (
            <span key={m.value}>{m.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
