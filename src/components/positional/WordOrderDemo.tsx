'use client';

// 演示"我打你" vs "你打我"——同样三个 token，顺序完全相反、意思也完全相反
// 让用户秒懂"为什么需要位置编码"——没 PE 的话，模型看到的是"词袋"，区分不出顺序

const PAIR = [
  { prompt: '我打你', tokens: ['我', '打', '你'], meaning: '我是动作发出者' },
  { prompt: '你打我', tokens: ['你', '打', '我'], meaning: '我是动作承受者' },
];

const TOKEN_COLOR: Record<string, string> = {
  我: 'bg-ink/15 border-ink/30 text-ink-dark',
  打: 'bg-ember/15 border-ember/30 text-ember-dark',
  你: 'bg-amber-100 border-amber-300 text-amber-800',
};

export default function WordOrderDemo() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PAIR.map((item) => (
          <div key={item.prompt} className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-2">原句</div>
            <p className="font-serif text-2xl text-ink-dark mb-3">{item.prompt}</p>
            <div className="flex items-center gap-1.5 flex-wrap mb-3">
              {item.tokens.map((tok, i) => (
                <span
                  key={i}
                  className={[
                    'inline-flex items-center px-2.5 py-1 rounded border text-base font-mono',
                    TOKEN_COLOR[tok] ?? 'bg-ink/10 border-ink/30',
                  ].join(' ')}
                >
                  <span className="font-serif">{tok}</span>
                </span>
              ))}
            </div>
            <p className="text-xs text-text-muted leading-relaxed">{item.meaning}</p>
          </div>
        ))}
      </div>

      {/* 关键问题 */}
      <div className="p-4 rounded-lg bg-ember/5 border-2 border-dashed border-ember/30">
        <p className="text-sm leading-relaxed">
          ⚠️ 两句话用的<strong className="text-text">三个 token 完全一样</strong>（"我"、"打"、"你"）——
          它们经过 token → embedding 后得到的就是<strong className="text-text">同一个向量集合</strong>。
        </p>
        <p className="text-sm leading-relaxed mt-2">
          但 Transformer 是<strong className="text-text">并行处理</strong>所有 token 的，没有"先后"概念——
          如果不给它额外的位置信息，它会把这两句话看成<strong className="text-ember-dark">完全一样的输入</strong>。
        </p>
        <p className="text-sm leading-relaxed mt-2 text-ink-dark font-medium">
          → 解决方法：给每个位置一个独特的"指纹"，让相同 token 在不同位置变成不同向量。这就是位置编码（Positional Encoding）。
        </p>
      </div>
    </div>
  );
}
