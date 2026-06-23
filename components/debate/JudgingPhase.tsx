'use client';

import { useCallback, useRef } from 'react';
import { useDebate } from '@/lib/store/debate-context';
import { PERSONAS } from '@/lib/debate/constants';
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

    // 触发全局加载状态
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

      // 这里的数据结构需与你的后端 API 返回保持一致
      const reportData = {
        winner: data.winner || 'tie',
        summary: data.summary || '',
        debaters: data.debaters || [],
        topic: state.topic,
        totalRounds: state.scores.length,
      };

      dispatch({ type: 'SET_JUDGE_REPORT', report: reportData });
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      dispatch({ type: 'SET_ERROR', error: String(err) });
      dispatch({ type: 'SET_JUDGE_LOADING', loading: false });
    }
  }, [state.messages, state.topic, state.scores, lang, dispatch]);

  // 1. 加载中状态 UI
  if (state.judgeLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">⚖️</div>
          <p className="text-zinc-500 dark:text-zinc-400">{t(lang, 'generatingReport')}</p>
        </div>
      </div>
    );
  }

  // 2. 初始等待生成状态 UI
  if (!report) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {t(lang, 'judgeReportTitle')}
          </h2>
          <Button variant="primary" size="lg" onClick={generateReport}>
            {t(lang, 'viewConclusion')}
          </Button>
        </div>
      </div>
    );
  }

  // 3. 结果展示 UI
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
          <div className={`text-center p-6 rounded-2xl border ${report.winner === 'ai1' ? 'bg-blue-50 border-blue-200' :
              report.winner === 'ai2' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
            }`}>
            <h2 className="text-xl font-bold">{t(lang, 'judgeReportTitle')}</h2>
            <p className="text-sm text-zinc-500 mt-1">{translateTopic(lang, report.topic)}</p>
            <div className="mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-bold bg-zinc-900 text-white">
              {t(lang, 'winner')}: {report.winner === 'tie' ? t(lang, 'tie') : PERSONAS[report.winner]?.displayName}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-zinc-200 p-4">
            <h3 className="text-sm font-bold mb-2">{t(lang, 'overallSummary')}</h3>
            <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap">{report.summary}</p>
          </div>
        </div>
      </div>

      <aside className="w-[350px] shrink-0 border-l border-zinc-200 bg-white overflow-y-auto">
        <div className="p-4 space-y-6">
          <h3 className="text-sm font-bold text-center">{t(lang, 'analysisDimensions')}</h3>
          {report.debaters.map((d: any, i: number) => (
            <div key={d.personaId} className="rounded-xl border p-4 space-y-3">
              <div className="font-bold text-sm">{i === 0 ? persona1?.displayName : persona2?.displayName}</div>
              <div className="text-xs text-zinc-500">MBTI: {d.mbti}</div>
              <div className="space-y-2">
                {d.dimensions?.map((dim: any, di: number) => (
                  <div key={di}>
                    <div className="flex justify-between text-[11px]">
                      <span>{dim.label}</span>
                      <span className="font-bold">{dim.score}</span>
                    </div>
                    {scoreBar(dim.score)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}