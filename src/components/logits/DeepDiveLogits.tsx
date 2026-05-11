'use client';

import { useState } from 'react';
import { useT } from '@/lib/i18n/LangContext';

const LINK_HREFS = [
  'https://platform.openai.com/docs/api-reference/chat/create#chat-create-logprobs',
  'https://cookbook.openai.com/examples/using_logprobs',
  'https://arxiv.org/abs/1608.05859',
];

export default function DeepDiveLogits() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">{t('logits.deepDive.toggle')}</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-5 text-text-muted leading-relaxed">
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>
              <h4 className="font-medium text-text mb-2">{t(`logits.deepDive.sections.${i}.title`)}</h4>
              <p className="text-sm">{t(`logits.deepDive.sections.${i}.body`)}</p>
            </div>
          ))}
          <div className="border-t border-cream-200 pt-5">
            <h4 className="font-medium text-text mb-3">{t('logits.deepDive.linksHeading')}</h4>
            <ul className="text-sm space-y-2">
              {LINK_HREFS.map((href, i) => (
                <li key={i}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">
                    {t(`logits.deepDive.links.${i}.label`)}
                  </a>{' '}
                  <span className="text-text-muted/80">{t(`logits.deepDive.links.${i}.desc`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
