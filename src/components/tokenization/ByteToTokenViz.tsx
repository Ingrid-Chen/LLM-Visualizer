'use client';

import { useMemo, useState } from 'react';

import { TOKENIZER_META, useMultiTokenCount, useTokenize, type TokenizerName } from '@/lib/useTokenizer';

// 选字符的标准：要能展示"GPT-2 → GPT-3.5/4 → GPT-4o" 的渐进合并叙事
// "模型" 在三档下分别是 6 / 2 / 1 token——是完美的渐进合并案例，且词义跟 LLM 主题契合
const SAMPLES: { char: string; label: string; note: string }[] = [
  { char: 'a', label: 'a', note: 'ASCII 英文字母（基线）' },
  { char: '模型', label: '模型', note: 'CJK 双字词（6 字节，渐进合并）' },
  { char: '🍕', label: '🍕', note: 'Emoji（4 字节）' },
  { char: '𝕩', label: '𝕩', note: '数学花体字（4 字节）' },
];

const ENCODINGS: TokenizerName[] = ['r50k_base', 'cl100k_base', 'o200k_base'];

export default function ByteToTokenViz() {
  const [char, setChar] = useState('模型');

  // 字节序列（UTF-8）
  const bytes = useMemo(() => {
    const arr = new TextEncoder().encode(char);
    return Array.from(arr);
  }, [char]);

  // 三个 tokenizer 各自的 token 数
  const counts = useMultiTokenCount(char, ENCODINGS);

  return (
    <div className="space-y-5">
      {/* 字符切换 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-text-muted self-center mr-1">看一个字符：</span>
        {SAMPLES.map((s) => (
          <button
            key={s.char}
            onClick={() => setChar(s.char)}
            className={[
              'px-3 py-1.5 rounded-lg border-2 transition-all flex items-center gap-2',
              char === s.char
                ? 'border-ink bg-cream-100'
                : 'border-ink/15 bg-cream-50 hover:border-ink/40',
            ].join(' ')}
          >
            <span className="font-serif text-xl">{s.label}</span>
            <span className="text-[10px] text-text-muted">{s.note}</span>
          </button>
        ))}
      </div>

      {/* 第 1 层：字符 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">第 1 层 · 字符</div>
          <div className="flex items-center justify-center flex-1 py-2">
            <span className="font-serif text-5xl text-ink-dark">{char}</span>
          </div>
          <div className="text-xs text-text-muted text-center mt-2">人眼看到的"1 个字符"</div>
        </div>

        {/* 第 2 层：UTF-8 字节 */}
        <div className="rounded-lg border-2 border-cream-200 bg-cream-50 p-4 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">
            第 2 层 · UTF-8 字节（{bytes.length} 字节）
          </div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap flex-1 py-2">
            {bytes.map((b, i) => (
              <div
                key={i}
                className="px-2 py-1.5 rounded bg-ink/10 border border-ink/30 font-mono text-xs text-ink-dark min-w-[38px] text-center"
              >
                <div className="font-bold">{b.toString(16).toUpperCase().padStart(2, '0')}</div>
                <div className="text-[9px] text-text-muted">byte {i + 1}</div>
              </div>
            ))}
          </div>
          <div className="text-xs text-text-muted text-center mt-2">
            计算机存储 / 传输用的"原料"
          </div>
        </div>

        {/* 第 3 层：token 数对比 */}
        <div className="rounded-lg border-2 border-ember/30 bg-ember/5 p-4 flex flex-col">
          <div className="text-[10px] uppercase tracking-wider text-ember-dark mb-1.5">
            第 3 层 · Token（看 BPE 合不合并）
          </div>
          <div className="space-y-1.5 flex-1 py-1">
            {ENCODINGS.map((enc) => {
              const meta = TOKENIZER_META[enc];
              const c = counts[enc];
              return (
                <div key={enc} className="flex items-center gap-2 text-xs">
                  <span className="text-text-muted/80 w-28 shrink-0 text-[10px] truncate">
                    {meta.modelEra.split('（')[0]}
                  </span>
                  <span className="font-mono font-bold text-ember-dark w-7 text-right">{c}</span>
                  <span className="text-text-muted">{c === 1 ? 'token' : 'tokens'}</span>
                  <MergeBadge tokens={c} bytes={bytes.length} />
                </div>
              );
            })}
          </div>
          <div className="text-xs text-text-muted text-center mt-2">模型的"识别单位"</div>
        </div>
      </div>

      {/* 解读 */}
      <ByteTokenInsight char={char} bytes={bytes} counts={counts} />
    </div>
  );
}

function ByteTokenInsight({
  char,
  bytes,
  counts,
}: {
  char: string;
  bytes: number[];
  counts: Record<TokenizerName, number>;
}) {
  const r50 = counts.r50k_base;
  const cl = counts.cl100k_base;
  const o2 = counts.o200k_base;

  let insight: React.ReactNode = null;

  if (bytes.length === 1) {
    insight = (
      <>
        英文 ASCII 字符就 1 字节，三种 tokenizer 都把它当作单 token——所以历史上"中文比英文费 token"的说法，
        本质是<strong className="text-text"> 中文每个字 3 字节 vs 英文 1 字节 </strong>这个底层差异。
      </>
    );
  } else if (r50 > cl && cl > o2 && o2 === 1) {
    // 完美渐进：6→2→1 这种 BPE 一代代逐步合并的故事
    insight = (
      <>
        看到了吗？<strong className="text-text">"{char}" 共 {bytes.length} 字节</strong>，三档 tokenizer 给出
        <strong className="text-ember-dark"> {r50} → {cl} → {o2} </strong>的渐进合并：
        <span className="block mt-1.5 ml-2 text-text-muted/90">
          • GPT-2/3 时代：BPE 完全没合并 → <strong className="text-text">{r50} 个 token</strong>（每个字节都是独立 token）<br />
          • GPT-3.5/4 时代：BPE 学会了把每个汉字合并 → <strong className="text-text">{cl} 个 token</strong>（按字切）<br />
          • GPT-4o 时代：BPE 把整个"{char}"作为常见词合并 → <strong className="text-text">{o2} 个 token</strong>
        </span>
        <span className="block mt-1.5">
          这不是"模型变聪明了"——是 OpenAI 在每次迭代时给 tokenizer 喂了更多中文训练数据，让 BPE 把更长的字节序列合并成单 token。
          同样的字节，<strong className="text-text">不同时代的 BPE 给出完全不同的"识别单位"</strong>。
        </span>
      </>
    );
  } else if (r50 > o2 && o2 === 1) {
    // 强对比：GPT-2 时代多 token，GPT-4o 合并成 1 token（中间 cl 跟 o2 同）
    insight = (
      <>
        看到了吗？<strong className="text-text">"{char}" 共 {bytes.length} 字节</strong>，但被切成的 token 数完全不同——
        GPT-2 时代 BPE 没把这 {bytes.length} 字节合并完，切成 <strong className="text-text">{r50} 个 token</strong>；
        GPT-3.5 之后 BPE 训练数据加入了大量中文，把整串字节合并成了 <strong className="text-ember-dark">1 个 token</strong>。
        <span className="block mt-1.5">
          这就是"为什么早年中文每字 ≈ 多个 token"——本质是
          <strong className="text-text"> BPE 没学过这串字节怎么合并 </strong>，不是中文本身"重"。
        </span>
      </>
    );
  } else if (r50 > o2) {
    // 弱对比：从 N → M（M > 1）
    insight = (
      <>
        "{char}" {bytes.length} 字节——GPT-2 时代 {r50} token，到 GPT-4o 压到 {o2} token。BPE 训练数据迭代后，
        这串字节序列的合并程度提高，但还没到完全合并成单 token——属于"较罕见"字符的常见情况。
      </>
    );
  } else if (r50 === o2 && r50 > 1) {
    // 三档都没合并：emoji / 罕见字符
    insight = (
      <>
        三档 tokenizer 都把 "{char}" 拆成 <strong className="text-text">{r50} 个 token</strong>——说明这串字节序列
        在所有训练数据里出现频率都很低，BPE 没学到合并规则。这就是 <strong className="text-text">emoji 和生僻字"贵"</strong>的本质：
        4 字节 + 没合并 = 比一个常用汉字（GPT-4o 下 1 token）贵几倍。
      </>
    );
  } else {
    insight = (
      <>
        字节数 = {bytes.length}；GPT-2/3 切成 {r50} token，GPT-3.5/4 切成 {cl} token，GPT-4o 切成 {o2} token。
        差异来自<strong className="text-text"> BPE 是否合并了这些字节 </strong>——合并越多，token 数越少。
      </>
    );
  }

  return (
    <div className="text-xs text-text-muted leading-relaxed bg-cream-100 border border-ink/10 rounded-lg p-3">
      💡 {insight}
    </div>
  );
}

function MergeBadge({ tokens, bytes }: { tokens: number; bytes: number }) {
  if (tokens === 1 && bytes > 1) {
    return <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">完全合并 ✓</span>;
  }
  if (tokens > 1 && tokens < bytes) {
    return <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">部分合并</span>;
  }
  if (tokens === bytes && bytes > 1) {
    return <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">未合并</span>;
  }
  return null;
}
