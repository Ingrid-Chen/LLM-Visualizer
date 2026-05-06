'use client';

// 讲清楚：embedding 矩阵长什么样、怎么 lookup、从哪里来（训练学出来的）
// 这是 Embedding 章节的"前置知识"——VectorSliceViz 之前应该有这一段

const D_DEMO = 8;
const SAMPLE_TOKENS = [
  { name: '苹果', id: 12345, highlight: true },
  { name: '橘子', id: 18762 },
  { name: '北京', id: 16482 },
  { name: '今天', id: 21548 },
  { name: '猫', id: 35491 },
];

export default function EmbeddingMatrixIntro() {
  return (
    <div className="space-y-4">
      {/* SVG：lookup 流程图（token → id → 行号 → 向量） */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 overflow-x-auto">
        <svg viewBox="0 0 760 280" className="w-full h-auto" style={{ minWidth: '600px' }}>
          <defs>
            <marker id="emi-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
            </marker>
          </defs>

          {/* === 左：token + token id === */}
          <g>
            <text x={60} y={30} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              ① Token
            </text>
            <text x={60} y={45} textAnchor="middle" fontSize="9" fill="#6B5F50">
              （来自 tokenization）
            </text>
            <rect x={20} y={55} width={80} height={36} rx={6} fill="#FFF7ED" stroke="#D97742" strokeWidth={2} />
            <text x={60} y={78} textAnchor="middle" fontSize="16" fontFamily="serif" fontWeight={700} fill="#B85A2A">
              苹果
            </text>
            <text x={60} y={108} textAnchor="middle" fontSize="10" fontFamily="monospace" fill="#6B5F50">
              token id = 12345
            </text>
            <text x={60} y={122} textAnchor="middle" fontSize="9" fill="#9C9183" fontStyle="italic">
              （也就是矩阵的行号）
            </text>
          </g>

          {/* 箭头：id → 矩阵 */}
          <line x1={110} y1={75} x2={170} y2={75} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#emi-arrow)" />
          <text x={140} y={68} textAnchor="middle" fontSize="9" fill="#6B5F50">
            按行号
          </text>
          <text x={140} y={92} textAnchor="middle" fontSize="9" fill="#6B5F50">
            查矩阵
          </text>

          {/* === 中：Embedding 矩阵 === */}
          <g>
            <text x={310} y={30} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              ② Embedding 矩阵 W_E
            </text>
            <text x={310} y={45} textAnchor="middle" fontSize="9" fill="#6B5F50">
              形状 |vocab| × d，每行 = 一个 token 的向量
            </text>

            {/* 矩阵色块 + 行标签 */}
            {SAMPLE_TOKENS.map((tok, row) => {
              const y = 60 + row * 30;
              return (
                <g key={tok.name}>
                  {/* 行标签 */}
                  <text x={195} y={y + 16} textAnchor="end" fontSize="11" fontFamily="serif" fill={tok.highlight ? '#B85A2A' : '#6B5F50'} fontWeight={tok.highlight ? 700 : 400}>
                    {tok.name}
                  </text>
                  <text x={195} y={y + 28} textAnchor="end" fontSize="8" fontFamily="monospace" fill="#9C9183">
                    id={tok.id}
                  </text>

                  {/* 高亮当前行的矩形框 */}
                  {tok.highlight && (
                    <rect x={205} y={y + 2} width={D_DEMO * 22 + 4} height={22} rx={4} fill="none" stroke="#D97742" strokeWidth={2.5} strokeDasharray="3 2" />
                  )}

                  {/* 色块矩阵（一行 = D_DEMO 个色块） */}
                  {Array.from({ length: D_DEMO }).map((_, col) => {
                    const seed = row * 13 + col * 7 + tok.name.charCodeAt(0);
                    const v = Math.sin(seed * 0.4) * 0.6;
                    const intensity = Math.min(Math.abs(v), 1);
                    const fill =
                      v >= 0
                        ? `rgba(44, 81, 66, ${0.15 + intensity * 0.6})`
                        : `rgba(217, 119, 66, ${0.15 + intensity * 0.6})`;
                    return (
                      <rect
                        key={col}
                        x={210 + col * 22}
                        y={y + 5}
                        width={18}
                        height={16}
                        rx={2}
                        fill={fill}
                        stroke="rgba(0,0,0,0.05)"
                        strokeWidth={0.5}
                      />
                    );
                  })}
                </g>
              );
            })}

            <text x={310} y={60 + SAMPLE_TOKENS.length * 30 + 12} textAnchor="middle" fontSize="9" fill="#9C9183" fontStyle="italic">
              （实际词表 50k - 200k 行）
            </text>
          </g>

          {/* 箭头：矩阵 → 取出向量 */}
          <line x1={420} y1={75} x2={490} y2={75} stroke="#2C5142" strokeWidth={1.5} markerEnd="url(#emi-arrow)" />
          <text x={455} y={68} textAnchor="middle" fontSize="9" fill="#6B5F50">
            取第 12345 行
          </text>

          {/* === 右：取出的向量 === */}
          <g>
            <text x={620} y={30} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#B85A2A">
              ③ 苹果的 embedding 向量
            </text>
            <text x={620} y={45} textAnchor="middle" fontSize="9" fill="#6B5F50">
              d 维（图示 d=8，实际 4096+ 因模型而异）
            </text>
            {/* 取出的向量色块（一行） */}
            {Array.from({ length: D_DEMO }).map((_, col) => {
              // 使用跟矩阵中"苹果"那一行同样的种子
              const seed = 0 * 13 + col * 7 + '苹果'.charCodeAt(0);
              const v = Math.sin(seed * 0.4) * 0.6;
              const intensity = Math.min(Math.abs(v), 1);
              const fill =
                v >= 0
                  ? `rgba(44, 81, 66, ${0.15 + intensity * 0.7})`
                  : `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
              return (
                <g key={col}>
                  <rect x={540 + col * 22} y={70} width={18} height={26} rx={3} fill={fill} stroke="#D97742" strokeWidth={1} />
                  <text x={549 + col * 22} y={87} textAnchor="middle" fontSize="8" fontFamily="monospace" fill="#FBF8F1" fontWeight={500}>
                    {v.toFixed(1)}
                  </text>
                </g>
              );
            })}
            <text x={620} y={120} textAnchor="middle" fontSize="9" fill="#6B5F50" fontStyle="italic">
              这个向量就是「苹果」的语义表示
            </text>
            <text x={620} y={134} textAnchor="middle" fontSize="9" fill="#6B5F50" fontStyle="italic">
              进入 Transformer 处理
            </text>
          </g>
        </svg>
      </div>

      {/* 解读 + caveat（紧凑两段，跟 VectorSliceViz 风格一致） */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 这就是模型最开头的<strong className="text-text">查表</strong>操作——tokenization 把 token 转成 id，embedding 用 id 当行号从矩阵里抽出对应那一行，作为该 token 的"<strong className="text-text">语义身份证</strong>"。
        矩阵的形状是 <span className="font-mono">|vocab|</span>（词表大小，10-20 万）<span className="font-mono"> × d</span>（hidden 维度，按模型规模 768-12288），一个矩阵就是几千万到几亿参数。
        这个矩阵不是人填的——是模型在<strong className="text-text">大量文本上自学</strong>出来的，逐渐让语义相近的词学到相近向量（这就是后面散点图里水果聚一起的根源）。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        ※ 后面章节用 OpenAI text-embedding-3-small（d=1536）做可视化示例——LLM 内部的 token embedding 机制相通，维度更大。
        模块末尾还有 Unembedding 矩阵做反方向的事，详见 <a href="/logits" className="text-ink hover:text-ember-dark underline-offset-2 hover:underline">输出层 / Logits</a>。
      </p>
    </div>
  );
}
