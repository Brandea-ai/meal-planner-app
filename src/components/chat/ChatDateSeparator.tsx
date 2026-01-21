'use client';

interface ChatDateSeparatorProps {
  date: string;
}

export function ChatDateSeparator({ date }: ChatDateSeparatorProps) {
  return (
    <div className="flex items-center justify-center py-2">
      <span className="glass-inner px-4 py-1.5 text-xs font-medium text-[var(--foreground-tertiary)] rounded-full">
        {date}
      </span>
    </div>
  );
}
