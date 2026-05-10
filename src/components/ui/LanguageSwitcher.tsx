'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLang, localizedHref, stripLocalePrefix } from '@/lib/i18n/LangContext';

// Toggle between EN and 中文 while keeping the user on the same page.
//   /sampling/      → /zh/sampling/
//   /zh/sampling/   → /sampling/
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const lang = useLang();
  const pathname = usePathname() ?? '/';

  const basePath = stripLocalePrefix(pathname);
  const otherLang = lang === 'en' ? 'zh' : 'en';
  const targetHref = localizedHref(otherLang, basePath);

  const label = lang === 'en' ? '中文' : 'EN';
  const aria = lang === 'en' ? '切换到中文' : 'Switch to English';

  return (
    <Link
      href={targetHref}
      aria-label={aria}
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full',
        'border border-ink/15 bg-cream-50 text-text-muted hover:text-ink-dark hover:border-ink/40',
        'text-xs font-mono tracking-wider transition-colors',
        className,
      ].join(' ')}
    >
      <span aria-hidden>🌐</span>
      <span>{label}</span>
    </Link>
  );
}
