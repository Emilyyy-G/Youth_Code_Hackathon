'use client';

import { useDebate } from '@/lib/store/debate-context';
import { TOPIC_CATEGORIES } from '@/lib/debate/constants';
import { t } from '@/lib/debate/i18n';
import type { TopicCategory } from '@/types/debate';

interface CategorySelectorProps {
  onSelect: (category: TopicCategory) => void;
}

export function CategorySelector({ onSelect }: CategorySelectorProps) {
  const { state } = useDebate();
  const lang = state.language;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">📂</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {t(lang, 'categoryTitle')}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t(lang, 'categoryDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
        {TOPIC_CATEGORIES.map((cat) => {
          const labelKey = `cat_${cat.id}`;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className="flex items-center gap-4 p-5 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div className="text-left">
                <div className="text-base font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {t(lang, labelKey)}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {cat.topics.length} {lang === 'zh' ? '个辩题' : 'topics'}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
