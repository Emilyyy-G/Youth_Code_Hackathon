'use client';

import { useLayoutEffect, useRef } from 'react';
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
  const orderClass =
    side === 'left'
      ? 'flex-row'
      : 'flex-row-reverse';

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  });

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
                  content: streamingContent,
                  round: 0,
                  timestamp: Date.now(),
                  vote: 0,
                }}
                side={side}
                color={persona.color}
                isStreaming
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
