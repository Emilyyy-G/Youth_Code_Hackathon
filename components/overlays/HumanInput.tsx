'use client';

import { useState } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS } from '@/lib/debate/constants';
import { Button } from '@/components/shared/Button';

export function HumanInput() {
  const { state, dispatch } = useDebate();
  const [input, setInput] = useState('');
  const isHumanTurn =
    state.phase === 'human-vs-ai' &&
    !state.isStreaming &&
    state.humanPersona &&
    state.messages.filter(m => m.round === state.currentRound).length < 2;

  if (!isHumanTurn && state.phase !== 'human-vs-ai') return null;
  if (!isHumanTurn && state.phase === 'human-vs-ai') {
    // Show waiting indicator during AI's turn
    return (
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 pointer-events-none">
        <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-sm text-zinc-500">
          对方正在思考...
        </div>
      </div>
    );
  }

  const humanPersonaState = state.humanPersona ? PERSONAS[state.humanPersona] : null;

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || !state.humanPersona) return;

    dispatch({
      type: 'ADD_MESSAGE',
      message: {
        id: crypto.randomUUID(),
        personaId: 'human',
        content: trimmed,
        round: state.currentRound,
        timestamp: Date.now(),
        vote: 0,
      },
    });
    setInput('');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-t border-zinc-200 dark:border-zinc-700 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            🟢 你代表：{humanPersonaState?.stanceLabel || ''}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
            placeholder="输入你的辩论观点..."
            className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={500}
          />
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!input.trim()}
          >
            发言
          </Button>
        </div>
      </div>
    </div>
  );
}
