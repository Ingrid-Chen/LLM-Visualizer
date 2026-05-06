'use client';

import SampleControls from './SampleControls';

interface Props {
  visible: boolean;
  demoMode: boolean;
  isAtEnd: boolean;
  hasGenerated: boolean;
  onSampleFirst: () => void;
  onAdvanceDemo: () => void;
  onReset: () => void;
}

// 页面级浮动操作条 —— 右下角紧凑常驻，不挡 stage 中央内容
export default function FloatingSampleBar({
  visible,
  demoMode,
  isAtEnd,
  hasGenerated,
  onSampleFirst,
  onAdvanceDemo,
  onReset,
}: Props) {
  if (!visible) return null;

  return (
    <div
      className={[
        'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50',
        'flex items-center gap-2 px-3 py-2',
        'rounded-2xl bg-cream-50/95 backdrop-blur-md',
        'border-2 border-ink/15',
        'shadow-[0_4px_0_rgba(44,81,66,0.08),0_14px_32px_-12px_rgba(44,81,66,0.25)]',
        'max-w-[calc(100vw-1.5rem)]',
      ].join(' ')}
      role="region"
      aria-label="采样操作"
    >
      <SampleControls
        demoMode={demoMode}
        isAtEnd={isAtEnd}
        hasGenerated={hasGenerated}
        onSampleFirst={onSampleFirst}
        onAdvanceDemo={onAdvanceDemo}
        onReset={onReset}
      />
    </div>
  );
}
