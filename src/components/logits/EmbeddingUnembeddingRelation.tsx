'use client';

import { useT } from '@/lib/i18n/LangContext';

const D_DEMO = 6;
const ROWS_DEMO = 5;
// demo token 保持中文（属于演示数据）
const SAMPLE_TOKENS = ['北京', '上海', '中国', '首都', '是'];

export default function EmbeddingUnembeddingRelation() {
  const t = useT();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-stretch">
        <MatrixCard
          badge={t('logits.comp.relation.embedding.badge')}
          badgeClass="bg-ink/15 text-ink-dark border-ink/30"
          title={t('logits.comp.relation.embedding.title')}
          direction={t('logits.comp.relation.embedding.direction')}
          rowLabel={t('logits.comp.relation.embedding.rowLabel')}
          shape={t('logits.comp.relation.embedding.shape')}
          colorScheme="ink"
          where={t('logits.comp.relation.embedding.where')}
        />

        <div className="flex md:flex-col items-center justify-center py-3 md:py-0 gap-2">
          <div className="text-2xl md:text-3xl text-ember-dark font-bold">↔</div>
          <div className="text-center">
            <div className="text-xs font-medium text-text">{t('logits.comp.relation.middle.headline')}</div>
            <div className="text-[10px] text-text-muted/90 mt-1 max-w-[110px]">{t('logits.comp.relation.middle.sub')}</div>
          </div>
        </div>

        <MatrixCard
          badge={t('logits.comp.relation.unembedding.badge')}
          badgeClass="bg-ember/15 text-ember-dark border-ember/30"
          title={t('logits.comp.relation.unembedding.title')}
          direction={t('logits.comp.relation.unembedding.direction')}
          rowLabel={t('logits.comp.relation.unembedding.rowLabel')}
          shape={t('logits.comp.relation.unembedding.shape')}
          colorScheme="ember"
          where={t('logits.comp.relation.unembedding.where')}
        />
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">
        {t('logits.comp.relation.insight')}
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        {t('logits.comp.relation.caveat')}
      </p>
    </div>
  );
}

interface MatrixCardProps {
  badge: string;
  badgeClass: string;
  title: string;
  direction: string;
  rowLabel: string;
  shape: string;
  colorScheme: 'ink' | 'ember';
  where: string;
}

function MatrixCard({ badge, badgeClass, title, direction, rowLabel, shape, colorScheme, where }: MatrixCardProps) {
  const t = useT();
  const baseColor = colorScheme === 'ink' ? 'rgba(44, 81, 66,' : 'rgba(217, 119, 66,';
  const borderClass = colorScheme === 'ink' ? 'border-ink/30' : 'border-ember/30';
  const titleClass = colorScheme === 'ink' ? 'text-ink-dark' : 'text-ember-dark';
  const shapeLabel = t('logits.comp.relation.embedding.shape') === t('logits.comp.relation.unembedding.shape') ? null : null;
  void shapeLabel;
  const shapeLabelText = colorScheme === 'ink' ? 'Shape' : 'Shape';
  // Use simple "Shape:" label that works for both languages — actually grab from generic
  return (
    <div className={['rounded-lg border-2 bg-cream-50 p-4', borderClass].join(' ')}>
      <span className={['inline-block text-[10px] px-2 py-0.5 rounded-full font-medium border tracking-wider mb-2', badgeClass].join(' ')}>
        {badge}
      </span>
      <h4 className={['font-serif text-base font-semibold mb-1', titleClass].join(' ')}>{title}</h4>
      <p className="text-xs text-text-muted mb-3">
        <span className="font-mono text-text">{direction}</span>
      </p>

      <div className="flex items-start gap-2 mb-2">
        <div className="flex flex-col gap-0.5">
          {SAMPLE_TOKENS.map((tok, i) => (
            <div key={i} className="h-4 flex items-center text-[10px] font-serif text-text-muted leading-none">
              {tok}
            </div>
          ))}
        </div>
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${D_DEMO}, minmax(0, 1fr))` }}>
          {Array.from({ length: ROWS_DEMO * D_DEMO }).map((_, idx) => {
            const seed = idx * 7;
            const v = Math.sin(seed * 0.4) * 0.5 + Math.cos(seed * 0.3) * 0.3;
            const intensity = Math.min(Math.abs(v), 1);
            const fill = `${baseColor} ${0.15 + intensity * 0.6})`;
            return (
              <div key={idx} className="aspect-square rounded-[2px]" style={{ backgroundColor: fill, minWidth: 14 }} />
            );
          })}
        </div>
      </div>

      <div className="text-[10px] text-text-muted/80 space-y-0.5 pt-2 border-t border-ink/10">
        <div>{shapeLabelText}: <span className="font-mono text-text">{shape}</span></div>
        <div>{rowLabel}</div>
        <div className="italic text-text-muted/70">{where}</div>
      </div>
    </div>
  );
}
