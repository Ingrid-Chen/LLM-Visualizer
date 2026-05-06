'use client';

import { useMemo, useState } from 'react';

// FFN 流程可视化：让用户看到一个 token 经过 FFN 的"扩展 → 激活 → 收回"过程
// 选不同 token，看中间层激活模式不同——展示"FFN 像知识库查询"的直觉

const TOKENS = [
  { name: '"Lucy"', vec: [0.6, -0.3, 0.8, 0.1, -0.5, 0.4, 0.2, -0.7] },
  { name: '"苹果"', vec: [-0.4, 0.7, -0.2, 0.5, 0.3, -0.6, 0.8, 0.1] },
  { name: '"北京"', vec: [0.3, 0.9, -0.5, -0.2, 0.6, 0.1, -0.4, 0.7] },
  { name: '"巴黎"', vec: [0.5, 0.8, -0.3, -0.1, 0.7, 0.2, -0.5, 0.6] },
];

const D = 8; // 演示用 d 维（LLM 实际 hidden 维度 4096+ 因模型而异）
const MID = 24; // 演示用中间层维度（实际是 4d；这里 24 个色块够直观）

function valueToBlue(v: number): string {
  // 用单色（暖橘）渐变表示"激活程度"
  return `rgba(217, 119, 66, ${0.05 + Math.min(Math.abs(v), 1) * 0.85})`;
}

function valueToGreen(v: number): string {
  // 输入/输出向量用墨绿渐变（区分主操作前后的"语义向量"）
  return v >= 0
    ? `rgba(44, 81, 66, ${0.1 + Math.min(Math.abs(v), 1) * 0.7})`
    : `rgba(217, 119, 66, ${0.1 + Math.min(Math.abs(v), 1) * 0.7})`;
}

export default function FFNFlowViz() {
  const [tokenIdx, setTokenIdx] = useState(0);
  const token = TOKENS[tokenIdx];

  // 中间层激活（mock）：用 token 名字 hash 决定激活模式——这样切换 token，激活模式明显不同
  const midActivation = useMemo(() => {
    const seed = token.name.charCodeAt(0) + token.name.charCodeAt(1);
    return Array.from({ length: MID }, (_, i) => {
      const raw = Math.sin(seed * 0.17 + i * 0.41) * 0.5 + 0.5; // 0~1
      // 模拟 ReLU 激活：低于阈值置 0
      return raw < 0.4 ? 0 : Number((raw - 0.3).toFixed(2));
    });
  }, [token]);

  // 输出：W₂ × 中间层 → d 维（mock）
  const output = useMemo(() => {
    return token.vec.map((v, i) => {
      const sum = midActivation.reduce((s, m, j) => s + m * Math.cos((i * j) * 0.3), 0);
      return Number((v * 0.6 + sum * 0.05).toFixed(2));
    });
  }, [token, midActivation]);

  // 计算激活的"特征数"，用于解读
  const activeCount = midActivation.filter((v) => v > 0).length;

  return (
    <div className="space-y-4">
      {/* token 切换 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">看不同 token 经过 FFN 激活了什么"特征"：</span>
        {TOKENS.map((t, i) => (
          <button
            key={t.name}
            onClick={() => setTokenIdx(i)}
            className={[
              'px-3 py-1 text-sm rounded-full border transition-colors',
              tokenIdx === i
                ? 'border-ink bg-ink text-cream-50'
                : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* SVG 流程 */}
      <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 overflow-x-auto">
        <svg viewBox="0 0 820 280" className="w-full h-auto" style={{ minWidth: '600px' }}>
          {/* 输入向量（左） */}
          <FlowSection
            x={30}
            label="输入"
            sublabel={`${token.name} 的向量（d=${D} 维示意）`}
            cells={token.vec}
            cellColor={valueToGreen}
            cols={D}
          />

          {/* 箭头 + W₁ 标注 */}
          <ArrowWith label="W₁ 扩展" sub={`d → 4d (${MID})`} x1={180} x2={260} y={130} />

          {/* 中间层（中） */}
          <FlowSection
            x={270}
            label="中间层"
            sublabel={`${MID} 维 · ${activeCount} 个特征激活`}
            cells={midActivation}
            cellColor={valueToBlue}
            cols={6}
            wide={true}
          />

          {/* 箭头 + W₂ 标注 */}
          <ArrowWith label="W₂ 收回" sub={`4d → d`} x1={520} x2={600} y={130} />

          {/* 输出向量（右） */}
          <FlowSection
            x={620}
            label="输出"
            sublabel="新的 d 维向量"
            cells={output}
            cellColor={valueToGreen}
            cols={D}
          />
        </svg>
      </div>

      {/* 解读 + caveat（紧凑） */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 <strong className="text-text">切换不同 token 看中间层激活的差异</strong>：每个 token 激活的"特征"位置不一样——这就是"知识库查询"类比的来源。
        中间层每个神经元像一个<strong className="text-text">"知识开关"</strong>，只在输入向量匹配它学到的某个知识时才被激活。
        例如<strong className="text-text">"巴黎"</strong>可能激活"首都/法国/欧洲"开关；
        <strong className="text-text">"苹果"</strong>可能激活"水果/科技公司/红色"等不同的开关。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        ※ 这是直觉示意。中间层的 ReLU 激活让"无关知识"被压成 0、"相关知识"留下——这是非线性激活的核心作用。
      </p>
    </div>
  );
}

// ==================== Helper components ====================

function FlowSection({
  x,
  label,
  sublabel,
  cells,
  cellColor,
  cols,
  wide = false,
}: {
  x: number;
  label: string;
  sublabel: string;
  cells: number[];
  cellColor: (v: number) => string;
  cols: number;
  wide?: boolean;
}) {
  const cellSize = wide ? 36 : 18;
  const gap = 2;
  const sectionW = cols * (cellSize + gap);
  const rows = Math.ceil(cells.length / cols);

  return (
    <g>
      {/* 标签 */}
      <text x={x + sectionW / 2} y={70} textAnchor="middle" fontSize="11" fontFamily="serif" fontWeight={600} fill="#1F1A14">
        {label}
      </text>
      <text x={x + sectionW / 2} y={84} textAnchor="middle" fontSize="9" fill="#6B5F50">
        {sublabel}
      </text>
      {/* Cells */}
      {cells.map((v, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <rect
            key={i}
            x={x + col * (cellSize + gap)}
            y={100 + row * (cellSize + gap)}
            width={cellSize}
            height={cellSize}
            rx={3}
            fill={cellColor(v)}
            stroke="rgba(0,0,0,0.05)"
            strokeWidth={0.5}
          >
            <title>第 {i + 1} 维：{v.toFixed(2)}</title>
          </rect>
        );
      })}
      {/* 行/列说明 */}
      <text
        x={x + sectionW / 2}
        y={100 + rows * (cellSize + gap) + 14}
        textAnchor="middle"
        fontSize="9"
        fill="#9C9183"
      >
        {cells.length} 维向量
      </text>
    </g>
  );
}

function ArrowWith({ label, sub, x1, x2, y }: { label: string; sub: string; x1: number; x2: number; y: number }) {
  return (
    <g>
      <defs>
        <marker
          id={`ffn-arrow-${x1}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#2C5142" />
        </marker>
      </defs>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke="#2C5142" strokeWidth={1.5} markerEnd={`url(#ffn-arrow-${x1})`} />
      <text x={(x1 + x2) / 2} y={y - 8} textAnchor="middle" fontSize="10" fontFamily="serif" fontWeight={600} fill="#1F3B30">
        {label}
      </text>
      <text x={(x1 + x2) / 2} y={y + 18} textAnchor="middle" fontSize="9" fill="#6B5F50">
        {sub}
      </text>
    </g>
  );
}
