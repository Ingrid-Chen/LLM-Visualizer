'use client';

import MultiHeadFlowViz from './MultiHeadFlowViz';
import QKVWalkthrough from './QKVWalkthrough';
import { useT } from '@/lib/i18n/LangContext';

const MATRIX_LETTERS = ['Q', 'K', 'V', 'O'];
const MATRIX_STYLES = [
  { color: 'bg-blue-100 border-blue-400 text-blue-900', letterClass: 'text-blue-700' },
  { color: 'bg-emerald-100 border-emerald-400 text-emerald-900', letterClass: 'text-emerald-700' },
  { color: 'bg-amber-100 border-amber-400 text-amber-900', letterClass: 'text-amber-700' },
  { color: 'bg-purple-100 border-purple-400 text-purple-900', letterClass: 'text-purple-700' },
];

export default function QKVDemo() {
  return (
    <div className="space-y-7">
      <CoreIdea />
      <SearchEngineAnalogy />
      <ConcreteWalkthrough />
      <MultiHeadExplained />
    </div>
  );
}

function CoreIdea() {
  const t = useT();
  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">{t('transformer.comp.qkvDemo.ch21Title')}</h3>
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <p className="text-sm text-text leading-relaxed">
          {t('transformer.comp.qkvDemo.ch21Body1')}
          <strong className="text-ember-dark">{t('transformer.comp.qkvDemo.ch21Body1Em')}</strong>
        </p>
        <p className="text-sm text-text-muted leading-relaxed mt-2">{t('transformer.comp.qkvDemo.ch21Body2')}</p>
      </div>
    </div>
  );
}

function SearchEngineAnalogy() {
  const t = useT();
  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">{t('transformer.comp.qkvDemo.ch22Title')}</h3>
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <p className="text-sm text-text-muted mb-4 leading-relaxed">{t('transformer.comp.qkvDemo.ch22Intro')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MATRIX_LETTERS.map((letter, i) => (
            <div key={letter} className={['p-4 rounded-lg border-2', MATRIX_STYLES[i].color].join(' ')}>
              <div className="flex items-baseline gap-2.5 mb-2">
                <span className={['font-mono text-3xl font-bold', MATRIX_STYLES[i].letterClass].join(' ')}>{letter}</span>
                <span className="font-medium text-sm">{t(`transformer.comp.qkvDemo.matrices.${i}.name`)}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">{t('transformer.comp.qkvDemo.matrixSearchEngineLabel')}</span>
                  <p className="leading-relaxed">{t(`transformer.comp.qkvDemo.matrices.${i}.analogy`)}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">{t('transformer.comp.qkvDemo.matrixInLLMLabel')}</span>
                  <p className="leading-relaxed">{t(`transformer.comp.qkvDemo.matrices.${i}.llm`)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-text-muted/80 italic mt-4">{t('transformer.comp.qkvDemo.matricesCaveat')}</p>
      </div>
    </div>
  );
}

function ConcreteWalkthrough() {
  const t = useT();
  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">{t('transformer.comp.qkvDemo.ch23Title')}</h3>
      <p className="text-sm text-text-muted mb-3 leading-relaxed">{t('transformer.comp.qkvDemo.ch23Body')}</p>
      <QKVWalkthrough />
    </div>
  );
}

function MultiHeadExplained() {
  const t = useT();
  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">{t('transformer.comp.qkvDemo.ch24Title')}</h3>

      <p className="text-sm text-text-muted leading-relaxed mb-3">{t('transformer.comp.qkvDemo.ch24Body')}</p>

      <MultiHeadFlowViz />

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
          <div className="font-medium text-text mb-1">{t('transformer.comp.qkvDemo.annotMultiHead')}</div>
          <div className="text-text-muted leading-relaxed">{t('transformer.comp.qkvDemo.annotMultiHeadBody')}</div>
        </div>
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
          <div className="font-medium text-text mb-1">{t('transformer.comp.qkvDemo.annotConcat')}</div>
          <div className="text-text-muted leading-relaxed">{t('transformer.comp.qkvDemo.annotConcatBody')}</div>
        </div>
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
          <div className="font-medium text-text mb-1">{t('transformer.comp.qkvDemo.annotWO')}</div>
          <div className="text-text-muted leading-relaxed">{t('transformer.comp.qkvDemo.annotWOBody')}</div>
        </div>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-ember/5 border border-ember/20 text-xs leading-relaxed text-text-muted">
        {t('transformer.comp.qkvDemo.paramHint')}
      </div>
    </div>
  );
}
