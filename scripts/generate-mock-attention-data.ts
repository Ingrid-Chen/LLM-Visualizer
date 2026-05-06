// Transformer 模块的 attention mock 数据
//
// PRD 4.4 要求"3-4 个精心设计的预设句子（含指代、长距离依赖、长 context 等情况）"
// 我们手编几个有代表性的句子 + N×N attention 矩阵——
// mock 不是 mock 数据集本身，而是 mock 真实模型在这些 prompt 上的注意力权重分布。
// UI 必须明示"这是教学演示用的合理近似，不是真实 GPT 输出的注意力权重"
//
// 跑：npx tsx scripts/generate-mock-attention-data.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { AttentionData, AttentionExample } from '../src/lib/types';

// 工具：把一行权重归一化使行和 = 1
function normalize(row: number[]): number[] {
  const sum = row.reduce((a, b) => a + b, 0);
  if (sum === 0) return row.map(() => 1 / row.length);
  return row.map((v) => v / sum);
}

// 工具：构造一个"指代主导"的注意力矩阵——某个 token 强烈看向另一个 token
// 输入：n（token 数）, 关键 from-to 对：[(fromIdx, toIdx, strength), ...]
function buildAttention(n: number, hotPairs: { from: number; to: number; weight: number }[]): number[][] {
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = new Array(n).fill(0.5); // 基础噪音权重
    // 自注意力（看自己）默认稍高
    row[i] = 1.5;
    // 应用 hot pairs
    for (const p of hotPairs) {
      if (p.from === i) {
        row[p.to] += p.weight;
      }
    }
    matrix.push(normalize(row));
  }
  return matrix;
}

// ==================== 例子设计 ====================

// 例子 1：指代消解
// "Lucy 把书放在桌上 因为 她 累 了" → "她" 应当看向 "Lucy"
const ex1Tokens = ['Lucy', '把', '书', '放在', '桌上', '因为', '她', '累', '了'];
const ex1: AttentionExample = {
  id: 'pronoun_resolve',
  label: '指代消解：「她」指谁？',
  tokens: ex1Tokens,
  highlight: '看 "她"（idx=6）的注意力——它强烈看向 "Lucy"（idx=0）',
  defaultFromIdx: 6, // "她"
  layers: [
    // Layer 0: 早期层主要看相邻 token（局部）
    buildAttention(ex1Tokens.length, [
      { from: 0, to: 1, weight: 1.0 },
      { from: 1, to: 0, weight: 0.5 },
      { from: 1, to: 2, weight: 1.0 },
      { from: 2, to: 1, weight: 0.5 },
      { from: 2, to: 3, weight: 1.0 },
      { from: 6, to: 5, weight: 1.5 },
      { from: 6, to: 7, weight: 1.0 },
    ]),
    // Layer 1: 中间层开始建立短距离语义关系
    buildAttention(ex1Tokens.length, [
      { from: 6, to: 0, weight: 1.5 }, // 她→Lucy 开始浮现
      { from: 6, to: 5, weight: 1.0 },
      { from: 7, to: 6, weight: 1.5 },
      { from: 8, to: 7, weight: 1.5 },
    ]),
    // Layer 2: 深层完全建立指代关系
    buildAttention(ex1Tokens.length, [
      { from: 6, to: 0, weight: 4.0 }, // 她→Lucy 强烈
      { from: 6, to: 7, weight: 1.0 },
      { from: 7, to: 6, weight: 1.5 },
      { from: 7, to: 0, weight: 1.5 },
    ]),
  ],
};

// 例子 2：长距离依赖
// "今天 我 在 公园 里 看到 一只 流浪 的 小 黑 猫"——"看到"应该看向后面的"猫"
const ex2Tokens = ['今天', '我', '在', '公园', '里', '看到', '一只', '流浪', '的', '小', '黑', '猫'];
const ex2: AttentionExample = {
  id: 'long_distance',
  label: '长距离依赖：「看到」的对象是？',
  tokens: ex2Tokens,
  highlight: '看 "看到"（idx=5）的注意力——它跨过 6 个修饰词，最终看向 "猫"（idx=11）',
  defaultFromIdx: 5,
  layers: [
    buildAttention(ex2Tokens.length, [
      { from: 5, to: 4, weight: 1.0 },
      { from: 5, to: 6, weight: 1.0 },
      { from: 11, to: 10, weight: 1.0 },
    ]),
    buildAttention(ex2Tokens.length, [
      { from: 5, to: 6, weight: 1.5 },
      { from: 5, to: 11, weight: 1.0 }, // 浮现
      { from: 11, to: 10, weight: 1.0 },
      { from: 11, to: 9, weight: 0.8 },
    ]),
    buildAttention(ex2Tokens.length, [
      { from: 5, to: 11, weight: 4.0 }, // 看到→猫 跨距离强烈
      { from: 5, to: 6, weight: 1.0 },
      { from: 11, to: 7, weight: 1.0 }, // 猫→流浪 形容词
      { from: 11, to: 10, weight: 1.0 }, // 猫→黑
    ]),
  ],
};

// 例子 3：上下文歧义（一词多义）
// "他 把 苹果 卖 给 了 我"——"苹果"在这个上下文是水果，不是公司
// vs "他 用 苹果 写 代码"——"苹果"在这个上下文倾向公司/电脑
// 这个例子：歧义解决靠上下文动词
const ex3Tokens = ['他', '用', '苹果', '写', '代码'];
const ex3: AttentionExample = {
  id: 'word_sense',
  label: '上下文歧义：「苹果」是水果还是公司？',
  tokens: ex3Tokens,
  highlight: '看 "苹果"（idx=2）的注意力——它会强烈看向"用""写""代码"，让模型理解这里指公司/电脑',
  defaultFromIdx: 2,
  layers: [
    buildAttention(ex3Tokens.length, [
      { from: 2, to: 1, weight: 1.0 },
      { from: 2, to: 3, weight: 1.0 },
    ]),
    buildAttention(ex3Tokens.length, [
      { from: 2, to: 1, weight: 1.5 }, // 用
      { from: 2, to: 3, weight: 1.5 }, // 写
      { from: 2, to: 4, weight: 1.0 }, // 代码
    ]),
    buildAttention(ex3Tokens.length, [
      { from: 2, to: 4, weight: 3.0 }, // 苹果 ← 代码（关键消歧）
      { from: 2, to: 3, weight: 2.0 }, // 苹果 ← 写
      { from: 2, to: 1, weight: 1.5 }, // 苹果 ← 用
    ]),
  ],
};

const data: AttentionData = {
  source: 'mock-v0.1（手编 attention 矩阵示意，不是真实 GPT 输出）',
  examples: [ex1, ex2, ex3],
};

const outDir = join(process.cwd(), 'public', 'data', 'transformer');
mkdirSync(outDir, { recursive: true });
const file = join(outDir, 'attention.json');
writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
console.log(`  ✓ ${file}`);
console.log(`Attention mock 数据生成完毕：${data.examples.length} 个例子 × 3 层`);
