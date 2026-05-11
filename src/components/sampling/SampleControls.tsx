'use client';

import { useT } from '@/lib/i18n/LangContext';

interface Props {
  demoMode: boolean;
  isAtEnd: boolean;
  hasGenerated: boolean;
  onSampleFirst: () => void;
  onAdvanceDemo: () => void;
  onReset: () => void;
}

export default function SampleControls({
  demoMode,
  isAtEnd,
  hasGenerated,
  onSampleFirst,
  onAdvanceDemo,
  onReset,
}: Props) {
  const t = useT();
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {!demoMode ? (
        <button onClick={onSampleFirst} className="btn-primary text-base">
          {t('sampling.components.sampleControls.sampleOnce')}
        </button>
      ) : (
        <button
          onClick={onAdvanceDemo}
          disabled={isAtEnd}
          className={isAtEnd ? 'btn-secondary cursor-not-allowed opacity-60' : 'btn-ember text-base'}
        >
          {isAtEnd
            ? t('sampling.components.sampleControls.demoEnded')
            : t('sampling.components.sampleControls.advanceDemo')}
        </button>
      )}

      {hasGenerated && (
        <button onClick={onReset} className="btn-secondary">
          {t('sampling.components.sampleControls.reset')}
        </button>
      )}
    </div>
  );
}
