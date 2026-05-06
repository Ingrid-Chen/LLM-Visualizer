'use client';

import FFNFlowViz from './FFNFlowViz';

// FFN 章节内容：把可视化放最上面（直观），简化下方文字卡片到关键要点
// PRD 4.4：必须明示"知识库类比"是主流但有争议（红线）

export default function FFNCard() {
  return (
    <div className="space-y-4">
      {/* === 主可视化：放最前面 === */}
      <FFNFlowViz />

      {/* === 数学结构（精简：公式挪深入） === */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">结构</div>
        <p className="text-sm text-text-muted leading-relaxed">
          就两层全连接 + 一个非线性激活函数。
          <strong className="text-text">第一层把向量从 d 维放大到 4d 维</strong>（"展开"）→ 激活筛选 →
          <strong className="text-text">第二层缩回 d 维</strong>（"收回"）。
          结构简单，但参数量<strong className="text-text">占整个模型 2/3+</strong>。
        </p>
      </div>

      {/* === "知识库"解释 + 必要的免责声明 === */}
      <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium">主流解释</span>
          <span className="text-[10px] text-text-muted">⚠️ 但学界仍在讨论</span>
        </div>
        <p className="text-sm text-text-muted leading-relaxed">
          一种被广泛接受的解释（Geva 2021 等）：FFN 的中间层每个神经元像一个
          <strong className="text-text">"知识开关"</strong>——比如"巴黎是法国首都"这类事实知识编码在这些开关里。
          Attention 让 token 之间沟通，FFN 让每个 token 单独"查表"。
        </p>
        <p className="text-[11px] text-text-muted/80 leading-relaxed border-t border-ember/20 pt-2 mt-2">
          ※ 这是主流但<strong className="text-text">有争议</strong>的解释——也有研究认为 FFN 主要做"特征整合"，知识可能分散在多个组件里。
          严谨场景下应该说"FFN 的具体作用仍是开放问题"。
        </p>
      </div>
    </div>
  );
}
