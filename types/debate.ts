export type PersonaId = 'ai1' | 'ai2' | 'human';

export type DebatePhase =
  | 'topic-select'
  | 'debating'
  | 'paused'
  | 'scoring'
  | 'human-vs-ai';

export type Stance = 'pro' | 'con';

export interface Persona {
  id: PersonaId;
  displayName: string;
  stance: Stance;
  stanceLabel: string;
  avatarUrl: string;
  personality: string;
  color: string;
}

export interface DebateMessage {
  id: string;
  personaId: PersonaId;
  content: string;
  round: number;
  timestamp: number;
  vote: 0 | 1 | -1;
}

export interface RoundScore {
  round: number;
  score: number;
  timestamp: number;
}

export interface DebateState {
  phase: DebatePhase;
  topic: string;
  currentRound: number;
  messages: DebateMessage[];
  scores: RoundScore[];
  moderatorNote: string | null;
  humanPersona: PersonaId | null;
  isStreaming: boolean;
  currentSpeaker: PersonaId | null;
  streamingContent: string;
  error: string | null;
}

export type DebateAction =
  | { type: 'SET_PHASE'; phase: DebatePhase }
  | { type: 'SET_TOPIC'; topic: string }
  | { type: 'ADD_MESSAGE'; message: DebateMessage }
  | { type: 'SET_STREAMING_CONTENT'; content: string }
  | { type: 'CLEAR_STREAMING' }
  | { type: 'SET_MESSAGE_VOTE'; messageId: string; vote: 0 | 1 | -1 }
  | { type: 'SET_STREAMING'; isStreaming: boolean }
  | { type: 'SET_SPEAKER'; personaId: PersonaId | null }
  | { type: 'SET_MODERATOR_NOTE'; note: string | null }
  | { type: 'ADD_SCORE'; score: RoundScore }
  | { type: 'NEXT_ROUND' }
  | { type: 'SET_HUMAN_PERSONA'; personaId: PersonaId | null }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };
