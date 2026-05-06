'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import ModuleInfoModal, { type ModuleInfo } from '@/components/pipeline/ModuleInfoModal';
import PipelineStep from '@/components/pipeline/PipelineStep';
import {
  DetokenizationViz,
  EmbeddingViz,
  LogitsViz,
  PositionalViz,
  SamplingViz,
  TokenizationViz,
  TransformerViz,
} from '@/components/pipeline/StepVisualizations';
import InlineExampleSwitcher from '@/components/sampling/InlineExampleSwitcher';
import { SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import type { IndexData, PipelineData, PipelineIndexData } from '@/lib/types';

// 7 步元数据（首页时间轴用）
// 文案对应 PRD 4.2 各模块"核心要讲的事" 与 4.4 节
const STEP_META: {
  index: string;
  key: keyof PipelineData['steps'] | 'logits';
  title: string;
  oneLiner: string;
  status: 'live' | 'wip';
  href?: string;
  modalInfo?: ModuleInfo;
}[] = [
  {
    index: '01',
    key: 'tokenization',
    title: 'Tokenization · 文字 → token',
    oneLiner: '模型不是按"字"或"单词"理解文字的，而是按 token。',
    status: 'live',
    href: '/tokenization',
  },
  {
    index: '02',
    key: 'embedding',
    title: 'Embedding · token → 向量',
    oneLiner: '每个 token 被映射到一个高维向量，向量的相对位置反映语义关系。',
    status: 'live',
    href: '/embedding',
  },
  {
    index: '03',
    key: 'positional_encoding',
    title: 'Positional Encoding · 加上位置信息',
    oneLiner: 'Transformer 不区分词序，需要把"位置"也编码进向量里。',
    status: 'live',
    href: '/positional',
  },
  {
    index: '04',
    key: 'transformer',
    title: 'Transformer · 注意力 + 前馈',
    oneLiner: 'Attention 让每个 token 在被处理时"看向"其他相关的 token。',
    status: 'live',
    href: '/transformer',
  },
  {
    index: '05',
    key: 'logits',
    title: '输出层 · 算出每个候选词的概率',
    oneLiner: '模型在最后一层把内部状态映射回整个词表的概率分布。',
    status: 'live',
    href: '/logits',
  },
  {
    index: '06',
    key: 'sampling',
    title: 'Sampling · 从分布里挑一个词',
    oneLiner: '不同采样策略（temperature / top-k / top-p）决定如何从分布挑词。',
    status: 'live',
    href: '/sampling',
  },
  {
    index: '07',
    key: 'detokenization',
    title: 'Detokenization · token → 文字 → 接回再来',
    oneLiner: '把生成的 token 解码成文字，接回输入末尾，再走一遍 7 步。',
    status: 'live',
    href: '/loop',
  },
];

export default function HomePage() {
  const [pipelineIndex, setPipelineIndex] = useState<PipelineIndexData | null>(null);
  const [samplingIndex, setSamplingIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<PipelineData | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModuleInfo | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  // 动画状态：当前正在演示的 step 索引（-1 = 未开始；0..6 = 进行中；7 = 已完成）
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  // 当前从某步流向下一步（小球动画）
  const [flowingFromIndex, setFlowingFromIndex] = useState<number | null>(null);
  // setTimeout 句柄，"跳过/重置"时清掉
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 加载 pipeline + sampling index（后者用于切换例子的 dropdown 复用）
  useEffect(() => {
    Promise.all([
      fetch('/data/pipeline/index.json').then((r) => r.json() as Promise<PipelineIndexData>),
      fetch('/data/sampling/index.json').then((r) => r.json() as Promise<IndexData>),
    ])
      .then(([pi, si]) => {
        setPipelineIndex(pi);
        setSamplingIndex(si);
        if (pi.examples.length > 0 && !selectedId) setSelectedId(pi.examples[0].id);
      })
      .catch((err) => console.error('加载首页数据失败：', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 加载选中例子的 pipeline 数据
  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/pipeline/${selectedId}.json`)
      .then((r) => r.json() as Promise<PipelineData>)
      .then((data) => {
        setPipeline(data);
        // 切例子时收起所有步骤、清动画状态
        timersRef.current.forEach((t) => clearTimeout(t));
        timersRef.current = [];
        setExpandedSteps(new Set());
        setHasStarted(false);
        setActiveStepIndex(-1);
        setFlowingFromIndex(null);
      })
      .catch((err) => console.error(`加载 ${selectedId} pipeline 失败：`, err));
  }, [selectedId]);

  // 清掉所有动画定时器（跳过/重置/切例子时调用）
  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  // 演示节奏（经过几轮调整后的"看动画片"节奏）
  // 每步：active 标记（0ms）→ 展开卡片（500ms）→ 阅读时间（让用户看清输入/viz/输出，3500ms）→ 流向下一步（800ms）
  // 总时长 ≈ 7 步 × 4.8s ≈ 33.6s（提供"跳过"按钮）
  const STEP_DURATION_MS = 4800;
  const EXPAND_DELAY_MS = 500;
  const READ_DURATION_MS = 3500;
  const FLOW_DURATION_MS = 800;
  const READ_BAR_DURATION_MS = STEP_DURATION_MS - EXPAND_DELAY_MS - FLOW_DURATION_MS; // 进度条时长

  const handleStart = () => {
    clearTimers();
    setExpandedSteps(new Set());
    setActiveStepIndex(-1);
    setFlowingFromIndex(null);
    setHasStarted(true);

    STEP_META.forEach((step, i) => {
      const stepStart = i * STEP_DURATION_MS;

      // 1) 该步进入 active（圆圈 pop 动画 + 聚光灯切到这一步）
      timersRef.current.push(
        setTimeout(() => {
          setActiveStepIndex(i);
          setFlowingFromIndex(null);
        }, stepStart),
      );

      // 2) 展开卡片（让用户看输入 → viz → 输出）
      timersRef.current.push(
        setTimeout(() => {
          setExpandedSteps((prev) => new Set(prev).add(step.index));
        }, stepStart + EXPAND_DELAY_MS),
      );

      // 3) 阅读完毕，开始流动小球到下一步（除最后一步）
      if (i < STEP_META.length - 1) {
        const flowStart = stepStart + EXPAND_DELAY_MS + READ_DURATION_MS;
        timersRef.current.push(
          setTimeout(() => {
            setFlowingFromIndex(i);
          }, flowStart),
        );
        timersRef.current.push(
          setTimeout(() => {
            setFlowingFromIndex(null);
          }, flowStart + FLOW_DURATION_MS),
        );
      }
    });

    // 全部完成
    timersRef.current.push(
      setTimeout(() => {
        setActiveStepIndex(STEP_META.length); // 7 = done
        setFlowingFromIndex(null);
      }, STEP_META.length * STEP_DURATION_MS),
    );
  };

  // 跳过动画：直接展开所有
  const handleSkip = () => {
    clearTimers();
    setExpandedSteps(new Set(STEP_META.map((s) => s.index)));
    setActiveStepIndex(STEP_META.length);
    setFlowingFromIndex(null);
    setHasStarted(true);
  };

  const handleToggleStep = (idx: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const handleCollapseAll = () => {
    clearTimers();
    setExpandedSteps(new Set());
    setHasStarted(false);
    setActiveStepIndex(-1);
    setFlowingFromIndex(null);
  };

  // 切例子时清动画
  useEffect(() => {
    return () => clearTimers();
  }, []);

  const finalToken = useMemo(() => pipeline?.steps.sampling.selected_token, [pipeline]);

  return (
    <main className="container-wide py-10 sm:py-16 pb-24">
      {/* === Hero === */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">LLM Visualizer · v0.1</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ink-dark leading-[1.1] mb-5">
          看一段话经过 LLM 的
          <br className="hidden sm:block" />
          <span className="relative inline-block text-ember-dark mx-1">
            7 步流水线
            <SquiggleUnderline className="text-ember" />
          </span>
        </h1>
        <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-prose mb-6">
          从输入文字到下一个词冒出来，模型其实做了 7 件事。
          每一步都是一个独立的"机制点"——选一个例子，看它怎么走完这趟流水线。
        </p>

        {/* 顶部输入控制条 */}
        {pipeline && samplingIndex && (
          <div className="stage flex flex-wrap items-center gap-4">
            <span className="stage-label">从这里开始 →</span>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-text-muted mb-1">这段话作为本次演示的输入</div>
              <p className="font-serif text-xl sm:text-2xl text-text leading-snug truncate">
                {pipeline.prompt_zh_label}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <InlineExampleSwitcher
                examples={samplingIndex.examples}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
              {!hasStarted ? (
                <button onClick={handleStart} className="btn-primary text-sm">
                  ▶ 开始演示
                </button>
              ) : activeStepIndex >= 0 && activeStepIndex < STEP_META.length ? (
                <button onClick={handleSkip} className="btn-secondary text-sm">
                  ⤓ 跳过动画
                </button>
              ) : (
                <button onClick={handleCollapseAll} className="btn-secondary text-sm">
                  ↺ 重新演示
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 7 步流水线时间轴 === */}
      <section>
        {pipeline ? (
          STEP_META.map((meta, i) => {
            const expanded = expandedSteps.has(meta.index);
            const isActive = activeStepIndex === i;
            // 演示进行中、且不是当前步：暗化（聚光灯效果）
            const isDimmed = hasStarted && activeStepIndex >= 0 && activeStepIndex < STEP_META.length && !isActive;
            const labels = buildStepLabels(meta.key, pipeline);
            return (
              <PipelineStep
                key={meta.index}
                index={meta.index}
                title={meta.title}
                oneLiner={meta.oneLiner}
                status={meta.status}
                href={meta.href}
                onWipClick={() => meta.modalInfo && setModal(meta.modalInfo)}
                expanded={expanded}
                onToggle={() => handleToggleStep(meta.index)}
                isActive={isActive}
                isFlowingNext={flowingFromIndex === i}
                isPassed={activeStepIndex > i || activeStepIndex === STEP_META.length}
                isDimmed={isDimmed}
                isLast={i === STEP_META.length - 1}
                inputLabel={labels.input}
                outputLabel={labels.output}
              >
                {renderViz(meta.key, pipeline)}
              </PipelineStep>
            );
          })
        ) : (
          <p className="text-text-muted">正在加载演示数据…</p>
        )}
      </section>

      {/* === 输出 === */}
      {pipeline && (
        <section className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 sm:gap-x-5">
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-10 rounded-full bg-ember text-cream-50 border-2 border-ember flex items-center justify-center font-serif text-lg shrink-0"
              style={
                activeStepIndex === STEP_META.length
                  ? { animation: 'circlePop 0.5s ease-out, finalArrive 1.6s ease-out' }
                  : undefined
              }
            >
              ✓
            </div>
          </div>
          <div className="pt-1">
            <h3 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">模型最终说出</h3>
            <div
              className="stage py-6 sm:py-8 transition-all"
              style={
                activeStepIndex === STEP_META.length
                  ? { animation: 'finalArrive 1.6s ease-out 1' }
                  : undefined
              }
            >
              <div className="text-[11px] uppercase tracking-wider text-text-muted mb-2">
                经过这 7 步，下一个 token 是
              </div>
              <p className="font-serif text-3xl sm:text-4xl text-ink-dark leading-snug">
                <span className="text-text-muted">{pipeline.prompt}</span>
                <span className="text-ember-dark ml-1 animate-pulse">{finalToken}</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 注释行 */}
      <p className="mt-12 text-xs text-text-muted/70 text-center">
        ※ v0.1 mock 数据。Sampling 步骤是已落地的真实模型数据；其他 6 步用占位数据示意流程，详细模块逐步上线。
      </p>

      {/* v0.2 模块占位弹窗 */}
      <ModuleInfoModal info={modal} onClose={() => setModal(null)} />
    </main>
  );
}

// 每步的"输入/输出"标签 —— 让用户看到数据是怎么"流"过 7 步的
function buildStepLabels(
  key: string,
  pipeline: PipelineData,
): { input: React.ReactNode; output: React.ReactNode } {
  const tokens = pipeline.steps.tokenization.tokens;
  const tokenCount = tokens.length;
  const embedDim = pipeline.steps.embedding.dim;
  const layers = pipeline.steps.transformer.layers;
  const heads = pipeline.steps.transformer.heads;
  const topToken = pipeline.steps.logits_top[0];
  const selected = pipeline.steps.sampling.selected_token;

  switch (key) {
    case 'tokenization':
      return {
        input: <>原文：「<strong>{pipeline.prompt}</strong>」</>,
        output: <>{tokenCount} 个 token：[{tokens.join('｜')}]</>,
      };
    case 'embedding':
      return {
        input: <>{tokenCount} 个 token（来自第 1 步）</>,
        output: <>{tokenCount} 个 {embedDim} 维向量</>,
      };
    case 'positional_encoding':
      return {
        input: <>{tokenCount} 个 {embedDim} 维向量（来自第 2 步）</>,
        output: <>{tokenCount} 个 <strong>含位置信息</strong>的向量</>,
      };
    case 'transformer':
      return {
        input: <>{tokenCount} 个含位置的向量（来自第 3 步）</>,
        output: <>经过 {layers} 层 × {heads} 头处理后的向量</>,
      };
    case 'logits':
      return {
        input: <>Transformer 最后一层输出（来自第 4 步）</>,
        output: <>词表概率分布，top-1 = "<strong>{topToken.token}</strong>" {(topToken.prob * 100).toFixed(1)}%</>,
      };
    case 'sampling':
      return {
        input: <>概率分布（来自第 5 步）</>,
        output: <>选中 token："<strong className="text-ember-dark">{selected}</strong>"</>,
      };
    case 'detokenization':
      return {
        input: <>选中的 token "{selected}"（来自第 6 步）</>,
        output: <>文字 "<strong className="text-ember-dark">{selected}</strong>" → 接回原文末尾，再走一遍这 7 步</>,
      };
    default:
      return { input: null, output: null };
  }
}

function renderViz(key: string, pipeline: PipelineData): React.ReactNode {
  const tokens = pipeline.steps.tokenization.tokens;
  switch (key) {
    case 'tokenization':
      return <TokenizationViz data={pipeline.steps.tokenization} />;
    case 'embedding':
      return <EmbeddingViz data={pipeline.steps.embedding} firstToken={tokens[0]} />;
    case 'positional_encoding':
      return <PositionalViz data={pipeline.steps.positional_encoding} tokens={tokens} />;
    case 'transformer':
      return <TransformerViz data={pipeline.steps.transformer} />;
    case 'logits':
      return <LogitsViz data={pipeline.steps.logits_top} />;
    case 'sampling':
      return <SamplingViz data={pipeline.steps.sampling} />;
    case 'detokenization':
      return <DetokenizationViz data={pipeline.steps.detokenization} prompt={pipeline.prompt} />;
    default:
      return null;
  }
}
