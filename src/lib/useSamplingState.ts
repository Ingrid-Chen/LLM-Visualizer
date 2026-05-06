'use client';
// Sampling 模块状态机 —— 严格对应 docs/Sampling-DevSpec.md 第 5.2 / 6.7 节
//
// 关键设计点：
// 1. 模式 A（demoMode=false）：第一步真采样，受温度/top-k/top-p 影响
// 2. 模式 B（demoMode=true）：演示模式，按预生成 greedy 路径推进，温度等参数被冻结展示但不影响计算
// 3. computedDistribution 由派生函数算出，不存进 state，避免冗余

import { useMemo, useReducer } from 'react';

import {
  computeFinalDistribution,
  rawDistributionForDisplay,
  sampleIndexFromDistribution,
} from './sampling-math';
import type { ComputedToken, ExampleData, Step } from './types';

export interface SamplingState {
  exampleData: ExampleData | null; // 当前选中例子的数据；null = 还没加载
  currentStepIndex: number; // 用户当前看到的第几步（0 开始）
  demoMode: boolean; // false = 第一步真采样模式；true = 演示模式
  temperature: number; // 0 - 2
  topK: number | null; // null = 不启用
  topP: number; // 0 - 1
  generatedTokens: string[]; // 累积输出
}

export type SamplingAction =
  | { type: 'EXAMPLE_LOADED'; data: ExampleData }
  | { type: 'SET_TEMPERATURE'; value: number }
  | { type: 'SET_TOPK'; value: number | null }
  | { type: 'SET_TOPP'; value: number }
  | { type: 'SAMPLE_FIRST'; tokenIndex: number } // 第一步真采样后调用，传入采到的 token 在 top 20 中的索引
  | { type: 'ADVANCE_DEMO' } // 演示模式下推进一步
  | { type: 'RESET' }; // 回到例子的初始状态（首次采样前）

const INITIAL_STATE: SamplingState = {
  exampleData: null,
  currentStepIndex: 0,
  demoMode: false,
  temperature: 1.0,
  topK: null,
  topP: 1.0,
  generatedTokens: [],
};

function reducer(state: SamplingState, action: SamplingAction): SamplingState {
  switch (action.type) {
    case 'EXAMPLE_LOADED':
      // 切换例子总是回到第一步真采样模式，但保留用户当前的温度/top-k/top-p
      return {
        ...state,
        exampleData: action.data,
        currentStepIndex: 0,
        demoMode: false,
        generatedTokens: [],
      };

    case 'SET_TEMPERATURE':
      // 演示模式下温度参数不应改变（UI 也会禁用，但这里加一道保险）
      if (state.demoMode) return state;
      return { ...state, temperature: action.value };

    case 'SET_TOPK':
      if (state.demoMode) return state;
      return { ...state, topK: action.value };

    case 'SET_TOPP':
      if (state.demoMode) return state;
      return { ...state, topP: action.value };

    case 'SAMPLE_FIRST': {
      if (!state.exampleData) return state;
      const step0 = state.exampleData.steps[0];
      const sampledToken = step0.top_logprobs[action.tokenIndex]?.token;
      if (!sampledToken) return state;
      return {
        ...state,
        generatedTokens: [...state.generatedTokens, sampledToken],
        currentStepIndex: 1,
        demoMode: true,
      };
    }

    case 'ADVANCE_DEMO': {
      if (!state.exampleData || !state.demoMode) return state;
      const next = state.exampleData.steps[state.currentStepIndex];
      if (!next) return state; // 已到末尾
      return {
        ...state,
        generatedTokens: [...state.generatedTokens, next.greedy_token],
        currentStepIndex: state.currentStepIndex + 1,
      };
    }

    case 'RESET':
      return {
        ...state,
        currentStepIndex: 0,
        demoMode: false,
        generatedTokens: [],
      };

    default:
      return state;
  }
}

export interface SamplingDerived {
  /** 当前展示的分布（柱状图用）。第一步=按温度/top-k/top-p 重算；演示模式=直接显示当前步真实分布 */
  distribution: ComputedToken[];
  /** 当前步骤的原始 step 数据（演示模式用） */
  currentStep: Step | null;
  /** 是否到达预生成路径末尾（演示模式按钮 disable 的条件） */
  isAtEnd: boolean;
  /** 拼接后的展示文本：原 prompt + 已生成 tokens */
  displayText: string;
}

export function useSamplingState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const derived = useMemo<SamplingDerived>(() => {
    if (!state.exampleData) {
      return { distribution: [], currentStep: null, isAtEnd: false, displayText: '' };
    }

    const steps = state.exampleData.steps;
    let currentStep: Step | null = null;
    let distribution: ComputedToken[] = [];

    if (!state.demoMode) {
      // 第一步真采样模式：固定看 step[0]，按用户参数重算
      currentStep = steps[0];
      distribution = computeFinalDistribution(
        currentStep.top_logprobs,
        state.temperature,
        state.topK,
        state.topP,
      );
    } else {
      // 演示模式：看当前步的真实分布（不再受温度影响）
      currentStep = steps[state.currentStepIndex] ?? null;
      if (currentStep) {
        distribution = rawDistributionForDisplay(currentStep.top_logprobs);
      }
    }

    const isAtEnd = state.currentStepIndex >= steps.length;
    const displayText = state.exampleData.prompt + state.generatedTokens.join('');

    return { distribution, currentStep, isAtEnd, displayText };
  }, [state]);

  return { state, dispatch, derived };
}

export function pickSampledIndex(probs: number[]): number {
  return sampleIndexFromDistribution(probs);
}
