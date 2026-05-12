'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

type NormStyle = 'pre' | 'post';

const PRE_NORM_FLOW = `x
↓
y₁ = LN(x)             // normalize first
↓
a = Attention(y₁)      // then attention
↓
x' = x + a             // residual added back
↓
y₂ = LN(x')
↓
f = FFN(y₂)
↓
output = x' + f`;

const POST_NORM_FLOW = `x
↓
a = Attention(x)       // attention first
↓
x' = LN(x + a)         // residual + normalize
↓
f = FFN(x')
↓
output = LN(x' + f)`;

const PRE_NORM_FLOW_CN = `x
↓
y₁ = LN(x)             // 先归一化
↓
a = Attention(y₁)      // 再做 attention
↓
x' = x + a             // 残差加回去
↓
y₂ = LN(x')
↓
f = FFN(y₂)
↓
输出 = x' + f`;

const POST_NORM_FLOW_CN = `x
↓
a = Attention(x)       // 先做 attention
↓
x' = LN(x + a)         // 残差 + 归一化
↓
f = FFN(x')
↓
输出 = LN(x' + f)`;

export default function TransformerBlockDiagram() {
  const t = useT();
  const [normStyle, setNormStyle] = useState<NormStyle>('pre');

  // Pick the localized flow string based on output node label (a simple way to detect lang)
  const isZh = t('transformer.comp.blockDiagram.nodeOutput') === '输出';
  const flowText = normStyle === 'pre' ? (isZh ? PRE_NORM_FLOW_CN : PRE_NORM_FLOW) : (isZh ? POST_NORM_FLOW_CN : POST_NORM_FLOW);

  return (
    <div className="space-y-5">
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">{t('transformer.comp.blockDiagram.normStyleLabel')}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => setNormStyle('pre')}
            className={[
              'text-left p-3 rounded-lg border-2 transition-all',
              normStyle === 'pre' ? 'border-ink bg-cream-100 shadow-[2px_3px_0_rgba(44,81,66,0.15)]' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            <div className="font-medium text-sm text-text">{t('transformer.comp.blockDiagram.preNormTitle')}</div>
            <div className="text-[11px] text-text-muted mt-0.5">{t('transformer.comp.blockDiagram.preNormSub')}</div>
          </button>
          <button
            onClick={() => setNormStyle('post')}
            className={[
              'text-left p-3 rounded-lg border-2 transition-all',
              normStyle === 'post' ? 'border-ink bg-cream-100 shadow-[2px_3px_0_rgba(44,81,66,0.15)]' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            <div className="font-medium text-sm text-text">{t('transformer.comp.blockDiagram.postNormTitle')}</div>
            <div className="text-[11px] text-text-muted mt-0.5">{t('transformer.comp.blockDiagram.postNormSub')}</div>
          </button>
        </div>
      </div>

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 sm:p-5">
        <div className="text-sm text-text-muted text-center mb-3">
          <strong className="text-text">{t('transformer.comp.blockDiagram.introBold')}</strong>{' '}
          {t('transformer.comp.blockDiagram.introMid')}
        </div>
        <div className="flex justify-center mb-5">
          <BlockSvg normStyle={normStyle} />
        </div>

        <div className="rounded-lg bg-cream-100 border border-ink/10 p-3">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
            {t('transformer.comp.blockDiagram.flowHeading', { mode: normStyle === 'pre' ? 'Pre-Norm' : 'Post-Norm' })}
          </div>
          <p className="font-mono text-[11px] text-text leading-relaxed whitespace-pre-line">{flowText}</p>
        </div>
      </div>

      <div className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded p-3 space-y-1.5">
        <p>{t('transformer.comp.blockDiagram.summary1')}</p>
        <p className="text-[11px] text-text-muted/80 italic">{t('transformer.comp.blockDiagram.summary2')}</p>
      </div>
    </div>
  );
}

const W = 220;

function BlockSvg({ normStyle }: { normStyle: NormStyle }) {
  const isPre = normStyle === 'pre';
  const H = isPre ? 420 : 380;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-[220px] h-auto" style={{ maxHeight: '440px' }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
        </marker>
      </defs>
      {isPre ? <PreNormDiagram /> : <PostNormDiagram />}
    </svg>
  );
}

function Node({
  x,
  y,
  w,
  h,
  label,
  sub,
  variant,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  variant?: 'norm' | 'main' | 'add' | 'io';
}) {
  const colorMap: Record<string, { fill: string; stroke: string }> = {
    norm: { fill: '#FBF8F1', stroke: '#5A8170' },
    main: { fill: '#FBF8F1', stroke: '#2C5142' },
    add: { fill: '#FFF7ED', stroke: '#D97742' },
    io: { fill: '#F5EFE2', stroke: '#6B5F50' },
  };
  const v = variant ?? 'main';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8} fill={colorMap[v].fill} stroke={colorMap[v].stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 4)} textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight="600" fill="#1F1A14">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" fontSize="10" fill="#6B5F50">
          {sub}
        </text>
      )}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#arrow)" />;
}

function ResidualPath({
  fromX,
  fromY,
  toX,
  toY,
  rightX,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  rightX: number;
}) {
  const t = useT();
  return (
    <g>
      <path d={`M ${fromX} ${fromY} L ${rightX} ${fromY} L ${rightX} ${toY} L ${toX} ${toY}`} fill="none" stroke="#D97742" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arrow)" />
      <text x={rightX + 4} y={(fromY + toY) / 2} fontSize="9" fill="#D97742" fontWeight="600">
        {t('transformer.comp.blockDiagram.residualLabel')}
      </text>
    </g>
  );
}

function PreNormDiagram() {
  const t = useT();
  const cx = 30;
  const w = 130;
  const right = cx + w + 30;
  return (
    <>
      <Node x={cx} y={10} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeInput')} variant="io" />
      <ResidualPath fromX={cx + w / 2} fromY={38} toX={cx + w / 2} toY={167} rightX={right} />
      <Arrow x1={cx + w / 2} y1={38} x2={cx + w / 2} y2={50} />
      <Node x={cx} y={50} w={w} h={32} label={t('transformer.comp.blockDiagram.nodeLayerNorm')} variant="norm" />
      <Arrow x1={cx + w / 2} y1={82} x2={cx + w / 2} y2={94} />
      <Node x={cx} y={94} w={w} h={50} label={t('transformer.comp.blockDiagram.nodeAttention')} sub="Q · K · V" variant="main" />
      <Arrow x1={cx + w / 2} y1={144} x2={cx + w / 2} y2={156} />
      <Node x={cx} y={156} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeAdd')} sub={t('transformer.comp.blockDiagram.nodeAddAttnSubPre')} variant="add" />

      <ResidualPath fromX={cx + w / 2} fromY={184} toX={cx + w / 2} toY={313} rightX={right} />
      <Arrow x1={cx + w / 2} y1={184} x2={cx + w / 2} y2={196} />
      <Node x={cx} y={196} w={w} h={32} label={t('transformer.comp.blockDiagram.nodeLayerNorm')} variant="norm" />
      <Arrow x1={cx + w / 2} y1={228} x2={cx + w / 2} y2={240} />
      <Node x={cx} y={240} w={w} h={50} label={t('transformer.comp.blockDiagram.nodeFFN')} sub="W₂·ReLU(W₁·x)" variant="main" />
      <Arrow x1={cx + w / 2} y1={290} x2={cx + w / 2} y2={302} />
      <Node x={cx} y={302} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeAdd')} sub={t('transformer.comp.blockDiagram.nodeAddFFNSubPre')} variant="add" />

      <Arrow x1={cx + w / 2} y1={330} x2={cx + w / 2} y2={342} />
      <Node x={cx} y={342} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeOutput')} variant="io" />
    </>
  );
}

function PostNormDiagram() {
  const t = useT();
  const cx = 30;
  const w = 130;
  const right = cx + w + 30;
  return (
    <>
      <Node x={cx} y={10} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeInput')} variant="io" />
      <ResidualPath fromX={cx + w / 2} fromY={38} toX={cx + w / 2} toY={123} rightX={right} />
      <Arrow x1={cx + w / 2} y1={38} x2={cx + w / 2} y2={50} />
      <Node x={cx} y={50} w={w} h={50} label={t('transformer.comp.blockDiagram.nodeAttention')} sub="Q · K · V" variant="main" />
      <Arrow x1={cx + w / 2} y1={100} x2={cx + w / 2} y2={112} />
      <Node x={cx} y={112} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeAdd')} sub={t('transformer.comp.blockDiagram.nodeAddAttnSubPost')} variant="add" />
      <Arrow x1={cx + w / 2} y1={140} x2={cx + w / 2} y2={152} />
      <Node x={cx} y={152} w={w} h={32} label={t('transformer.comp.blockDiagram.nodeLayerNorm')} variant="norm" />

      <ResidualPath fromX={cx + w / 2} fromY={184} toX={cx + w / 2} toY={269} rightX={right} />
      <Arrow x1={cx + w / 2} y1={184} x2={cx + w / 2} y2={196} />
      <Node x={cx} y={196} w={w} h={50} label={t('transformer.comp.blockDiagram.nodeFFN')} sub="W₂·ReLU(W₁·x)" variant="main" />
      <Arrow x1={cx + w / 2} y1={246} x2={cx + w / 2} y2={258} />
      <Node x={cx} y={258} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeAdd')} sub={t('transformer.comp.blockDiagram.nodeAddFFNSubPost')} variant="add" />
      <Arrow x1={cx + w / 2} y1={286} x2={cx + w / 2} y2={298} />
      <Node x={cx} y={298} w={w} h={32} label={t('transformer.comp.blockDiagram.nodeLayerNorm')} variant="norm" />

      <Arrow x1={cx + w / 2} y1={330} x2={cx + w / 2} y2={342} />
      <Node x={cx} y={342} w={w} h={28} label={t('transformer.comp.blockDiagram.nodeOutput')} variant="io" />
    </>
  );
}
