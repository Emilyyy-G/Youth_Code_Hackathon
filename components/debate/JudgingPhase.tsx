'use client';

import { useCallback, useRef, useState } from 'react';
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
  const [rating, setRating] = useState(0);
  const [rated, setRated] = useState(false);

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
          messages: state.messages.map(m => ({ personaId: m.personaId, content: m.content })),
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
              { personaId: 'ai1', mbti: '—', title: '—', strengths: [], weaknesses: [], dimensions: [
                { label: t(lang, 'logic'), score: 50, description: '' },
                { label: t(lang, 'expression'), score: 50, description: '' },
                { label: t(lang, 'rebuttal'), score: 50, description: '' },
                { label: t(lang, 'innovation'), score: 50, description: '' },
                { label: t(lang, 'composure'), score: 50, description: '' },
              ], bestQuote: '—' },
              { personaId: 'ai2', mbti: '—', title: '—', strengths: [], weaknesses: [], dimensions: [
                { label: t(lang, 'logic'), score: 50, description: '' },
                { label: t(lang, 'expression'), score: 50, description: '' },
                { label: t(lang, 'rebuttal'), score: 50, description: '' },
                { label: t(lang, 'innovation'), score: 50, description: '' },
                { label: t(lang, 'composure'), score: 50, description: '' },
              ], bestQuote: '—' },
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
          <p className="text-zinc-700 dark:text-zinc-300">{t(lang, 'generatingReport')}</p>
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
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{t(lang, 'judgeReportTitle')}</h2>
          <p className="text-base text-zinc-700 dark:text-zinc-300 mb-6">
            {t(lang, 'totalScore')}: <span className="text-2xl font-extrabold">{totalScore > 0 ? `+${totalScore}` : totalScore}</span>
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
      <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${fillColor} transition-all`} style={{ width: `${score}%` }} />
      </div>
    );
  };

  // Get all messages sorted for highlights
  const allMessages = [...state.messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex-1 flex min-h-0">
      {/* ===== Left: Report ===== */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* ===== Winner Banner ===== */}
          <div className={`p-6 rounded-2xl border-2 ${
            report.winner === 'ai1'
              ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700'
              : report.winner === 'ai2'
              ? 'bg-rose-50 dark:bg-rose-950 border-rose-300 dark:border-rose-700'
              : 'bg-amber-50 dark:bg-amber-950 border-amber-300 dark:border-amber-700'
          }`}>
            <div className="text-4xl mb-2 text-center">🏆</div>
            <h2 className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100 text-center">{t(lang, 'judgeReportTitle')}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 text-center mt-1">{translateTopic(lang, report.topic)}</p>
            <div className="flex justify-center mt-4">
              <div className={`inline-block px-5 py-2 rounded-full text-base font-extrabold ${
                report.winner === 'ai1' ? 'bg-blue-600 text-white'
                : report.winner === 'ai2' ? 'bg-rose-600 text-white'
                : 'bg-amber-600 text-white'
              }`}>
                {t(lang, 'winner')}: {report.winner === 'tie' ? t(lang, 'tie') : t(lang, report.winner === 'ai1' ? 'debater1' : 'debater2')}
              </div>
            </div>
          </div>

          {/* ===== Final Score ===== */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 p-5 text-center">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">{t(lang, 'finalScore')}</span>
            <div className="text-4xl font-extrabold mt-1 text-zinc-900 dark:text-zinc-100">
              {totalScore > 0 ? `+${totalScore}` : totalScore}
            </div>
            <div className="flex justify-center gap-6 mt-3 text-sm font-semibold">
              <span className="text-blue-600">{t(lang, 'debater1')}: {ai1Score}/{state.scores.length}</span>
              <span className="text-rose-600">{t(lang, 'debater2')}: {ai2Score}/{state.scores.length}</span>
            </div>
          </div>

          {/* ===== Overall Summary ===== */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 p-5">
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mb-3">{t(lang, 'overallSummary')}</h3>
            <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
          </div>

          {/* ===== Highlights / 精彩回顾 ===== */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 p-5">
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mb-3">{t(lang, 'highlights')}</h3>
            <div className="space-y-3">
              {allMessages.slice(-6).map((msg) => (
                <div key={msg.id} className={`rounded-lg border p-3 ${
                  msg.personaId === 'ai1'
                    ? 'bg-blue-50/80 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    : msg.personaId === 'ai2'
                    ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800'
                    : 'bg-green-50/80 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      msg.personaId === 'ai1' ? 'bg-blue-500 text-white'
                      : msg.personaId === 'ai2' ? 'bg-rose-500 text-white'
                      : 'bg-green-500 text-white'
                    }`}>
                      {t(lang, msg.personaId === 'ai1' ? 'debater1' : msg.personaId === 'ai2' ? 'debater2' : 'pro')}
                    </span>
                    <span className="text-[10px] text-zinc-400">{t(lang, 'round').split('{')[0]}{msg.round}</span>
                  </div>
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 leading-relaxed">{msg.content.slice(0, 100)}{msg.content.length > 100 ? '...' : ''}</p>
                  {msg.vote !== 0 && <span className={`text-[10px] ${msg.vote === 1 ? 'text-blue-500' : 'text-rose-500'}`}>{msg.vote === 1 ? '👍' : '👎'}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ===== Best Quotes ===== */}
          <div className="grid grid-cols-2 gap-4">
            {report.debaters.map((d, i) => (
              <div key={d.personaId} className={`rounded-xl border-2 p-4 ${
                i === 0
                  ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700'
                  : 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700'
              }`}>
                <div className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">{t(lang, i === 0 ? 'debater1' : 'debater2')} {t(lang, 'bestQuote')}</div>
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 italic leading-relaxed">&ldquo;{d.bestQuote}&rdquo;</p>
              </div>
            ))}
          </div>

          {/* ===== Rating Section ===== */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 p-5 text-center">
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mb-1">
              {rated ? t(lang, 'rateThanks') : t(lang, 'rateDebate')}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{t(lang, 'rateDebateDesc')}</p>

            {!rated ? (
              <>
                <div className="flex justify-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-all hover:scale-110 ${
                        star <= rating ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {rating > 0 && (
                  <>
                    <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                      {t(lang, 'yourRating')}: {rating}/5
                      <span className="ml-2 font-normal">
                        ({t(lang, rating >= 5 ? 'excellent' : rating >= 4 ? 'good' : rating >= 3 ? 'average' : rating >= 2 ? 'poor' : 'terrible')})
                      </span>
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setRated(true)}>
                      {t(lang, 'rateSubmit')}
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="flex justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={`text-3xl ${star <= rating ? 'text-amber-400' : 'text-zinc-300 dark:text-zinc-600'}`}>★</span>
                ))}
              </div>
            )}
          </div>

          {/* ===== Back ===== */}
          <div className="text-center pb-4">
            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'RESET' })}>
              {t(lang, 'backToTopics')}
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Right: Analysis Dimensions ===== */}
      <aside className="w-[350px] shrink-0 border-l border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="p-4 space-y-6">
          <h3 className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100 text-center">{t(lang, 'analysisDimensions')}</h3>
          {report.debaters.map((d, i) => {
            const isFirst = i === 0;
            return (
              <div key={d.personaId} className={`rounded-xl border-2 p-4 space-y-3 ${
                isFirst
                  ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700'
                  : 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-300 dark:border-rose-700'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-sm ${isFirst ? 'bg-blue-600' : 'bg-rose-600'}`}>
                    {isFirst ? t(lang, 'pro').charAt(0) : t(lang, 'con').charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{t(lang, isFirst ? 'debater1' : 'debater2')}</div>
                    <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{t(lang, 'mbtiType')}: {d.mbti} · {t(lang, 'title')}: {d.title}</div>
                  </div>
                </div>

                {d.strengths?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">{t(lang, 'strengths')}</span>
                    <ul className="mt-1 space-y-0.5">
                      {d.strengths.map((s, si) => (
                        <li key={si} className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-start gap-1">
                          <span className="text-green-600 mt-0.5 shrink-0">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {d.weaknesses?.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">{t(lang, 'weaknesses')}</span>
                    <ul className="mt-1 space-y-0.5">
                      {d.weaknesses.map((w, wi) => (
                        <li key={wi} className="text-xs font-medium text-zinc-700 dark:text-zinc-300 flex items-start gap-1">
                          <span className="text-rose-600 mt-0.5 shrink-0">−</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2.5 pt-1">
                  {d.dimensions?.map((dim, di) => (
                    <div key={di}>
                      <div className="flex justify-between text-xs mb-0.5">
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{dim.label}</span>
                        <span className="font-extrabold text-zinc-900 dark:text-zinc-100">{dim.score}</span>
                      </div>
                      {scoreBar(dim.score)}
                      {dim.description && (
                        <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">{dim.description}</p>
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
