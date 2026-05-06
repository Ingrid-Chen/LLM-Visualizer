'use client';

// PM 视角对比卡片 —— 内容严格对应 docs/Sampling-DevSpec.md 第 3.6 节
// 格式跟其他模块的 PMPerspectiveCards 对齐（不再自带 section/header）

const SCENARIOS = [
  {
    badge: '客服机器人',
    badgeClass: 'bg-blue-50 text-blue-800',
    temperature: '0.2 - 0.4',
    topP: '0.9',
    rationale: '用户期望准确、稳定的回答；不希望同一问题第二次问得到不同答复。',
  },
  {
    badge: '创意写作助手',
    badgeClass: 'bg-pink-50 text-pink-800',
    temperature: '0.8 - 1.2',
    topP: '0.95',
    rationale: '需要多样化产出；用户主动来这里，预期会有惊喜。',
  },
  {
    badge: '代码生成',
    badgeClass: 'bg-emerald-50 text-emerald-800',
    temperature: '0 - 0.2',
    topP: '0.95',
    rationale: '代码错一个字符就跑不了；几乎不存在"创意正确"的代码。',
  },
];

export default function PMPerspectiveCards() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SCENARIOS.map((s) => (
          <div
            key={s.badge}
            className="p-5 rounded-lg bg-cream-100 border-2 border-cream-200 hover:border-ink-light transition-colors"
          >
            <span className={['inline-block text-xs px-2.5 py-1 rounded-full font-medium mb-3', s.badgeClass].join(' ')}>
              {s.badge}
            </span>
            <div className="space-y-2 mb-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Temperature</span>
                <span className="text-text font-bold">{s.temperature}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Top-p</span>
                <span className="text-text font-bold">{s.topP}</span>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{s.rationale}</p>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-lg bg-ember/5 border-l-4 border-ember">
        <p className="text-sm leading-relaxed">
          <strong className="text-ember-dark">一个常被忽略的点：</strong>
          Top-p 通常比 Top-k 更鲁棒。Top-k 是固定砍一刀（"只留 5 个"），但实际分布形态差别很大——有时 top 5 已经覆盖 99%
          概率，有时 top 5 才覆盖 60%。Top-p 能根据分布形态<strong>动态调整</strong>候选池大小，更能反映"模型在这一步有多确定"。
        </p>
      </div>
    </div>
  );
}
