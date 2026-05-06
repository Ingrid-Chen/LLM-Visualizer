'use client';

// Tokenization 模块的 hook —— 用 js-tiktoken 在前端直接跑真实 BPE 切分
// 支持三种主流 encoding，让用户亲眼看到从 GPT-3 到 GPT-4o 的中文 token 数变化

import { getEncoding } from 'js-tiktoken';
import { useMemo } from 'react';

// r50k_base 和 p50k_base 在文本切分上几乎一致（差别仅 280 个代码相关特殊 token），
// 合并成一档"GPT-2/3 时代"展示更清晰
export type TokenizerName = 'r50k_base' | 'cl100k_base' | 'o200k_base';

export const TOKENIZER_META: Record<
  TokenizerName,
  { label: string; modelEra: string; usedBy: string }
> = {
  r50k_base: {
    label: 'GPT-2 / GPT-3 时代',
    modelEra: '2019-2022 · 代号 r50k_base / p50k_base',
    usedBy: 'GPT-2、GPT-3、Codex',
  },
  cl100k_base: {
    label: 'GPT-3.5 / GPT-4 时代',
    modelEra: '2022-2023 · 代号 cl100k_base',
    usedBy: 'GPT-3.5、GPT-4、text-embedding-ada-002',
  },
  o200k_base: {
    label: 'GPT-4o 时代',
    modelEra: '2024 · 代号 o200k_base',
    usedBy: 'GPT-4o、GPT-4o-mini',
  },
};

export interface TokenInfo {
  id: number;
  str: string;
}

export interface TokenizationResult {
  tokens: TokenInfo[];
  tokenCount: number;
  /** 字符数（按 Unicode code point 计，emoji 算 1 个字符） */
  charCount: number;
  /** UTF-8 字节数 */
  byteCount: number;
}

// 缓存 encoder 实例，避免每次 hook 调用都重建（getEncoding 内部会读 vocab JSON）
const encodingCache = new Map<TokenizerName, ReturnType<typeof getEncoding>>();

function getCachedEncoding(name: TokenizerName) {
  let enc = encodingCache.get(name);
  if (!enc) {
    enc = getEncoding(name);
    encodingCache.set(name, enc);
  }
  return enc;
}

export function useTokenize(text: string, encoding: TokenizerName): TokenizationResult {
  return useMemo(() => {
    if (!text) {
      return { tokens: [], tokenCount: 0, charCount: 0, byteCount: 0 };
    }
    const enc = getCachedEncoding(encoding);
    const ids = enc.encode(text);
    const tokens: TokenInfo[] = ids.map((id) => ({ id, str: enc.decode([id]) }));
    return {
      tokens,
      tokenCount: ids.length,
      // 用扩展运算符正确数 Unicode code point（emoji 算 1 个字符而非 surrogate pair 的 2 个）
      charCount: [...text].length,
      // UTF-8 字节数
      byteCount: new TextEncoder().encode(text).length,
    };
  }, [text, encoding]);
}

/** 一次性算多种 tokenizer 的 token 数（中英对比 / 三档对比用） */
export function useMultiTokenCount(
  text: string,
  encodings: TokenizerName[],
): Record<TokenizerName, number> {
  return useMemo(() => {
    const result = {} as Record<TokenizerName, number>;
    if (!text) {
      encodings.forEach((e) => (result[e] = 0));
      return result;
    }
    for (const e of encodings) {
      const enc = getCachedEncoding(e);
      result[e] = enc.encode(text).length;
    }
    return result;
  }, [text, encodings.join(',')]);
}
