import type { Metadata } from 'next';
import { LangProvider } from '@/lib/i18n/LangContext';

// 中文子树元数据（覆盖 root layout 的英文 metadata）
export const metadata: Metadata = {
  title: 'LLM Visualizer · 用交互理解 LLM 工作原理',
  description: '面向 LLM 入门用户的可视化交互科普网站，从 PM 视角讲清楚每个机制点。',
};

export default function ZhLayout({ children }: { children: React.ReactNode }) {
  // root layout 已经渲染了 <html><body>，这里只包 LangProvider
  return <LangProvider lang="zh">{children}</LangProvider>;
}
