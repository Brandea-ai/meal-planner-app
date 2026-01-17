'use client';

import { Flame, Trophy } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakTracker({ currentStreak, longestStreak }: StreakTrackerProps) {
  const isOnFire = currentStreak >= 3;

  return (
    <div className="rounded-[12px] bg-[var(--background-secondary)] p-4">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">Serien</h3>

      <div className="mt-4 flex gap-4">
        {/* Current Streak */}
        <div className="flex-1">
          <div className={`flex items-center justify-center rounded-[12px] py-6 ${
            isOnFire
              ? 'bg-[var(--system-orange)]/15'
              : 'bg-[var(--fill-tertiary)]'
          }`}>
            <div className="text-center">
              <div className={`flex items-center justify-center gap-1 ${
                isOnFire ? 'text-[var(--system-orange)]' : 'text-[var(--foreground-tertiary)]'
              }`}>
                <Flame size={24} />
              </div>
              <p className={`mt-1 text-3xl font-bold ${
                isOnFire ? 'text-[var(--system-orange)]' : 'text-[var(--foreground)]'
              }`}>
                {currentStreak}
              </p>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                Aktuelle Serie
              </p>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex-1">
          <div className="flex items-center justify-center rounded-[12px] bg-[var(--system-yellow)]/15 py-6">
            <div className="text-center">
              <div className="flex items-center justify-center text-[var(--system-yellow)]">
                <Trophy size={24} />
              </div>
              <p className="mt-1 text-3xl font-bold text-[var(--foreground)]">
                {longestStreak}
              </p>
              <p className="text-xs text-[var(--foreground-tertiary)]">
                Rekord
              </p>
            </div>
          </div>
        </div>
      </div>

      {isOnFire && (
        <p className="mt-3 text-center text-sm text-[var(--system-orange)]">
          Du bist auf einer heißen Serie!
        </p>
      )}
    </div>
  );
}
