'use client';

import { useApp } from '@/context/AppContext';

export function ProgressRing() {
  const { progress, getCompletionPercentage } = useApp();
  const percentage = getCompletionPercentage();

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center">
      <svg
        className="h-32 w-32 -rotate-90 transform"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="var(--fill-secondary)"
          strokeWidth="8"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="var(--system-green)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className="transition-all duration-500"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-[var(--foreground)]">
          {percentage}%
        </span>
        <span className="text-xs text-[var(--foreground-tertiary)]">
          abgeschlossen
        </span>
      </div>
      <p
        className="mt-2 text-sm text-[var(--foreground-secondary)]"
        role="status"
        aria-live="polite"
      >
        {progress.completedDays.length} von 7 Tagen erledigt
      </p>
    </div>
  );
}
