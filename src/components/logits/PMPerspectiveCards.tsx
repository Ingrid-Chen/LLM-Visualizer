'use client';

const CARDS = [
  {
    badge: 'API 透明度',
    badgeClass: 'bg-blue-50 text-blue-800',
    title: 'Logprobs API 让你看到模型的"信心"',
    body:
      'OpenAI、Anthropic 的 logprobs API 让你看到模型在每个位置的真实概率分布——它就是这一步的输出。最常见的用法：判断"模型对这个回答有多有把握"（top-1 概率 99% = 很自信；只有 30% = 模型在猜）。这对自动化评估、合规审查很有用。',
  },
  {
    badge: '推理成本',
    badgeClass: 'bg-amber-50 text-amber-800',
    title: '词表大小直接影响推理速度',
    body:
      '每生成一个 token 都要算一次 vocab 大小的 softmax。GPT-2 的 50k 词表 vs GPT-4o 的 200k 词表——计算量翻 4 倍。但词表大也意味着更精细的中文 / 多语言切分（前面 Tokenization 章节看过）。这是模型设计的经典 trade-off。',
  },
  {
    badge: '产品能力',
    badgeClass: 'bg-pink-50 text-pink-800',
    title: '多语言能力 ≈ 词表里有多少种语言',
    body:
      '词表里没收录的字符会按 byte 拆——典型 emoji 一个 4 字节、生僻字一个 3 字节，全部按字节级拆开。所以选模型时看词表覆盖：如果产品要支持泰语 / 阿拉伯语 / 古希腊语，得选词表里包含的模型，否则推理成本和质量都会变差。',
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
