'use client';

import { useState, useEffect } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { t } from '@/lib/debate/i18n';
import { TopicCard } from './TopicCard';
import { CustomTopicInput } from './CustomTopicInput';
import { Button } from '@/components/shared/Button';

export function TopicSelector() {
  const { state, dispatch } = useDebate();
  const lang = state.language;
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTopics = async (refresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/topics?refresh=${refresh}`);
      const data = await res.json();
      if (data.topics?.length) setTopics(data.topics);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTopics(); }, []);

  const handleSelect = (topic: string) => {
    dispatch({ type: 'SET_TOPIC', topic });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">{t(lang, 'chooseTopic')}</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t(lang, 'chooseTopicTitle')}</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t(lang, 'chooseTopicDesc')}</p>
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
          {topics.map((topic, i) => (
            <TopicCard key={i} topic={topic} onClick={handleSelect} />
          ))}
        </div>
      )}

      <Button variant="secondary" size="sm" className="mt-6" onClick={() => loadTopics(true)} disabled={loading}>
        {t(lang, 'refresh')}
      </Button>
    </div>
  );
}
