'use client';

import Link from 'next/link';

import AutoregressiveLoop from '@/components/loop/AutoregressiveLoop';
import DeepDiveLoop from '@/components/loop/DeepDiveLoop';
import MaxTokensSlider from '@/components/loop/MaxTokensSlider';
import PMPerspectiveCards from '@/components/loop/PMPerspectiveCards';
import StreamingComparison from '@/components/loop/StreamingComparison';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { ChapterNumber, SquiggleUnderline, WavyDivider } from '@/components/ui/SketchDecor';
import { useLang, useT, localizedHref } from '@/lib/i18n/LangContext';

export default function LoopPage() {
  const t = useT();
  const lang = useLang();
  return (
    <main className="container-wide py-8 sm:py-12 pb-20">
      {/* 顶部导航 */}
      <nav className="mb-8 flex items-center justify-between text-sm gap-3">
        <Link href={localizedHref(lang, '/')} className="text-text-muted hover:text-ink-dark transition-colors">
          {t('loop.nav.backToHome')}
        </Link>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <span className="text-text-muted font-mono">{t('loop.nav.pageIndex')}</span>
        </div>
      </nav>

      {/* === Hero === */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-ember-dark">{t('loop.eyebrow')}</span>
          <span className="flex-1 h-px bg-ember/30" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink-dark leading-[1.15] mb-4">
          {t('loop.hero.title1')}{' '}
          <span className="relative inline-block text-ember-dark mx-1">
            {t('loop.hero.titleHighlight')}
            <SquiggleUnderline className="text-ember" />
          </span>
          {' '}{t('loop.hero.title2')}
        </h1>
        <p className="text-base text-text-muted max-w-prose leading-relaxed">{t('loop.hero.lede')}</p>
      </header>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 1：自回归循环 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="01" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">自回归循环<SquiggleUnderline className="text-ember/70" /></span>：每生成一个 token 接回去再来一遍
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            选个例子，点"下一个 token"逐步看模型的生成过程——每点一次就走完一整轮前向计算（前面 6 个模块 + 解码成文字）。
            数据复用 Sampling 模块的 greedy 路径。
          </p>
          <div className="stage">
            <span className="stage-label">点击逐 token 推进 →</span>
            <AutoregressiveLoop />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 2：Streaming 对比 === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="02" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">Streaming<SquiggleUnderline className="text-ember/70" /></span>：一字一字蹦出 vs 等齐了再出
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            既然 token 是一个一个生成的，那就可以<strong className="text-text">一边生成一边返回给用户</strong>（streaming），
            或者等所有 token 都生成完一次性返回。两种模式总耗时相同，但用户感知天差地别。
          </p>
          <div className="stage">
            <span className="stage-label">点开始看对比 →</span>
            <StreamingComparison />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 3：max_tokens === */}
      <section className="mb-12 grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
        <ChapterNumber n="03" />
        <div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-dark mb-2">
            <span className="relative inline-block text-ember-dark">max_tokens<SquiggleUnderline className="text-ember/70" /></span>：模型也会被强行打断
          </h2>
          <p className="text-sm text-text-muted mb-5 max-w-prose">
            循环不会无限走下去——要么模型自己生成 EOS 结束 token，要么达到 API 设的 max_tokens 上限被强制停。
            后者是产品里"半句话 bug"的元凶。
          </p>
          <div className="stage">
            <span className="stage-label">拖滑块感受截断 →</span>
            <MaxTokensSlider />
          </div>
        </div>
      </section>

      <WavyDivider className="text-ink/20 mb-10" />

      {/* === 章节 4：PM 视角 === */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <ChapterNumber n="04" />
          <div>
            <p className="text-sm uppercase tracking-widest text-ember-dark">PM 视角</p>
            <h2 className="font-serif text-xl sm:text-2xl text-ink-dark">从生成循环到产品决策</h2>
          </div>
        </div>
        <PMPerspectiveCards />
      </section>

      <WavyDivider className="text-ink/20 my-10" />

      <DeepDiveLoop />

      {/* 章节出口 */}
      <section className="mt-12 pt-8 border-t-2 border-dashed border-ink/15">
        <p className="text-text-muted leading-relaxed mb-5 max-w-prose">{t('loop.outro.body')}</p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href={localizedHref(lang, '/')} className="btn-secondary">
            {t('loop.outro.backHome')}
          </Link>
          <span className="step-pill bg-cream-100 text-text-muted/60 border-ink/10">
            {t('loop.outro.next')}
          </span>
        </div>
      </section>
    </main>
  );
}
