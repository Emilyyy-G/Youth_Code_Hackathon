'use client';

import { useState, useLayoutEffect, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS, MAX_ROUNDS } from '@/lib/debate/constants';
import { t } from '@/lib/debate/i18n';
import { Button } from '@/components/shared/Button';
import type { PersonaId } from '@/types/debate';
console.log("!!! 正在运行的 Dashboard.tsx 已经修改过 !!!");

interface DashboardProps {
  takeoverTarget: PersonaId | null;
  onConfirmTakeOver: () => void;
  onCancelTakeOver: () => void;
}

export function Dashboard({ takeoverTarget, onConfirmTakeOver, onCancelTakeOver }: DashboardProps) {
  const { state, dispatch } = useDebate();
  const lang = state.language;
  const scrollRef = useRef<HTMLDivElement>(null);

  // 状态管理
  const [pauseNote, setPauseNote] = useState('');
  const [humanInput, setHumanInput] = useState('');
  const [score, setScore] = useState(0);
  const [isJudging, setIsJudging] = useState(false);
  const [judgeResult, setJudgeResult] = useState<any | null>(null);

  const isScoring = state.phase === 'scoring';
  const isJudgingPhase = state.phase === 'judging';
  const isPaused = state.phase === 'paused';

  useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [state.messages, state.phase]);

  // 操作函数
  const handlePauseToggle = () => {
    if (state.phase === 'debating' || state.phase === 'human-vs-ai') dispatch({ type: 'SET_PHASE', phase: 'paused' });
    else if (state.phase === 'paused') dispatch({ type: 'SET_PHASE', phase: 'debating' });
  };

  const handleResumeWithNote = () => {
    if (pauseNote.trim()) dispatch({ type: 'SET_MODERATOR_NOTE', note: pauseNote.trim() });
    setPauseNote('');
    dispatch({ type: 'SET_PHASE', phase: 'debating' });
  };

  const handleScoreSubmit = () => {
    dispatch({ type: 'ADD_SCORE', score: { round: state.currentRound, score, timestamp: Date.now() } });
    if (state.currentRound >= MAX_ROUNDS) {
      dispatch({ type: 'SET_PHASE', phase: 'judging' });
    } else {
      dispatch({ type: 'NEXT_ROUND' });
      setScore(0);
    }
  };

  const handleGenerateReport = async () => {
    // 1. 触发加载状态（UI 层面）
    dispatch({ type: 'SET_JUDGE_LOADING', loading: true });
    setIsJudging(true);

    console.log("=== 开始执行生成报告函数 ===");

    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.messages,
          language: lang,
          userFeedback: 50 // 保持你原有的逻辑
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      console.log("=== 后端返回的完整数据结构 ===", data);

      // 2. 更新本地状态（用于侧边栏渲染）
      setJudgeResult(data);

      // 3. 更新全局 Context（用于主页面组件读取数据）
      dispatch({ type: 'SET_JUDGE_REPORT', report: data });

    } catch (err) {
      console.error("=== 捕获到错误 ===", err);
      alert("裁判罢工了，错误信息: " + err);
      // 如果出错，也要取消加载状态
      dispatch({ type: 'SET_JUDGE_LOADING', loading: false });
    } finally {
      setIsJudging(false);
    }
  };

  const handleHumanSubmit = () => {
    if (!humanInput.trim() || !state.humanPersona) return;
    dispatch({
      type: 'ADD_MESSAGE',
      message: { id: crypto.randomUUID(), personaId: 'human', content: humanInput.trim(), round: state.currentRound, timestamp: Date.now(), vote: 0 },
    });
    setHumanInput('');
  };

  const isHumanTurn = state.phase === 'human-vs-ai' && !state.isStreaming && state.humanPersona !== null && state.messages.filter(m => m.round === state.currentRound).length < 2;
  const humanPersonaState = state.humanPersona ? PERSONAS[state.humanPersona] : null;
  const totalScore = state.scores.reduce((s, sc) => s + sc.score, 0);

  return (
    <aside className="w-[350px] shrink-0 border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 flex flex-col self-stretch">
      <div className="p-4 pb-2 space-y-3">
        <Button variant={isPaused ? 'primary' : 'secondary'} className="w-full" onClick={handlePauseToggle}>
          {isPaused ? t(lang, 'resume') : t(lang, 'pause')}
        </Button>
        {state.scores.length > 0 && (
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 uppercase">{t(lang, 'totalScore')}</span>
            <div className="text-xl font-bold">{totalScore > 0 ? `+${totalScore}` : totalScore}</div>
          </div>
        )}
      </div>

      <hr className="border-zinc-200 mx-4" />

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 pt-3">
        <div className="flex flex-col gap-4 min-h-full justify-end">
          {/* 暂停逻辑 */}
          {isPaused && (
            <section className="space-y-2">
              <textarea value={pauseNote} onChange={e => setPauseNote(e.target.value)} placeholder={t(lang, 'moderatorPlaceholder')} rows={3} className="w-full p-2 text-xs border rounded-lg" />
              <Button variant="primary" size="sm" className="w-full" onClick={handleResumeWithNote}>{t(lang, 'submitIntervention')}</Button>
            </section>
          )}

          {/* 评分逻辑 */}
          {isScoring && (
            <section>
              <h3 className="text-sm font-bold text-center mb-2">{t(lang, 'scoringTitle', { round: state.currentRound })}</h3>
              <input type="range" min={-10} max={10} value={score} onChange={e => setScore(Number(e.target.value))} className="w-full accent-blue-500" />
              <Button variant="primary" className="w-full mt-2" onClick={handleScoreSubmit}>
                {state.currentRound >= MAX_ROUNDS ? t(lang, 'submitScoreFinal') : t(lang, 'submitScore')}
              </Button>
            </section>
          )}

          {isJudgingPhase && (
            <section className="bg-amber-100 p-4 rounded-xl border border-amber-300">
              <h3 className="text-lg font-bold mb-3">调试裁判报告</h3>

              {!judgeResult ? (
                <Button variant="primary" className="w-full" onClick={handleGenerateReport}>
                  {isJudging ? "生成中..." : "点击生成报告"}
                </Button>
              ) : (
                <pre className="text-[10px] bg-black text-green-400 p-2 overflow-auto max-h-[300px]">
                  {JSON.stringify(judgeResult, null, 2)}
                </pre>
              )}
            </section>
          )}
          {/* 人类发言逻辑 */}
          {state.phase === 'human-vs-ai' && !takeoverTarget && (
            <section className="space-y-2">
              <input value={humanInput} onChange={e => setHumanInput(e.target.value)} placeholder={t(lang, 'inputPlaceholder')} className="w-full p-2 border rounded-lg text-sm" />
              <Button variant="primary" className="w-full" onClick={handleHumanSubmit}>{t(lang, 'speak')}</Button>
            </section>
          )}
        </div>
      </div>

      <div className="p-4 border-t">
        <Button variant="ghost" size="sm" className="w-full" onClick={() => dispatch({ type: 'RESET' })}>
          {t(lang, 'backToTopics')}
        </Button>
      </div>
    </aside>
  );
}