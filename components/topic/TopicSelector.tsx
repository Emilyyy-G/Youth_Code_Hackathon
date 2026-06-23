'use client';

import { useState } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { TOPIC_CATEGORIES } from '@/lib/debate/constants';
import { t, translateTopic } from '@/lib/debate/i18n';
import { CategorySelector } from './CategorySelector';
import { CustomTopicInput } from './CustomTopicInput';
import { Button } from '@/components/shared/Button';
import type { TopicCategory } from '@/types/debate';

export function TopicSelector() {
  const { state, dispatch } = useDebate();
  const lang = state.language;
  const [category, setCategory] = useState<TopicCategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiTopics, setAiTopics] = useState<string[] | null>(null);

  // Phase 1: pick a category
  if (!category) {
    return <CategorySelector onSelect={setCategory} />;
  }

  const handleSelect = (topic: string) => {
    dispatch({ type: 'SET_TOPIC', topic });
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/topics?refresh=true&category=${category.id}&language=${lang}`);
      const data = await res.json();
      if (data.topics?.length) setAiTopics(data.topics);
    } catch {}
    setLoading(false);
  };

  const displayTopics = aiTopics ?? category.topics.map(t => t.zh);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      {/* Back to categories */}
      <div className="w-full mb-4">
        <button
          onClick={() => { setCategory(null); setAiTopics(null); }}
          className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ← {t(lang, 'categoryTitle')}
        </button>
      </div>

      <div className="text-center mb-6">
        <div className="text-4xl mb-3">{category.icon}</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {t(lang, `cat_${category.id}`)}
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {t(lang, 'chooseTopicDesc')}
        </p>
      </div>

      <div className="w-full mb-6">
        <CustomTopicInput onSubmit={handleSelect} />
      </div>

      <div className="flex items-center gap-3 w-full mb-6">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        <span className="text-xs text-zinc-400 font-medium">{t(lang, 'recommended')}</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="animate-spin text-lg">⟳</span>
          <span className="text-sm">{t(lang, 'loading')}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {displayTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSelect(topic)}
              className="w-full text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
            >
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {translateTopic(lang, topic)}
              </p>
              <div className="mt-2 text-xs text-zinc-400 group-hover:text-blue-400">
                {t(lang, 'selectTopic')} →
              </div>
            </button>
          ))}
        </div>
      )}

      <Button variant="secondary" size="sm" className="mt-6" onClick={handleRefresh} disabled={loading}>
        {t(lang, 'refresh')}
      </Button>
    </div>
  );
}
