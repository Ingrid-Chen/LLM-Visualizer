// 首页全流程 mock 数据生成器
//
// 给 5 个预设例子各生成 7 步贯穿数据，让首页能演示一段文字经过 LLM 7 道工序的全过程。
// 数据格式见 src/lib/types.ts 的 PipelineData。
// 真实 API 接入后只需替换本脚本，前端无需改动。
//
// 跑这个脚本：npm run generate:mock

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type {
  ExampleData,
  PipelineData,
  PipelineIndexData,
  PipelineIndexEntry,
} from '../src/lib/types';

// ==================== 每个例子的人工 token 切分（mock） ====================
// 真实 tokenizer 切分可能不一样，但这里是 mock 用于演示。token_ids 也是占位数字。

const TOKEN_SPLITS: Record<string, { tokens: string[]; token_ids: number[] }> = {
  capital_china: {
    tokens: ['中国', '的', '首都', '是'],
    token_ids: [16482, 1764, 18456, 6135],
  },
  capital_france_en: {
    // 英文典型切分：单词通常带前导空格 " word"
    tokens: ['The', ' capital', ' of', ' France', ' is'],
    token_ids: [785, 5500, 315, 9822, 374],
  },
  favorite_fruit: {
    tokens: ['我', '最', '喜欢', '的', '水果', '是'],
    token_ids: [3922, 5292, 23128, 1764, 30412, 6135],
  },
  pizza_emoji: {
    // emoji 通常占 2-3 个 byte-level token，这里 mock 简化为单独一个 token，
    // viz 上加注释说明真实成本
    tokens: ['I', ' love', ' pizza', ' 🍕', ' because'],
    token_ids: [40, 3021, 23798, 11410, 1606],
  },
  weather_today: {
    tokens: ['今天', '天气', '真'],
    token_ids: [21548, 22812, 1996],
  },
  she_said: {
    tokens: ['她', '说', '：'],
    token_ids: [10186, 1810, 8326],
  },
};

// 每个例子里，最后一个 token 的注意力分布（mock，权重和 ≈ 1）
// 演示重点：让用户感受"模型在选下一个词时，更看哪些上文"
const ATTENTION_FROM_LAST: Record<string, { to: string; w: number }[]> = {
  capital_china: [
    { to: '中国', w: 0.32 },
    { to: '的', w: 0.05 },
    { to: '首都', w: 0.51 }, // "首都" 是关键上下文
    { to: '是', w: 0.12 },
  ],
  capital_france_en: [
    { to: 'The', w: 0.04 },
    { to: ' capital', w: 0.28 },
    { to: ' of', w: 0.04 },
    { to: ' France', w: 0.55 }, // "France" 是关键上下文
    { to: ' is', w: 0.09 },
  ],
  favorite_fruit: [
    { to: '我', w: 0.06 },
    { to: '最', w: 0.05 },
    { to: '喜欢', w: 0.18 },
    { to: '的', w: 0.04 },
    { to: '水果', w: 0.55 }, // "水果" 是关键上下文
    { to: '是', w: 0.12 },
  ],
  pizza_emoji: [
    { to: 'I', w: 0.05 },
    { to: ' love', w: 0.1 },
    { to: ' pizza', w: 0.25 },
    { to: ' 🍕', w: 0.5 }, // emoji 是关键上下文（视觉锚点）
    { to: ' because', w: 0.1 },
  ],
  weather_today: [
    { to: '今天', w: 0.22 },
    { to: '天气', w: 0.62 },
    { to: '真', w: 0.16 },
  ],
  she_said: [
    { to: '她', w: 0.18 },
    { to: '说', w: 0.7 },
    { to: '：', w: 0.12 },
  ],
};

// Embedding 第一个 token 的前 8 维示意值（mock，看起来"像是"嵌入向量）
function makeEmbeddingSample(seed: string): number[] {
  // 用 token 字符的 charCode 做 deterministic 噪音
  const code = seed.charCodeAt(0);
  return Array.from({ length: 8 }, (_, i) =>
    Number(((Math.sin(code * 0.13 + i * 0.7) * 0.6).toFixed(3)),
  ));
}

// ==================== 生成 ====================

function buildPipeline(exampleId: string, sampling: ExampleData): PipelineData {
  const split = TOKEN_SPLITS[exampleId];
  if (!split) throw new Error(`没有为 ${exampleId} 配置 token 切分`);

  const lastToken = split.tokens[split.tokens.length - 1];
  const attention = ATTENTION_FROM_LAST[exampleId];
  if (!attention) throw new Error(`没有为 ${exampleId} 配置 attention 权重`);

  // logits 取 sampling 第一步的 top 5（首页只需展示精华）
  const step0 = sampling.steps[0];
  const logitsTop = step0.top_logprobs.slice(0, 5).map((l) => ({
    token: l.token,
    prob: Math.exp(l.logprob),
  }));
  // 归一化（top 5 不一定加和为 1，重新分配让首页看着自然）
  const sumProb = logitsTop.reduce((a, b) => a + b.prob, 0);
  for (const item of logitsTop) item.prob = item.prob / sumProb;

  return {
    example_id: exampleId,
    prompt: sampling.prompt,
    prompt_zh_label: sampling.prompt_zh_label,
    steps: {
      tokenization: split,
      embedding: {
        dim: 1536,
        sample_first_token: makeEmbeddingSample(split.tokens[0]),
      },
      positional_encoding: {
        positions: split.tokens.map((_, i) => i),
      },
      transformer: {
        layers: 32,
        heads: 32,
        attention_sample: {
          from_token: lastToken,
          weights: attention,
        },
      },
      logits_top: logitsTop,
      sampling: {
        selected_token: step0.greedy_token,
        method: 'greedy',
      },
      detokenization: {
        decoded_text: step0.greedy_token,
        will_loop: true,
      },
    },
  };
}

function main() {
  const samplingDir = join(process.cwd(), 'public', 'data', 'sampling');
  const outDir = join(process.cwd(), 'public', 'data', 'pipeline');
  mkdirSync(outDir, { recursive: true });

  // 读 sampling 模块的 5 个例子，作为 logits 数据来源
  const samplingIndex = JSON.parse(
    readFileSync(join(samplingDir, 'index.json'), 'utf-8'),
  ) as { examples: { id: string; label: string; category: string }[] };

  const indexEntries: PipelineIndexEntry[] = [];
  for (const entry of samplingIndex.examples) {
    const samplingData = JSON.parse(
      readFileSync(join(samplingDir, `${entry.id}.json`), 'utf-8'),
    ) as ExampleData;

    const pipeline = buildPipeline(entry.id, samplingData);
    const file = join(outDir, `${entry.id}.json`);
    writeFileSync(file, JSON.stringify(pipeline, null, 2), 'utf-8');
    console.log(`  ✓ ${file}`);

    indexEntries.push({
      id: entry.id,
      prompt: pipeline.prompt,
      prompt_zh_label: pipeline.prompt_zh_label,
      category: entry.category as PipelineIndexEntry['category'],
    });
  }

  const index: PipelineIndexData = { examples: indexEntries };
  const indexFile = join(outDir, 'index.json');
  writeFileSync(indexFile, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`  ✓ ${indexFile}`);
  console.log(`\nPipeline mock 数据生成完毕：${indexEntries.length} 个例子 × 7 步`);
}

main();
