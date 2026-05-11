'use client';

import { useT } from '@/lib/i18n/LangContext';

const HEAD_COLORS = [
  { color: '#1E40AF', bg: '#DBEAFE' },
  { color: '#047857', bg: '#D1FAE5' },
  { color: '#B85A2A', bg: '#FFF7ED' },
  { color: '#A16207', bg: '#FEF3C7' },
];

export default function MultiHeadFlowViz() {
  const t = useT();
  const W = 720;
  const H = 380;

  const headW = 150;
  const headH = 90;
  const headY = 30;
  const spacing = (W - headW * HEAD_COLORS.length) / (HEAD_COLORS.length + 1);
  const headXs = HEAD_COLORS.map((_, i) => spacing + i * (headW + spacing));

  const concatY = 175;
  const concatW = 280;
  const concatH = 40;
  const concatX = (W - concatW) / 2;

  const woY = 250;
  const woW = 200;
  const woH = 40;
  const woX = (W - woW) / 2;

  const outY = 320;
  const outW = 160;
  const outH = 36;
  const outX = (W - outW) / 2;

  return (
    <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: '600px' }}>
        <defs>
          <marker id="mh-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#6B5F50" />
          </marker>
        </defs>

        {HEAD_COLORS.map((h, i) => {
          const x = headXs[i];
          return (
            <g key={i}>
              <rect x={x} y={headY} width={headW} height={headH} rx={8} fill={h.bg} stroke={h.color} strokeWidth={2} />
              <text x={x + headW / 2} y={headY + 22} textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight={700} fill={h.color}>
                Head {i + 1}
              </text>
              <text x={x + headW / 2} y={headY + 40} textAnchor="middle" fontSize="10" fontFamily="monospace" fill={h.color} opacity={0.85}>
                Wq · Wk · Wv
              </text>
              <line x1={x + 12} y1={headY + 50} x2={x + headW - 12} y2={headY + 50} stroke={h.color} opacity={0.3} />
              <text x={x + headW / 2} y={headY + 65} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#1F1A14">
                {t('transformer.comp.multiHead.headFocusPrefix')} {t(`transformer.comp.multiHead.heads.${i}.focus`)}
              </text>
              <text x={x + headW / 2} y={headY + 80} textAnchor="middle" fontSize="10" fill="#6B5F50" fontStyle="italic">
                {t(`transformer.comp.multiHead.heads.${i}.example`)}
              </text>
            </g>
          );
        })}

        {HEAD_COLORS.map((_, i) => {
          const fromX = headXs[i] + headW / 2;
          const fromY = headY + headH;
          const toX = concatX + ((i + 0.5) * concatW) / HEAD_COLORS.length;
          const toY = concatY;
          return <line key={`line-${i}`} x1={fromX} y1={fromY} x2={toX} y2={toY} stroke="#6B5F50" strokeWidth={1.2} markerEnd="url(#mh-arrow)" />;
        })}

        <rect x={concatX} y={concatY} width={concatW} height={concatH} rx={6} fill="#F5EFE2" stroke="#6B5F50" strokeWidth={1.5} />
        <text x={W / 2} y={concatY + 25} textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight={600} fill="#1F1A14">
          {t('transformer.comp.multiHead.concatLabel')}
        </text>

        <line x1={W / 2} y1={concatY + concatH} x2={W / 2} y2={woY} stroke="#6B5F50" strokeWidth={1.5} markerEnd="url(#mh-arrow)" />

        <rect x={woX} y={woY} width={woW} height={woH} rx={6} fill="#EDE9FE" stroke="#7C3AED" strokeWidth={2.5} />
        <text x={W / 2} y={woY + 18} textAnchor="middle" fontSize="14" fontFamily="serif" fontWeight={700} fill="#5B21B6">
          {t('transformer.comp.multiHead.woLabel')}
        </text>
        <text x={W / 2} y={woY + 33} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#5B21B6">
          {t('transformer.comp.multiHead.woSub')}
        </text>

        <line x1={W / 2} y1={woY + woH} x2={W / 2} y2={outY} stroke="#6B5F50" strokeWidth={1.5} markerEnd="url(#mh-arrow)" />

        <rect x={outX} y={outY} width={outW} height={outH} rx={6} fill="#FFF7ED" stroke="#D97742" strokeWidth={2} />
        <text x={W / 2} y={outY + 23} textAnchor="middle" fontSize="14" fontFamily="serif" fontWeight={700} fill="#B85A2A">
          {t('transformer.comp.multiHead.outputLabel')}
        </text>
      </svg>
    </div>
  );
}
