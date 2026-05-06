'use client';

import { useEffect, useRef, useState } from 'react';

import type { ExampleData, IndexData } from '@/lib/types';

// 自回归循环可视化：让用户看到模型一次只生成一个 token + 接回去 + 再生成的过程
// 复用 Sampling 模块的 8 步 greedy 数据

const STEP_INTERVAL_MS = 1000; // 自动播放速度

export default function AutoregressiveLoop() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string>('capital_china');
  const [data, setData] = useState<ExampleData | null>(null);
  const [stepIdx, setStepIdx] = useState(0); // 已生成几个 token（0 = 还没开始）
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch('/data/sampling/index.json')
      .then((r) => r.json() as Promise<IndexData>)
      .then(setIndex);
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/sampling/${selectedId}.json`)
      .then((r) => r.json() as Promise<ExampleData>)
      .then((d) => {
        setData(d);
        setStepIdx(0);
        setIsPlaying(false);
      });
  }, [selectedId]);

  // 自动播放
  useEffect(() => {
    if (!isPlaying || !data) return;
    if (stepIdx >= data.steps.length) {
      setIsPlaying(false);
      return;
    }
    playTimerRef.current = setTimeout(() => {
      setStepIdx((s) => s + 1);
    }, STEP_INTERVAL_MS);
    return () => {
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying, stepIdx, data]);

  if (!data) return <p className="text-text-muted">加载中…</p>;

  const totalSteps = data.steps.length;
  const isFinished = stepIdx >= totalSteps;
  const generatedTokens = data.steps.slice(0, stepIdx).map((s) => s.greedy_token);
  const nextToken = isFinished ? null : data.steps[stepIdx]?.greedy_token;
  const currentText = data.prompt + generatedTokens.join('');

  const handleNext = () => {
    if (stepIdx < totalSteps) {
      setStepIdx((s) => s + 1);
      setIsPlaying(false);
    }
  };

  const handlePlay = () => {
    if (isFinished) {
      // 已结束 → 重新开始
      setStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const handleReset = () => {
    setStepIdx(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4">
      {/* 例子选择 */}
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">选个例子（来自 Sampling 的真实 greedy 路径）</label>
        <div className="flex flex-wrap gap-2">
          {index?.examples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => setSelectedId(ex.id)}
              className={[
                'text-xs px-3 py-1 rounded-full border transition-colors',
                selectedId === ex.id ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
              ].join(' ')}
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      {/* 循环示意图 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <CircuitDiagram
          currentText={currentText}
          nextToken={nextToken}
          isFinished={isFinished}
          stepIdx={stepIdx}
          totalSteps={totalSteps}
        />
      </div>

      {/* 输出文本 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">当前已生成的文本</div>
        <p className="font-serif text-xl leading-relaxed">
          <span className="text-text-muted">{data.prompt}</span>
          {generatedTokens.map((t, i) => (
            <span key={i} className={i === stepIdx - 1 ? 'text-ember-dark font-bold animate-[pulse_1s_ease-out_1]' : 'text-ink-dark font-semibold'}>
              {t}
            </span>
          ))}
          {nextToken && (
            <span className="text-text-muted/40 italic">[ {nextToken} ]</span>
          )}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-text-muted">
            进度：<strong className="text-text font-mono">{stepIdx} / {totalSteps}</strong> 个 token
            {isFinished && <span className="ml-2 text-ember-dark">· ✓ 完成</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="btn-secondary text-xs">
              ↺ 重置
            </button>
            <button onClick={handleNext} disabled={isFinished} className="btn-secondary text-xs disabled:opacity-40">
              下一个 token →
            </button>
            <button onClick={handlePlay} className="btn-primary text-xs">
              {isPlaying ? '⏸ 暂停' : isFinished ? '↻ 重新播放' : '▶ 自动播放'}
            </button>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-text-muted/80 leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        💡 <strong className="text-text">关键直觉：</strong>每生成一个 token，模型把它<strong className="text-text">接回输入末尾</strong>，
        再走一遍完整前向计算（前面 6 个模块 + 解码）预测下一个。这就是<strong className="text-text">"自回归"</strong>（autoregressive）——
        每一步都基于自己之前的所有输出。模型每次只看到比上一次多一个 token 的输入。
      </p>
    </div>
  );
}

// ==================== 循环示意 SVG ====================

function CircuitDiagram({
  currentText,
  nextToken,
  isFinished,
  stepIdx,
  totalSteps,
}: {
  currentText: string;
  nextToken: string | null;
  isFinished: boolean;
  stepIdx: number;
  totalSteps: number;
}) {
  const W = 720;
  const H = 200;

  // 截短当前文本到可视长度
  const displayText = currentText.length > 22 ? '…' + currentText.slice(-22) : currentText;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ minWidth: '500px' }}>
      <defs>
        <marker id="loop-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
        </marker>
      </defs>

      {/* 当前输入 */}
      <rect x={20} y={70} width={200} height={60} rx={8} fill="#F5EFE2" stroke="#6B5F50" strokeWidth={1.5} />
      <text x={120} y={88} textAnchor="middle" fontSize="10" fill="#6B5F50">
        当前输入文本
      </text>
      <text x={120} y={110} textAnchor="middle" fontSize="13" fontFamily="serif" fill="#1F1A14" fontWeight={500}>
        {displayText || '(空)'}
      </text>

      {/* 箭头 → LLM */}
      <line x1={220} y1={100} x2={300} y2={100} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#loop-arrow)" />

      {/* LLM 框 */}
      <rect x={310} y={70} width={150} height={60} rx={8} fill="#FFF7ED" stroke="#D97742" strokeWidth={2} />
      <text x={385} y={92} textAnchor="middle" fontSize="13" fontFamily="serif" fontWeight={700} fill="#B85A2A">
        LLM 7 步流程
      </text>
      <text x={385} y={108} textAnchor="middle" fontSize="9" fill="#6B5F50">
        Token → Embed → ...
      </text>
      <text x={385} y={120} textAnchor="middle" fontSize="9" fill="#6B5F50">
        → Sampling
      </text>

      {/* 箭头 → 下一个 token */}
      <line x1={460} y1={100} x2={540} y2={100} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#loop-arrow)" />

      {/* 下一个 token */}
      <rect x={550} y={70} width={150} height={60} rx={8} fill={isFinished ? '#F5EFE2' : '#FFF7ED'} stroke={isFinished ? '#9C9183' : '#D97742'} strokeWidth={isFinished ? 1.5 : 2.5} />
      <text x={625} y={88} textAnchor="middle" fontSize="10" fill="#6B5F50">
        新 token
      </text>
      <text x={625} y={114} textAnchor="middle" fontSize="20" fontFamily="serif" fontWeight={700} fill={isFinished ? '#9C9183' : '#B85A2A'}>
        {isFinished ? '✓ 完成' : nextToken ? `「${nextToken}」` : '?'}
      </text>

      {/* 循环回去的弧线 */}
      {!isFinished && nextToken && (
        <>
          <path
            d={`M 625 130 Q 625 170, 380 170 Q 120 170, 120 135`}
            fill="none"
            stroke="#D97742"
            strokeWidth={2}
            strokeDasharray="5 4"
            markerEnd="url(#loop-arrow)"
          />
          <text x={385} y={185} textAnchor="middle" fontSize="11" fill="#B85A2A" fontWeight={600} fontStyle="italic">
            接回输入末尾，再走一遍 →
          </text>
        </>
      )}

      {/* 顶部进度提示 */}
      <text x={W / 2} y={28} textAnchor="middle" fontSize="11" fill="#6B5F50">
        第 {stepIdx + 1} 步 · 共 {totalSteps} 步
      </text>
    </svg>
  );
}
