'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Persona, DebateMessage } from '@/types/debate';
import { useDebate } from '@/lib/store/debate-context';
import { t } from '@/lib/debate/i18n';
import { AAvatar } from './AAvatar';
import { SpeechBubble } from './SpeechBubble';

interface DebaterColumnProps {
  persona: Persona;
  messages: DebateMessage[];
  side: 'left' | 'right';
  isStreaming: boolean;
  streamingContent: string;
  isCurrentSpeaker: boolean;
  isHumanControlled: boolean;
  onTakeOver: () => void;
}

export function DebaterColumn({
  persona,
  messages,
  side,
  isStreaming,
  streamingContent,
  isCurrentSpeaker,
  isHumanControlled,
  onTakeOver,
}: DebaterColumnProps) {
  const { state } = useDebate();
  const lang = state.language;
  const scrollRef = useRef<HTMLDivElement>(null);
  const orderClass = side === 'left' ? 'flex-row' : 'flex-row-reverse';

  // Smooth character reveal — time-based, exactly 40 chars/sec (1 char per 25ms)
  const CHAR_RATE = 40;
  const [revealed, setRevealed] = useState(0);
  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const contentLenRef = useRef(0);
  // contentLenRef is updated synchronously in render below

  const displayedContent = streamingContent.slice(0, revealed);
  const fullyRevealed = revealed >= streamingContent.length;
  const showCursor = isStreaming && isCurrentSpeaker && !fullyRevealed && streamingContent.length > 0;

  // Auto-scroll — useLayoutEffect runs synchronously before paint
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'instant' });
  }, [messages.length, displayedContent, isStreaming, isCurrentSpeaker, revealed]);

  // Time-based reveal loop using requestAnimationFrame
  // rAF runs continuously while speaking, delivering exactly 40 chars/sec
  // New API chunks are picked up naturally via contentLenRef.current
  useEffect(() => {
    if (!isStreaming || !isCurrentSpeaker) {
      setRevealed(0);
      startTimeRef.current = 0;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      return;
    }

    if (startTimeRef.current === 0) {
      startTimeRef.current = performance.now();
    }

    function tick(now: number) {
      const elapsed = now - startTimeRef.current;
      // Ensure at least 1 char is shown on first frame
      const rawTarget = elapsed / (1000 / CHAR_RATE);
      const target = Math.max(1, Math.floor(rawTarget));
      const maxLen = contentLenRef.current;

      if (target >= maxLen) {
        setRevealed(maxLen);
      } else {
        setRevealed(target);
      }
      // Keep ticking indefinitely — new chunks are picked up naturally
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [isStreaming, isCurrentSpeaker]);

  // Keep ref in sync with latest content length
  contentLenRef.current = streamingContent.length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${orderClass} gap-3`}>
            {side === 'left' && (
              <div className="shrink-0 pt-1">
                <AAvatar
                  persona={persona}
                  side={side}
                  onTakeOver={onTakeOver}
                  isHumanControlled={isHumanControlled}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <SpeechBubble
                message={msg}
                side={side}
                color={persona.color}
              />
            </div>
            {side === 'right' && (
              <div className="shrink-0 pt-1">
                <AAvatar
                  persona={persona}
                  side={side}
                  onTakeOver={onTakeOver}
                  isHumanControlled={isHumanControlled}
                />
              </div>
            )}
          </div>
        ))}

        {isStreaming && isCurrentSpeaker && streamingContent && (
          <div className={`flex ${orderClass} gap-3`}>
            {side === 'left' && (
              <div className="shrink-0 pt-1">
                <AAvatar
                  persona={persona}
                  side={side}
                  onTakeOver={onTakeOver}
                  isHumanControlled={isHumanControlled}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <SpeechBubble
                message={{
                  id: 'streaming',
                  personaId: persona.id,
                  content: displayedContent,
                  round: 0,
                  timestamp: Date.now(),
                  vote: 0,
                }}
                side={side}
                color={persona.color}
                isStreaming={showCursor}
              />
            </div>
            {side === 'right' && (
              <div className="shrink-0 pt-1">
                <AAvatar
                  persona={persona}
                  side={side}
                  onTakeOver={onTakeOver}
                  isHumanControlled={isHumanControlled}
                />
              </div>
            )}
          </div>
        )}

        {isStreaming && isCurrentSpeaker && !streamingContent && (
          <div className={`flex ${orderClass} gap-3`}>
            {side === 'left' && (
              <div className="shrink-0 pt-1">
                <AAvatar
                  persona={persona}
                  side={side}
                  onTakeOver={onTakeOver}
                  isHumanControlled={isHumanControlled}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className={`inline-block px-4 py-3 rounded-2xl border ${
                side === 'left'
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                  : 'bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800'
              }`}>
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0s' }} />
                  <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
            </div>
            {side === 'right' && (
              <div className="shrink-0 pt-1">
                <AAvatar
                  persona={persona}
                  side={side}
                  onTakeOver={onTakeOver}
                  isHumanControlled={isHumanControlled}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {!messages.length && !isStreaming && (
        <div className="flex-1 flex items-center justify-center text-sm text-zinc-400">
          {t(lang, 'waiting')}
        </div>
      )}
    </div>
  );
}
