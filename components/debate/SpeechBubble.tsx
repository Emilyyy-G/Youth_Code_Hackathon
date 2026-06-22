'use client';

import type { DebateMessage, PersonaId } from '@/types/debate';
import { MessageActions } from './MessageActions';

interface SpeechBubbleProps {
  message: DebateMessage;
  side: 'left' | 'right';
  color: string;
  isStreaming?: boolean;
}

export function SpeechBubble({
  message,
  side,
  color,
  isStreaming,
}: SpeechBubbleProps) {
  const alignClass = side === 'left' ? 'items-start' : 'items-end';
  const bubbleColor =
    side === 'left'
      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
      : 'bg-rose-50 border-rose-200 dark:bg-rose-950 dark:border-rose-800';

  return (
    <div className={`flex flex-col ${alignClass} w-full`}>
      <div
        className={`relative px-4 py-3 rounded-2xl border ${bubbleColor} max-w-[85%] ${
          side === 'left' ? 'rounded-bl-md' : 'rounded-br-md'
        }`}
      >
        <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
          {message.content}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-zinc-400 dark:bg-zinc-500 animate-pulse rounded-sm" />
          )}
        </p>
      </div>
      <div className={`mt-1 flex ${side === 'left' ? 'justify-start' : 'justify-end'}`}>
        <MessageActions messageId={message.id} vote={message.vote} />
      </div>
    </div>
  );
}
