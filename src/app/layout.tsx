import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LLM Visualizer · Understand how an LLM works',
  description:
    'An interactive visual walkthrough of how a Large Language Model turns text into the next token — 7 mechanisms explained from a product perspective.',
};

// Root layout serves the English (default) tree. The /zh subtree has its own
// layout that overrides <html lang> to "zh-CN" and wraps with LangProvider.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-50 text-text">{children}</body>
    </html>
  );
}
