'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS, MAX_ROUNDS } from '@/lib/debate/constants';
import { getNextSpeaker, isRoundComplete, buildMessageHistory } from '@/lib/debate/engine';
import { buildDebateSystemPrompt } from '@/lib/debate/prompt-builder';
import { DebaterColumn } from './DebaterColumn';
import { Dashboard } from './Dashboard';
import type { PersonaId } from '@/types/debate';

export function DebateLayout() {
  const { state, dispatch } = useDebate();
  const abortRef = useRef<AbortController | null>(null);
  const [takeoverTarget, setTakeoverTarget] = useState<PersonaId | null>(null);

  const generateDebateResponse = useCallback(async (personaId: PersonaId) => {
    if (personaId === 'human') return;
    const persona = PERSONAS[personaId];
    if (!persona) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'SET_STREAMING', isStreaming: true });
    dispatch({ type: 'SET_SPEAKER', personaId });

    try {
      const history = buildMessageHistory(state.messages);
      const systemPrompt = buildDebateSystemPrompt(
        state.topic, persona, state.currentRound, state.moderatorNote,
      );

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, system: systemPrompt }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullContent += decoder.decode(value, { stream: true });
        dispatch({ type: 'SET_STREAMING_CONTENT', content: fullContent });
      }

      dispatch({
        type: 'ADD_MESSAGE',
        message: {
          id: crypto.randomUUID(),
          personaId,
          content: fullContent,
          round: state.currentRound,
          timestamp: Date.now(),
          vote: 0,
        },
      });
      dispatch({ type: 'CLEAR_STREAMING' });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      dispatch({ type: 'SET_ERROR', error: String(err) });
    } finally {
      dispatch({ type: 'SET_STREAMING', isStreaming: false });
      dispatch({ type: 'SET_SPEAKER', personaId: null });
    }
  }, [state.topic, state.currentRound, state.messages, state.moderatorNote, dispatch]);

  // Auto-advance debate
  useEffect(() => {
    if (state.isStreaming || state.error) return;
    if (state.phase !== 'debating' && state.phase !== 'human-vs-ai') return;

    const isHumanVsAi = state.phase === 'human-vs-ai';

    if (isRoundComplete(state.messages, state.currentRound)) {
      dispatch({ type: 'SET_PHASE', phase: 'scoring' });
      return;
    }

    const nextSpeaker = getNextSpeaker(
      state.messages, state.currentRound, isHumanVsAi, state.humanPersona,
    );

    if (nextSpeaker === null) {
      dispatch({ type: 'SET_PHASE', phase: 'scoring' });
      return;
    }

    if (nextSpeaker === 'human') return; // wait for Dashboard input

    generateDebateResponse(nextSpeaker);
  }, [state.phase, state.messages, state.currentRound, state.isStreaming, state.error,
      state.humanPersona, state.moderatorNote, dispatch, generateDebateResponse]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const confirmTakeOver = () => {
    if (takeoverTarget) {
      dispatch({ type: 'SET_HUMAN_PERSONA', personaId: takeoverTarget });
      dispatch({ type: 'SET_PHASE', phase: 'human-vs-ai' });
    }
    setTakeoverTarget(null);
  };

  const ai1Messages = state.messages.filter(
    m => m.personaId === 'ai1' || (m.personaId === 'human' && state.humanPersona === 'ai1'),
  );
  const ai2Messages = state.messages.filter(
    m => m.personaId === 'ai2' || (m.personaId === 'human' && state.humanPersona === 'ai2'),
  );
  const ai1IsSpeaker = state.currentSpeaker === 'ai1' || (state.currentSpeaker === 'human' && state.humanPersona === 'ai1');
  const ai2IsSpeaker = state.currentSpeaker === 'ai2' || (state.currentSpeaker === 'human' && state.humanPersona === 'ai2');

  return (
    <div className="flex-1 grid grid-cols-[1fr_350px] overflow-hidden">
      {/* ===== 左侧：辩论聊天区 ===== */}
      <div className="grid grid-cols-2 overflow-hidden">
        {/* AI1 列 */}
        <div className="overflow-y-auto border-r border-zinc-200 dark:border-zinc-700">
          <DebaterColumn
            persona={PERSONAS.ai1}
            messages={ai1Messages}
            side="left"
            isStreaming={state.isStreaming}
            streamingContent={state.currentSpeaker === 'ai1' ? state.streamingContent : ''}
            isCurrentSpeaker={ai1IsSpeaker}
            isHumanControlled={state.humanPersona === 'ai1'}
            onTakeOver={() => setTakeoverTarget('ai1')}
          />
        </div>

        {/* AI2 列 */}
        <div className="overflow-y-auto">
          <DebaterColumn
            persona={PERSONAS.ai2}
            messages={ai2Messages}
            side="right"
            isStreaming={state.isStreaming}
            streamingContent={state.currentSpeaker === 'ai2' ? state.streamingContent : ''}
            isCurrentSpeaker={ai2IsSpeaker}
            isHumanControlled={state.humanPersona === 'ai2'}
            onTakeOver={() => setTakeoverTarget('ai2')}
          />
        </div>
      </div>

      {/* ===== 右侧：控制台侧边栏（固定，不滚动） ===== */}
      <Dashboard
        takeoverTarget={takeoverTarget}
        onConfirmTakeOver={confirmTakeOver}
        onCancelTakeOver={() => setTakeoverTarget(null)}
      />
    </div>
  );
}
