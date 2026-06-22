'use client';

import Link from 'next/link';
import { Button } from '@/components/shared/Button';

export function LandingHero() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center px-4">
      {/* Logo / Title */}
      <div className="mb-8">
        <div className="text-6xl mb-4">⚖️</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          AI 辩论
        </h1>
        <p className="mt-3 text-lg text-zinc-500 dark:text-zinc-400 max-w-md">
          让 AI 为你展示正反双方的精彩辩论，你也可以亲自上场挑战！
        </p>
      </div>

      {/* Main CTA */}
      <Link href="/debate">
        <Button size="lg" className="text-lg px-10 py-4 rounded-xl shadow-lg shadow-blue-500/25">
          🎤 开始辩论
        </Button>
      </Link>

      {/* Feature highlights */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-lg">
        <div className="text-center">
          <div className="text-2xl mb-1">🤖</div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">AI vs AI</div>
          <div className="text-xs text-zinc-400">观看两个 AI 激烈辩论</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">🆚</div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">人机大战</div>
          <div className="text-xs text-zinc-400">亲自上场挑战 AI</div>
        </div>
        <div className="text-center">
          <div className="text-2xl mb-1">📊</div>
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">实时评分</div>
          <div className="text-xs text-zinc-400">每轮为辩手打分</div>
        </div>
      </div>
    </div>
  );
}
