'use client';

import { useState } from 'react';
import type { Persona } from '@/types/debate';
import { useDebate } from '@/lib/store/debate-context';
import { t } from '@/lib/debate/i18n';
import { Avatar } from '@/components/shared/Avatar';

interface AAvatarProps {
  persona: Persona;
  side: 'left' | 'right';
  onTakeOver: () => void;
  isHumanControlled?: boolean;
}

export function AAvatar({
  persona,
  side,
  onTakeOver,
  isHumanControlled,
}: AAvatarProps) {
  const { state } = useDebate();
  const lang = state.language;
  const [showTakeOver, setShowTakeOver] = useState(false);

  return (
    <div
      className={`relative flex flex-col items-center gap-2 ${side === 'left' ? 'ml-4' : 'mr-4'}`}
      onMouseEnter={() => setShowTakeOver(true)}
      onMouseLeave={() => setShowTakeOver(false)}
    >
      <Avatar
        src={persona.avatarUrl}
        alt={persona.displayName}
        size={56}
        color={persona.color}
        onClick={onTakeOver}
      />
      <div className="text-center">
        <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
          {persona.displayName}
        </div>
        <div
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            persona.stance === 'pro'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300'
          }`}
        >
          {t(lang, persona.stance)}
        </div>
      </div>

      {showTakeOver && !isHumanControlled && (
        <button
          onClick={(e) => { e.stopPropagation(); onTakeOver(); }}
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
        >
          {t(lang, 'letMe')}
        </button>
      )}

      {isHumanControlled && (
        <div className="text-[10px] font-bold text-green-500 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
          {t(lang, 'youHaveTaken')}
        </div>
      )}
    </div>
  );
}
