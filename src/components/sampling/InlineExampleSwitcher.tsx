'use client';

import { useEffect, useRef, useState } from 'react';

import { useT } from '@/lib/i18n/LangContext';
import type { Certainty, IndexEntry } from '@/lib/types';

interface Props {
  examples: IndexEntry[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const CATEGORY_BADGE: Record<Certainty, string> = {
  high_certainty: 'bg-ink/10 text-ink-dark',
  medium_certainty: 'bg-ember/15 text-ember-dark',
  low_certainty: 'bg-amber-100 text-amber-800',
};

// stage 顶部的"换其他文本"快捷入口 —— 不脱离 stage 也能切例子
export default function InlineExampleSwitcher({ examples, selectedId, onSelect }: Props) {
  const t = useT();
  const CATEGORY_TEXT: Record<Certainty, string> = {
    high_certainty: t('home.inlineSwitcher.certaintyHigh'),
    medium_certainty: t('home.inlineSwitcher.certaintyMedium'),
    low_certainty: t('home.inlineSwitcher.certaintyLow'),
  };
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // 点外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className={[
          'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full',
          'border border-ink/20 bg-cream-50 text-text hover:border-ink/50 transition-colors',
        ].join(' ')}
        aria-expanded={open}
        aria-label={t('home.inlineSwitcher.ariaLabel')}
      >
        <span>{t('home.inlineSwitcher.buttonLabel')}</span>
        <span className={['transition-transform', open ? 'rotate-180' : ''].join(' ')}>▾</span>
      </button>

      {open && (
        <div
          className={[
            'absolute right-0 top-full mt-2 z-30',
            'min-w-[260px] sm:min-w-[300px]',
            'rounded-xl bg-cream-50 border-2 border-ink/15 p-2',
            'shadow-[0_4px_0_rgba(44,81,66,0.08),0_12px_28px_-12px_rgba(44,81,66,0.25)]',
          ].join(' ')}
        >
          <div className="text-[10px] uppercase tracking-wider text-text-muted px-2 py-1.5">
            {t('home.inlineSwitcher.heading')}
          </div>
          <ul className="space-y-1">
            {examples.map((ex) => {
              const active = ex.id === selectedId;
              return (
                <li key={ex.id}>
                  <button
                    onClick={() => {
                      onSelect(ex.id);
                      setOpen(false);
                    }}
                    className={[
                      'w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 text-sm',
                      'transition-colors',
                      active ? 'bg-ink/10 text-ink-dark' : 'hover:bg-cream-100 text-text',
                    ].join(' ')}
                  >
                    <span
                      className={[
                        'inline-flex shrink-0 items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold',
                        CATEGORY_BADGE[ex.category],
                      ].join(' ')}
                    >
                      {CATEGORY_TEXT[ex.category]}
                    </span>
                    <span className="font-serif truncate">{ex.label}</span>
                    {active && <span className="ml-auto text-xs text-ink">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
