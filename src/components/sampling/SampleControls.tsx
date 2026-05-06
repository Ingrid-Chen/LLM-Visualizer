'use client';

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
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {!demoMode ? (
        <button onClick={onSampleFirst} className="btn-primary text-base">
          🎲 采样一次（按当前参数）
        </button>
      ) : (
        <button
          onClick={onAdvanceDemo}
          disabled={isAtEnd}
          className={isAtEnd ? 'btn-secondary cursor-not-allowed opacity-60' : 'btn-ember text-base'}
        >
          {isAtEnd ? '✓ 演示已结束' : '▶ 再生成一个 token（演示）'}
        </button>
      )}

      {hasGenerated && (
        <button onClick={onReset} className="btn-secondary">
          ↺ 重置
        </button>
      )}
    </div>
  );
}
