'use client';

import { useState } from 'react';
import { Button } from '@/components/shared/Button';

interface CustomTopicInputProps {
  onSubmit: (topic: string) => void;
}

export function CustomTopicInput({ onSubmit }: CustomTopicInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue('');
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
        placeholder="输入自定义辩题..."
        className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <Button
        variant="primary"
        size="md"
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="shrink-0"
      >
        自定义
      </Button>
    </div>
  );
}
