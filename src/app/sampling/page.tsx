'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import DeepDiveSampling from '@/components/sampling/DeepDiveSampling';
import DistributionChart from '@/components/sampling/DistributionChart';
import ExampleSelector from '@/components/sampling/ExampleSelector';
import FloatingSampleBar from '@/components/sampling/FloatingSampleBar';
import GeneratedTextDisplay from '@/components/sampling/GeneratedTextDisplay';
import InlineExampleSwitcher from '@/components/sampling/InlineExampleSwitcher';
import ParamControls from '@/components/sampling/ParamControls';
import PMPerspectiveCards from '@/components/sampling/PMPerspectiveCards';
import {
  ChapterNumber,
  SquiggleUnderline,
  TryBadge,
  WavyDivider,
} from '@/components/ui/SketchDecor';
import { pickSampledIndex, useSamplingState } from '@/lib/useSamplingState';
import type { ExampleData, IndexData } from '@/lib/types';

export default function SamplingPage() {
  const [index, setIndex] = useState<IndexData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const { state, dispatch, derived } = useSamplingState();

  useEffect(() => {
    fetch('/data/sampling/index.json')
      .then((r) => r.json() as Promise<IndexData>)
      .then((data) => {
        setIndex(data);
        if (data.examples.length > 0 && !selectedId) {
          setSelectedId(data.examples[0].id);
        }
      })
      .catch((err) => console.error('加载 index.json 失败：', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    fetch(`/data/sampling/${selectedId}.json`)
      .then((r) => r.json() as Promise<ExampleData>)
      .then((data) => {
        dispatch({ type: 'EXAMPLE_LOADED', data });
        setHighlightIndex(null);
      })
      .catch((err) => console.error(`加载 ${selectedId}.json 失败：`, err));
  }, [selectedId, dispatch]);

  const handleSampleFirst = () => {
    const probs = derived.distribution.map((d) => d.prob);
    const idx = pickSampledIndex(probs);
    setHighlightIndex(idx);
    dispatch({ type: 'SAMPLE_FIRST', tokenIndex: idx });
  };

  const handleAdvanceDemo = () => {
    setHighlightIndex(null);
    dispatch({ type: 'ADVANCE_DEMO' });
  };

  const handleReset = () => {
    setHighlightIndex(null);
    dispatch({ type: 'RESET' });
  };

  return (
    <>
      <main className="container-wide py-8 sm:py-12 pb-28 sm:pb-32">
        {/* 顶部导航条 */}
        <nav className="mb-8 flex items-center justify-between text-sm">
          <Link href="/" className="text-text-muted hover:text-ink-dark transition-colors">
            ← LLM Visualizer 首页
          </Link>
          <span className="text-text-muted font-mono">06 / 08</span>
        </nav>

        {/* === Hero（紧凑） === */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">采样 · Sampling</span>
            <span className="flex-1 h-px bg-ember/30" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
            模型如何
            <span className="relative inline-block text-ember-dark mx-1">
              挑出
              <SquiggleUnderline className="text-ember" />
            </span>
            下一个词？
          </h1>
          <p className="text-base text-text-muted max-w-prose leading-relaxed">
            前一步（<Link href="/logits" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">输出层 / Logits</Link>）算出了概率分布——
            模型给词表里<strong className="text-text">每一个</strong>可能的词都打了一个分数。
            现在的问题是：这么多词，到底挑哪个？
          </p>
        </header>

        <WavyDivider className="text-ink/20 mb-8" />

        {/* === 章节 1：选例子（紧凑） === */}
        <section className="mb-8 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="01" />
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-1.5">
              先选一个例子
            </h2>
            <p className="text-sm text-text-muted mb-4 max-w-prose">
              不同的句子开头，让模型面对的"选择题"形态完全不同——有的几乎闭眼能选，有的真的左右为难。
            </p>
            {index ? (
              <ExampleSelector
                examples={index.examples}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ) : (
              <p className="text-text-muted">正在加载例子…</p>
            )}
          </div>
        </section>

        <WavyDivider className="text-ink/20 mb-8" />

        {/* === 章节 2：主交互舞台（紧凑） === */}
        <section className="mb-8 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="02" />
          <div>
            <div className="flex items-baseline gap-3 mb-3 flex-wrap">
              <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">
                模型不是"知道答案"，而是给每个候选词
                <span className="relative inline-block text-ink mx-0.5">
                  打分
                  <SquiggleUnderline className="text-ink/60" />
                </span>
              </h2>
              <TryBadge>动手玩</TryBadge>
            </div>

            {state.exampleData && (
              <div className="stage">
                <span className="stage-label">交互区 · 你的回合 →</span>

                {/* 紧凑版当前文本（一行） + 右侧"换其他文本"快捷入口 */}
                <GeneratedTextDisplay
                  prompt={state.exampleData.prompt}
                  generated={state.generatedTokens}
                  compact
                  trailing={
                    index ? (
                      <InlineExampleSwitcher
                        examples={index.examples}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                      />
                    ) : null
                  }
                />

                {/* 上下布局：柱状图横满 → 参数横向 3 列 */}
                <div className="mt-3">
                  <div className="flex items-baseline justify-between mb-1.5 gap-2 flex-wrap">
                    <h3 className="font-serif text-sm text-ink-dark">
                      {state.demoMode
                        ? `第 ${state.currentStepIndex + 1} 步 · 真实分布`
                        : 'top 20 候选词的概率分布'}
                    </h3>
                    {state.demoMode && (
                      <span className="step-pill bg-ember/15 text-ember-dark border-ember/30">演示模式</span>
                    )}
                  </div>
                  <DistributionChart
                    distribution={derived.distribution}
                    highlightIndex={highlightIndex}
                    height={240}
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-ink/10">
                  <h3 className="font-serif text-sm text-ink-dark mb-2.5">采样参数</h3>
                  <ParamControls
                    temperature={state.temperature}
                    topK={state.topK}
                    topP={state.topP}
                    disabled={state.demoMode}
                    onTemperatureChange={(v) => dispatch({ type: 'SET_TEMPERATURE', value: v })}
                    onTopKChange={(v) => dispatch({ type: 'SET_TOPK', value: v })}
                    onTopPChange={(v) => dispatch({ type: 'SET_TOPP', value: v })}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        <WavyDivider className="text-ink/20 mb-10" />

        {/* === 章节 3：温度叙事 === */}
        <section className="mb-10 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="03" />
          <div className="max-w-prose">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-3">
              那么，<span className="relative inline-block text-ember-dark">温度<SquiggleUnderline className="text-ember/70" /></span> 到底在调什么？
            </h2>
            <p className="text-text-muted leading-relaxed mb-3">
              它不是在"调整模型对哪个词更有信心"——模型的信心已经定了。它在调的是：
              <strong className="text-text">这些信心被采样时，差距被放大还是被压平。</strong>
            </p>
            <ul className="space-y-2 mb-4 text-text-muted">
              <li>
                <strong className="text-text">↓ 低温：</strong>差距放大，最有信心那个词几乎一定被选中（确定、刻板）
              </li>
              <li>
                <strong className="text-text">↑ 高温：</strong>差距压平，低概率的词也有机会（更随机、有创意，但易胡说）
              </li>
            </ul>
            <p className="text-xs text-text-muted/70 italic">
              ※ 这是简化说法。数学上 temperature 是 softmax 的除数。
            </p>
          </div>
        </section>

        {/* === 章节 4：Top-k / Top-p === */}
        <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
          <ChapterNumber n="04" />
          <div className="max-w-prose">
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-3">
              <span className="relative inline-block text-ember-dark">Top-k<SquiggleUnderline className="text-ember/70" /></span>
              {' '}和{' '}
              <span className="relative inline-block text-ember-dark">Top-p<SquiggleUnderline className="text-ember/70" /></span>
              {' '}又是什么？
            </h2>
            <p className="text-text-muted leading-relaxed mb-3">
              温度调的是分布的<em>形状</em>。Top-k 和 Top-p 调的是另一件事：
              <strong className="text-text">从分布的多大范围里挑。</strong>
            </p>
            <ul className="space-y-2 text-text-muted">
              <li>
                <strong className="text-text">Top-k = 5：</strong>只从最有可能的 5 个词里挑
              </li>
              <li>
                <strong className="text-text">Top-p = 0.9：</strong>从概率排序累加超 90% 的那批词里挑——分布越平，候选池越大
              </li>
            </ul>
          </div>
        </section>

        <WavyDivider className="text-ink/20 mb-10" />

        {/* === 章节 5：PM 视角 === */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <ChapterNumber n="05" />
            <div>
              <p className="text-sm uppercase tracking-widest text-ember-dark">PM 视角</p>
              <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">不同产品场景，参数选型对比</h2>
            </div>
          </div>
          <PMPerspectiveCards />
        </section>

        <WavyDivider className="text-ink/20 my-10" />

        <DeepDiveSampling />

        {/* 章节出口 */}
        <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
          <p className="text-text-muted leading-relaxed mb-5 max-w-prose">
            现在你已经理解了：模型如何从概率分布里挑出下一个词。
            但模型不是只挑一个词——它要把这个词加回去，再挑下一个，直到一段话写完。
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/" className="btn-secondary">
              ← 回到首页
            </Link>
            <Link href="/loop" className="btn-primary">
              下一章 · Detokenization →
            </Link>
          </div>
        </section>
      </main>

      {/* 页面级浮动操作条：始终常驻视口底部 */}
      <FloatingSampleBar
        visible={!!state.exampleData}
        demoMode={state.demoMode}
        isAtEnd={derived.isAtEnd}
        hasGenerated={state.generatedTokens.length > 0}
        onSampleFirst={handleSampleFirst}
        onAdvanceDemo={handleAdvanceDemo}
        onReset={handleReset}
      />
    </>
  );
}
