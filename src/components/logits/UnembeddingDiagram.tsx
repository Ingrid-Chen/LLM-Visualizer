'use client';

import { useT } from '@/lib/i18n/LangContext';

const D_DEMO = 8;
const V_DEMO = 12;

export default function UnembeddingDiagram() {
  const t = useT();
  const lastHiddenVec = [0.6, -0.3, 0.8, 0.1, -0.5, 0.4, 0.2, -0.7];
  // demo vocab 保持中文（mock 数据）
  const sampleVocab = ['北京', '上海', '中国', '首都', '是', '的', '了', '在', '历史', '城市', '一个', '了'];
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

          <g>
            <text x={70} y={30} textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              {t('logits.comp.unembeddingDiagram.lastLayerTitle')}
            </text>
            <text x={70} y={45} textAnchor="middle" fontSize="10" fill="#6B5F50">
              {t('logits.comp.unembeddingDiagram.lastLayerSub')}
            </text>
            {lastHiddenVec.map((v, i) => {
              const intensity = Math.min(Math.abs(v), 1);
              const fill = v >= 0 ? `rgba(44, 81, 66, ${0.15 + intensity * 0.7})` : `rgba(217, 119, 66, ${0.15 + intensity * 0.7})`;
              return (
                <g key={i}>
                  <rect x={50} y={60 + i * 18} width={40} height={16} rx={3} fill={fill} stroke="rgba(0,0,0,0.1)" />
                  <text x={70} y={72 + i * 18} textAnchor="middle" fontSize="9" fontFamily="monospace" fill="#FBF8F1" fontWeight={500}>
                    {v.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </g>

          <text x={130} y={140} textAnchor="middle" fontSize="20" fontFamily="serif" fill="#6B5F50" fontWeight={300}>
            ×
          </text>

          <g>
            <text x={300} y={30} textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight={600} fill="#1F1A14">
              {t('logits.comp.unembeddingDiagram.matrixTitle')}
            </text>
            <text x={300} y={45} textAnchor="middle" fontSize="10" fill="#6B5F50">
              {t('logits.comp.unembeddingDiagram.matrixSub')}
            </text>
            {Array.from({ length: V_DEMO }).map((_, row) =>
              Array.from({ length: D_DEMO }).map((_, col) => {
                const seed = row * 13 + col * 7;
                const v = Math.sin(seed * 0.5) * 0.6;
                const intensity = Math.min(Math.abs(v), 1);
                const fill = v >= 0 ? `rgba(124, 58, 237, ${0.1 + intensity * 0.5})` : `rgba(217, 119, 66, ${0.1 + intensity * 0.5})`;
                return <rect key={`m-${row}-${col}`} x={200 + col * 20} y={60 + row * 14} width={18} height={12} rx={2} fill={fill} stroke="rgba(0,0,0,0.05)" strokeWidth={0.5} />;
              }),
            )}
            {sampleVocab.map((tok, i) => (
              <text key={`vlbl-${i}`} x={195} y={71 + i * 14} textAnchor="end" fontSize="9" fontFamily="serif" fill="#6B5F50">
                {tok}
              </text>
            ))}
            <text x={300} y={60 + V_DEMO * 14 + 12} textAnchor="middle" fontSize="9" fill="#9C9183" fontStyle="italic">
              {t('logits.comp.unembeddingDiagram.vocabHint')}
            </text>
          </g>

          <text x={420} y={140} textAnchor="middle" fontSize="20" fontFamily="serif" fill="#6B5F50" fontWeight={300}>
            =
          </text>

          <g>
            <text x={580} y={30} textAnchor="middle" fontSize="12" fontFamily="serif" fontWeight={600} fill="#B85A2A">
              {t('logits.comp.unembeddingDiagram.logitsTitle')}
            </text>
            <text x={580} y={45} textAnchor="middle" fontSize="10" fill="#6B5F50">
              {t('logits.comp.unembeddingDiagram.logitsSub')}
            </text>
            {logits.map((logit, i) => {
              const w = (Math.abs(logit) / 10) * 80;
              const isPos = logit >= 0;
              return (
                <g key={i}>
                  <text x={460} y={71 + i * 14} textAnchor="end" fontSize="9" fontFamily="serif" fill="#6B5F50">
                    {sampleVocab[i]}
                  </text>
                  <line x1={500} y1={64 + i * 14} x2={500} y2={76 + i * 14} stroke="#9C9183" strokeWidth={0.5} />
                  <rect x={isPos ? 500 : 500 - w} y={65 + i * 14} width={w} height={10} fill={isPos ? '#D97742' : '#9C9183'} opacity={0.7} />
                  <text x={isPos ? 500 + w + 4 : 500 - w - 4} y={73 + i * 14} textAnchor={isPos ? 'start' : 'end'} fontSize="9" fontFamily="monospace" fill="#1F1A14">
                    {logit.toFixed(1)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <p className="text-xs text-text-muted/90 leading-relaxed">{t('logits.comp.unembeddingDiagram.insight')}</p>
      <p className="text-[11px] text-text-muted/70 italic">{t('logits.comp.unembeddingDiagram.caveat')}</p>
    </div>
  );
}
