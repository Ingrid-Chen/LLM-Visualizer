'use client';

import { useEffect, useRef } from 'react';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';

interface Props {
  index: string; // "01" / "02" 等
  title: string;
  oneLiner: string;
  status: 'live' | 'wip';
  href?: string;
  onWipClick?: () => void;

  expanded: boolean;
  onToggle: () => void;

  /** 演示动画相关 */
  isActive?: boolean; // 当前正在演示这一步：聚光灯 + 圆圈 pop
  isFlowingNext?: boolean; // 当前步已展开，正向下一步流动
  isPassed?: boolean; // 已经走过的步骤（左侧竖线保持橙色"已走过"状态）
  isDimmed?: boolean; // 演示进行中、且不是当前/上一步：背景暗化（聚光灯效果）
  /** 是否为最后一步 */
  isLast?: boolean;

  /** 上一步给本步的"输入"标签（让用户看到数据传递关系） */
  inputLabel?: React.ReactNode;
  /** 本步产出给下一步的"输出"标签 */
  outputLabel?: React.ReactNode;

  children: React.ReactNode;
}

export default function PipelineStep({
  index,
  title,
  oneLiner,
  status,
  href,
  onWipClick,
  expanded,
  onToggle,
  isActive = false,
  isFlowingNext = false,
  isPassed = false,
  isDimmed = false,
  isLast = false,
  inputLabel,
  outputLabel,
  children,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const lang = useLang();

  // 当步骤变为 active 时滚到屏幕中上（block:'start' 配合 scroll-mt 让标题贴近视口顶部）
  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isActive]);

  const circleClass = [
    'relative w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold shrink-0 border-2 transition-colors',
    isActive
      ? 'bg-ember text-cream-50 border-ember'
      : expanded
        ? 'bg-ink text-cream-50 border-ink'
        : 'bg-cream-50 text-ink border-ink/30',
  ].join(' ');

  return (
    <div
      ref={cardRef}
      className={[
        'grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-5 scroll-mt-24 transition-all duration-500',
        isDimmed ? 'opacity-30 pointer-events-none' : 'opacity-100',
      ].join(' ')}
    >
      {/* 左侧：编号 + 连接线 */}
      <div className="flex flex-col items-center">
        <div
          className={circleClass}
          style={isActive ? { animation: 'circlePop 0.5s ease-out, pulseRing 1.4s ease-out' } : undefined}
        >
          {index}
        </div>
        {!isLast && (
          <div className="relative flex-1 w-1 mt-2 mb-2 rounded-full overflow-visible">
            {/* 竖线颜色：active / flowing / 已走过 = 橙色；未走过 = 浅灰。纯状态切换，无动画。 */}
            <div
              className={[
                'absolute inset-0 rounded-full transition-colors duration-300',
                isActive || isFlowingNext || isPassed ? 'bg-ember' : 'bg-ink/15',
              ].join(' ')}
            />
            {/* 流动阶段：橙色小球从竖线顶部往下跑——"数据正在传递" */}
            {isFlowingNext && (
              <div
                className="absolute left-1/2 w-3 h-3 rounded-full bg-ember shadow-[0_0_12px_4px_rgba(217,119,66,0.7)]"
                style={{ animation: 'flowDown 0.8s ease-in-out infinite', transform: 'translateX(-50%)' }}
                aria-hidden
              />
            )}
          </div>
        )}
      </div>

      {/* 右侧：标题 + 卡片 */}
      <div className="pb-6">
        <button onClick={onToggle} className="text-left w-full group" aria-expanded={expanded}>
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3
              className={[
                'font-serif text-lg sm:text-xl transition-colors',
                isActive ? 'text-ember-dark' : 'text-ink-dark group-hover:text-ember-dark',
              ].join(' ')}
            >
              {title}
            </h3>
            <span className="text-text-muted text-xs">{expanded ? t('common.collapse') : t('common.expand')}</span>
          </div>
          <p className="text-sm text-text-muted mt-0.5">{oneLiner}</p>
        </button>

        {expanded && (
          <div
            className={[
              'mt-4 sketch-card p-4 sm:p-5 transition-shadow',
              isActive ? 'border-ember/50 shadow-[3px_4px_0_rgba(217,119,66,0.2)]' : '',
            ].join(' ')}
            style={{ animation: 'fadeSlide 0.4s ease-out' }}
          >
            {/* 输入条（上一步流过来的数据）——active 时有"刚收到"脉冲 */}
            {inputLabel && (
              <div
                className="mb-3 flex items-center gap-2 px-3 py-1.5 rounded-md bg-ink/5 border border-ink/10 text-xs transition-colors"
                style={isActive ? { animation: 'inputArrive 1.4s ease-out 1 forwards' } : undefined}
              >
                <span className="text-text-muted/80 shrink-0 uppercase tracking-wider">{t('common.inputLabel')}</span>
                <span className="text-text flex-1 min-w-0 truncate">{inputLabel}</span>
              </div>
            )}

            {/* 处理过程：可视化 viz */}
            <div className="my-3">{children}</div>

            {/* 输出条（产出给下一步的数据）——flowingNext 时脉冲"要发出去" */}
            {outputLabel && (
              <div
                className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-md bg-ember/10 border border-ember/25 text-xs transition-colors"
                style={isFlowingNext ? { animation: 'outputDeparting 0.8s ease-in-out infinite' } : undefined}
              >
                <span className="text-ember-dark shrink-0 uppercase tracking-wider font-medium">{t('common.outputLabel')}</span>
                <span className="text-text flex-1 min-w-0 truncate">{outputLabel}</span>
              </div>
            )}

            {/* 深入了解按钮 — 右下角，明显的 CTA */}
            <div className="pt-3 mt-3 border-t border-ink/10 flex justify-end">
              {status === 'live' ? (
                <a href={localizedHref(lang, href!)} className="btn-primary text-sm">
                  {t('common.deepDiveButton', { name: title.split('·')[0].trim() })}
                </a>
              ) : (
                <button type="button" onClick={onWipClick} className="btn-secondary text-sm">
                  {t('common.deepDiveButtonGeneric')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
