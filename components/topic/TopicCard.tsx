'use client';

interface TopicCardProps {
  topic: string;
  onClick: (topic: string) => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
  return (
    <button
      onClick={() => onClick(topic)}
      className="w-full text-left p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-200 group"
    >
      <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {topic}
      </p>
      <div className="mt-2 text-xs text-zinc-400 group-hover:text-blue-400">
        选择此辩题 →
      </div>
    </button>
  );
}
