'use client';

import { useState, useEffect } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS, MAX_ROUNDS } from '@/lib/debate/constants';
import { Button } from '@/components/shared/Button';
import type { PersonaId } from '@/types/debate';

interface DashboardProps {
  takeoverTarget: PersonaId | null;
  onConfirmTakeOver: () => void;
  onCancelTakeOver: () => void;
}

export function Dashboard({ takeoverTarget, onConfirmTakeOver, onCancelTakeOver }: DashboardProps) {
  const { state, dispatch } = useDebate();
  const [pauseNote, setPauseNote] = useState('');
  const [humanInput, setHumanInput] = useState('');
  const [score, setScore] = useState(0);
  const isScoring = state.phase === 'scoring';
  const isPaused = state.phase === 'paused';

  // Reset score when entering scoring phase
  useEffect(() => {
    if (isScoring) setScore(0);
  }, [isScoring]);

  // ---- Pause handlers ----
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

  // ---- Score handler ----
  const handleScoreSubmit = () => {
    dispatch({ type: 'ADD_SCORE', score: { round: state.currentRound, score, timestamp: Date.now() } });
    dispatch({ type: 'NEXT_ROUND' });
  };

  // ---- Human input handler ----
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
    <aside className="border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col h-full overflow-y-auto">
      <div className="flex flex-col h-full p-4 gap-4">

        {/* ===== ① Pause / Continue button ===== */}
        <section>
          <Button
            variant={isPaused ? 'primary' : 'secondary'}
            size="md"
            className="w-full"
            onClick={handlePauseToggle}
          >
            {isPaused ? '▶ 继续辩论' : '⏸ 暂停辩论'}
          </Button>
        </section>

        {/* ===== ② Pause note textarea (only when paused) ===== */}
        {isPaused && (
          <section className="space-y-2">
            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              主持人干预
            </label>
            <textarea
              value={pauseNote}
              onChange={e => setPauseNote(e.target.value)}
              placeholder="输入你的想法改变辩论走向…"
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onClick={() => { setPauseNote(''); dispatch({ type: 'SET_PHASE', phase: 'debating' }); }}>
                取消
              </Button>
              <Button variant="primary" size="sm" className="flex-1" onClick={handleResumeWithNote}>
                提交干预
              </Button>
            </div>
          </section>
        )}

        <hr className="border-zinc-200 dark:border-zinc-700" />

        {/* ===== ③ Round scoring (only when scoring phase) ===== */}
        <section className={isScoring ? '' : 'hidden'}>
          <div className="text-center mb-3">
            <div className="text-2xl mb-1">📊</div>
            <h3 className="text-sm font-bold">第 {state.currentRound} 回合 评分</h3>
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
              <span>反方占优</span>
              <span>正方占优</span>
            </div>

            <Button variant="primary" size="sm" className="w-full mt-1" onClick={handleScoreSubmit}>
              提交评分 &amp; 继续
            </Button>
          </div>
        </section>

        <hr className={`border-zinc-200 dark:border-zinc-700 ${isScoring ? '' : 'hidden'}`} />

        {/* ===== ④ Take-over section ===== */}
        {takeoverTarget && takeoverPersona && (
          <section className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <div className="text-center">
              <div className="text-3xl mb-2">🔥</div>
              <h3 className="text-sm font-bold mb-1">人机大战</h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3 leading-relaxed">
                欢迎您挑战地狱模式：人机大战～
                <br />
                请选择确认来开始您精彩的表演
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="flex-1" onClick={onCancelTakeOver}>
                  再看看
                </Button>
                <Button variant="primary" size="sm" className="flex-1" onClick={onConfirmTakeOver}>
                  ✅ 确认出战
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* ===== ⑤ Human-vs-AI input (when human's turn) ===== */}
        {state.phase === 'human-vs-ai' && !takeoverTarget && (
          <section className="space-y-2">
            {isHumanTurn ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    🟢 你代表：{humanPersonaState?.stanceLabel || ''}
                  </span>
                </div>
                <input
                  type="text"
                  value={humanInput}
                  onChange={e => setHumanInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleHumanSubmit(); } }}
                  placeholder="输入你的辩论观点…"
                  className="w-full px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={500}
                />
                <Button variant="primary" size="sm" className="w-full" onClick={handleHumanSubmit} disabled={!humanInput.trim()}>
                  发言
                </Button>
              </>
            ) : (
              <div className="text-center text-xs text-zinc-400 py-4">
                <div className="flex items-center justify-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span>对方正在思考…</span>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ===== ⑥ Cumulative score ===== */}
        {state.scores.length > 0 && (
          <section className="mt-auto pt-2">
            <hr className="border-zinc-200 dark:border-zinc-700 mb-3" />
            <div className="text-center">
              <span className="text-xs text-zinc-500">累计总分</span>
              <div className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">
                {totalScore > 0 ? `+${totalScore}` : totalScore}
              </div>
              <span className="text-[10px] text-zinc-400">
                已评 {state.scores.length} / {MAX_ROUNDS} 回合
              </span>
            </div>
          </section>
        )}

        {/* ===== ⑦ Return to topic button ===== */}
        <section className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={() => dispatch({ type: 'RESET' })}
          >
            ← 返回选题
          </Button>
        </section>
      </div>
    </aside>
  );
}
