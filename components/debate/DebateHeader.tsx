'use client';

import Link from 'next/link';
import { useDebate } from '@/lib/store/debate-context';
import { MAX_ROUNDS } from '@/lib/debate/constants';
import { t, translateTopic } from '@/lib/debate/i18n';
import { LanguageSwitch } from '@/components/shared/LanguageSwitch';

export function DebateHeader() {
  const { state } = useDebate();
  const lang = state.language;
  const isFinal = state.currentRound >= MAX_ROUNDS;

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {t(lang, 'back')}
        </Link>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-md">
              {translateTopic(lang, state.topic)}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">
                {t(lang, 'round', { round: state.currentRound, total: MAX_ROUNDS })}
              </span>
              {isFinal && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                  {lang === 'en' ? 'CLOSING' : '结辩'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <LanguageSwitch />
    </header>
  );
}
