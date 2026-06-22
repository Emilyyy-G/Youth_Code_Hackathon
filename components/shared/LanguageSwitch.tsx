'use client';

import { useDebate } from '@/lib/store/debate-context';
import type { Language } from '@/types/debate';

export function LanguageSwitch() {
  const { state, dispatch } = useDebate();
  const lang = state.language;

  const handleChange = (newLang: Language) => {
    dispatch({ type: 'SET_LANGUAGE', language: newLang });
  };

  return (
    <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
      <button
        onClick={() => handleChange('zh')}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
          lang === 'zh'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
      >
        中
      </button>
      <button
        onClick={() => handleChange('en')}
        className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
          lang === 'en'
            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-sm'
            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
        }`}
      >
        EN
      </button>
    </div>
  );
}
