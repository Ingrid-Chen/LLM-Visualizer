'use client';

// PM 视角卡片 —— 文案严格对应 PRD 4.4 模块 1 的 PM 视角连接点

const CARDS = [
  {
    badge: '上下文窗口',
    badgeClass: 'bg-blue-50 text-blue-800',
    title: '"4k 上下文"≠ 4k 中文字',
    body:
      '上下文窗口是按 token 算的，不是按字。GPT-4o 的 128k 窗口装中文大约 80-130k 字，装英文大约 90-110k 词。做长 prompt 产品时，估算容量要按 token 数算。',
  },
  {
    badge: '产品 Bug',
    badgeClass: 'bg-amber-50 text-amber-800',
    title: '前端按字符截断 → 模型按 token 计费',
    body:
      '常见 bug：产品定义"用户输入最多 500 字"，按 string.length 截断。但 emoji / 生僻字 / 中英混合的实际 token 数可能远超 500——既超出 max_tokens 限制、又被 API 多收费。截断逻辑要按 tokenizer 算。',
  },
  {
    badge: '隐藏成本',
    badgeClass: 'bg-pink-50 text-pink-800',
    title: 'Emoji 是 token 大户',
    body:
      'Chat UI 里的 emoji 装饰看着免费，实际计费时一个 emoji 通常 = 2-3 个 token。在客服 / 朋友圈风格的产品中，emoji 大量出现会显著抬高 API 成本——比一个汉字还贵。',
  },
];

export default function PMPerspectiveCards() {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
