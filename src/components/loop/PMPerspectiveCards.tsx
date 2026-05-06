'use client';

const CARDS = [
  {
    badge: '感知性能',
    badgeClass: 'bg-emerald-50 text-emerald-800',
    title: 'Streaming = 感知性能的经典案例',
    body:
      '总耗时不变，但用户体验差异巨大。第一个 token 是否快速到达决定"AI 是否在思考"的体感。多数对话产品默认开 streaming——用户不会等 5 秒看一个完整回答，但能耐心等 5 秒看一个一字字蹦出的回答。',
  },
  {
    badge: 'Streaming 副作用',
    badgeClass: 'bg-amber-50 text-amber-800',
    title: '什么时候不该开 streaming？',
    body:
      '需要"看到完整输出再展示"的场景：① 输出是 JSON 等结构化数据，必须解析完才能用；② 需要敏感词 / 安全过滤后再展示；③ 输出会被翻译 / 后处理 / 重新排版。这些场景下流式吐出来的"半成品"反而会让产品状态不一致。',
  },
  {
    badge: 'max_tokens',
    badgeClass: 'bg-rose-50 text-rose-800',
    title: '"半句话 bug" 的元凶',
    body:
      'max_tokens 设小了 → 模型在句子中间硬切，用户看到"半截答案"。后端要检测 finish_reason === "length" 给用户友好提示（比如"回答较长，发送 \'继续\'"）；设大了又会偶尔被模型"凑字数"——典型 1.5-2x 预估长度。',
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
