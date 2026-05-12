'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

// demo tokens / weights 保持原数据（mock 数据）
const TOKENS = ['Lucy', '把', '书', '放在', '桌上', '因为', '她', '累', '了'];
const WEIGHTS = [0.65, 0.02, 0.05, 0.05, 0.02, 0.07, 0, 0.1, 0.04];
const FROM_IDX = 6;

const STEP_COUNT = 4;

const W = 720;
const H = 320;
const TOK_W = 60;
const TOK_H = 36;
const TOK_Y = 130;
const N = TOKENS.length;
const X = (i: number) => 50 + i * ((W - 100) / (N - 1));

export default function QKVWalkthrough() {
  const t = useT();
  const [step, setStep] = useState(0);

  const fromX = X(FROM_IDX);
  const fromTopY = TOK_Y;
  const maxW = Math.max(...WEIGHTS);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={[
              'text-left px-3 py-2 rounded-lg border-2 transition-all',
              step === i
                ? 'border-ember bg-ember/10 shadow-[2px_3px_0_rgba(217,119,66,0.18)]'
                : i < step
                  ? 'border-ink/30 bg-cream-50 text-text-muted'
                  : 'border-ink/15 bg-cream-50 text-text-muted/60 hover:border-ink/40',
            ].join(' ')}
          >
            <div className={['text-xs font-medium', step === i ? 'text-ember-dark' : 'text-text'].join(' ')}>
              {t(`transformer.comp.qkvWalkthrough.steps.${i}.label`)}
            </div>
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-ember/5 border border-ember/30 p-3 text-sm text-text leading-relaxed">
        {t(`transformer.comp.qkvWalkthrough.steps.${step}.explainer`)}
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-3 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: '600px' }}>
          {step >= 2 &&
            WEIGHTS.map((w, j) => {
              if (j === FROM_IDX || w < 0.01) return null;
              const x2 = X(j);
              const y2 = TOK_Y + TOK_H / 2;
              const opacity = Math.max(0.15, w / maxW);
              const strokeW = 1 + (w / maxW) * 6;
              return (
                <line
                  key={`line-${j}`}
                  x1={fromX}
                  y1={fromTopY + TOK_H / 2}
                  x2={x2}
                  y2={y2}
                  stroke="#D97742"
                  strokeWidth={strokeW}
                  strokeOpacity={opacity}
                />
              );
            })}

          {step === 3 && (
            <circle cx={fromX} cy={fromTopY + TOK_H / 2} r={32} fill="none" stroke="#D97742" strokeWidth={2} strokeDasharray="4 3" opacity={0.6}>
              <animate attributeName="r" from="32" to="42" dur="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.6" to="0.2" dur="1.5s" repeatCount="indefinite" />
            </circle>
          )}

          {step >= 0 && (
            <g>
              <rect x={fromX - 30} y={50} width={60} height={36} rx={6} fill="#DBEAFE" stroke="#1E40AF" strokeWidth={1.5} />
              <text x={fromX} y={64} textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight={700} fill="#1E40AF">
                {t('transformer.comp.qkvWalkthrough.qBubbleQ')}
              </text>
              <text x={fromX} y={78} textAnchor="middle" fontSize="9" fill="#1E3A8A">
                {t('transformer.comp.qkvWalkthrough.qBubbleHint')}
              </text>
              <line x1={fromX} y1={86} x2={fromX} y2={TOK_Y - 2} stroke="#1E40AF" strokeWidth={1} strokeDasharray="2 2" />
            </g>
          )}

          {TOKENS.map((tok, i) => {
            const isFrom = i === FROM_IDX;
            const isHighWeight = step >= 2 && i !== FROM_IDX && WEIGHTS[i] > 0.3;
            const fill = isFrom ? '#D97742' : isHighWeight ? '#FFF7ED' : '#FBF8F1';
            const stroke = isFrom ? '#B85A2A' : isHighWeight ? '#D97742' : '#9C9183';
            const strokeWidth = isFrom || isHighWeight ? 2 : 1;
            const textColor = isFrom ? '#FBF8F1' : '#1F1A14';
            return (
              <g key={`tok-${i}`}>
                <rect x={X(i) - TOK_W / 2} y={TOK_Y} width={TOK_W} height={TOK_H} rx={6} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
                <text x={X(i)} y={TOK_Y + 23} textAnchor="middle" fontSize="14" fontFamily="serif" fontWeight={isFrom ? 700 : 500} fill={textColor}>
                  {tok}
                </text>
              </g>
            );
          })}

          {step >= 1 &&
            TOKENS.map((_, i) => (
              <g key={`k-${i}`}>
                <rect x={X(i) - TOK_W / 2 + 4} y={TOK_Y + TOK_H + 8} width={TOK_W - 8} height={20} rx={4} fill="#D1FAE5" stroke="#047857" strokeWidth={1} />
                <text x={X(i)} y={TOK_Y + TOK_H + 22} textAnchor="middle" fontSize="9" fontFamily="monospace" fontWeight={600} fill="#065F46">
                  {t('transformer.comp.qkvWalkthrough.kPrefix')} {t(`transformer.comp.qkvWalkthrough.kLabels.${i}`)}
                </text>
              </g>
            ))}

          {step >= 2 &&
            WEIGHTS.map((w, i) => {
              if (i === FROM_IDX || w < 0.01) return null;
              const isTop = w > 0.3;
              return (
                <text
                  key={`w-${i}`}
                  x={X(i)}
                  y={TOK_Y + TOK_H + 50}
                  textAnchor="middle"
                  fontSize={isTop ? 12 : 10}
                  fontFamily="monospace"
                  fontWeight={isTop ? 700 : 500}
                  fill={isTop ? '#B85A2A' : '#6B5F50'}
                >
                  {(w * 100).toFixed(0)}%
                </text>
              );
            })}

          {step === 3 && (
            <g>
              <rect x={fromX - 130} y={TOK_Y + TOK_H + 68} width={260} height={42} rx={6} fill="#FFF7ED" stroke="#D97742" strokeWidth={1.5} />
              <text x={fromX} y={TOK_Y + TOK_H + 83} textAnchor="middle" fontSize="10" fontFamily="serif" fill="#B85A2A" fontWeight={600}>
                {t('transformer.comp.qkvWalkthrough.outputBoxLine1')}
              </text>
              <text x={fromX} y={TOK_Y + TOK_H + 100} textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#1F1A14">
                {t('transformer.comp.qkvWalkthrough.outputBoxLine2')}
              </text>
            </g>
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-secondary text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('transformer.comp.qkvWalkthrough.prevStep')}
        </button>
        <span className="text-xs text-text-muted font-mono">
          {t('transformer.comp.qkvWalkthrough.progress', { current: step + 1, total: STEP_COUNT })}
        </span>
        <button
          onClick={() => setStep((s) => Math.min(STEP_COUNT - 1, s + 1))}
          disabled={step === STEP_COUNT - 1}
          className="btn-primary text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t('transformer.comp.qkvWalkthrough.nextStep')}
        </button>
      </div>

      <p className="text-[11px] text-text-muted/80 italic">
        {t('transformer.comp.qkvWalkthrough.caveatStart')}
        <a href="#" className="underline-offset-2 hover:underline">{t('transformer.comp.qkvWalkthrough.caveatLink')}</a>
        {t('transformer.comp.qkvWalkthrough.caveatEnd')}
      </p>
    </div>
  );
}
