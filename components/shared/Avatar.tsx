import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
  className?: string;
  color?: string;
  onClick?: () => void;
}

export function Avatar({
  src,
  alt,
  size = 48,
  className = '',
  color = 'blue',
  onClick,
}: AvatarProps) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    rose: 'bg-rose-500',
    green: 'bg-green-500',
    amber: 'bg-amber-500',
    violet: 'bg-violet-500',
  };

  const fallbackBg = colorMap[color] || 'bg-zinc-400';

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 ${onClick ? 'cursor-pointer hover:ring-2 hover:ring-offset-2 ring-blue-400' : ''} ${className}`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <div
          className={`w-full h-full ${fallbackBg} flex items-center justify-center text-white font-bold text-lg`}
        >
          {alt.charAt(0)}
        </div>
      )}
    </div>
  );
}
