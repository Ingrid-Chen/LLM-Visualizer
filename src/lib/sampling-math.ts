// Sampling 模块核心数学函数
// 严格对应 docs/Sampling-DevSpec.md 第 6.3 - 6.7 节
// ⚠️ 这部分公式不能写错——温度模拟成立的前提是数据生成时 temperature=1.0

import type { ComputedToken, TopLogprob } from './types';

/**
 * 按温度参数 T 重算概率分布。
 *
 * 数学前提：raw logprobs 来自 temperature=1.0 的 API 调用。
 * 公式：P_new_i = exp(logprob_i / T) / sum_j(exp(logprob_j / T))
 *
 * 数值稳定性：先减去最大值再 exp，避免 logprob/T 在大数时溢出。
 */
export function applyTemperature(logprobs: number[], T: number): number[] {
  // T 接近 0 退化为 argmax（避免除零）
  if (T < 0.001) {
    let maxIdx = 0;
    for (let i = 1; i < logprobs.length; i++) {
      if (logprobs[i] > logprobs[maxIdx]) maxIdx = i;
    }
    return logprobs.map((_, i) => (i === maxIdx ? 1 : 0));
  }

  const scaled = logprobs.map((lp) => lp / T);
  const maxScaled = Math.max(...scaled);
  const expValues = scaled.map((s) => Math.exp(s - maxScaled));
  const sumExp = expValues.reduce((a, b) => a + b, 0);
  return expValues.map((e) => e / sumExp);
}

/**
 * Top-k 截断：只保留概率最高的 k 个 token，其余置零，归一化。
 * k=null 表示不启用。
 */
export function applyTopK(probs: number[], k: number | null): { kept: boolean[]; probs: number[] } {
  if (k === null || k >= probs.length) {
    return { kept: probs.map(() => true), probs: [...probs] };
  }

  const sorted = [...probs].sort((a, b) => b - a);
  const threshold = sorted[k - 1];

  const kept = probs.map((p) => p >= threshold);
  const masked = probs.map((p, i) => (kept[i] ? p : 0));
  const sum = masked.reduce((a, b) => a + b, 0);
  const out = sum > 0 ? masked.map((p) => p / sum) : masked;
  return { kept, probs: out };
}

/**
 * Top-p（nucleus）截断：按概率降序累加，直到累计 ≥ p，剩余置零，归一化。
 * p=1 表示不启用。
 */
export function applyTopP(probs: number[], p: number): { kept: boolean[]; probs: number[] } {
  if (p >= 1) {
    return { kept: probs.map(() => true), probs: [...probs] };
  }

  // 按概率降序排序，记住原始索引
  const indexed = probs.map((prob, idx) => ({ prob, idx })).sort((a, b) => b.prob - a.prob);

  const keptSet = new Set<number>();
  let cumulative = 0;
  for (const item of indexed) {
    keptSet.add(item.idx);
    cumulative += item.prob;
    if (cumulative >= p) break;
  }

  const kept = probs.map((_, i) => keptSet.has(i));
  const masked = probs.map((prob, i) => (kept[i] ? prob : 0));
  const sum = masked.reduce((a, b) => a + b, 0);
  const out = sum > 0 ? masked.map((prob) => prob / sum) : masked;
  return { kept, probs: out };
}

/**
 * 综合应用三个采样参数，返回带元信息的 ComputedToken[] 用于柱状图渲染与采样。
 *
 * 应用顺序（DevSpec 6.6）：
 * 1. Temperature 重算
 * 2. Top-p 截断
 * 3. Top-k 截断
 */
export function computeFinalDistribution(
  topLogprobs: TopLogprob[],
  T: number,
  topK: number | null,
  topP: number,
): ComputedToken[] {
  const tokens = topLogprobs.map((l) => l.token);
  const lp = topLogprobs.map((l) => l.logprob);

  const probsAfterT = applyTemperature(lp, T);
  const afterP = applyTopP(probsAfterT, topP);
  const afterK = applyTopK(afterP.probs, topK);

  // 同一个位置：top-p 砍掉 OR top-k 砍掉 => 视为未保留
  const finalKept = afterP.kept.map((kp, i) => kp && afterK.kept[i]);

  // originalRank 按原始 logprob 降序排列（0 = 第一名）
  const ranks = computeRanks(lp);

  return topLogprobs.map((_, i) => ({
    token: tokens[i],
    prob: afterK.probs[i],
    isKept: finalKept[i],
    originalRank: ranks[i],
  }));
}

/**
 * 直接展示一个原始分布（演示模式用）：仅 softmax 不做温度/截断。
 * 因为 raw logprob 已经是 temperature=1.0 下的 log 概率，所以直接 exp 即可。
 */
export function rawDistributionForDisplay(topLogprobs: TopLogprob[]): ComputedToken[] {
  const lp = topLogprobs.map((l) => l.logprob);
  // 数值稳定 softmax（理论上 OpenAI 返回的已经是合理 logprob，这里只是兜底归一化）
  const maxLp = Math.max(...lp);
  const expValues = lp.map((v) => Math.exp(v - maxLp));
  const sum = expValues.reduce((a, b) => a + b, 0);
  const probs = expValues.map((v) => v / sum);
  const ranks = computeRanks(lp);

  return topLogprobs.map((tl, i) => ({
    token: tl.token,
    prob: probs[i],
    isKept: true,
    originalRank: ranks[i],
  }));
}

/**
 * 按当前最终分布按概率采样一个 token 索引。
 */
export function sampleIndexFromDistribution(probs: number[]): number {
  const total = probs.reduce((a, b) => a + b, 0);
  if (total <= 0) return 0; // 兜底：所有概率被截没了，返回第一个
  const r = Math.random() * total;
  let cumulative = 0;
  for (let i = 0; i < probs.length; i++) {
    cumulative += probs[i];
    if (r < cumulative) return i;
  }
  return probs.length - 1;
}

// 辅助：计算降序 rank
function computeRanks(values: number[]): number[] {
  const sorted = [...values].map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  const ranks = new Array<number>(values.length);
  sorted.forEach((entry, rank) => {
    ranks[entry.i] = rank;
  });
  return ranks;
}
