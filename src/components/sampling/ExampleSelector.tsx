'use client';

import type { Certainty, IndexEntry } from '@/lib/types';

const CATEGORY_BADGE: Record<Certainty, string> = {
  high_certainty: 'bg-ink/10 text-ink-dark border-ink/20',
  medium_certainty: 'bg-ember/15 text-ember-dark border-ember/30',
  low_certainty: 'bg-amber-100 text-amber-800 border-amber-200',
};

const CATEGORY_TEXT: Record<Certainty, string> = {
  high_certainty: '高确定性',
  medium_certainty: '中等确定性',
  low_certainty: '低确定性',
};

interface Props {
  examples: IndexEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ExampleSelector({ examples, selectedId, onSelect }: Props) {
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
