// Mock 数据生成器
//
// 目的：v0.1 还没接 OpenAI API 之前，先用 mock 数据让前端交互跑起来。
// 数据格式严格对应 docs/Sampling-DevSpec.md 第 4.2 节，未来切换到真实 API 时
// 只需替换本脚本的 generateExample 函数实现，前端无需修改。
//
// 跑这个脚本：npm run generate:mock

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import type { Certainty, ExampleData, IndexData, Step, TopLogprob } from '../src/lib/types';

// ==================== Logprob 模板（按三档确定性） ====================
// 真实 OpenAI 数据通常呈现这样的形态：
// - 高确定性：top-1 几乎 100%，第 2 名起断崖式跌到 -7~-8
// - 中等确定性：top-1 在 30-60%，前几名缓降，尾部缓慢衰减
// - 低确定性：top-1 在 15-30%，前几名很接近，尾部仍有可观概率

const LOGPROB_TEMPLATES: Record<Certainty, number[]> = {
  high_certainty: [
    -0.002, -7.5, -8.2, -9.0, -9.8, -10.3, -10.9, -11.5, -12.0, -12.5,
    -13.0, -13.4, -13.8, -14.2, -14.6, -14.9, -15.2, -15.5, -15.8, -16.0,
  ],
  medium_certainty: [
    -0.8, -1.4, -1.9, -2.4, -2.8, -3.2, -3.6, -4.0, -4.3, -4.7,
    -5.0, -5.3, -5.6, -5.9, -6.1, -6.3, -6.5, -6.7, -6.9, -7.0,
  ],
  low_certainty: [
    -1.6, -1.85, -2.05, -2.25, -2.45, -2.6, -2.78, -2.95, -3.1, -3.25,
    -3.4, -3.55, -3.7, -3.85, -3.95, -4.05, -4.15, -4.25, -4.35, -4.45,
  ],
};

// 当某个 step 的备选 token 不够 20 个时，从这里挑常见高频 token 填充
// 按语言分组——避免英文例子里混入中文 filler 看着违和
const FILLERS_BY_LANG: Record<'zh' | 'en' | 'mixed', string[]> = {
  zh: [
    '的', '是', '了', '在', '和', '也', '都', '就', '还', '又',
    '，', '。', '！', '？', '我', '你', '他', '这', '那', '一',
    '个', '不', '有', '到', '上', '下', '里', '外', '前', '后',
  ],
  en: [
    ' the', ' a', ' and', ' to', ' of', ' in', ' is', ' that', ' it', ' for',
    ' was', ' on', ' with', ' as', ' be', ' have', ' this', ' will', ' or', ' an',
    '.', ',', '!', '?', "'s",
  ],
  mixed: [
    ' it', ' the', ' a', ' and', ' to', ' is', ' for', ' of', ' that', ' on',
    '.', ',', "'s", ' so', ' just', '!', '?', ' very', ' I', ' you',
  ],
};

// ==================== 6 个预设例子（按 DevSpec 4.4 覆盖三档；中英混合 + emoji 突出 tokenization 差异） ====================

interface ExampleSpec {
  id: string;
  prompt: string;
  prompt_zh_label: string;
  category: Certainty;
  lang: 'zh' | 'en' | 'mixed';
  // 每一步的 [greedy_token, ...alternatives]，第一项即下一步的 greedy 路径
  steps: { greedy: string; alts: string[] }[];
}

const EXAMPLE_SPECS: ExampleSpec[] = [
  // ---- 高确定性 × 2 ----
  {
    id: 'capital_china',
    prompt: '中国的首都是',
    prompt_zh_label: '中国的首都是 ___',
    category: 'high_certainty',
    lang: 'zh',
    steps: [
      { greedy: '北京', alts: ['中华', '首都', '上海', '天安', '中国', '京'] },
      { greedy: '，', alts: ['。', '（', '：', '；', ' '] },
      { greedy: '也', alts: ['同', '中', '它', '这', '其'] },
      { greedy: '是', alts: ['为', '属', '被', '叫', '称'] },
      { greedy: '中', alts: ['全', '整', '亚', '世', '一'] },
      { greedy: '国', alts: ['华', '央', '部', '心', '原'] },
      { greedy: '的', alts: ['之', '最', '政', '经', '文'] },
      { greedy: '政', alts: ['经', '文', '首', '中', '历'] },
    ],
  },
  {
    id: 'capital_france_en',
    prompt: 'The capital of France is',
    prompt_zh_label: 'The capital of France is ___',
    category: 'high_certainty',
    lang: 'en',
    steps: [
      { greedy: ' Paris', alts: [' Lyon', ' Marseille', ' Bordeaux', ' Nice', ' Versailles', ' Toulouse', ' French', ' a', ' the', ' an', ' often', ' home', ' known'] },
      { greedy: '.', alts: [',', ' and', '!', ' (', '...', '—', ':', '?', '"'] },
      { greedy: ' It', alts: [' Paris', ' The', ' Located', ' Famous', ' A', ' As', ' With', ' This', ' Known', ' Home', ' One'] },
      { greedy: ' is', alts: ["'s", ' has', ' contains', ' sits', ' lies', ' offers', ' features', ' stands', ' was', ' serves'] },
      { greedy: ' known', alts: [' famous', ' home', ' the', ' one', ' considered', ' often', ' widely', ' a', ' an', ' loved'] },
      { greedy: ' for', alts: [' as', ' around', ' worldwide', ' globally', ' throughout', ' by', ' among', ' across', ' to'] },
      { greedy: ' its', alts: [' being', ' the', ' several', ' a', ' an', ' many', ' centuries', ' over', ' having'] },
      { greedy: ' iconic', alts: [' famous', ' art', ' rich', ' cultural', ' stunning', ' beautiful', ' centuries', ' ancient', ' museums', ' architecture'] },
    ],
  },

  // ---- 中等确定性 × 2 ----
  {
    id: 'favorite_fruit',
    prompt: '我最喜欢的水果是',
    prompt_zh_label: '我最喜欢的水果是 ___',
    category: 'medium_certainty',
    lang: 'zh',
    steps: [
      { greedy: '苹', alts: ['西', '草', '葡', '香', '橘', '芒'] },
      { greedy: '果', alts: ['瓜', '萄', '莓', '蕉', '子', '梨'] },
      { greedy: '，', alts: ['。', '和', '与', '：'] },
      { greedy: '因', alts: ['它', '我', '这', '味', '不'] },
      { greedy: '为', alts: ['是', '它', '其', '不', '此'] },
      { greedy: '它', alts: ['苹', '这', '其', '味', '吃'] },
      { greedy: '既', alts: ['味', '不', '又', '很', '非'] },
      { greedy: '甜', alts: ['脆', '美', '酸', '香', '健'] },
    ],
  },
  {
    id: 'pizza_emoji',
    prompt: 'I love pizza 🍕 because',
    prompt_zh_label: 'I love pizza 🍕 because ___',
    category: 'medium_certainty',
    lang: 'mixed',
    steps: [
      { greedy: ' it', alts: [' of', ' pizza', ' I', ' they', ' its', ' every', ' the', ' you', ' all', ' who', ' when', ' food'] },
      { greedy: "'s", alts: [' is', ' has', ' can', ' brings', ' makes', ' offers', ' feels', ' tastes', ' smells', ' comes', ' always'] },
      { greedy: ' delicious', alts: [' so', ' tasty', ' versatile', ' amazing', ' comforting', ' yummy', ' perfect', ' incredible', ' awesome', ' filling', ' satisfying'] },
      { greedy: ',', alts: [' and', ' with', ' in', '.', ' or', '!', ' plus', ' yet', ' but', '—', '...'] },
      { greedy: ' easy', alts: [' comforting', ' perfect', ' fun', ' cheap', ' simple', ' satisfying', ' quick', ' warm', ' filling', ' always'] },
      { greedy: ' to', alts: [' yet', 'ly', ' and', ' for', ',', ' when', ' enough', ' on', ' in', ' at', ' as'] },
      { greedy: ' share', alts: [' make', ' eat', ' customize', ' enjoy', ' love', ' serve', ' devour', ' bite', ' craft', ' grab'] },
      { greedy: ',', alts: [' and', ' with', '.', '!', ' plus', ' yet', ' or', '—', ';', '...'] },
    ],
  },

  // ---- 低确定性 × 2 ----
  {
    id: 'weather_today',
    prompt: '今天天气真',
    prompt_zh_label: '今天天气真 ___',
    category: 'low_certainty',
    lang: 'zh',
    steps: [
      { greedy: '好', alts: ['不', '棒', '热', '凉', '美', '舒', '晴', '冷', '糟'] },
      { greedy: '，', alts: ['。', '！', '啊', '呀'] },
      { greedy: '我', alts: ['阳', '想', '适', '是', '太', '让', '天'] },
      { greedy: '想', alts: ['打', '准', '决', '要', '要', '希'] },
      { greedy: '去', alts: ['出', '到', '在', '和', '约'] },
      { greedy: '外', alts: ['公', '海', '山', '河', '街'] },
      { greedy: '面', alts: ['头', '园', '边', '滩', '上'] },
      { greedy: '走', alts: ['散', '玩', '跑', '逛', '看'] },
    ],
  },
  {
    id: 'she_said',
    prompt: '她说：',
    prompt_zh_label: '她说：___',
    category: 'low_certainty',
    lang: 'zh',
    steps: [
      { greedy: '"', alts: ['「', '你', '我', '请', '今', '为', '别', '不'] },
      { greedy: '我', alts: ['你', '今', '请', '别', '让', '不'] },
      { greedy: '不', alts: ['想', '觉', '希', '需', '要', '会'] },
      { greedy: '知', alts: ['想', '会', '懂', '清', '相'] },
      { greedy: '道', alts: ['楚', '解', '晓', '情', '究'] },
      { greedy: '你', alts: ['该', '为', '这', '怎', '到'] },
      { greedy: '在', alts: ['是', '想', '说', '到', '会'] },
      { greedy: '说', alts: ['想', '做', '讲', '问', '搞'] },
    ],
  },
];

// ==================== 工具函数 ====================

function buildTopLogprobs(
  stepDef: { greedy: string; alts: string[] },
  certainty: Certainty,
  lang: 'zh' | 'en' | 'mixed',
): TopLogprob[] {
  const tmpl = LOGPROB_TEMPLATES[certainty];
  const tokens: string[] = [stepDef.greedy, ...stepDef.alts];

  // 用 fillers 补到 20 个，按语言选 filler 池，去重
  const fillers = FILLERS_BY_LANG[lang];
  const seen = new Set(tokens);
  for (const filler of fillers) {
    if (tokens.length >= 20) break;
    if (!seen.has(filler)) {
      tokens.push(filler);
      seen.add(filler);
    }
  }
  // 极端情况下还不到 20 个，用占位符兜底
  while (tokens.length < 20) {
    tokens.push(`_${tokens.length}`);
  }

  // 用模板 + 微噪音（保证看起来不像机械生成）
  return tokens.slice(0, 20).map((token, i) => {
    const noise = (Math.sin(i * 13.7 + token.charCodeAt(0)) - 0.5) * 0.04;
    return { token, logprob: tmpl[i] + noise };
  });
}

function generateExample(spec: ExampleSpec): ExampleData {
  let promptSoFar = spec.prompt;
  const steps: Step[] = spec.steps.map((stepDef, i) => {
    const top_logprobs = buildTopLogprobs(stepDef, spec.category, spec.lang);
    const step: Step = {
      step_index: i,
      prompt_so_far: promptSoFar,
      top_logprobs,
      greedy_token: stepDef.greedy,
    };
    promptSoFar = promptSoFar + stepDef.greedy;
    return step;
  });

  return {
    id: spec.id,
    prompt: spec.prompt,
    prompt_zh_label: spec.prompt_zh_label,
    category: spec.category,
    model: 'mock-v0.1', // 真实 API 替换后改为 'gpt-4o' 等
    generated_at: new Date().toISOString().slice(0, 10),
    steps,
  };
}

const CATEGORY_LABEL: Record<Certainty, string> = {
  high_certainty: '高确定性场景',
  medium_certainty: '中等确定性场景',
  low_certainty: '低确定性场景',
};

// ==================== 主流程 ====================

function main() {
  const outDir = join(process.cwd(), 'public', 'data', 'sampling');
  mkdirSync(outDir, { recursive: true });

  const indexEntries = EXAMPLE_SPECS.map((spec) => {
    const example = generateExample(spec);
    const file = join(outDir, `${spec.id}.json`);
    writeFileSync(file, JSON.stringify(example, null, 2), 'utf-8');
    console.log(`  ✓ ${file}`);
    return {
      id: spec.id,
      label: spec.prompt_zh_label,
      category: spec.category,
      description: CATEGORY_LABEL[spec.category],
    };
  });

  const index: IndexData = { examples: indexEntries };
  const indexFile = join(outDir, 'index.json');
  writeFileSync(indexFile, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`  ✓ ${indexFile}`);
  console.log(`\nMock 数据生成完毕：${indexEntries.length} 个例子`);
}

main();
