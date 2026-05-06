'use client';

import { useState } from 'react';

// 深入模式延伸内容 —— DevSpec 3.8 节
// v0.1 占位为主，后续填真实链接和论文引用

export default function DeepDiveSampling() {
  const [open, setOpen] = useState(false);

  return (
    <section className="my-10 border-t border-cream-200 pt-8">
      <button
        onClick={() => setOpen(!open)}
        className="text-left w-full flex items-center justify-between text-text hover:text-ink-dark transition-colors"
      >
        <span className="font-serif text-xl">想了解更多 Sampling 方法？</span>
        <span className="text-2xl">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="mt-6 space-y-4 text-text-muted leading-relaxed">
          <div>
            <h4 className="font-medium text-text mb-1">Typical Sampling</h4>
            <p className="text-sm">
              不只看概率高低，还看候选词的"信息量"是否接近平均。在某些生成任务中比 top-p 更稳。
              （论文链接待补 · v0.1 mock）
            </p>
          </div>
          <div>
            <h4 className="font-medium text-text mb-1">Min-p Sampling</h4>
            <p className="text-sm">
              按 top-1 概率的某个比例作为阈值动态截断，比固定 top-p 在低确定性场景下更鲁棒。
              （论文链接待补 · v0.1 mock）
            </p>
          </div>
          <div>
            <h4 className="font-medium text-text mb-1">Repetition Penalty</h4>
            <p className="text-sm">
              对已生成过的 token 的概率施加惩罚，缓解模型反复说同一句话的问题——但可能损伤一些固定搭配的输出。
            </p>
          </div>
          <p className="text-sm">
            外链：Hugging Face 关于采样策略的官方文档（待补 · v0.1 mock）
          </p>
        </div>
      )}
    </section>
  );
}
