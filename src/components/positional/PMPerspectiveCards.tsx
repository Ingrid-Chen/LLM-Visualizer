'use client';

const CARDS = [
  {
    badge: '上下文窗口',
    badgeClass: 'bg-blue-50 text-blue-800',
    title: '"128k 上下文" 是 PE 决定的',
    body:
      '模型能处理多长的输入，跟 PE 直接相关——经典 sinusoidal 训练时定了多少位置就只能处理多少。GPT-4o 的 128k、Claude 的 200k、Gemini 的 1M+ 上下文，背后都是 PE 设计的演进（RoPE、ALiBi 让位置外推变得可行）。',
  },
  {
    badge: '产品现象',
    badgeClass: 'bg-amber-50 text-amber-800',
    title: 'Lost in the Middle',
    body:
      '即便上下文窗口够长，模型对 prompt 中间的内容关注度也明显低于开头和结尾——这是 PE 引发的位置偏置。RAG 系统中把最相关文档放最前 / 最后是常见优化策略；让 prompt 关键指令出现在结尾比埋在中间有效得多。',
  },
  {
    badge: '模型选型',
    badgeClass: 'bg-emerald-50 text-emerald-800',
    title: 'RoPE / ALiBi 决定了"长 context 能力"',
    body:
      '现代模型几乎都用 RoPE（旋转位置编码）或 ALiBi（线性偏置）替代经典 sinusoidal——它们让模型能处理远超训练长度的输入。选模型时如果产品需要超长输入（法律文书、长论文），要看模型用的是哪种 PE 方案。',
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
