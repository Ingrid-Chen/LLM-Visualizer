'use client';

import { useT } from '@/lib/i18n/LangContext';

const BADGE_CLASSES = ['bg-blue-50 text-blue-800', 'bg-amber-50 text-amber-800', 'bg-pink-50 text-pink-800'];

export default function PMPerspectiveCards() {
  const t = useT();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="p-5 rounded-lg bg-cream-100 border-2 border-cream-200 hover:border-ink-light transition-colors"
        >
          <span className={['inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-3', BADGE_CLASSES[i]].join(' ')}>
            {t(`logits.pmCards.${i}.badge`)}
          </span>
          <h4 className="font-serif text-lg text-ink-dark mb-2 leading-snug">{t(`logits.pmCards.${i}.title`)}</h4>
          <p className="text-sm text-text-muted leading-relaxed">{t(`logits.pmCards.${i}.body`)}</p>
        </div>
      ))}
    </div>
  );
}
