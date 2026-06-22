'use client';

import Link from 'next/link';
import { useDebate } from '@/lib/store/debate-context';
import { Button } from '@/components/shared/Button';

export function DebateHeader() {
  const { state, dispatch } = useDebate();

  const handlePause = () => {
    if (state.phase === 'debating') {
      dispatch({ type: 'SET_PHASE', phase: 'paused' });
    } else if (state.phase === 'paused') {
      dispatch({ type: 'SET_PHASE', phase: 'debating' });
    }
  };

  const canPause = state.phase === 'debating' || state.phase === 'paused';

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ← 返回
        </Link>
        <div>
          <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-md">
            {state.topic}
          </h1>
          <span className="text-xs text-zinc-400">
            第 {state.currentRound} / {5} 回合
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {canPause && (
          <Button
            variant={state.phase === 'paused' ? 'primary' : 'secondary'}
            size="sm"
            onClick={handlePause}
          >
            {state.phase === 'paused' ? '▶ 继续' : '⏸ 暂停'}
          </Button>
        )}
      </div>
    </header>
  );
}
