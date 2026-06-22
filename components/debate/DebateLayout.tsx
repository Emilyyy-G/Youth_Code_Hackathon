'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS } from '@/lib/debate/constants';
import { getNextSpeaker, isRoundComplete, buildMessageHistory } from '@/lib/debate/engine';
import { DebaterColumn } from './DebaterColumn';
import { Dashboard } from './Dashboard';
import type { PersonaId } from '@/types/debate';

export function DebateLayout() {
  const { state, dispatch } = useDebate();
  const [takeoverTarget, setTakeoverTarget] = useState<PersonaId | null>(null);

  // 防重复触发锁
  const isProcessingRef = useRef(false);

  const generateDebateResponse = useCallback(async (personaId: PersonaId) => {
    if (personaId === 'human' || isProcessingRef.current) return;
    const persona = PERSONAS[personaId];
    if (!persona) return;

    isProcessingRef.current = true; // 加锁
    dispatch({ type: 'SET_STREAMING', isStreaming: true });
    dispatch({ type: 'SET_SPEAKER', personaId });

    try {
      const history = buildMessageHistory(state.messages);
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          role: personaId === 'ai1' ? 'A' : 'B',
          language: state.language
        }),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      dispatch({
        type: 'ADD_MESSAGE',
        message: {
          id: crypto.randomUUID(),
          personaId,
          content: data.content || "...",
          round: state.currentRound,
          timestamp: Date.now(),
          vote: 0,
        },
      });
    } catch (err) {
      console.error(err);
      dispatch({ type: 'SET_ERROR', error: String(err) });
    } finally {
      dispatch({ type: 'SET_STREAMING', isStreaming: false });
      dispatch({ type: 'SET_SPEAKER', personaId: null });
      isProcessingRef.current = false; // 解锁
    }
  }, [state.messages, state.currentRound, state.language, dispatch]);

  useEffect(() => {
    if (state.isStreaming || state.error || isProcessingRef.current) return;
    if (state.phase !== 'debating' && state.phase !== 'human-vs-ai') return;

    if (isRoundComplete(state.messages, state.currentRound, state.humanPersona)) {
      dispatch({ type: 'SET_PHASE', phase: 'scoring' });
      return;
    }

    const nextSpeaker = getNextSpeaker(
      state.messages, state.currentRound, (state.phase === 'human-vs-ai'), state.humanPersona,
    );

    if (nextSpeaker && nextSpeaker !== 'human') {
      generateDebateResponse(nextSpeaker);
    }
  }, [state.phase, state.messages, state.currentRound, state.isStreaming, state.error, state.humanPersona, dispatch, generateDebateResponse]);

  // ... 其余 JSX 和辅助函数保持不变 ...
  const confirmTakeOver = () => {
    if (takeoverTarget) {
      dispatch({ type: 'SET_HUMAN_PERSONA', personaId: takeoverTarget });
      dispatch({ type: 'SET_PHASE', phase: 'human-vs-ai' });
    }
    setTakeoverTarget(null);
  };

  const ai1Messages = state.messages.filter(m => m.personaId === 'ai1' || (m.personaId === 'human' && state.humanPersona === 'ai1'));
  const ai2Messages = state.messages.filter(m => m.personaId === 'ai2' || (m.personaId === 'human' && state.humanPersona === 'ai2'));
  const ai1IsSpeaker = state.currentSpeaker === 'ai1' || (state.currentSpeaker === 'human' && state.humanPersona === 'ai1');
  const ai2IsSpeaker = state.currentSpeaker === 'ai2' || (state.currentSpeaker === 'human' && state.humanPersona === 'ai2');

  return (
    <div className="flex-1 grid grid-cols-[1fr_350px] overflow-hidden">
      <div className="grid grid-cols-2 overflow-hidden">
        <div className="overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
          <DebaterColumn persona={PERSONAS.ai1} messages={ai1Messages} side="left" isStreaming={state.isStreaming} isCurrentSpeaker={ai1IsSpeaker} isHumanControlled={state.humanPersona === 'ai1'} onTakeOver={() => setTakeoverTarget('ai1')} />
        </div>
        <div className="overflow-y-auto">
          <DebaterColumn persona={PERSONAS.ai2} messages={ai2Messages} side="right" isStreaming={state.isStreaming} isCurrentSpeaker={ai2IsSpeaker} isHumanControlled={state.humanPersona === 'ai2'} onTakeOver={() => setTakeoverTarget('ai2')} />
        </div>
      </div>
      <Dashboard takeoverTarget={takeoverTarget} onConfirmTakeOver={confirmTakeOver} onCancelTakeOver={() => setTakeoverTarget(null)} />
    </div>
  );
}