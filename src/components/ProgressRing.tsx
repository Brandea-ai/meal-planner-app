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
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className="text-green-500 transition-all duration-500"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900 dark:text-white">
          {percentage}%
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          abgeschlossen
        </span>
      </div>
      <p
        className="mt-2 text-sm text-gray-600 dark:text-gray-400"
        role="status"
        aria-live="polite"
      >
        {progress.completedDays.length} von 7 Tagen erledigt
      </p>
    </div>
  );
}
