'use client';

import Link from 'next/link';
import { useDebate } from '@/lib/store/debate-context';
import { t, translateTopic } from '@/lib/debate/i18n';
import { LanguageSwitch } from '@/components/shared/LanguageSwitch';

export function DebateHeader() {
  const { state } = useDebate();
  const lang = state.language;

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {t(lang, 'back')}
        </Link>
        <div>
          <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-md">
            {translateTopic(lang, state.topic)}
          </h1>
          <span className="text-xs text-zinc-400">
            {t(lang, 'round', { round: state.currentRound, total: 5 })}
          </span>
        </div>
      </div>

      <LanguageSwitch />
    </header>
  );
}
