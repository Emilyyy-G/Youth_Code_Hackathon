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
    <div className="flex flex-1 flex-col items-center justify-center text-center px-4 relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitch />
      </div>

      <div className="mb-8">
        <div className="text-6xl mb-4">⚖️</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t(lang, 'appTitle')}
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 max-w-md">
          {t(lang, 'appSubtitle')}
        </p>
      </div>

      <Link href="/debate">
        <Button size="lg" className="text-lg px-10 py-4 rounded-xl shadow-lg shadow-blue-500/25">
          {t(lang, 'startDebate')}
        </Button>
      </Link>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg">
        <div className="text-center">
          <div className="text-2xl mb-1">🤖</div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t(lang, 'featureAiVsAi')}</div>
          <div className="text-xs text-zinc-400">{t(lang, 'featureAiVsAiDesc')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🆚</div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t(lang, 'featureHumanVsAi')}</div>
          <div className="text-xs text-zinc-400">{t(lang, 'featureHumanVsAiDesc')}</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t(lang, 'featureScoring')}</div>
          <div className="text-xs text-zinc-400">{t(lang, 'featureScoringDesc')}</div>
        </div>
      </div>
    </div>
  );
}
