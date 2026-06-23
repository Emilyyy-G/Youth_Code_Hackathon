'use client';

import { useDebate } from '@/lib/store/debate-context';
import { TopicSelector } from '@/components/topic/TopicSelector';
import { DebateHeader } from '@/components/debate/DebateHeader';
import { DebateLayout } from '@/components/debate/DebateLayout';
import { JudgingPhase } from '@/components/debate/JudgingPhase';
import { LanguageSwitch } from '@/components/shared/LanguageSwitch';

export default function DebatePage() {
  const { state } = useDebate();

  return (
    <div className="flex-1 flex flex-col h-screen relative">
      <div className="absolute top-3 right-4 z-50">
        <LanguageSwitch />
      </div>

      {state.phase === 'topic-select' ? (
        <TopicSelector />
      ) : state.phase === 'judging' ? (
        <>
          <DebateHeader />
          <JudgingPhase />
        </>
      ) : (
        <>
          <DebateHeader />
          <DebateLayout />
        </>
      )}
    </div>
  );
}
