'use client';

import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS, MAX_ROUNDS } from '@/lib/debate/constants';
import { t } from '@/lib/debate/i18n';
import { Button } from '@/components/shared/Button';
import type { PersonaId } from '@/types/debate';

interface DashboardProps {
  takeoverTarget: PersonaId | null;
  onConfirmTakeOver: () => void;
  onCancelTakeOver: () => void;
}

export function Dashboard({ takeoverTarget, onConfirmTakeOver, onCancelTakeOver }: DashboardProps) {
  const { state, dispatch } = useDebate();
  const lang = state.language;
  const [pauseNote, setPauseNote] = useState('');
  const [humanInput, setHumanInput] = useState('');
  const [score, setScore] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dashContentRef = useRef<HTMLDivElement>(null);
  const isScoring = state.phase === 'scoring';
  const isPaused = state.phase === 'paused';

  useEffect(() => {
    if (isScoring) setScore(0);
  }, [isScoring]);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  });

  const handlePauseToggle = () => {
    if (state.phase === 'debating' || state.phase === 'human-vs-ai') {
      dispatch({ type: 'SET_PHASE', phase: 'paused' });
    } else if (state.phase === 'paused') {
      setPauseNote('');
      dispatch({ type: 'SET_PHASE', phase: 'debating' });
    }
  };
  const handleResumeWithNote = () => {
    if (pauseNote.trim()) {
      dispatch({ type: 'SET_MODERATOR_NOTE', note: pauseNote.trim() });
    }
    setPauseNote('');
    dispatch({ type: 'SET_PHASE', phase: 'debating' });
  };

  const handleScoreSubmit = () => {
    dispatch({ type: 'ADD_SCORE', score: { round: state.currentRound, score, timestamp: Date.now() } });
    if (state.currentRound >= MAX_ROUNDS) {
      dispatch({ type: 'SET_PHASE', phase: 'judging' });
    } else {
      dispatch({ type: 'NEXT_ROUND' });
    }
  };

  const handleHumanSubmit = () => {
    const trimmed = humanInput.trim();
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
    setHumanInput('');
  };

  const isHumanTurn =
    state.phase === 'human-vs-ai' &&
    !state.isStreaming &&
    state.humanPersona !== null &&
    state.messages.filter(m => m.round === state.currentRound).length < 2;

  const humanPersonaState = state.humanPersona ? PERSONAS[state.humanPersona] : null;
  const takeoverPersona = takeoverTarget ? PERSONAS[takeoverTarget] : null;
  const totalScore = state.scores.reduce((s, sc) => s + sc.score, 0);

  return (
    <aside className="w-[350px] shrink-0 border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col self-stretch">
      <div className="p-4 pb-2 space-y-3">
        <Button
          variant={isPaused ? 'primary' : 'secondary'}
          size="md"
          className="w-full"
          onClick={handlePauseToggle}
        >
          {isPaused ? t(lang, 'resume') : t(lang, 'pause')}
        </Button>

        {state.scores.length > 0 && (
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wide">{t(lang, 'totalScore')}</span>
            <div className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
              {totalScore > 0 ? `+${totalScore}` : totalScore}
            </div>
            <span className="text-[10px] text-zinc-400">
              {t(lang, 'scored', { n: state.scores.length, total: MAX_ROUNDS })}
            </span>
          </div>
        )}
      </div>

      <hr className="border-zinc-200 dark:border-zinc-700 mx-4" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pt-3">
        <div ref={dashContentRef} className="flex flex-col gap-4 min-h-full justify-end">
          {isPaused && (
            <section className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                {t(lang, 'moderatorTitle')}
              </label>
              <textarea
                value={pauseNote}
                onChange={e => setPauseNote(e.target.value)}
                placeholder={t(lang, 'moderatorPlaceholder')}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setPauseNote(''); dispatch({ type: 'SET_PHASE', phase: 'debating' }); }}>
                  {t(lang, 'cancel')}
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={handleResumeWithNote}>
                  {t(lang, 'submitIntervention')}
                </Button>
              </div>
            </section>
          )}

          {isScoring && (
            <section>
              <div className="text-center mb-3">
                <div className="text-2xl mb-1">📊</div>
                <h3 className="text-sm font-bold">{t(lang, 'scoringTitle', { round: state.currentRound })}</h3>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className={`text-4xl font-extrabold transition-colors ${
                  score > 0 ? 'text-blue-500' : score < 0 ? 'text-rose-500' : 'text-zinc-400'
                }`}>
                  {score > 0 ? `+${score}` : score}
                </div>

                <input
                  type="range"
                  min={-10}
                  max={10}
                  step={1}
                  value={score}
                  onChange={e => setScore(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-500"
                />

                <div className="flex justify-between w-full text-[10px] text-zinc-400">
                  <span>{t(lang, 'conWins')}</span>
                  <span>{t(lang, 'proWins')}</span>
                </div>

                <Button variant="primary" size="sm" className="w-full mt-1" onClick={handleScoreSubmit}>
                  {state.currentRound >= MAX_ROUNDS ? t(lang, 'submitScoreFinal') : t(lang, 'submitScore')}
                </Button>
              </div>
            </section>
          )}

          {takeoverTarget && takeoverPersona && (
            <section className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
              <div className="text-center">
                <div className="text-3xl mb-2">🔥</div>
                <h3 className="text-sm font-bold mb-1">{t(lang, 'humanVsAi')}</h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed whitespace-pre-line">
                  {t(lang, 'takeoverDesc')}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="flex-1" onClick={onCancelTakeOver}>
                    {t(lang, 'takeoverCancel')}
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1" onClick={onConfirmTakeOver}>
                    {t(lang, 'takeoverConfirm')}
                  </Button>
                </div>
              </div>
            </section>
          )}

          {state.phase === 'human-vs-ai' && !takeoverTarget && (
            <section className="space-y-2">
              {isHumanTurn ? (
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-green-700 dark:text-green-300">
                      ✍️ {t(lang, 'youRepresent', { stance: humanPersonaState ? t(lang, humanPersonaState.stance) : '' })}
                    </span>
                  </div>
                  <textarea
                    value={humanInput}
                    onChange={e => setHumanInput(e.target.value)}
                    rows={3}
                    placeholder={t(lang, 'inputPlaceholder')}
                    className="w-full px-3 py-2 rounded-xl border border-green-300 dark:border-green-700 bg-white dark:bg-zinc-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                    maxLength={500}
                  />
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => { dispatch({ type: 'SET_HUMAN_PERSONA', personaId: null }); dispatch({ type: 'SET_PHASE', phase: 'debating' }); }}>
                      交还控制
                    </Button>
                    <Button variant="primary" size="sm" className="flex-1" onClick={handleHumanSubmit} disabled={!humanInput.trim()}>
                      {t(lang, 'speak')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-xs text-zinc-400 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                    <span>{t(lang, 'thinking')}</span>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="pt-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => dispatch({ type: 'RESET' })}
            >
              {t(lang, 'backToTopics')}
            </Button>
          </section>
        </div>
      </div>
    </aside>
  );
}
