'use client';

import { useState } from 'react';

import { TOKENIZER_META, useTokenize, type TokenizerName } from '@/lib/useTokenizer';

const PRESETS: { label: string; text: string; hint?: string }[] = [
  { label: '中文短句', text: '中国的首都是北京。', hint: '看 6 字汉字怎么被切' },
  { label: '英文短句', text: 'The capital of China is Beijing.', hint: '看英文单词的前导空格' },
  { label: '中英对照', text: 'The weather today is really nice. 今天的天气真好。', hint: '同义中英文混在一起' },
  { label: '含 Emoji', text: '我们一起去吃 pizza 🍕 吧！', hint: 'emoji 是 token 大户' },
  { label: '生僻字', text: '䶮龘齉爨饕餮鬱鬰', hint: '生僻字按字节级 fallback 拆分' },
  { label: '代码片段', text: 'def hello(name: str) -> None:\n    print(f"Hello, {name}!")', hint: '代码的 indent / 符号' },
];

// 给每个 token 一个稳定的颜色（基于 token id 哈希），让相同 token 在不同位置出现时颜色一致
const PALETTE = [
  'bg-ink/15 border-ink/30 text-ink-dark',
  'bg-ember/15 border-ember/30 text-ember-dark',
  'bg-amber-100 border-amber-300 text-amber-800',
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-emerald-100 border-emerald-300 text-emerald-800',
  'bg-pink-100 border-pink-300 text-pink-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-indigo-100 border-indigo-300 text-indigo-800',
];

function colorFor(id: number): string {
  return PALETTE[Math.abs(id) % PALETTE.length];
}

interface Props {
  initialText?: string;
  initialEncoding?: TokenizerName;
}

export default function TokenizerPlayground({
  initialText = '中国的首都是北京。',
  initialEncoding = 'cl100k_base',
}: Props) {
  const [text, setText] = useState(initialText);
  const [encoding, setEncoding] = useState<TokenizerName>(initialEncoding);
  const result = useTokenize(text, encoding);

  return (
    <div className="space-y-5">
      {/* 真实性说明（给用户信心） */}
      <p className="text-[11px] text-text-muted/80 bg-cream-100 border border-ink/10 rounded px-3 py-1.5 inline-block">
        ✓ 真实切分 · 用 OpenAI 官方 <a href="https://github.com/openai/tiktoken" target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline text-ink">tiktoken</a> 的 JS port 在浏览器本地跑，无 mock、无 API 调用
      </p>

      {/* 预设例子 */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-text-muted self-center mr-1">试试：</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setText(p.text)}
            className="text-xs px-3 py-1 rounded-full border border-ink/15 bg-cream-50 hover:border-ink/40 hover:bg-cream-100 transition-colors"
            title={p.hint}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 输入框 */}
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">输入任意文本</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-lg border-2 border-ink/15 bg-cream-50 font-serif text-base resize-y focus:outline-none focus:border-ink/50 transition-colors"
          placeholder="在这里输入任意中英文 / emoji / 代码…"
        />
      </div>

      {/* Tokenizer 切换 */}
      <div>
        <label className="text-xs uppercase tracking-wider text-text-muted block mb-1.5">选择 Tokenizer（看不同模型时代的差异）</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(TOKENIZER_META) as TokenizerName[]).map((name) => {
            const meta = TOKENIZER_META[name];
            const active = encoding === name;
            return (
              <button
                key={name}
                onClick={() => setEncoding(name)}
                className={[
                  'text-left p-2.5 rounded-lg border-2 transition-all',
                  active
                    ? 'border-ink bg-cream-100 shadow-[2px_3px_0_rgba(44,81,66,0.15)]'
                    : 'border-ink/15 bg-cream-50 hover:border-ink/40',
                ].join(' ')}
              >
                <div className="font-mono text-sm text-text">{meta.label}</div>
                <div className="text-[10px] text-text-muted leading-tight mt-0.5">{meta.modelEra}</div>
                <div className="text-[10px] text-text-muted/70 leading-tight">{meta.usedBy}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 切分结果 */}
      <div>
        <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
          <h3 className="font-serif text-base text-ink-dark">切分结果</h3>
          <div className="flex items-center gap-3 text-xs">
            <Stat label="字符" value={result.charCount} />
            <Stat label="字节 (UTF-8)" value={result.byteCount} />
            <Stat label="Token" value={result.tokenCount} highlight />
          </div>
        </div>

        {result.tokens.length === 0 ? (
          <p className="text-sm text-text-muted py-6 text-center">输入文本后看切分…</p>
        ) : (
          <div className="p-3 rounded-lg bg-cream-100 border border-ink/10">
            <div className="flex flex-wrap gap-1">
              {result.tokens.map((t, i) => (
                <span
                  key={i}
                  className={[
                    'inline-flex items-center px-2 py-0.5 rounded border text-sm font-mono',
                    colorFor(t.id),
                  ].join(' ')}
                  title={`token id: ${t.id}`}
                >
                  {/* 把空格 / 换行 等"看不见"的字符可视化 */}
                  <span className="font-serif">{visualize(t.str)}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 简短统计：char/token 比 */}
        {result.tokenCount > 0 && (
          <p className="text-[11px] text-text-muted/80 mt-2">
            <strong className="text-text">{(result.charCount / result.tokenCount).toFixed(2)}</strong>{' '}
            字符 / token —— 这个比值越接近 1，说明越接近"按字符切"；越大说明 BPE 把多个字符合并成单 token。
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[10px] uppercase tracking-wider text-text-muted">{label}</span>
      <span
        className={[
          'font-mono font-bold',
          highlight ? 'text-ember-dark text-lg' : 'text-text text-sm',
        ].join(' ')}
      >
        {value}
      </span>
    </div>
  );
}

function visualize(s: string): string {
  // 把不可见字符替换成可视图标，让 token 边界更清楚
  return s
    .replace(/ /g, '␣')
    .replace(/\n/g, '⏎')
    .replace(/\t/g, '⇥');
}
