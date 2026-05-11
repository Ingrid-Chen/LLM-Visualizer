'use client';

import { useState } from 'react';

import { inputCost, MODEL_PRICING, PRICING_AS_OF, type ModelPricing } from '@/lib/api-pricing';
import { useTokenize } from '@/lib/useTokenizer';
import { useT } from '@/lib/i18n/LangContext';

// Texts kept as-is (demo data). Labels and rationales come from dict.
const PRESET_TEXTS = [
  '您好！您的订单已发货，预计明天送达。如有任何问题，请联系客服热线。',
  '基于以下上下文回答用户问题：「LLM Visualizer 是一个面向 LLM 入门用户的可视化交互科普网站。」用户问：什么是这个产品？请用一段话回答。',
  'Translate to Chinese: The history of large language models traces back to early statistical NLP, but the field changed forever in 2017 when Vaswani et al. published "Attention Is All You Need."',
];

const PRESET_TIMES = [100_000, 1_000_000, 10_000];

export default function CostEstimator() {
  const t = useT();
  const [presetIdx, setPresetIdx] = useState(0);
  const [text, setText] = useState(PRESET_TEXTS[0]);
  const [times, setTimes] = useState(PRESET_TIMES[0]);

  const result = useTokenize(text, 'cl100k_base');

  const handlePresetChange = (i: number) => {
    setPresetIdx(i);
    setText(PRESET_TEXTS[i]);
    setTimes(PRESET_TIMES[i]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-text-muted self-center mr-1">{t('tokenization.comp.cost.scenarioLabel')}</span>
        {PRESET_TEXTS.map((_, i) => (
          <button
            key={i}
            onClick={() => handlePresetChange(i)}
            className={[
              'text-xs px-3 py-1 rounded-full border transition-colors',
              i === presetIdx ? 'border-ink bg-ink text-cream-50' : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {t(`tokenization.comp.cost.scenarios.${i}.label`)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="text-xs uppercase tracking-wider text-text-muted block mb-1">{t('tokenization.comp.cost.textLabel')}</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full p-2.5 rounded-lg border-2 border-ink/15 bg-cream-50 font-serif text-sm resize-y focus:outline-none focus:border-ink/50"
          />
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-wider text-text-muted block mb-1">{t('tokenization.comp.cost.callsLabel')}</label>
            <input
              type="number"
              value={times}
              onChange={(e) => setTimes(Math.max(0, Number(e.target.value)))}
              className="w-full p-2 rounded-lg border-2 border-ink/15 bg-cream-50 font-mono text-sm focus:outline-none focus:border-ink/50"
            />
            <p className="text-[10px] text-text-muted/80 mt-1.5 leading-relaxed">
              💡 {t(`tokenization.comp.cost.scenarios.${presetIdx}.timesRationale`)}{t('tokenization.comp.cost.timesHintSuffix')}
            </p>
          </div>
          <div className="text-xs text-text-muted leading-relaxed">
            <span className="text-text-muted/70">{t('tokenization.comp.cost.tokensPerCallLabel')}</span>
            <span className="font-mono text-ember-dark font-bold">{result.tokenCount}</span>
            <br />
            <span className="text-text-muted/70">{t('tokenization.comp.cost.totalTokensLabel')}</span>
            <span className="font-mono text-text font-bold">{(result.tokenCount * times).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs uppercase tracking-wider text-text-muted mb-2">
          {t('tokenization.comp.cost.costHeading', { timesLabel: t(`tokenization.comp.cost.scenarios.${presetIdx}.timesLabel`) })}
        </h4>
        <div className="space-y-1.5">
          {MODEL_PRICING.map((m) => {
            const cost = inputCost(result.tokenCount * times, m);
            return <CostRow key={m.name} model={m} cost={cost} />;
          })}
        </div>
        <p className="text-[11px] text-text-muted/70 mt-3 leading-relaxed">
          {t('tokenization.comp.cost.caveat', { date: PRICING_AS_OF })}
        </p>
      </div>
    </div>
  );
}

function CostRow({ model, cost }: { model: ModelPricing; cost: number }) {
  const t = useT();
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-cream-50 border border-ink/10">
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-text truncate">{model.name}</div>
        <div className="text-[10px] text-text-muted">
          {model.provider} · ${model.inputPerMillion}{t('tokenization.comp.cost.inputPerMillion')}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-mono text-base font-bold text-ember-dark">${cost.toFixed(2)}</div>
      </div>
    </div>
  );
}
