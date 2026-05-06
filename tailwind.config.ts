import type { Config } from 'tailwindcss';

// 温暖科普风（PRD 5.1）：奶油白底 + 不饱和深色主色 + 暖橘点缀
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 主背景：奶油白
        cream: {
          50: '#FBF8F1',
          100: '#F5EFE2',
          200: '#EBE2CD',
        },
        // 主色：墨绿（不饱和）
        ink: {
          DEFAULT: '#2C5142',
          dark: '#1F3B30',
          light: '#5A8170',
        },
        // 点缀：暖橘
        ember: {
          DEFAULT: '#D97742',
          dark: '#B85A2A',
          light: '#E89968',
        },
        // 文字
        text: {
          DEFAULT: '#1F1A14',
          muted: '#6B5F50',
        },
      },
      fontFamily: {
        // 中文衬线优先（PRD 5.2 字体策略：思源宋体/有人文感的字体）
        serif: ['"Noto Serif SC"', '"Songti SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', '"PingFang SC"', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
