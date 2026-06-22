'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS, MAX_ROUNDS } from '@/lib/debate/constants';
import { getNextSpeaker, isRoundComplete, buildMessageHistory } from '@/lib/debate/engine';
import { buildDebateSystemPrompt } from '@/lib/debate/prompt-builder';
import { DebaterColumn } from './DebaterColumn';
import { ScoringPanel } from '@/components/overlays/ScoringPanel';
import { PauseOverlay } from '@/components/overlays/PauseOverlay';
import { TakeoverModal } from '@/components/overlays/TakeoverModal';
import { HumanInput } from '@/components/overlays/HumanInput';
import type { PersonaId } from '@/types/debate';

export function DebateLayout() {
  const { state, dispatch } = useDebate();
  const abortRef = useRef<AbortController | null>(null);
  const [showTakeoverModal, setShowTakeoverModal] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<PersonaId | null>(null);

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
        state.topic,
        persona,
        state.currentRound,
        state.moderatorNote,
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
        const chunk = decoder.decode(value, { stream: true });
        fullContent += chunk;
        dispatch({ type: 'SET_STREAMING_CONTENT', content: fullContent });
      }

      // Save complete message
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

    // Check if round is complete (both have spoken)
    if (isRoundComplete(state.messages, state.currentRound)) {
      // Don't auto-advance to scoring on last round
      if (state.currentRound >= MAX_ROUNDS) return;
      dispatch({ type: 'SET_PHASE', phase: 'scoring' });
      return;
    }

    const nextSpeaker = getNextSpeaker(
      state.messages,
      state.currentRound,
      isHumanVsAi,
      state.humanPersona,
    );

    if (nextSpeaker === null) {
      // Round complete
      if (state.currentRound >= MAX_ROUNDS) return;
      dispatch({ type: 'SET_PHASE', phase: 'scoring' });
      return;
    }

    if (nextSpeaker === 'human') {
      // Wait for human input — HumanInput component handles this
      return;
    }

    // AI's turn
    generateDebateResponse(nextSpeaker);
  }, [state.phase, state.messages, state.currentRound, state.isStreaming, state.error, state.humanPersona, state.moderatorNote, dispatch, generateDebateResponse]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleTakeOver = (personaId: PersonaId) => {
    setSelectedPersona(personaId);
    setShowTakeoverModal(true);
  };

  const confirmTakeOver = () => {
    if (selectedPersona) {
      dispatch({ type: 'SET_HUMAN_PERSONA', personaId: selectedPersona });
      dispatch({ type: 'SET_PHASE', phase: 'human-vs-ai' });
    }
    setShowTakeoverModal(false);
    setSelectedPersona(null);
  };

  const ai1Messages = state.messages.filter(m => m.personaId === 'ai1' || (m.personaId === 'human' && state.humanPersona === 'ai1'));
  const ai2Messages = state.messages.filter(m => m.personaId === 'ai2' || (m.personaId === 'human' && state.humanPersona === 'ai2'));
  const ai1IsCurrentSpeaker = state.currentSpeaker === 'ai1' || (state.currentSpeaker === 'human' && state.humanPersona === 'ai1');
  const ai2IsCurrentSpeaker = state.currentSpeaker === 'ai2' || (state.currentSpeaker === 'human' && state.humanPersona === 'ai2');

  return (
    <div className="flex-1 flex relative overflow-hidden">
      {/* AI1 (Pro/正方) - Left column */}
      <div className="flex-1 flex border-r border-zinc-200 dark:border-zinc-700">
        <DebaterColumn
          persona={PERSONAS.ai1}
          messages={ai1Messages}
          side="left"
          isStreaming={state.isStreaming}
          streamingContent={state.currentSpeaker === 'ai1' ? state.streamingContent : ''}
          isCurrentSpeaker={ai1IsCurrentSpeaker}
          isHumanControlled={state.humanPersona === 'ai1'}
          onTakeOver={() => handleTakeOver('ai1')}
        />
      </div>

      {/* AI2 (Con/反方) - Right column */}
      <div className="flex-1 flex">
        <DebaterColumn
          persona={PERSONAS.ai2}
          messages={ai2Messages}
          side="right"
          isStreaming={state.isStreaming}
          streamingContent={state.currentSpeaker === 'ai2' ? state.streamingContent : ''}
          isCurrentSpeaker={ai2IsCurrentSpeaker}
          isHumanControlled={state.humanPersona === 'ai2'}
          onTakeOver={() => handleTakeOver('ai2')}
        />
      </div>

      {/* Score bar at bottom */}
      {state.scores.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
          <div className="mb-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs text-zinc-500">
            总分: {state.scores.reduce((s, sc) => s + sc.score, 0)} / {state.scores.length * 10}
          </div>
        </div>
      )}

      {/* Overlays */}
      <ScoringPanel />
      <PauseOverlay />
      <TakeoverModal
        open={showTakeoverModal}
        onClose={() => setShowTakeoverModal(false)}
        onConfirm={confirmTakeOver}
      />
      <HumanInput />
    </div>
  );
}
