'use client';

import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from 'react';
import type { DebateState, DebateAction } from '@/types/debate';

const initialState: DebateState = {
  phase: 'topic-select',
  topic: '',
  currentRound: 1,
  messages: [],
  scores: [],
  moderatorNote: null,
  humanPersona: null,
  isStreaming: false,
  currentSpeaker: null,
  streamingContent: '',
  error: null,
  language: 'zh',
  judgeReport: null,
  judgeLoading: false,
};

function debateReducer(state: DebateState, action: DebateAction): DebateState {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'SET_TOPIC':
      return { ...state, topic: action.topic, phase: 'debating' };

    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] };

    case 'SET_STREAMING_CONTENT':
      return { ...state, streamingContent: action.content };

    case 'CLEAR_STREAMING':
      return { ...state, streamingContent: '' };

    case 'SET_MESSAGE_VOTE':
      return {
        ...state,
        messages: state.messages.map(m =>
          m.id === action.messageId ? { ...m, vote: action.vote } : m
        ),
      };

    case 'SET_STREAMING':
      return { ...state, isStreaming: action.isStreaming };

    case 'SET_SPEAKER':
      return { ...state, currentSpeaker: action.personaId };

    case 'SET_MODERATOR_NOTE':
      return { ...state, moderatorNote: action.note };

    case 'ADD_SCORE':
      return { ...state, scores: [...state.scores, action.score] };

    case 'NEXT_ROUND':
      return {
        ...state,
        currentRound: state.currentRound + 1,
        moderatorNote: null,
        phase: 'debating',
      };

    case 'SET_HUMAN_PERSONA':
      return { ...state, humanPersona: action.personaId };

    case 'SET_ERROR':
      return { ...state, error: action.error };

    case 'SET_LANGUAGE':
      return { ...state, language: action.language };

    case 'SET_JUDGE_REPORT':
      return { ...state, judgeReport: action.report, judgeLoading: false };

    case 'SET_JUDGE_LOADING':
      return { ...state, judgeLoading: action.loading };

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

const DebateContext = createContext<{
  state: DebateState;
  dispatch: React.Dispatch<DebateAction>;
} | null>(null);

export function DebateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(debateReducer, initialState);

  return (
    <DebateContext.Provider value={{ state, dispatch }}>
      {children}
    </DebateContext.Provider>
  );
}

export function useDebate() {
  const context = useContext(DebateContext);
  if (!context) {
    throw new Error('useDebate must be used within a DebateProvider');
  }
  return context;
}