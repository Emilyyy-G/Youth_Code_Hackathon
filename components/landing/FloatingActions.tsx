'use client';

import { Button } from '@/components/shared/Button';

export function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-6 flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        title="设置"
        onClick={() => alert('设置功能即将上线')}
      >
        ⚙️
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        title="声音"
        onClick={() => alert('声音功能即将上线')}
      >
        🔊
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        title="外观"
        onClick={() => alert('外观功能即将上线')}
      >
        🎨
      </Button>
    </div>
  );
}
