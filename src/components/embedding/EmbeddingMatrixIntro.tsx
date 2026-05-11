'use client';

import Link from 'next/link';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';

const D_DEMO = 8;
// demo 词保持中文（属于演示数据）
const SAMPLE_TOKENS = [
  { name: '苹果', id: 12345, highlight: true },
  { name: '橘子', id: 18762 },
  { name: '北京', id: 16482 },
  { name: '今天', id: 21548 },
  { name: '猫', id: 35491 },
];

export default function EmbeddingMatrixIntro() {
  const t = useT();
  const lang = useLang();
  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 overflow-x-auto">
        <svg viewBox="0 0 760 280" className="w-full h-auto" style={{ minWidth: '600px' }}>
          <defs>
            <marker id="emi-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
            </marker>
          </defs>

          <g>
            <text x={60} y={30} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              {t('embedding.comp.matrixIntro.step1Label')}
            </text>
            <text x={60} y={45} textAnchor="middle" fontSize="9" fill="#6B5F50">
              {t('embedding.comp.matrixIntro.step1Sub')}
            </text>
            <rect x={20} y={55} width={80} height={36} rx={6} fill="#FFF7ED" stroke="#D97742" strokeWidth={2} />
            <text x={60} y={78} textAnchor="middle" fontSize="16" fontFamily="serif" fontWeight={700} fill="#B85A2A">
              苹果
            </text>
            <text x={60} y={108} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#6B5F50">
              token id = 12345
            </text>
            <text x={60} y={122} textAnchor="middle" fontSize="9" fill="#9C9183" fontStyle="italic">
              {t('embedding.comp.matrixIntro.rowHint')}
            </text>
          </g>

          <line x1={110} y1={75} x2={170} y2={75} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#emi-arrow)" />
          <text x={140} y={80} textAnchor="middle" fontSize="9" fill="#6B5F50">
            {t('embedding.comp.matrixIntro.arrowByRow')}
          </text>

          <g>
            <text x={310} y={30} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              {t('embedding.comp.matrixIntro.step2Label')}
            </text>
            <text x={310} y={45} textAnchor="middle" fontSize="9" fill="#6B5F50">
              {t('embedding.comp.matrixIntro.step2Sub')}
            </text>

            {SAMPLE_TOKENS.map((tok, row) => {
              const y = 60 + row * 30;
              return (
                <g key={tok.name}>
                  <text x={195} y={y + 16} textAnchor="end" fontSize="11" fontFamily="serif" fill={tok.highlight ? '#B85A2A' : '#6B5F50'} fontWeight={tok.highlight ? 700 : 400}>
                    {tok.name}
                  </text>
                  <text x={195} y={y + 28} textAnchor="end" fontSize="8" fontFamily="monospace" fill="#9C9183">
                    id={tok.id}
                  </text>
                  {tok.highlight && (
                    <rect x={205} y={y + 2} width={D_DEMO * 22 + 4} height={22} rx={4} fill="none" stroke="#D97742" strokeWidth={2.5} strokeDasharray="3 2" />
                  )}
                  {Array.from({ length: D_DEMO }).map((_, col) => {
                    const seed = row * 13 + col * 7 + tok.name.charCodeAt(0);
                    const v = Math.sin(seed * 0.4) * 0.6;
                    const intensity = Math.min(Math.abs(v), 1);
                    const fill = v >= 0
                      ? `rgba(44, 81, 66, ${0.15 + intensity * 0.6})`
                      : `rgba(217, 119, 66, ${0.15 + intensity * 0.6})`;
                    return (
                      <rect key={col} x={210 + col * 22} y={y + 5} width={18} height={16} rx={2} fill={fill} stroke="rgba(0,0,0,0.05)" strokeWidth={0.5} />
                    );
                  })}
                </g>
              );
            })}

            <text x={310} y={60 + SAMPLE_TOKENS.length * 30 + 12} textAnchor="middle" fontSize="9" fill="#9C9183" fontStyle="italic">
              {t('embedding.comp.matrixIntro.matrixVocabHint')}
            </text>
          </g>

          <line x1={420} y1={75} x2={490} y2={75} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#emi-arrow)" />
          <text x={455} y={68} textAnchor="middle" fontSize="9" fill="#6B5F50">
            {t('embedding.comp.matrixIntro.arrowFetch')}
          </text>

          <g>
            <text x={620} y={30} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#B85A2A">
              {t('embedding.comp.matrixIntro.step3Label')}
            </text>
            <text x={620} y={45} textAnchor="middle" fontSize="9" fill="#6B5F50">
              {t('embedding.comp.matrixIntro.step3Sub')}
            </text>
            {Array.from({ length: D_DEMO }).map((_, col) => {
              const seed = 0 * 13 + col * 7 + '苹果'.charCodeAt(0);
              const v = Math.sin(seed * 0.4) * 0.6;
              const intensity = Math.min(Math.abs(v), 1);
              const fill = v >= 0
                ? `rgba(44, 81, 66, ${0.15 + intensity * 0.7})`
                : `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
              return (
                <g key={col}>
                  <rect x={540 + col * 22} y={70} width={18} height={26} rx={3} fill={fill} stroke="#D97742" strokeWidth={1} />
                  <text x={549 + col * 22} y={87} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#FBF8F1" fontWeight={500}>
                    {v.toFixed(1)}
                  </text>
                </g>
              );
            })}
            <text x={620} y={120} textAnchor="middle" fontSize="9" fill="#6B5F50" fontStyle="italic">
              {t('embedding.comp.matrixIntro.step3Caption1')}
            </text>
            <text x={620} y={134} textAnchor="middle" fontSize="9" fill="#6B5F50" fontStyle="italic">
              {t('embedding.comp.matrixIntro.step3Caption2')}
            </text>
          </g>
        </svg>
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">
        {t('embedding.comp.matrixIntro.insightBody')}
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        {t('embedding.comp.matrixIntro.caveat')}
        <Link href={localizedHref(lang, '/logits')} className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
          {t('embedding.comp.matrixIntro.unembeddingLink')}
        </Link>
        {t('embedding.comp.matrixIntro.caveatEnd')}
      </p>
    </div>
  );
}
