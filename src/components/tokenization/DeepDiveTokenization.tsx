'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

const LINK_HREFS = [
  'https://tiktokenizer.vercel.app/',
  'https://www.youtube.com/watch?v=zduSFxRajkE',
  'https://arxiv.org/abs/1508.07909',
  'https://github.com/openai/tiktoken',
];

export default function DeepDiveTokenization() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">{t('tokenization.deepDive.toggle')}</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-2">{t('tokenization.deepDive.sections.0.title')}</h4>
            <p className="text-sm">{t('tokenization.deepDive.sections.0.body')}</p>
            <p className="text-xs text-text-muted/80 italic mt-2">{t('tokenization.deepDive.sections.0.caveat')}</p>
          </div>
          <div>
            <h4 className="font-medium text-text mb-2">{t('tokenization.deepDive.sections.1.title')}</h4>
            <p className="text-sm">{t('tokenization.deepDive.sections.1.body')}</p>
          </div>
          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">{t('tokenization.deepDive.linksHeading')}</h4>
            <ul className="text-sm space-y-2">
              {LINK_HREFS.map((href, i) => (
                <li key={i}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                    {t(`tokenization.deepDive.links.${i}.label`)}
                  </a>{' '}
                  <span className="text-text-muted/80">{t(`tokenization.deepDive.links.${i}.desc`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
