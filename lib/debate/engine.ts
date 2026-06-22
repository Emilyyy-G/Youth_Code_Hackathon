import type { DebateMessage, PersonaId } from '@/types/debate';
import { TURN_ORDER } from './constants';

export function getNextSpeaker(
  messages: DebateMessage[],
  currentRound: number,
  isHumanVsAi: boolean,
  humanPersona: PersonaId | null,
): PersonaId | null {
  const msgsThisRound = messages.filter(m => m.round === currentRound);

  if (msgsThisRound.length === 0) return TURN_ORDER[0];
  if (msgsThisRound.length === 1) {
    const nextSpeaker = TURN_ORDER[1];
    if (isHumanVsAi && humanPersona === nextSpeaker) {
      return 'human';
    }
    if (isHumanVsAi && humanPersona === TURN_ORDER[0]) {
      // Human is ai1 (already spoke), now ai2's turn
      return TURN_ORDER[1];
    }
    return nextSpeaker;
  }

  // Round complete — both have spoken
  return null;
}

export function isRoundComplete(
  messages: DebateMessage[],
  currentRound: number,
): boolean {
  return messages.filter(m => m.round === currentRound).length >= 2;
}

export function buildMessageHistory(messages: DebateMessage[]) {
  return messages.map(m => ({
    role: m.personaId === 'human' ? 'user' as const : 'assistant' as const,
    content: m.content,
  }));
}
