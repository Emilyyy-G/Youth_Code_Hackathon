'use client';

import { useState } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { Button } from '@/components/shared/Button';

export function PauseOverlay() {
  const { state, dispatch } = useDebate();
  const [note, setNote] = useState('');

  if (state.phase !== 'paused') return null;

  const handleResume = () => {
    if (note.trim()) {
      dispatch({ type: 'SET_MODERATOR_NOTE', note: note.trim() });
    }
    setNote('');
    dispatch({ type: 'SET_PHASE', phase: 'debating' });
  };

  const handleCancel = () => {
    setNote('');
    dispatch({ type: 'SET_PHASE', phase: 'debating' });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-6 w-full max-w-md mx-4">
        <div className="text-center mb-4">
          <div className="text-3xl mb-2">⏸</div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            辩论已暂停
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            输入你的想法来改变辩论走向
          </p>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="例如：请辩手一更多引用数据..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div className="flex gap-2 mt-4">
          <Button
            variant="secondary"
            size="md"
            className="flex-1"
            onClick={handleCancel}
          >
            直接继续
          </Button>
          <Button
            variant="primary"
            size="md"
            className="flex-1"
            onClick={handleResume}
          >
            提交 &amp; 继续
          </Button>
        </div>
      </div>
    </div>
  );
}
