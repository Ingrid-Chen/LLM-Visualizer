'use client';

import { useState } from 'react';

import { inputCost, MODEL_PRICING, PRICING_AS_OF, type ModelPricing } from '@/lib/api-pricing';
import { useTokenize } from '@/lib/useTokenizer';

const COST_PRESETS = [
  {
    label: '一句客服回复',
    text: '您好！您的订单已发货，预计明天送达。如有任何问题，请联系客服热线。',
    times: 100_000,
    timesLabel: '10 万次客服对话',
    timesRationale: '典型规模参考：中型电商日均客服会话约 10 万次（每个会话 5-10 轮，单轮按这条算）',
  },
  {
    label: 'RAG 单次查询',
    text:
      '基于以下上下文回答用户问题：「LLM Visualizer 是一个面向 LLM 入门用户的可视化交互科普网站。」用户问：什么是这个产品？请用一段话回答。',
    times: 1_000_000,
    timesLabel: '100 万次 RAG 查询',
    timesRationale: '典型规模参考：中型 SaaS 产品的 AI 搜索 / 知识库问答日均约 100 万次查询',
  },
  {
    label: '一篇短文翻译',
    text:
      'Translate to Chinese: The history of large language models traces back to early statistical NLP, but the field changed forever in 2017 when Vaswani et al. published "Attention Is All You Need."',
    times: 10_000,
    timesLabel: '1 万次翻译',
    timesRationale: '典型规模参考：批量翻译任务（新闻聚合、跨境电商商品翻译等）日均约 1 万篇',
  },
];

export default function CostEstimator() {
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = COST_PRESETS[presetIdx];
  const [text, setText] = useState(preset.text);
  const [times, setTimes] = useState(preset.times);

  // 用 cl100k_base 估算（多数主流模型 tokenizer 量级类似——足够 PM 决策用）
  const result = useTokenize(text, 'cl100k_base');

  const handlePresetChange = (i: number) => {
    setPresetIdx(i);
    setText(COST_PRESETS[i].text);
    setTimes(COST_PRESETS[i].times);
  };

  return (
    <div className="space-y-5">
      {/* 场景切换 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-text-muted self-center mr-1">场景：</span>
        {COST_PRESETS.map((p, i) => (
          <button
            key={p.label}
            onClick={() => handlePresetChange(i)}
            className={[
              'text-xs px-3 py-1 rounded-full border transition-colors',
              i === presetIdx
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 输入区 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-wider text-text-muted block mb-1">单次请求文本</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full p-2.5 rounded-lg border-2 border-ink/15 bg-cream-50 font-serif text-sm resize-y focus:outline-none focus:border-ink/50"
          />
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-text-muted block mb-1">调用次数</label>
            <input
              type="number"
              value={times}
              onChange={(e) => setTimes(Math.max(0, Number(e.target.value)))}
              className="w-full p-2 rounded-lg border-2 border-ink/15 bg-cream-50 font-mono text-sm focus:outline-none focus:border-ink/50"
            />
            <p className="text-[10px] text-text-muted/80 mt-1.5 leading-relaxed">
              💡 {preset.timesRationale}（不同场景的"天然规模"差很大——这就是为什么三个场景总成本会差几个数量级）
            </p>
          </div>
          <div className="text-xs text-text-muted leading-relaxed">
            <span className="text-text-muted/70">单次 token 数：</span>
            <span className="font-mono text-ember-dark font-bold">{result.tokenCount}</span>
            <br />
            <span className="text-text-muted/70">总 token 数：</span>
            <span className="font-mono text-text font-bold">
              {(result.tokenCount * times).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 成本对比 */}
      <div>
        <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2">
          {preset.timesLabel}的输入成本估算（仅 input，不含 output）
        </h4>
        <div className="space-y-1.5">
          {MODEL_PRICING.map((m) => {
            const cost = inputCost(result.tokenCount * times, m);
            return <CostRow key={m.name} model={m} cost={cost} />;
          })}
        </div>
        <p className="text-[11px] text-text-muted/70 mt-3 leading-relaxed">
          ※ 成本估算基于 cl100k_base 的 token 数。Claude 系列实际 tokenizer 略有差异，估算可能 ±10%。
          价格数据截至 <strong>{PRICING_AS_OF}</strong>，会变动——以官方价目表为准。
        </p>
      </div>
    </div>
  );
}

function CostRow({ model, cost }: { model: ModelPricing; cost: number }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-cream-50 border border-ink/10">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-text truncate">{model.name}</div>
        <div className="text-[10px] text-text-muted">
          {model.provider} · ${model.inputPerMillion}/M input
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-base font-bold text-ember-dark">${cost.toFixed(2)}</div>
      </div>
    </div>
  );
}
