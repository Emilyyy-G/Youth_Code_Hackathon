'use client';

import { useDebate } from '@/lib/store/debate-context';
import { t } from '@/lib/debate/i18n';
import { Button } from '@/components/shared/Button';

export function FloatingActions() {
  const { state } = useDebate();
  const lang = state.language;

  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        title={t(lang, 'settings')}
        onClick={() => alert(t(lang, 'settings') + ' ' + (lang === 'zh' ? '功能即将上线' : 'coming soon'))}
      >
        ⚙️
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        title={t(lang, 'sound')}
        onClick={() => alert(t(lang, 'sound') + ' ' + (lang === 'zh' ? '功能即将上线' : 'coming soon'))}
      >
        🔊
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        title={t(lang, 'appearance')}
        onClick={() => alert(t(lang, 'appearance') + ' ' + (lang === 'zh' ? '功能即将上线' : 'coming soon'))}
      >
        🎨
      </Button>
    </div>
  );
}
