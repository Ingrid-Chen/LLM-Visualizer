'use client';

import FFNFlowViz from './FFNFlowViz';
import { useT } from '@/lib/i18n/LangContext';

export default function FFNCard() {
  const t = useT();
  return (
    <div className="space-y-4">
      <FFNFlowViz />

      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">{t('transformer.comp.ffnCard.structureLabel')}</div>
        <p className="text-sm text-text-muted leading-relaxed">{t('transformer.comp.ffnCard.structureBody')}</p>
      </div>

      <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium">{t('transformer.comp.ffnCard.mainstreamBadge')}</span>
          <span className="text-[10px] text-text-muted">{t('transformer.comp.ffnCard.debateBadge')}</span>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">{t('transformer.comp.ffnCard.mainstreamBody')}</p>
        <p className="text-[11px] text-text-muted/80 leading-relaxed border-t border-ember/20 pt-2 mt-2">
          {t('transformer.comp.ffnCard.caveat')}
        </p>
      </div>
    </div>
  );
}
