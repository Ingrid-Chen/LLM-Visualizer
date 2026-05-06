// Sampling 模块共享类型 —— 与 docs/Sampling-DevSpec.md 第 4.2 节 / 5.2 节一致

export type Certainty = 'high_certainty' | 'medium_certainty' | 'low_certainty';

export interface TopLogprob {
  token: string;
  logprob: number;
}

export interface Step {
  step_index: number;
  prompt_so_far: string;
  top_logprobs: TopLogprob[];
  greedy_token: string;
}

export interface ExampleData {
  id: string;
  prompt: string;
  prompt_zh_label: string;
  category: Certainty;
  model: string;
  generated_at: string;
  steps: Step[];
}

export interface IndexEntry {
  id: string;
  label: string;
  category: Certainty;
  description: string;
}

export interface IndexData {
  examples: IndexEntry[];
}

// 用户当前看到的某个 token 的最终展示项
export interface ComputedToken {
  token: string;
  prob: number;        // 重算后的概率（0-1）
  isKept: boolean;     // 是否在 top-k / top-p 截断后保留
  originalRank: number; // 在原始 top 20 里的排名（0 开始）
}

// ==================== 首页全流程 pipeline 数据 ====================
// 7 步贯穿数据：每个预设例子生成一份，让用户看到一段文字经过 LLM 7 道工序的全过程
// 文档对应：PRD 4.2 八个模块 + 4.3 统一交互骨架

export interface PipelineData {
  example_id: string;
  prompt: string;
  prompt_zh_label: string;
  steps: {
    tokenization: {
      tokens: string[];
      token_ids: number[];
    };
    embedding: {
      dim: number; // 真实模型维度（如 1536）
      sample_first_token: number[]; // 第一个 token 的前 8 维示意（实际 1536 维不可视）
    };
    positional_encoding: {
      positions: number[]; // 0,1,2,...
    };
    transformer: {
      layers: number;
      heads: number;
      // 演示用：模型在最后一层、所有 head 平均后，从最后一个 token 看其他 token 的注意力权重
      attention_sample: {
        from_token: string;
        weights: { to: string; w: number }[];
      };
    };
    // 输出层 logits 直接复用 sampling 第一步的 top_logprobs，但首页只展示 top 5
    logits_top: { token: string; prob: number }[];
    sampling: {
      selected_token: string;
      method: 'greedy';
    };
    detokenization: {
      decoded_text: string;
      will_loop: boolean;
    };
  };
}

export interface PipelineIndexEntry {
  id: string;
  prompt: string;
  prompt_zh_label: string;
  category: Certainty;
}

export interface PipelineIndexData {
  examples: PipelineIndexEntry[];
}

// ==================== Embedding 模块数据 ====================
// 由 scripts/generate-mock-embedding-data.ts 生成
// PRD 4.4 明示"可以是预生成的静态图，不必实时计算"——所以全 mock，叙事用而已

export type EmbeddingCategory = 'fruit' | 'animal' | 'city' | 'time';

export interface EmbeddingWord {
  word: string;
  category: EmbeddingCategory;
  /** 降维到 2D 后的坐标，用于散点图 */
  x: number;
  y: number;
  /** 前 8 维"示意值"，用于章节 1 的向量切片 viz（实际 1536 维不可视） */
  sample8: number[];
}

export interface EmbeddingData {
  /** 真实模型的 embedding 维度 */
  realDim: number;
  /** 数据生成日期 / 来源说明 */
  source: string;
  words: EmbeddingWord[];
}

// ==================== Transformer / Attention 模块数据 ====================

export interface AttentionExample {
  id: string;
  label: string;
  tokens: string[];
  /** 该例子要演示的"看点"——比如"指代消解"、"长距离依赖" */
  highlight: string;
  /** 多层注意力矩阵：layers[layerIdx][i][j] = token i 看 token j 的权重（0-1，每行和约为 1） */
  layers: number[][][];
  /** 每层的"重点 from token"索引（用于默认 hover） */
  defaultFromIdx: number;
}

export interface AttentionData {
  source: string;
  examples: AttentionExample[];
}
