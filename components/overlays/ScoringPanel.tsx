'use client';

import { useState, useEffect } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { Button } from '@/components/shared/Button';

export function ScoringPanel() {
  const { state, dispatch } = useDebate();
  const [score, setScore] = useState(0);
  const isOpen = state.phase === 'scoring';

  useEffect(() => {
    if (isOpen) setScore(0);
  }, [isOpen]);

  const handleSubmit = () => {
    dispatch({
      type: 'ADD_SCORE',
      score: {
        round: state.currentRound,
        score,
        timestamp: Date.now(),
      },
    });
    dispatch({ type: 'NEXT_ROUND' });
  };

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-700 z-40 transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">📊</div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            第 {state.currentRound} 回合 评分
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {state.topic}
          </p>
        </div>

        {/* Score slider */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          {/* Current score display */}
          <div className={`text-5xl font-extrabold transition-colors ${
            score > 0
              ? 'text-blue-500'
              : score < 0
              ? 'text-rose-500'
              : 'text-zinc-400'
          }`}>
            {score > 0 ? `+${score}` : score}
          </div>

          {/* Slider */}
          <input
            type="range"
            min={-10}
            max={10}
            step={1}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full max-w-xs h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-500"
          />

          {/* Labels */}
          <div className="flex justify-between w-full max-w-xs text-xs text-zinc-400">
            <span>反方占优</span>
            <span>正方占优</span>
          </div>

          {/* Score marks */}
          <div className="flex justify-between w-full max-w-xs text-[10px] text-zinc-300 mt-1">
            <span>-10</span>
            <span>0</span>
            <span>+10</span>
          </div>
        </div>

        {/* Submit button */}
        <Button
          variant="primary"
          size="lg"
          className="w-full mt-6"
          onClick={handleSubmit}
        >
          提交评分 &amp; 继续
        </Button>
      </div>
    </div>
  );
}
