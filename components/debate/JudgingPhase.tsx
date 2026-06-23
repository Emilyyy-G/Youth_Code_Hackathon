'use client';

import { useCallback, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS, MAX_ROUNDS } from '@/lib/debate/constants';
import { t, translateTopic } from '@/lib/debate/i18n';
import { Button } from '@/components/shared/Button';

export function JudgingPhase() {
  const { state, dispatch } = useDebate();
  const abortRef = useRef<AbortController | null>(null);
  const lang = state.language;
  const report = state.judgeReport;
  const totalScore = state.scores.reduce((s, sc) => s + sc.score, 0);
  const ai1Score = state.scores.filter(s => s.score > 0).length;
  const ai2Score = state.scores.filter(s => s.score < 0).length;

  const generateReport = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: 'SET_JUDGE_LOADING', loading: true });

    try {
      const res = await fetch('/api/judge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: state.messages.map(m => ({
            personaId: m.personaId,
            content: m.content,
          })),
          topic: state.topic,
          scores: state.scores,
          language: lang,
        }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();

      const report = {
        winner: data.winner || 'tie',
        summary: data.summary || '',
        debaters: (data.debaters && data.debaters.length >= 2)
          ? data.debaters
          : [
              {
                personaId: 'ai1', mbti: '—', title: '—',
                strengths: [], weaknesses: [],
                dimensions: [
                  { label: t(lang, 'logic'), score: 50, description: '' },
                  { label: t(lang, 'expression'), score: 50, description: '' },
                  { label: t(lang, 'rebuttal'), score: 50, description: '' },
                  { label: t(lang, 'innovation'), score: 50, description: '' },
                  { label: t(lang, 'composure'), score: 50, description: '' },
                ],
                bestQuote: '—',
              },
              {
                personaId: 'ai2', mbti: '—', title: '—',
                strengths: [], weaknesses: [],
                dimensions: [
                  { label: t(lang, 'logic'), score: 50, description: '' },
                  { label: t(lang, 'expression'), score: 50, description: '' },
                  { label: t(lang, 'rebuttal'), score: 50, description: '' },
                  { label: t(lang, 'innovation'), score: 50, description: '' },
                  { label: t(lang, 'composure'), score: 50, description: '' },
                ],
                bestQuote: '—',
              },
            ],
        topic: state.topic,
        totalRounds: state.scores.length,
      };

      dispatch({ type: 'SET_JUDGE_REPORT', report });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      dispatch({ type: 'SET_ERROR', error: String(err) });
      dispatch({ type: 'SET_JUDGE_LOADING', loading: false });
    }
  }, [state.messages, state.topic, state.scores, lang, dispatch]);

  if (state.judgeLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⚖️</div>
          <p className="text-zinc-500 dark:text-zinc-400">{t(lang, 'generatingReport')}</p>
          <div className="flex gap-1.5 justify-center mt-4">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0.15s' }} />
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {t(lang, 'judgeReportTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
            {t(lang, 'totalScore')}: {totalScore > 0 ? `+${totalScore}` : totalScore}
          </p>
          <Button variant="primary" size="lg" onClick={generateReport}>
            {t(lang, 'viewConclusion')}
          </Button>
        </div>
      </div>
    );
  }

  const persona1 = PERSONAS[report.debaters[0]?.personaId];
  const persona2 = PERSONAS[report.debaters[1]?.personaId];

  const scoreBar = (score: number) => {
    const fillColor = score >= 60 ? 'bg-blue-500' : score >= 40 ? 'bg-amber-500' : 'bg-rose-500';
    return (
      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${fillColor} transition-all`} style={{ width: `${score}%` }} />
      </div>
    );
  };

  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className={`text-center p-6 rounded-2xl border ${
            report.winner === 'ai1'
              ? 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800'
              : report.winner === 'ai2'
              ? 'bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800'
              : 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
          }`}>
            <div className="text-4xl mb-2">🏆</div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t(lang, 'judgeReportTitle')}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{translateTopic(lang, report.topic)}</p>
            <div className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-bold ${
              report.winner === 'ai1' ? 'bg-blue-500 text-white'
              : report.winner === 'ai2' ? 'bg-rose-500 text-white'
              : 'bg-amber-500 text-white'
            }`}>
              {t(lang, 'winner')}: {report.winner === 'tie' ? t(lang, 'tie') : PERSONAS[report.winner]?.displayName || ''}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 text-center">
            <span className="text-xs text-zinc-400 uppercase tracking-wide">{t(lang, 'finalScore')}</span>
            <div className="text-3xl font-extrabold mt-1">{totalScore > 0 ? `+${totalScore}` : totalScore}</div>
            <div className="flex justify-center gap-4 mt-2 text-xs text-zinc-500">
              <span className="text-blue-500">{persona1?.displayName || ''}: {ai1Score}/{state.scores.length}</span>
              <span className="text-rose-500">{persona2?.displayName || ''}: {ai2Score}/{state.scores.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-2">{t(lang, 'overallSummary')}</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {report.debaters.map((d, i) => {
              const p = i === 0 ? persona1 : persona2;
              return (
                <div key={d.personaId} className={`rounded-xl border p-4 ${
                  i === 0
                    ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                }`}>
                  <div className="text-xs font-bold mb-1">{p?.displayName || ''}</div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 italic">&ldquo;{d.bestQuote}&rdquo;</p>
                </div>
              );
            })}
          </div>

          <div className="text-center pb-4">
            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'RESET' })}>
              {t(lang, 'backToTopics')}
            </Button>
          </div>
        </div>
      </div>

      <aside className="w-[350px] shrink-0 border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="p-4 space-y-6">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 text-center">{t(lang, 'analysisDimensions')}</h3>
          {report.debaters.map((d, i) => {
            const p = i === 0 ? persona1 : persona2;
            const isFirst = i === 0;
            return (
              <div key={d.personaId} className={`rounded-xl border p-4 space-y-3 ${
                isFirst
                  ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                  : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${isFirst ? 'bg-blue-500' : 'bg-rose-500'}`}>
                    {isFirst ? t(lang, 'pro').charAt(0) : t(lang, 'con').charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{p?.displayName || ''}</div>
                    <div className="text-xs text-zinc-500">{t(lang, 'mbtiType')}: {d.mbti} · {t(lang, 'title')}: {d.title}</div>
                  </div>
                </div>

                {d.strengths?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-green-600 uppercase">{t(lang, 'strengths')}</span>
                    <ul className="mt-1 space-y-0.5">
                      {d.strengths.map((s, si) => (
                        <li key={si} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1">
                          <span className="text-green-500 mt-0.5">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {d.weaknesses?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 uppercase">{t(lang, 'weaknesses')}</span>
                    <ul className="mt-1 space-y-0.5">
                      {d.weaknesses.map((w, wi) => (
                        <li key={wi} className="text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-1">
                          <span className="text-rose-500 mt-0.5">−</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  {d.dimensions?.map((dim, di) => (
                    <div key={di}>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-zinc-600 dark:text-zinc-400">{dim.label}</span>
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">{dim.score}</span>
                      </div>
                      {scoreBar(dim.score)}
                      {dim.description && (
                        <p className="text-[10px] text-zinc-400 mt-0.5">{dim.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
