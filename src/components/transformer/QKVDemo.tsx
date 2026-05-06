'use client';

import MultiHeadFlowViz from './MultiHeadFlowViz';
import QKVWalkthrough from './QKVWalkthrough';

// 重写：按"是什么 → 类比 → 走一遍 → 多头 + O"的认知顺序讲清 QKV/O 四个矩阵
// 关键修复：① 补 W_O 矩阵 ② 多头单独一节解释（先讲"头"是什么再用） ③ 加搜索引擎类比让 QKV 更具象 ④ 走一遍流程改成可视化交互

export default function QKVDemo() {
  return (
    <div className="space-y-7">
      {/* ============ 1. 核心思想 ============ */}
      <CoreIdea />

      {/* ============ 2. 搜索引擎类比 - Q/K/V/O 四个矩阵 ============ */}
      <SearchEngineAnalogy />

      {/* ============ 3. 一个具体例子走一遍 ============ */}
      <ConcreteWalkthrough />

      {/* ============ 4. 多头 + W_O 的角色 ============ */}
      <MultiHeadExplained />
    </div>
  );
}

// ============================================================

function CoreIdea() {
  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">2.1 · 核心思想</h3>
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <p className="text-sm text-text leading-relaxed">
          Attention 的本质就一件事：
          <strong className="text-ember-dark"> 给每个 token 算一组「该看谁」的权重，按权重把其他 token 的信息加权融合进自己。</strong>
        </p>
        <p className="text-sm text-text-muted leading-relaxed mt-2">
          这意味着模型在处理"她"这个 token 时，能<strong className="text-text">动态决定</strong>该看回 "Lucy"、"Mary" 还是别的——
          不是固定看前 3 个 token，而是<strong className="text-text">按内容相关性</strong>。这是 Transformer 比 RNN/CNN 强的核心。
        </p>
      </div>
    </div>
  );
}

// ============================================================

function SearchEngineAnalogy() {
  const matrices = [
    {
      letter: 'Q',
      name: 'Query · 我在找什么',
      color: 'bg-blue-100 border-blue-400 text-blue-900',
      letterClass: 'text-blue-700',
      analogy: '你在搜索框里输入的查询词',
      llm: '当前 token 想"问"的问题——比如"她"问"我前面提到的女性人名是谁？"',
    },
    {
      letter: 'K',
      name: 'Key · 我能被怎么找到',
      color: 'bg-emerald-100 border-emerald-400 text-emerald-900',
      letterClass: 'text-emerald-700',
      analogy: '数据库里每个条目的"索引标签"——告诉搜索引擎"我是什么类型"',
      llm: '每个候选 token 的"标签"——比如"Lucy"标记着"人名 / 女性"',
    },
    {
      letter: 'V',
      name: 'Value · 实际内容是什么',
      color: 'bg-amber-100 border-amber-400 text-amber-900',
      letterClass: 'text-amber-700',
      analogy: '搜索结果点进去的"实际页面内容"',
      llm: '每个 token 的"语义信息"——Q-K 匹配后，从匹配的 token 取出来融合',
    },
    {
      letter: 'O',
      name: 'Output · 最终输出整理',
      color: 'bg-purple-100 border-purple-400 text-purple-900',
      letterClass: 'text-purple-700',
      analogy: '搜索引擎把找到的结果"排版"成你看到的页面',
      llm: '把多头的结果拼接 + 投影回原维度（多头 attention 才需要 O；单头不需要）',
    },
  ];

  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">2.2 · 用搜索引擎类比 Q / K / V / O 四个矩阵</h3>
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4">
        <p className="text-sm text-text-muted mb-4 leading-relaxed">
          Attention 跟<strong className="text-text">搜索引擎</strong>做的事其实一样：用查询词去匹配索引、取出内容、整理结果。
          这四个矩阵是 LLM 里"搜索引擎"的四个组件：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matrices.map((m) => (
            <div key={m.letter} className={['p-4 rounded-lg border-2', m.color].join(' ')}>
              <div className="flex items-baseline gap-2.5 mb-2">
                <span className={['font-mono text-3xl font-bold', m.letterClass].join(' ')}>{m.letter}</span>
                <span className="font-medium text-sm">{m.name}</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">搜索引擎</span>
                  <p className="leading-relaxed">{m.analogy}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider opacity-60">在 LLM 里</span>
                  <p className="leading-relaxed">{m.llm}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-text-muted/80 italic mt-4">
          ※ 这四个矩阵都是<strong className="text-text">模型训练学出来的</strong>。具体的数学公式在深入模式里。
        </p>
      </div>
    </div>
  );
}

// ============================================================

function ConcreteWalkthrough() {
  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">2.3 · 一个例子走一遍完整流程（点 step 看图）</h3>
      <p className="text-sm text-text-muted mb-3 leading-relaxed">
        例句：<span className="font-serif text-ink-dark">"Lucy 把书放在桌上，因为<strong className="text-ember-dark">她</strong>累了"</span>。
        Attention 现在处理「她」——它要找出前面哪个 token 是它指的人。点下面 4 个 step 看 SVG 怎么变。
      </p>
      <QKVWalkthrough />
    </div>
  );
}

// ============================================================

function MultiHeadExplained() {
  return (
    <div>
      <h3 className="font-serif text-base font-semibold text-ink-dark mb-2">2.4 · 多头注意力 + W_O 的角色</h3>

      {/* 一句话讲清"头"和"多头" */}
      <p className="text-sm text-text-muted leading-relaxed mb-3">
        前面 2.3 讲的<strong className="text-text">一组 Q/K/V = 一个头</strong>（head）——只能从一个角度看上下文。
        实际模型用<strong className="text-text"> N 个头并行</strong>（按模型规模 8 ~ 128 不等，GPT-3 用 96 头），每个头关注不同关系：
      </p>

      {/* 主可视化 */}
      <MultiHeadFlowViz />

      {/* 极简注解 */}
      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
          <div className="font-medium text-text mb-1">🎭 多头并行</div>
          <div className="text-text-muted leading-relaxed">N 套独立的 Wq/Wk/Wv 各做各的 attention，互不干扰。</div>
        </div>
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
          <div className="font-medium text-text mb-1">🪡 Concat 拼接</div>
          <div className="text-text-muted leading-relaxed">N 个头的输出首尾拼成一个长向量。</div>
        </div>
        <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
          <div className="font-medium text-text mb-1">📐 W_O 整理</div>
          <div className="text-text-muted leading-relaxed">长向量乘以 W_O，缩回原 d 维 → 最终输出。</div>
        </div>
      </div>

      {/* 参数量提示（公式挪到深入模式） */}
      <div className="mt-3 p-3 rounded-lg bg-ember/5 border border-ember/20 text-xs leading-relaxed text-text-muted">
        💡 完整 Multi-Head Attention 共 <strong className="text-text">4 种矩阵</strong>：Wq、Wk、Wv 各 N 套 + 一个 W_O。
        这一层的参数量大约是 <strong className="text-text">4 × d²</strong>——参数越多，推理越慢、占显存越多。
      </div>
    </div>
  );
}
