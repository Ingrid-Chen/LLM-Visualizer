'use client';

import { useT } from '@/lib/i18n/LangContext';

const BADGE_CLASSES = ['bg-blue-50 text-blue-800', 'bg-pink-50 text-pink-800', 'bg-emerald-50 text-emerald-800'];

export default function PMPerspectiveCards() {
  const t = useT();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="p-5 rounded-lg bg-cream-100 border-2 border-cream-200 hover:border-ink-light transition-colors"
          >
            <span className={['inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-3', BADGE_CLASSES[i]].join(' ')}>
              {t(`sampling.pmCards.${i}.badge`)}
            </span>
            <div className="space-y-2 mb-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Temperature</span>
                <span className="text-text font-bold">{t(`sampling.pmCards.${i}.tempVal`)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Top-p</span>
                <span className="text-text font-bold">{t(`sampling.pmCards.${i}.topPVal`)}</span>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{t(`sampling.pmCards.${i}.rationale`)}</p>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-lg bg-ember/5 border-l-4 border-ember">
        <p className="text-sm leading-relaxed">
          <strong className="text-ember-dark">{t('sampling.pmCallout.bold')}</strong>
          {t('sampling.pmCallout.body')}
        </p>
      </div>
    </div>
  );
}
