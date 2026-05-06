'use client';

// 展示从"最后一层 d 维向量" → 乘以 unembedding 矩阵 → "词表大小 logits" 的过程
// 视觉化：左 = d 维向量；中 = 大矩阵；右 = vocab 大小 logits

const D_DEMO = 8; // 展示用 d 维（实际 LLM hidden 维度通常 4096+）
const V_DEMO = 12; // 展示用词表大小（实际 50k-200k）

export default function UnembeddingDiagram() {
  // mock 一个最后一层向量
  const lastHiddenVec = [0.6, -0.3, 0.8, 0.1, -0.5, 0.4, 0.2, -0.7];
  // mock 几个 token 名字（前 V_DEMO 个）
  const sampleVocab = ['北京', '上海', '中国', '首都', '是', '的', '了', '在', '历史', '城市', '一个', '了'];

  // mock 一些 logits 值
  const logits = [9.2, -1.5, 1.8, 1.1, -3.2, -4.0, -5.1, -5.5, -2.8, -3.4, -4.7, -5.8];

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 overflow-x-auto">
        <svg viewBox="0 0 760 240" className="w-full h-auto" style={{ minWidth: '600px' }}>
          <defs>
            <marker id="ue-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
            </marker>
          </defs>

          {/* === 最后一层向量（左） === */}
          <g>
            <text x={70} y={30} textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              Transformer 最后一层
            </text>
            <text x={70} y={45} textAnchor="middle" fontSize="10" fill="#6B5F50">
              d 维向量（d=8 示意）
            </text>
            {lastHiddenVec.map((v, i) => {
              const intensity = Math.min(Math.abs(v), 1);
              const fill =
                v >= 0
                  ? `rgba(44, 81, 66, ${0.15 + intensity * 0.7})`
                  : `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
              return (
                <g key={i}>
                  <rect x={50} y={60 + i * 18} width={40} height={16} rx={3} fill={fill} stroke="rgba(0,0,0,0.1)" />
                  <text
                    x={70}
                    y={72 + i * 18}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="monospace"
                    fill="#FBF8F1"
                    fontWeight={500}
                  >
                    {v.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </g>

          {/* === × 乘号 === */}
          <text x={130} y={140} textAnchor="middle" fontSize="20" fontFamily="serif" fill="#6B5F50" fontWeight={300}>
            ×
          </text>

          {/* === Unembedding 矩阵（中） === */}
          <g>
            <text x={300} y={30} textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              Unembedding 矩阵 W
            </text>
            <text x={300} y={45} textAnchor="middle" fontSize="10" fill="#6B5F50">
              每行 = 一个 token 的"匹配模板"（|vocab| × d）
            </text>
            {/* 矩阵色块 */}
            {Array.from({ length: V_DEMO }).map((_, row) =>
              Array.from({ length: D_DEMO }).map((_, col) => {
                // 用确定性"噪音"生成色块
                const seed = row * 13 + col * 7;
                const v = Math.sin(seed * 0.5) * 0.6;
                const intensity = Math.min(Math.abs(v), 1);
                const fill =
                  v >= 0
                    ? `rgba(124, 58, 237, ${0.1 + intensity * 0.5})`
                    : `rgba(217, 119, 66, ${0.1 + intensity * 0.5})`;
                return (
                  <rect
                    key={`m-${row}-${col}`}
                    x={200 + col * 20}
                    y={60 + row * 14}
                    width={18}
                    height={12}
                    rx={2}
                    fill={fill}
                    stroke="rgba(0,0,0,0.05)"
                    strokeWidth={0.5}
                  />
                );
              }),
            )}
            {/* 矩阵旁的 vocab 标签 */}
            {sampleVocab.map((tok, i) => (
              <text key={`vlbl-${i}`} x={195} y={71 + i * 14} textAnchor="end" fontSize="9" fontFamily="serif" fill="#6B5F50">
                {tok}
              </text>
            ))}
            <text x={300} y={60 + V_DEMO * 14 + 12} textAnchor="middle" fontSize="9" fill="#9C9183" fontStyle="italic">
              （实际词表 50k - 200k 行）
            </text>
          </g>

          {/* === = 等号 === */}
          <text x={420} y={140} textAnchor="middle" fontSize="20" fontFamily="serif" fill="#6B5F50" fontWeight={300}>
            =
          </text>

          {/* === Logits（右） === */}
          <g>
            <text x={580} y={30} textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight={600} fill="#B85A2A">
              Logits（每个 token 的"分数"）
            </text>
            <text x={580} y={45} textAnchor="middle" fontSize="10" fill="#6B5F50">
              vocab 维向量（每个 token 一个分数）
            </text>
            {logits.map((logit, i) => {
              // logit 范围 ~ -6 到 +10，归一化条形长度
              const w = (Math.abs(logit) / 10) * 80;
              const isPos = logit >= 0;
              return (
                <g key={i}>
                  <text x={460} y={71 + i * 14} textAnchor="end" fontSize="9" fontFamily="serif" fill="#6B5F50">
                    {sampleVocab[i]}
                  </text>
                  {/* 中心线 */}
                  <line x1={500} y1={64 + i * 14} x2={500} y2={76 + i * 14} stroke="#9C9183" strokeWidth={0.5} />
                  {/* 条形 */}
                  <rect
                    x={isPos ? 500 : 500 - w}
                    y={65 + i * 14}
                    width={w}
                    height={10}
                    fill={isPos ? '#D97742' : '#9C9183'}
                    opacity={0.7}
                  />
                  <text
                    x={isPos ? 500 + w + 4 : 500 - w - 4}
                    y={73 + i * 14}
                    textAnchor={isPos ? 'start' : 'end'}
                    fontSize="9"
                    fontFamily="monospace"
                    fill="#1F1A14"
                  >
                    {logit.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 解读 + caveat（紧凑两段） */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 unembedding 矩阵<strong className="text-text">每一行是一个 token 的"匹配模板"</strong>——最后一层向量跟某行做点积，分数高 = 这个 token 跟当前上下文匹配。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        ※ 注意：这些 logits <strong>不是概率</strong>——可以是任意实数（负无穷到正无穷）。要变成概率得过 softmax，下一节讲。
      </p>
    </div>
  );
}
