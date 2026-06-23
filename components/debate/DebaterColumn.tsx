'use client';

import { useEffect, useRef, useState } from 'react';
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

  // Fast consistent character-by-character reveal
  const [revealed, setRevealed] = useState(0);
  const revealedRef = useRef(0);
  const contentRef = useRef(streamingContent);
  contentRef.current = streamingContent;

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  });

  // Tick loop: reveals 3 chars every 15ms using refs to always see latest content
  useEffect(() => {
    if (!isStreaming || !isCurrentSpeaker) {
      setRevealed(0);
      revealedRef.current = 0;
      return;
    }

    const interval = setInterval(() => {
      const totalLen = contentRef.current.length;
      const next = revealedRef.current + 3;
      if (next >= totalLen) {
        revealedRef.current = totalLen;
        setRevealed(totalLen);
        // Don't clear — keep ticking so new chunks are picked up immediately
      } else {
        revealedRef.current = next;
        setRevealed(next);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [isStreaming, isCurrentSpeaker]);

  const displayedContent = streamingContent.slice(0, revealed);
  const fullyRevealed = revealed >= streamingContent.length;
  const showCursor = isStreaming && isCurrentSpeaker && !fullyRevealed && streamingContent.length > 0;

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
