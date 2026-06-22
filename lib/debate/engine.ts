import type { DebateMessage, PersonaId } from '@/types/debate';
import { TURN_ORDER } from './constants';

/**
 * 决定当前回合该谁发言
 */
export function getNextSpeaker(
  messages: DebateMessage[],
  currentRound: number,
  isHumanVsAi: boolean,
  humanPersona: PersonaId | null,
): PersonaId | null {
  const msgsThisRound = messages.filter(m => m.round === currentRound);

  // 映射人类发言至对应角色
  const spokenThisRound = msgsThisRound.map(m => {
    return m.personaId === 'human' ? humanPersona : m.personaId;
  });

  // 按顺序查找第一个还没发言的人
  for (const persona of TURN_ORDER) {
    if (!spokenThisRound.includes(persona)) {
      return (isHumanVsAi && humanPersona === persona) ? 'human' : persona;
    }
  }

  return null;
}

/**
 * 判断回合是否完成
 */
export function isRoundComplete(
  messages: DebateMessage[],
  currentRound: number,
  humanPersona: PersonaId | null
): boolean {
  const msgsThisRound = messages.filter(m => m.round === currentRound);

  const spokenThisRound = msgsThisRound.map(m => {
    return m.personaId === 'human' ? humanPersona : m.personaId;
  });

  // 必须所有 TURN_ORDER 里的角色都出现在已发言名单中
  return TURN_ORDER.every(persona => spokenThisRound.includes(persona));
}

export function buildMessageHistory(messages: DebateMessage[]) {
  return messages.map(m => ({
    role: m.personaId === 'human' ? 'user' as const : 'assistant' as const,
    content: m.content,
  }));
}