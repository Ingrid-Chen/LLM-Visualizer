import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LLM Visualizer · 用交互理解 LLM 工作原理',
  description: '面向 LLM 入门用户的可视化交互科普网站，从 PM 视角讲清楚每个机制点。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-cream-50 text-text">{children}</body>
    </html>
  );
}
