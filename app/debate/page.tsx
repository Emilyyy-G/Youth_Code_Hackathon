'use client';

import { useDebate } from '@/lib/store/debate-context';
import { TopicSelector } from '@/components/topic/TopicSelector';
import { DebateHeader } from '@/components/debate/DebateHeader';
import { DebateLayout } from '@/components/debate/DebateLayout';

export default function DebatePage() {
  const { state } = useDebate();

  if (state.phase === 'topic-select') {
    return <TopicSelector />;
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <DebateHeader />
      <DebateLayout />
    </div>
  );
}
