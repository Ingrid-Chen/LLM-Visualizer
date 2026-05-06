// Embedding 模块 mock 数据生成器
//
// PRD 4.4 模块 2 是"轻量"，明示可以预生成静态图。
// 这里手编一组合理的 2D 坐标 + 8 维向量示意，用于 Embedding 模块叙事。
// UI 必须明示"是降维到 2D 的简化示意"——不允许误导用户以为模型真的在 2D 比对语义。
//
// 跑：npx tsx scripts/generate-mock-embedding-data.ts

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { EmbeddingCategory, EmbeddingData, EmbeddingWord } from '../src/lib/types';

// ==================== 4 个类别的 2D 投影中心（手编） ====================
// 设计原则：四个角各放一类，让聚类视觉效果明显
const CATEGORY_CENTERS: Record<EmbeddingCategory, { x: number; y: number }> = {
  fruit: { x: 4.0, y: 4.0 }, // 右上
  animal: { x: 4.0, y: -3.8 }, // 右下
  city: { x: -4.0, y: -3.8 }, // 左下
  time: { x: -4.0, y: 4.0 }, // 左上
};

// 每个词在中心附近随机抖一点（保持聚类感同时不完全重叠）
function jitter(seed: number, range = 0.6): number {
  // deterministic noise based on seed
  return (Math.sin(seed * 12.9898) * 0.5 + Math.cos(seed * 78.233) * 0.5) * range;
}

const WORD_GROUPS: Record<EmbeddingCategory, string[]> = {
  fruit: ['苹果', '橘子', '香蕉', '西瓜', '草莓', '葡萄'],
  animal: ['猫', '狗', '马', '牛', '羊', '鸟'],
  city: ['北京', '上海', '广州', '深圳', '成都'],
  time: ['昨天', '今天', '明天', '上周', '下周'],
};

// 给每个词造 8 维"示意值"。前 4 维代表"语义身份"（同类相近），后 4 维代表"个体差异"（每个词不同）
// 这是 mock，但保留一个性质：同类的词向量"前 4 维更接近"——用户看到这个数据时能感受到"语义聚类"
function buildSample8(category: EmbeddingCategory, word: string): number[] {
  // 为每个类别造一个"语义指纹"（前 4 维）
  const fingerprint: Record<EmbeddingCategory, number[]> = {
    fruit: [0.62, -0.31, 0.45, -0.18],
    animal: [-0.41, 0.55, 0.22, -0.37],
    city: [-0.28, -0.49, -0.51, 0.34],
    time: [0.39, 0.27, -0.43, 0.58],
  };
  const base = fingerprint[category];

  // 后 4 维：基于 word 字符 hash 的"个体噪音"
  const charSum = word.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const personal = Array.from({ length: 4 }, (_, i) =>
    Number((Math.sin(charSum * 0.13 + i * 0.7) * 0.5).toFixed(3)),
  );

  // 前 4 维基础值 + 小扰动，保留"同类相近"的特性
  const semantic = base.map((b, i) =>
    Number((b + Math.sin(charSum * 0.05 + i * 1.3) * 0.08).toFixed(3)),
  );

  return [...semantic, ...personal];
}

function buildWord(category: EmbeddingCategory, word: string, idx: number): EmbeddingWord {
  const center = CATEGORY_CENTERS[category];
  // 用 word 的 charCodeAt 做 deterministic seed
  const seed = word.charCodeAt(0) + idx * 7;
  return {
    word,
    category,
    x: Number((center.x + jitter(seed)).toFixed(2)),
    y: Number((center.y + jitter(seed + 1)).toFixed(2)),
    sample8: buildSample8(category, word),
  };
}

function main() {
  const words: EmbeddingWord[] = [];
  (Object.keys(WORD_GROUPS) as EmbeddingCategory[]).forEach((cat) => {
    WORD_GROUPS[cat].forEach((w, i) => {
      words.push(buildWord(cat, w, i));
    });
  });

  const data: EmbeddingData = {
    realDim: 1536, // text-embedding-3-small 的真实维度
    source: 'mock-v0.1（手编 2D 坐标 + 8 维示意值，仅供教学。真实数据见 OpenAI text-embedding-3-small）',
    words,
  };

  const outDir = join(process.cwd(), 'public', 'data', 'embedding');
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, 'words.json');
  writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✓ ${file}`);
  console.log(`Embedding mock 数据生成完毕：${words.length} 个词，4 个类别`);
}

main();
