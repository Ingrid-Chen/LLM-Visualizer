'use client';

import { useT } from '@/lib/i18n/LangContext';

export default function OverviewDiagram() {
  const t = useT();
  return (
    <div className="space-y-5">
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-5">
        <svg viewBox="0 0 700 130" className="w-full h-auto">
          <defs>
            <marker id="ovArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
            </marker>
          </defs>

          <g>
            <rect x={20} y={40} width={100} height={50} rx={8} fill="#F5EFE2" stroke="#6B5F50" strokeWidth={1.5} />
            <text x={70} y={65} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#1F1A14" fontWeight={600}>{t('transformer.comp.overview.boxInput')}</text>
            <text x={70} y={82} textAnchor="middle" fontSize="10" fill="#6B5F50">{t('transformer.comp.overview.boxInputSub')}</text>
          </g>
          <line x1={120} y1={65} x2={170} y2={65} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#ovArrow)" />

          <g>
            <rect x={170} y={30} width={170} height={70} rx={10} fill="#FFF7ED" stroke="#D97742" strokeWidth={2.5} />
            <text x={255} y={55} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#B85A2A" fontWeight={700}>{t('transformer.comp.overview.boxAttn')}</text>
            <text x={255} y={72} textAnchor="middle" fontSize="11" fill="#6B5F50">{t('transformer.comp.overview.boxAttnSub')}</text>
            <text x={255} y={88} textAnchor="middle" fontSize="10" fill="#9C9183" fontStyle="italic">{t('transformer.comp.overview.boxAttnExample')}</text>
          </g>
          <line x1={340} y1={65} x2={390} y2={65} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#ovArrow)" />

          <g>
            <rect x={390} y={30} width={170} height={70} rx={10} fill="#F0F7F2" stroke="#2C5142" strokeWidth={2.5} />
            <text x={475} y={55} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#1F3B30" fontWeight={700}>{t('transformer.comp.overview.boxFFN')}</text>
            <text x={475} y={72} textAnchor="middle" fontSize="11" fill="#6B5F50">{t('transformer.comp.overview.boxFFNSub')}</text>
            <text x={475} y={88} textAnchor="middle" fontSize="10" fill="#9C9183" fontStyle="italic">{t('transformer.comp.overview.boxFFNExample')}</text>
          </g>
          <line x1={560} y1={65} x2={610} y2={65} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#ovArrow)" />

          <g>
            <rect x={610} y={40} width={70} height={50} rx={8} fill="#F5EFE2" stroke="#6B5F50" strokeWidth={1.5} />
            <text x={645} y={65} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#1F1A14" fontWeight={600}>{t('transformer.comp.overview.boxOutput')}</text>
            <text x={645} y={82} textAnchor="middle" fontSize="10" fill="#6B5F50">{t('transformer.comp.overview.boxOutputSub')}</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-5">
          <div className="mb-3">
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium tracking-wider mb-2">{t('transformer.comp.overview.step1Label')}</span>
            <h3 className="font-serif text-xl text-ember-dark leading-tight">{t('transformer.comp.overview.step1Title')}</h3>
            <p className="text-sm text-ember-dark/80 mt-1">{t('transformer.comp.overview.step1Sub')}</p>
          </div>
          <p className="text-sm text-text-muted leading-relaxed mb-2">{t('transformer.comp.overview.step1Body')}</p>
          <p className="text-xs text-text-muted/80 italic">{t('transformer.comp.overview.step1Hint')}</p>
        </div>

        <div className="rounded-lg border-2 border-ink/30 bg-ink/5 p-5">
          <div className="mb-3">
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-ink text-cream-50 font-medium tracking-wider mb-2">{t('transformer.comp.overview.step2Label')}</span>
            <h3 className="font-serif text-xl text-ink-dark leading-tight">{t('transformer.comp.overview.step2Title')}</h3>
            <p className="text-sm text-ink-dark/80 mt-1">{t('transformer.comp.overview.step2Sub')}</p>
          </div>
          <p className="text-sm text-text-muted leading-relaxed mb-2">{t('transformer.comp.overview.step2Body')}</p>
          <p className="text-xs text-text-muted/80 italic">{t('transformer.comp.overview.step2Hint')}</p>
        </div>
      </div>

      <div className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        {t('transformer.comp.overview.stackHint')}
      </div>
    </div>
  );
}
