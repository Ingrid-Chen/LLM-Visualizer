'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

interface Props {
  temperature: number;
  topK: number | null;
  topP: number;
  disabled: boolean;
  onTemperatureChange: (v: number) => void;
  onTopKChange: (v: number | null) => void;
  onTopPChange: (v: number) => void;
}

export default function ParamControls({
  temperature,
  topK,
  topP,
  disabled,
  onTemperatureChange,
  onTopKChange,
  onTopPChange,
}: Props) {
  const t = useT();
  return (
    <div className={disabled ? 'opacity-60' : ''}>
      {disabled && (
        <p className="text-sm text-ember-dark bg-ember/10 px-3 py-2 rounded leading-relaxed mb-4">
          {t('sampling.components.paramControls.demoLock')}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        <ParamBlock
          label={t('sampling.components.paramControls.tempLabel')}
          shortHelp={t('sampling.components.paramControls.tempHelpShort')}
          longHelp={t('sampling.components.paramControls.tempHelpLong')}
        >
          <Slider
            value={temperature}
            min={0}
            max={2}
            step={0.05}
            disabled={disabled}
            onChange={onTemperatureChange}
            marks={[
              { value: 0.2, label: t('sampling.components.paramControls.tempMark0_2') },
              { value: 1.0, label: t('sampling.components.paramControls.tempMark1') },
              { value: 1.5, label: t('sampling.components.paramControls.tempMark1_5') },
            ]}
            format={(v) => v.toFixed(2)}
          />
        </ParamBlock>

        <ParamBlock
          label={t('sampling.components.paramControls.topPLabel')}
          shortHelp={t('sampling.components.paramControls.topPHelpShort')}
          longHelp={t('sampling.components.paramControls.topPHelpLong')}
        >
          <Slider
            value={topP}
            min={0.1}
            max={1.0}
            step={0.05}
            disabled={disabled}
            onChange={onTopPChange}
            marks={[
              { value: 0.5, label: t('sampling.components.paramControls.topPMark0_5') },
              { value: 0.9, label: t('sampling.components.paramControls.topPMark0_9') },
              { value: 1.0, label: t('sampling.components.paramControls.topPMark1') },
            ]}
            format={(v) => v.toFixed(2)}
          />
        </ParamBlock>

        <ParamBlock
          label={t('sampling.components.paramControls.topKLabel')}
          shortHelp={t('sampling.components.paramControls.topKHelpShort')}
          longHelp={t('sampling.components.paramControls.topKHelpLong')}
          valueDisplay={
            topK === null
              ? t('sampling.components.paramControls.topKOff')
              : `${t('sampling.components.paramControls.topKValueLabel')} ${topK}`
          }
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
                {k === null
                  ? t('sampling.components.paramControls.topKOff')
                  : `${t('sampling.components.paramControls.topKValueLabel')} ${k}`}
              </button>
            ))}
          </div>
        </ParamBlock>
      </div>
    </div>
  );
}

interface ParamBlockProps {
  label: string;
  shortHelp: string;
  longHelp: string;
  valueDisplay?: string;
  children: React.ReactNode;
}

function ParamBlock({ label, shortHelp, longHelp, valueDisplay, children }: ParamBlockProps) {
  const t = useT();
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between mb-0.5 gap-2">
        <label className="text-sm font-medium text-text">{label}</label>
        {valueDisplay !== undefined && <span className="text-xs text-text-muted font-mono">{valueDisplay}</span>}
      </div>
      <div className="flex items-start gap-1.5 mb-2.5">
        <p className="text-xs text-text-muted leading-relaxed flex-1 min-w-0">{shortHelp}</p>
        <button
          onClick={() => setShowDetail(!showDetail)}
          className="text-[11px] text-ink-light hover:text-ink transition-colors shrink-0 underline-offset-2 hover:underline"
          type="button"
        >
          {showDetail ? t('sampling.components.paramControls.showLess') : t('sampling.components.paramControls.showMore')}
        </button>
      </div>
      {showDetail && (
        <p className="text-[11px] text-text-muted bg-cream-100 border border-cream-200 rounded p-2 mb-3 leading-relaxed">
          {longHelp}
        </p>
      )}
      {children}
    </div>
  );
}

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
