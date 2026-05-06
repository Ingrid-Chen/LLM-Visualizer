'use client';

import { useEffect, useRef } from 'react';

export interface ModuleInfo {
  index: string;
  title: string;
  description: string;
  /** PM 视角连接点（PRD 4.2 表格的 PM 视角列） */
  pmAngle: string;
}

interface Props {
  info: ModuleInfo | null;
  onClose: () => void;
}

// v0.2 占位模块的简介弹窗 —— 让用户看到模块要讲什么、为什么重要，
// 但具体页面还没做。文案严格对应 PRD 4.2 / 4.4 节，避免事实误差。
export default function ModuleInfoModal({ info, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!info) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [info, onClose]);

  if (!info) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-info-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/30 backdrop-blur-sm animate-[fadeSlide_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
        className={[
          'relative max-w-lg w-full',
          'rounded-2xl bg-cream-50 border-2 border-ink/15 p-6 sm:p-8',
          'shadow-[0_8px_0_rgba(44,81,66,0.1),0_24px_60px_-12px_rgba(44,81,66,0.4)]',
        ].join(' ')}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-cream-100 flex items-center justify-center text-text-muted hover:text-text transition-colors"
          aria-label="关闭"
        >
          ✕
        </button>

        <div className="mb-2 flex items-center gap-3">
          <span className="font-mono text-2xl text-ink-light/50">{info.index}</span>
          <span className="step-pill bg-ember/10 text-ember-dark border-ember/30">v0.2 即将上线</span>
        </div>
        <h2 id="module-info-title" className="font-serif text-2xl sm:text-3xl text-ink-dark mb-3 leading-tight">
          {info.title}
        </h2>

        <div className="mb-4">
          <h3 className="text-xs uppercase tracking-wider text-text-muted mb-1">这个模块讲什么</h3>
          <p className="text-text leading-relaxed">{info.description}</p>
        </div>

        <div className="mb-5">
          <h3 className="text-xs uppercase tracking-wider text-ember-dark mb-1">PM 视角连接点</h3>
          <p className="text-text-muted leading-relaxed text-sm">{info.pmAngle}</p>
        </div>

        <div className="flex justify-end">
          <button onClick={onClose} className="btn-secondary text-sm">
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
