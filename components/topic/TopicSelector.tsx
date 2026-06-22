'use client';

import { useState, useEffect } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { TopicCard } from './TopicCard';
import { CustomTopicInput } from './CustomTopicInput';
import { Button } from '@/components/shared/Button';

export function TopicSelector() {
  const { dispatch } = useDebate();
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTopics = async (refresh = false) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/topics?refresh=${refresh}`);
      const data = await res.json();
      if (data.topics?.length) setTopics(data.topics);
    } catch {
      // Fallback - will be handled by the API returning defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  const handleSelect = (topic: string) => {
    dispatch({ type: 'SET_TOPIC', topic });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🎯</div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          选择辩题
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          选择一个辩题开始辩论，或自定义输入
        </p>
      </div>

      {/* Custom input */}
      <div className="w-full mb-6">
        <CustomTopicInput onSubmit={handleSelect} />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full mb-6">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        <span className="text-xs text-zinc-400 font-medium">推荐辩题</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
      </div>

      {/* Topic cards */}
      {loading ? (
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="animate-spin text-lg">⟳</span>
          <span className="text-sm">加载辩题中...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
          {topics.map((topic, i) => (
            <TopicCard key={i} topic={topic} onClick={handleSelect} />
          ))}
        </div>
      )}

      {/* Refresh button */}
      <Button
        variant="secondary"
        size="sm"
        className="mt-6"
        onClick={() => loadTopics(true)}
        disabled={loading}
      >
        🔄 换一批
      </Button>
    </div>
  );
}
