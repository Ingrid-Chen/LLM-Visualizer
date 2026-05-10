'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { dictionaries, type Locale, type Dictionary } from './dictionaries';

const LangContext = createContext<Locale>('en');

export function LangProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

export function useLang(): Locale {
  return useContext(LangContext);
}

// Dot-path lookup helper.
function getByPath(obj: Dictionary, path: string): string | undefined {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === 'string' ? cur : undefined;
}

// {name} → vars[name]; missing keys silently render as empty string.
function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

export function useT() {
  const lang = useLang();
  return (key: string, vars?: Record<string, string | number>): string => {
    const dict = dictionaries[lang];
    const raw = getByPath(dict, key) ?? getByPath(dictionaries.en, key) ?? key;
    return interpolate(raw, vars);
  };
}

// Build a path-prefixed href so internal links keep the active locale.
//   localizedHref('en', '/sampling/')  → '/sampling/'
//   localizedHref('zh', '/sampling/')  → '/zh/sampling/'
//   localizedHref('zh', '/')           → '/zh/'
export function localizedHref(lang: Locale, path: string): string {
  if (lang === 'en') return path;
  if (path === '/') return '/zh/';
  return `/zh${path.startsWith('/') ? path : `/${path}`}`;
}

// Strip locale prefix from a pathname; the result is the canonical (en) path.
//   stripLocalePrefix('/zh/sampling/')  → '/sampling/'
//   stripLocalePrefix('/sampling/')     → '/sampling/'
//   stripLocalePrefix('/zh')            → '/'
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/zh' || pathname === '/zh/') return '/';
  if (pathname.startsWith('/zh/')) return pathname.slice(3);
  return pathname;
}
