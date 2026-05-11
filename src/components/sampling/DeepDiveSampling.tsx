'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

export default function DeepDiveSampling() {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">{t('sampling.deepDive.toggle')}</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <h4 className="font-medium text-text mb-1">{t(`sampling.deepDive.sections.${i}.title`)}</h4>
              <p className="text-sm">{t(`sampling.deepDive.sections.${i}.body`)}</p>
            </div>
          ))}
          <p className="text-sm">{t('sampling.deepDive.externalNote')}</p>
        </div>
      )}
    </section>
  );
}
