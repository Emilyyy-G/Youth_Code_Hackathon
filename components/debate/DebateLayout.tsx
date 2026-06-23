'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS, MAX_ROUNDS } from '@/lib/debate/constants';
import { getNextSpeaker, isRoundComplete, buildMessageHistory } from '@/lib/debate/engine';
import { buildDebateSystemPrompt } from '@/lib/debate/prompt-builder';
import { t } from '@/lib/debate/i18n';
import { DebaterColumn } from './DebaterColumn';
import { Dashboard } from './Dashboard';
import type { PersonaId } from '@/types/debate';

export function DebateLayout() {
  const { state, dispatch } = useDebate();
  const abortRef = useRef<AbortController | null>(null);
  const [takeoverTarget, setTakeoverTarget] = useState<PersonaId | null>(null);
  const [pauseTick, setPauseTick] = useState(0);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMsgCountRef = useRef(state.messages.length);

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
        state.topic, persona, state.currentRound, state.moderatorNote, state.language,
      );

      // AI SDK requires at least one message; seed with a starter if empty
      const lang = state.language;
      const debaterLabel = persona.id === 'ai1' ? t(lang, 'debater1') : t(lang, 'debater2');
      const seedMsg = lang === 'en'
        ? `Please begin your debate as ${debaterLabel}.`
        : `请作为${debaterLabel}开始你的辩论发言。`;
      const messages = history.length > 0
        ? history
        : [{ role: 'user' as const, content: seedMsg }];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, system: systemPrompt }),
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

      if (!fullContent.trim()) throw new Error('Empty response');

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
      console.error('generateDebateResponse error:', err);
      dispatch({ type: 'SET_ERROR', error: String(err) });
    } finally {
      dispatch({ type: 'SET_STREAMING', isStreaming: false });
      dispatch({ type: 'SET_SPEAKER', personaId: null });
    }
  }, [state.topic, state.currentRound, state.messages, state.moderatorNote, dispatch]);

  // Auto-advance debate with 5-second pauses between speakers and before scoring
  useEffect(() => {
    if (state.phase !== 'debating' && state.phase !== 'human-vs-ai') return;
    if (state.isStreaming) return;
    if (state.error) return;

    const isHumanVsAi = state.phase === 'human-vs-ai';

    // If we're not in a pause and a speaker just finished (messages count changed),
    // start a 5-second pause timer before proceeding.
    const msgCount = state.messages.length;
    if (msgCount > lastMsgCountRef.current && !isHumanVsAi && !pauseTimerRef.current) {
      lastMsgCountRef.current = msgCount;
      pauseTimerRef.current = setTimeout(() => {
        pauseTimerRef.current = null;
        setPauseTick(t => t + 1);
      }, 5000);
      return;
    }
    lastMsgCountRef.current = msgCount;

    // If a pause timer is active, wait
    if (pauseTimerRef.current) return;

    const nextSpeaker = getNextSpeaker(
      state.messages, state.currentRound, isHumanVsAi, state.humanPersona,
    );

    if (nextSpeaker === null) {
      dispatch({ type: 'SET_PHASE', phase: 'scoring' });
      return;
    }

    if (nextSpeaker === 'human') return;

    generateDebateResponse(nextSpeaker);
  }, [state.phase, state.messages, state.currentRound, state.isStreaming, state.error,
      state.humanPersona, state.moderatorNote, dispatch, generateDebateResponse, pauseTick]);

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
    <div className="flex-1 flex min-h-0 relative">
      {/* Error banner */}
      {state.error && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 px-4 py-2 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl shadow-lg flex items-center gap-3">
          <span className="text-xs text-red-600 dark:text-red-400">{'⚠️'} {state.error}</span>
          <button
            onClick={() => dispatch({ type: 'SET_ERROR', error: null })}
            className="text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 underline whitespace-nowrap"
          >
            重试
          </button>
        </div>
      )}
      {/* Left debate area */}
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-zinc-200 dark:border-zinc-700">
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

        <div className="flex-1 flex flex-col min-h-0">
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

      {/* Right Dashboard sidebar */}
      <Dashboard
        takeoverTarget={takeoverTarget}
        onConfirmTakeOver={confirmTakeOver}
        onCancelTakeOver={() => setTakeoverTarget(null)}
      />
    </div>
  );
}
