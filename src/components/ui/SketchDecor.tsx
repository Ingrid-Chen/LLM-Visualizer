// 手绘风装饰元素 —— PRD 5.2 路线：用线条/箭头/标注营造人味
// 全部用内联 SVG 实现，颜色走 currentColor，方便父组件控制色调

interface BaseProps {
  className?: string;
}

/** 波浪分隔线：章节之间或叙事节奏切换 */
export function WavyDivider({ className = '' }: BaseProps) {
  return (
    <svg
      className={`w-full h-3 ${className}`}
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path
        d="M 0 6 Q 10 0, 20 6 T 40 6 T 60 6 T 80 6 T 100 6 T 120 6 T 140 6 T 160 6 T 180 6 T 200 6 T 220 6 T 240 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * 手绘下划线（关键词强调）。父元素需要 position: relative，本组件绝对定位在词的下方。
 * 用法：<span className="relative inline-block">关键词<SquiggleUnderline /></span>
 */
export function SquiggleUnderline({ className = '' }: BaseProps) {
  return (
    <svg
      className={`absolute left-0 right-0 -bottom-1.5 w-full h-2 pointer-events-none ${className}`}
      viewBox="0 0 100 8"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      <path
        d="M 1 5 Q 12 1, 25 5 T 50 5 T 75 5 T 99 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 手绘箭头：用于标注。direction 控制朝向 */
export function SketchArrow({
  direction = 'down-right',
  className = '',
}: BaseProps & { direction?: 'down-right' | 'down-left' | 'right' | 'left' | 'down' }) {
  // 一个稍微弯曲的箭头，根据方向加 transform
  const transformMap: Record<string, string> = {
    'down-right': '',
    'down-left': 'scaleX(-1)',
    right: 'rotate(45deg)',
    left: 'scaleX(-1) rotate(45deg)',
    down: 'rotate(-45deg)',
  };
  return (
    <svg
      className={className}
      style={{ transform: transformMap[direction] }}
      viewBox="0 0 60 50"
      fill="none"
      aria-hidden
    >
      {/* 主弧线 */}
      <path
        d="M 4 6 Q 18 12, 28 22 Q 38 32, 50 42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* 箭头头部 */}
      <path
        d="M 50 42 L 44 38 M 50 42 L 46 34"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 手绘圆圈（不规则椭圆，套住一个内容） */
export function CircleScribble({ className = '' }: BaseProps) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
    >
      {/* 一笔画的圆圈，故意首尾不闭合，营造手绘感 */}
      <path
        d="M 50 6 Q 18 6, 6 30 Q 6 54, 50 54 Q 94 54, 94 30 Q 94 6, 52 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** 章节大编号（杂志感） */
export function ChapterNumber({ n, className = '' }: BaseProps & { n: string }) {
  return (
    <span
      className={[
        'inline-block font-serif text-5xl sm:text-6xl text-ink-light/40 leading-none select-none',
        className,
      ].join(' ')}
      aria-hidden
    >
      {n}
    </span>
  );
}

/** 闪光点（小装饰，强调"这里有动态" / "新东西"） */
export function Sparkle({ className = '' }: BaseProps) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M 10 2 L 11.5 8.5 L 18 10 L 11.5 11.5 L 10 18 L 8.5 11.5 L 2 10 L 8.5 8.5 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** "试试看"小标签：标在交互入口附近 */
export function TryBadge({ children, className = '' }: BaseProps & { children: React.ReactNode }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium',
        'bg-ember/15 text-ember-dark border border-ember/30 rounded-full',
        '-rotate-1', // 略微歪斜营造手绘感
        className,
      ].join(' ')}
    >
      <Sparkle className="w-3 h-3" />
      {children}
    </span>
  );
}
