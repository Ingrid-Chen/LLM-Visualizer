'use client';

import { useT } from '@/lib/i18n/LangContext';
import type { Certainty, IndexEntry } from '@/lib/types';

const CATEGORY_BADGE: Record<Certainty, string> = {
  high_certainty: 'bg-ink/10 text-ink-dark border-ink/20',
  medium_certainty: 'bg-ember/15 text-ember-dark border-ember/30',
  low_certainty: 'bg-amber-100 text-amber-800 border-amber-200',
};

interface Props {
  examples: IndexEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ExampleSelector({ examples, selectedId, onSelect }: Props) {
  const t = useT();
  const CATEGORY_TEXT: Record<Certainty, string> = {
    high_certainty: t('sampling.components.exampleSelector.certaintyHigh'),
    medium_certainty: t('sampling.components.exampleSelector.certaintyMedium'),
    low_certainty: t('sampling.components.exampleSelector.certaintyLow'),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {examples.map((ex) => {
        const active = ex.id === selectedId;
        return (
          <button
            key={ex.id}
            onClick={() => onSelect(ex.id)}
            className={[
              'text-left p-4 transition-all sketch-card',
              active ? 'sketch-card-active' : 'hover:border-ink/30',
            ].join(' ')}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={['step-pill', CATEGORY_BADGE[ex.category]].join(' ')}>
                {CATEGORY_TEXT[ex.category]}
              </span>
            </div>
            <div className="font-serif text-lg text-text leading-snug">{ex.label}</div>
          </button>
        );
      })}
    </div>
  );
}
