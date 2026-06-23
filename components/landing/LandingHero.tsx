'use client';

import Link from 'next/link';
import { useDebate } from '@/lib/store/debate-context';
import { t } from '@/lib/debate/i18n';
import { LanguageSwitch } from '@/components/shared/LanguageSwitch';
import { Button } from '@/components/shared/Button';

export function LandingHero() {
  const { state } = useDebate();
  const lang = state.language;

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center px-4 py-12 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>

      {/* Welcome header */}
      <div className="mb-6">
        <div className="text-6xl mb-3">⚖️</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t(lang, 'appTitle')}
        </h1>
        <p className="mt-3 text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-lg leading-relaxed">
          {t(lang, 'appSubtitle')}
        </p>
      </div>

      {/* App description card */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 max-w-lg w-full mb-8 text-left">
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
          {t(lang, 'appDesc')}
        </p>
      </div>

      <Link href="/debate">
        <Button size="lg" className="text-lg px-10 py-4 rounded-xl shadow-lg shadow-blue-500/25">
          {t(lang, 'startDebate')}
        </Button>
      </Link>

      {/* Feature steps */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg">
        <div className="text-center">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t(lang, 'chooseTopicTitle')}</div>
          <div className="text-xs text-zinc-400 mt-0.5">{t(lang, 'chooseTopicDesc')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🤖</div>
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t(lang, 'featureAiVsAi')}</div>
          <div className="text-xs text-zinc-400 mt-0.5">{t(lang, 'featureAiVsAiDesc')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">{t(lang, 'featureScoring')}</div>
          <div className="text-xs text-zinc-400 mt-0.5">{t(lang, 'featureScoringDesc')}</div>
        </div>
      </div>
    </div>
  );
}
