'use client';

import { Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface DaySelectorProps {
  onDaySelect: (day: number) => void;
  selectedDay: number;
}

const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export function DaySelector({ onDaySelect, selectedDay }: DaySelectorProps) {
  const { progress } = useApp();
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <nav aria-label="Tagesauswahl" className="w-full">
      {/* Grid layout for equal distribution */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const isCompleted = progress.completedDays.includes(day);
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => onDaySelect(day)}
              className={`relative flex aspect-square flex-col items-center justify-center rounded-[14px] transition-none active:scale-95 active:opacity-90 ${
                isSelected
                  ? 'bg-[var(--system-blue)] shadow-lg shadow-[var(--system-blue)]/30'
                  : isCompleted
                  ? 'bg-[var(--system-green)]/12'
                  : 'bg-[var(--fill-tertiary)]'
              }`}
              aria-label={`${dayNames[index]}, Tag ${day}${isCompleted ? ', erledigt' : ''}${isSelected ? ', ausgewählt' : ''}`}
              aria-current={isSelected ? 'true' : undefined}
            >
              {/* Day name */}
              <span
                className={`text-[11px] font-medium ${
                  isSelected
                    ? 'text-white/70'
                    : isCompleted
                    ? 'text-[var(--system-green)]'
                    : 'text-[var(--foreground-tertiary)]'
                }`}
              >
                {dayNames[index]}
              </span>

              {/* Day number */}
              <span
                className={`text-xl font-bold leading-tight ${
                  isSelected
                    ? 'text-white'
                    : isCompleted
                    ? 'text-[var(--system-green)]'
                    : 'text-[var(--foreground)]'
                }`}
              >
                {day}
              </span>

              {/* Completion badge */}
              {isCompleted && !isSelected && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--system-green)] shadow-sm"
                  aria-hidden="true"
                >
                  <Check size={12} strokeWidth={3} className="text-white" />
                </span>
              )}

              {/* Selected indicator for completed days */}
              {isCompleted && isSelected && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm"
                  aria-hidden="true"
                >
                  <Check size={12} strokeWidth={3} className="text-[var(--system-blue)]" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--fill-secondary)]">
          <div
            className="h-full bg-[var(--system-green)] transition-all duration-500 ease-out"
            style={{ width: `${(progress.completedDays.length / 7) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-[var(--foreground-tertiary)]">
          {progress.completedDays.length}/7
        </span>
      </div>
    </nav>
  );
}
