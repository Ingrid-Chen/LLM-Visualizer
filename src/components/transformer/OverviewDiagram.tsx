'use client';

// 简化的两模块概览：让用户先理解 Transformer 一层做的两件核心事
// 不画归一化、不画残差——那是下文要讲的"工程支持"
// 目的：先建立"是什么 + 做什么"的直觉，再建立"为什么要那么组织"

export default function OverviewDiagram() {
  return (
    <div className="space-y-5">
      {/* 简化流程图 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-5">
        <svg viewBox="0 0 700 130" className="w-full h-auto">
          <defs>
            <marker id="ovArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
            </marker>
          </defs>

          {/* 输入 */}
          <g>
            <rect x={20} y={40} width={100} height={50} rx={8} fill="#F5EFE2" stroke="#6B5F50" strokeWidth={1.5} />
            <text x={70} y={65} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#1F1A14" fontWeight={600}>输入</text>
            <text x={70} y={82} textAnchor="middle" fontSize="10" fill="#6B5F50">每个 token 的向量</text>
          </g>
          <line x1={120} y1={65} x2={170} y2={65} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#ovArrow)" />

          {/* Attention */}
          <g>
            <rect x={170} y={30} width={170} height={70} rx={10} fill="#FFF7ED" stroke="#D97742" strokeWidth={2.5} />
            <text x={255} y={55} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#B85A2A" fontWeight={700}>Attention（注意力机制）</text>
            <text x={255} y={72} textAnchor="middle" fontSize="11" fill="#6B5F50">让 token 互相沟通</text>
            <text x={255} y={88} textAnchor="middle" fontSize="10" fill="#9C9183" fontStyle="italic">"她" 看向 "Lucy"</text>
          </g>
          <line x1={340} y1={65} x2={390} y2={65} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#ovArrow)" />

          {/* FFN */}
          <g>
            <rect x={390} y={30} width={170} height={70} rx={10} fill="#F0F7F2" stroke="#2C5142" strokeWidth={2.5} />
            <text x={475} y={55} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#1F3B30" fontWeight={700}>FFN（前馈网络）</text>
            <text x={475} y={72} textAnchor="middle" fontSize="11" fill="#6B5F50">每个 token 自己消化</text>
            <text x={475} y={88} textAnchor="middle" fontSize="10" fill="#9C9183" fontStyle="italic">提取相关知识 / 特征</text>
          </g>
          <line x1={560} y1={65} x2={610} y2={65} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#ovArrow)" />

          {/* 输出 */}
          <g>
            <rect x={610} y={40} width={70} height={50} rx={8} fill="#F5EFE2" stroke="#6B5F50" strokeWidth={1.5} />
            <text x={645} y={65} textAnchor="middle" fontSize="14" fontFamily="serif" fill="#1F1A14" fontWeight={600}>输出</text>
            <text x={645} y={82} textAnchor="middle" fontSize="10" fill="#6B5F50">下一层用</text>
          </g>
        </svg>
      </div>

      {/* 两个模块的角色卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-5">
          <div className="mb-3">
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium tracking-wider mb-2">第 1 步</span>
            <h3 className="font-serif text-xl text-ember-dark leading-tight">Attention（注意力机制）</h3>
            <p className="text-sm text-ember-dark/80 mt-1">让 token 互相沟通</p>
          </div>
          <p className="text-sm text-text-muted leading-relaxed mb-2">
            一个 token 不能独自理解自己——"她" 这个字本身没意义，必须看回前文知道"她"指的是 Lucy 还是 Mary。
            Attention 让<strong className="text-text">每个 token 主动看向句子里其他相关的 token</strong>，把上下文信息融合进自己的向量。
          </p>
          <p className="text-xs text-text-muted/80 italic">
            ※ 把它想成"开会"——每个 token 都在跟别的 token 交换情报，更新自己的"理解"。
          </p>
        </div>

        <div className="rounded-lg border-2 border-ink/30 bg-ink/5 p-5">
          <div className="mb-3">
            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-ink text-cream-50 font-medium tracking-wider mb-2">第 2 步</span>
            <h3 className="font-serif text-xl text-ink-dark leading-tight">FFN（前馈网络）</h3>
            <p className="text-sm text-ink-dark/80 mt-1">让每个 token 自己消化</p>
          </div>
          <p className="text-sm text-text-muted leading-relaxed mb-2">
            Attention 之后，每个 token 已经"听到"了其他 token 的信息。FFN 让每个 token<strong className="text-text">单独做一遍"思考"</strong>——
            把刚才听来的信息跟它本身携带的知识结合，提取出更高层的特征。
          </p>
          <p className="text-xs text-text-muted/80 italic">
            ※ 把它想成"散会后回办公室翻自己的脑子"——消化刚才的会议内容。
          </p>
        </div>
      </div>

      {/* 关键提示：堆叠 + 还有"工程支持" */}
      <div className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded p-3">
        🔁 这两件事是<strong className="text-text">堆叠的</strong>——大型 LLM 有几十到上百层，每一层都是「Attention → FFN」，逐层抽象出更复杂的语义。
        实际工程上还会在外面包两层"工程支持"（归一化 + 残差连接），<strong className="text-ember-dark">下文会专讲</strong>。
      </div>
    </div>
  );
}
