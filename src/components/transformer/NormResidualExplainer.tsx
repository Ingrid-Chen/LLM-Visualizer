'use client';

import { useT } from '@/lib/i18n/LangContext';

export default function NormResidualExplainer() {
  const t = useT();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="rounded-lg border-2 border-ink/30 bg-cream-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink text-cream-50 font-medium tracking-wider">{t('transformer.comp.normResidual.layerNormBadge')}</span>
          <h3 className="font-serif text-lg text-ink-dark">{t('transformer.comp.normResidual.layerNormTitle')}</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">{t('transformer.comp.normResidual.layerNormWhatLabel')}</div>
            <p className="text-text-muted leading-relaxed">{t('transformer.comp.normResidual.layerNormWhatBody')}</p>
          </div>

          <div className="pt-2 border-t border-ink/10">
            <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium mb-1">{t('transformer.comp.normResidual.layerNormWhyLabel')}</div>
            <p className="text-text-muted leading-relaxed">{t('transformer.comp.normResidual.layerNormWhyBody')}</p>
            <p className="text-text leading-relaxed mt-2 font-medium">{t('transformer.comp.normResidual.layerNormImportant')}</p>
            <p className="text-[11px] text-text-muted/70 italic mt-2">{t('transformer.comp.normResidual.layerNormCaveat')}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border-2 border-ember/30 bg-cream-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium tracking-wider">{t('transformer.comp.normResidual.residualBadge')}</span>
          <h3 className="font-serif text-lg text-ember-dark">{t('transformer.comp.normResidual.residualTitle')}</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">{t('transformer.comp.normResidual.residualWhatLabel')}</div>
            <p className="text-text-muted leading-relaxed">{t('transformer.comp.normResidual.residualWhatBody')}</p>
          </div>

          <div className="pt-2 border-t border-ember/15">
            <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium mb-1">{t('transformer.comp.normResidual.residualWhyLabel')}</div>
            <p className="text-text-muted leading-relaxed">{t('transformer.comp.normResidual.residualWhyBody1')}</p>
            <p className="text-text-muted leading-relaxed mt-1.5">{t('transformer.comp.normResidual.residualWhyBody2')}</p>
            <p className="text-text leading-relaxed mt-2 font-medium">{t('transformer.comp.normResidual.residualImportant')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
