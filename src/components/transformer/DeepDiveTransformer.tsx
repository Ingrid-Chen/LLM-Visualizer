'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

const LINK_HREFS = [
  'https://jalammar.github.io/illustrated-transformer/',
  'https://www.youtube.com/watch?v=kCc8FmEb1nY',
  'https://bbycroft.net/llm',
  'https://arxiv.org/abs/1706.03762',
  'https://arxiv.org/abs/2002.04745',
];

export default function DeepDiveTransformer() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">{t('transformer.deepDive.toggle')}</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <h4 className="font-medium text-text mb-2">{t(`transformer.deepDive.sections.${i}.title`)}</h4>
              <p className="text-sm">{t(`transformer.deepDive.sections.${i}.body`)}</p>
            </div>
          ))}
          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">{t('transformer.deepDive.linksHeading')}</h4>
            <ul className="text-sm space-y-2">
              {LINK_HREFS.map((href, i) => (
                <li key={i}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                    {t(`transformer.deepDive.links.${i}.label`)}
                  </a>{' '}
                  <span className="text-text-muted/80">{t(`transformer.deepDive.links.${i}.desc`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
