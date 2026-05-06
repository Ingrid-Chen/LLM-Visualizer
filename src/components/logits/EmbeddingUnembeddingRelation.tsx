'use client';

// 讲清楚：unembedding 矩阵从哪里来？跟 embedding 矩阵是什么关系？
// 这个章节是 PRD"模块 5 输出层"的关键铺垫——把首尾两个矩阵关联起来

const D_DEMO = 6;
const ROWS_DEMO = 5;
const SAMPLE_TOKENS = ['北京', '上海', '中国', '首都', '是'];

export default function EmbeddingUnembeddingRelation() {
  return (
    <div className="space-y-4">
      {/* 两个矩阵并排对照 + 中间双向箭头 */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-4 items-stretch">
        {/* Embedding */}
        <MatrixCard
          badge="模块开头用"
          badgeClass="bg-ink/15 text-ink-dark border-ink/30"
          title="W_E · Embedding 矩阵"
          direction="token → 向量"
          rowLabel='每行 = 一个 token 的"语义向量"'
          shape="|vocab| × d"
          colorScheme="ink"
          where="（第 2 章 Embedding 模块讲过）"
        />

        {/* Middle: 双向箭头 + 关系标注 */}
        <div className="flex md:flex-col items-center justify-center py-3 md:py-0 gap-2">
          <div className="text-2xl md:text-3xl text-ember-dark font-bold">↔</div>
          <div className="text-center">
            <div className="text-xs font-medium text-text">互为反向</div>
            <div className="text-[10px] text-text-muted/90 mt-1 max-w-[110px]">
              形状一样<br />
              （很多模型让 W_U = W_Eᵀ）
            </div>
          </div>
        </div>

        {/* Unembedding */}
        <MatrixCard
          badge="模块末尾用"
          badgeClass="bg-ember/15 text-ember-dark border-ember/30"
          title="W_U · Unembedding 矩阵"
          direction="向量 → token"
          rowLabel='每行 = 一个 token 的"匹配模板"'
          shape="|vocab| × d"
          colorScheme="ember"
          where="（这一章讲）"
        />
      </div>

      {/* 解读 + caveat（紧凑两段，跟 VectorSliceViz 风格一致） */}
      <p className="text-xs text-text-muted/90 leading-relaxed">
        💡 W_E 和 W_U 形状都是 <span className="font-mono">|vocab| × d</span>——本质是<strong className="text-text">同一映射的两个方向</strong>：W_E 把 token 翻译成向量（模块开头用），W_U 反过来从向量找回 token（模块末尾用）。
        两个矩阵都是模型在<strong className="text-text">大量文本上自学</strong>出来的，训练目标是"预测下一个 token"。
      </p>

      <p className="text-[11px] text-text-muted/70 italic">
        ※ 很多 LLM 直接让两个矩阵共享权重（<strong>Weight Tying</strong>，W_U = W_E 的转置），能省一半参数（如 LLaMA 7B 量级模型省 ~4 亿）。详见深入模式。
      </p>
    </div>
  );
}

interface MatrixCardProps {
  badge: string;
  badgeClass: string;
  title: string;
  direction: string;
  rowLabel: string;
  shape: string;
  colorScheme: 'ink' | 'ember';
  where: string;
}

function MatrixCard({ badge, badgeClass, title, direction, rowLabel, shape, colorScheme, where }: MatrixCardProps) {
  const baseColor = colorScheme === 'ink' ? 'rgba(44, 81, 66,' : 'rgba(217, 119, 66,';
  const borderClass = colorScheme === 'ink' ? 'border-ink/30' : 'border-ember/30';
  const titleClass = colorScheme === 'ink' ? 'text-ink-dark' : 'text-ember-dark';

  return (
    <div className={['rounded-lg border-2 bg-cream-50 p-4', borderClass].join(' ')}>
      <span className={['inline-block text-[10px] px-2 py-0.5 rounded-full font-medium border tracking-wider mb-2', badgeClass].join(' ')}>
        {badge}
      </span>
      <h4 className={['font-serif text-base font-semibold mb-1', titleClass].join(' ')}>{title}</h4>
      <p className="text-xs text-text-muted mb-3">
        <span className="font-mono text-text">{direction}</span>
      </p>

      {/* 矩阵示意 */}
      <div className="flex items-start gap-2 mb-2">
        {/* 行标签 */}
        <div className="flex flex-col gap-0.5">
          {SAMPLE_TOKENS.map((tok, i) => (
            <div key={i} className="h-4 flex items-center text-[10px] font-serif text-text-muted leading-none">
              {tok}
            </div>
          ))}
        </div>
        {/* 色块矩阵 */}
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${D_DEMO}, minmax(0, 1fr))` }}>
          {Array.from({ length: ROWS_DEMO * D_DEMO }).map((_, idx) => {
            const seed = idx * 7;
            const v = Math.sin(seed * 0.4) * 0.5 + Math.cos(seed * 0.3) * 0.3;
            const intensity = Math.min(Math.abs(v), 1);
            const fill = `${baseColor} ${0.15 + intensity * 0.6})`;
            return (
              <div
                key={idx}
                className="aspect-square rounded-[2px]"
                style={{ backgroundColor: fill, minWidth: 14 }}
              />
            );
          })}
        </div>
      </div>

      <div className="text-[10px] text-text-muted/80 space-y-0.5 pt-2 border-t border-ink/10">
        <div>形状：<span className="font-mono text-text">{shape}</span></div>
        <div>{rowLabel}</div>
        <div className="italic text-text-muted/70">{where}</div>
      </div>
    </div>
  );
}
