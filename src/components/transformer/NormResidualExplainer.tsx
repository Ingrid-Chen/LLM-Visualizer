'use client';

// 归一化 + 残差连接的概念解释卡片
// 直接在页面上讲清两个东西的"是什么 + 数学 + 为什么需要"——不依赖点击交互
// 公式挪到深入模式；用类比替代"梯度回传/信息保留"等术语

export default function NormResidualExplainer() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* === LayerNorm === */}
      <div className="rounded-lg border-2 border-ink/30 bg-cream-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-ink text-cream-50 font-medium tracking-wider">归一化</span>
          <h3 className="font-serif text-lg text-ink-dark">LayerNorm</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">是什么</div>
            <p className="text-text-muted leading-relaxed">
              把向量的数值<strong className="text-text">"标准化"</strong>到一个稳定范围里——既不会过大也不会过小。
            </p>
          </div>

          <div className="pt-2 border-t border-ink/10">
            <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium mb-1">为什么需要</div>
            <p className="text-text-muted leading-relaxed">
              神经网络训练时如果某层输出数值<strong className="text-text">"飘"</strong>了（变得很大或很小），训练就不稳定了。
              归一化把数值强制拉回固定范围，让训练能稳定收敛、能堆深层网络。
            </p>
            <p className="text-text leading-relaxed mt-2 font-medium">
              📌 这是 Transformer 能堆 50+ 层的工程前提。
            </p>
            <p className="text-[11px] text-text-muted/70 italic mt-2">
              ※ 数学公式（μ / σ / γ / β）放在深入模式。
            </p>
          </div>
        </div>
      </div>

      {/* === Residual === */}
      <div className="rounded-lg border-2 border-ember/30 bg-cream-50 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-ember text-cream-50 font-medium tracking-wider">残差连接</span>
          <h3 className="font-serif text-lg text-ember-dark">Residual</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">是什么</div>
            <p className="text-text-muted leading-relaxed">
              把进入这一层之前的输入 x <strong className="text-text">直接"绕过去"加到</strong>主操作（Attention 或 FFN）的输出上。
              一个简单的"加号"——
              <span className="font-mono text-text"> y = F(x) + x</span>。
            </p>
          </div>

          <div className="pt-2 border-t border-ember/15">
            <div className="text-[10px] uppercase tracking-wider text-ember-dark font-medium mb-1">为什么需要（用一个比喻）</div>
            <p className="text-text-muted leading-relaxed">
              想象一下你做一道复杂菜：每加工一步都有可能<strong className="text-text">出错</strong>或<strong className="text-text">弄丢原料的味道</strong>。
              "残差连接"就像每一步都<strong className="text-text">留一份原汁</strong>——即使新一步没做好，原汁还能保住基本味道。
            </p>
            <p className="text-text-muted leading-relaxed mt-1.5">
              对深层网络也一样：50+ 层堆叠时，哪怕中间某层"翻车"，原始信息还能通过残差通道直传过去——这是模型能可靠地堆很深的关键。
            </p>
            <p className="text-text leading-relaxed mt-2 font-medium">
              📌 没有残差，超过几层的网络就训不起来。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
