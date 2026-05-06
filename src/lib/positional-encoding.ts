// Sinusoidal Positional Encoding —— 经典 Transformer (Vaswani et al. 2017) 的位置编码
//
// 公式：
//   PE(pos, 2i)   = sin(pos / 10000^(2i/dim))
//   PE(pos, 2i+1) = cos(pos / 10000^(2i/dim))
//
// 性质：
//   1. 每个位置都有独特的"指纹"向量
//   2. 不需要训练，纯数学函数
//   3. 理论上可外推到训练时没见过的更长序列（实际效果 RoPE / ALiBi 更好）

export function sinusoidalPE(pos: number, dim: number): number[] {
  const result: number[] = [];
  for (let i = 0; i < dim; i++) {
    // 一对 (2i, 2i+1) 共用同一个 frequency
    const pairIndex = Math.floor(i / 2);
    const angle = pos / Math.pow(10000, (2 * pairIndex) / dim);
    result.push(i % 2 === 0 ? Math.sin(angle) : Math.cos(angle));
  }
  return result;
}

/** 一次性算 0..N 的所有位置 PE，返回 N×dim 矩阵 */
export function sinusoidalMatrix(numPositions: number, dim: number): number[][] {
  const matrix: number[][] = [];
  for (let p = 0; p < numPositions; p++) {
    matrix.push(sinusoidalPE(p, dim));
  }
  return matrix;
}
