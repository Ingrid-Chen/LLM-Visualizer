'use client';

const CARDS = [
  {
    badge: 'RAG 的基础',
    badgeClass: 'bg-emerald-50 text-emerald-800',
    title: '为什么 RAG 能"找到相关内容"',
    body:
      'RAG = Retrieval-Augmented Generation。把所有知识切成段落、各自算出 embedding，存进向量数据库；用户提问时把问题也算成 embedding，找余弦相似度最高的那几段拼进 prompt——这就是大模型"瞬间记住"私有知识的全部魔法。',
  },
  {
    badge: '跨语言能力',
    badgeClass: 'bg-blue-50 text-blue-800',
    title: '"hello"和"你好"为什么搜出同样结果',
    body:
      '现代 embedding 模型在多语言数据上训练后，不同语言里语义相同的词在向量空间里距离很近。这就是"用中文问也能查到英文文档"的底层机制——多语言 embedding 是国际化产品的关键。',
  },
  {
    badge: '基础设施',
    badgeClass: 'bg-pink-50 text-pink-800',
    title: '向量数据库为什么火了',
    body:
      'embedding 是 1536 / 3072 维浮点数。要在百万、亿级规模上做余弦相似度搜索，需要专门的近似最近邻（ANN）索引。Pinecone / Milvus / pgvector 等向量数据库做的就是这件事——它们是 RAG 系统的存储基础设施。',
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
