'use client';

interface Props {
  prompt: string;
  generated: string[];
  /** 紧凑模式：放在 stage 顶部一行展示，不占独立卡片 */
  compact?: boolean;
  /** 紧凑模式下右侧的额外操作（如"换其他文本"按钮） */
  trailing?: React.ReactNode;
}

export default function GeneratedTextDisplay({ prompt, generated, compact = false, trailing }: Props) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 pb-3 border-b border-ink/10">
        <span className="text-xs text-text-muted uppercase tracking-wider whitespace-nowrap">当前文本</span>
        <p className="font-serif text-lg leading-snug flex-1 min-w-0 truncate">
          <span>{prompt}</span>
          {generated.map((t, i) => (
            <span
              key={i}
              className={
                i === 0
                  ? 'text-ink font-bold animate-[pulse_1.2s_ease-out_1]'
                  : 'text-ember font-bold'
              }
            >
              {t}
            </span>
          ))}
          {generated.length === 0 && <span className="text-text-muted/50 ml-1">___</span>}
        </p>
        {trailing && <div className="shrink-0">{trailing}</div>}
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-5">
      <div className="text-xs text-text-muted mb-2 uppercase tracking-wider">当前文本</div>
      <p className="text-xl font-serif leading-relaxed">
        <span>{prompt}</span>
        {generated.map((t, i) => (
          <span
            key={i}
            className={
              i === 0
                ? 'text-ink font-bold animate-[pulse_1.2s_ease-out_1]'
                : 'text-ember font-bold'
            }
          >
            {t}
          </span>
        ))}
      </p>
    </div>
  );
}
