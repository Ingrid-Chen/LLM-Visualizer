'use client';

// PRD 4.4 模块 4 PM 视角：
// - 长 prompt 失忆（attention 是其中一个原因，不是唯一——必须严格表述）
// - heads 和 layers 数对效果的影响
// 加一个第三张：成本 / 推理速度跟 layers 直接挂钩

interface CardData {
  badge: string;
  badgeClass: string;
  title: string;
  body: React.ReactNode;
}

const CARDS: CardData[] = [
  {
    badge: '长 prompt 现象',
    badgeClass: 'bg-amber-50 text-amber-800',
    title: '为什么长 prompt 中模型会"忘"前面的指令',
    body: (
      <>
        当 prompt 超长，attention 把权重分散到 N 个位置上，每个位置分到的"关注"自然就稀薄。这是长 prompt 失忆的<strong className="text-text">其中一个原因</strong>——不是唯一原因。位置编码（PE）的外推能力、softmax 的尾部抑制、训练时的长度分布都有影响。RAG 系统中把关键指令放 prompt 末尾、最相关文档放前后，是有效的工程缓解。
      </>
    ),
  },
  {
    badge: '模型选型',
    badgeClass: 'bg-blue-50 text-blue-800',
    title: 'heads 和 layers 数怎么影响产品体验',
    body: (
      <>
        <strong className="text-text">更多 heads</strong> = 同时关注更多角度（语法 / 语义 / 指代）；<strong className="text-text">更多 layers</strong> = 抽象层级更深，能建立更长距离的关联。但都直接增加参数量、推理成本和延迟——这是为什么 GPT-4o-mini / Haiku 等"轻量版"会减少 heads 和 layers，速度更快但深层语义能力会有损失。
      </>
    ),
  },
  {
    badge: '推理成本',
    badgeClass: 'bg-pink-50 text-pink-800',
    title: 'layers 数 ≈ 单 token 推理时长',
    body: (
      <>
        生成一个 token 要走完 N 层。大型 LLM 估计有几十到上百层（如 GPT-3 公开是 96 层；GPT-4 / GPT-4o 未公开但业界估计 ~120 层），每层包含 attention + FFN + 两次 LayerNorm + 两次残差——这些都是 GPU 顺序执行的。模型层数越多、单 token 延迟越长。streaming 输出能让感知性能不那么差，但绝对的"模型反应时间"是 layers × 单层耗时，几乎线性。
      </>
    ),
  },
];

export default function PMPerspectiveCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {CARDS.map((c) => (
        <div
          key={c.title}
          className="p-5 rounded-lg bg-cream-100 border-2 border-cream-200 hover:border-ink-light transition-colors"
        >
          <span className={['inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-3', c.badgeClass].join(' ')}>
            {c.badge}
          </span>
          <h4 className="font-serif text-lg text-ink-dark mb-2 leading-snug">{c.title}</h4>
          <p className="text-sm text-text-muted leading-relaxed">{c.body}</p>
        </div>
      ))}
    </div>
  );
}
