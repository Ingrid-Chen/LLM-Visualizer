// API 价格表
//
// ⚠️ 数据来源 + 时效：截至 2026-04，OpenAI / Anthropic 官方价目表
//   - OpenAI: https://openai.com/pricing
//   - Anthropic: https://www.anthropic.com/pricing
//
// ⚠️ 这些价格会变！每隔 3-6 个月需要 review 一次。
//   维护方式：直接修改本文件的常量，无需改 UI 代码。

export interface ModelPricing {
  /** 显示名 */
  name: string;
  /** 提供方 */
  provider: 'OpenAI' | 'Anthropic';
  /** 输入价格：美元 / 1M tokens */
  inputPerMillion: number;
  /** 输出价格：美元 / 1M tokens */
  outputPerMillion: number;
  /** 用的 tokenizer encoding（用于成本估算时跟切分结果匹配） */
  tokenizerHint: 'cl100k_base' | 'o200k_base' | 'unknown';
  /** 上下文窗口（token） */
  contextWindow: number;
}

export const MODEL_PRICING: ModelPricing[] = [
  {
    name: 'GPT-4o',
    provider: 'OpenAI',
    inputPerMillion: 2.5,
    outputPerMillion: 10.0,
    tokenizerHint: 'o200k_base',
    contextWindow: 128_000,
  },
  {
    name: 'GPT-4o-mini',
    provider: 'OpenAI',
    inputPerMillion: 0.15,
    outputPerMillion: 0.6,
    tokenizerHint: 'o200k_base',
    contextWindow: 128_000,
  },
  {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    inputPerMillion: 10.0,
    outputPerMillion: 30.0,
    tokenizerHint: 'cl100k_base',
    contextWindow: 128_000,
  },
  {
    name: 'Claude Opus 4',
    provider: 'Anthropic',
    inputPerMillion: 15.0,
    outputPerMillion: 75.0,
    tokenizerHint: 'unknown',
    contextWindow: 200_000,
  },
  {
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    inputPerMillion: 3.0,
    outputPerMillion: 15.0,
    tokenizerHint: 'unknown',
    contextWindow: 200_000,
  },
  {
    name: 'Claude Haiku 4',
    provider: 'Anthropic',
    inputPerMillion: 1.0,
    outputPerMillion: 5.0,
    tokenizerHint: 'unknown',
    contextWindow: 200_000,
  },
];

export const PRICING_AS_OF = '2026-04';

/** 给定 token 数 + 模型，返回输入成本（美元） */
export function inputCost(tokens: number, model: ModelPricing): number {
  return (tokens / 1_000_000) * model.inputPerMillion;
}
