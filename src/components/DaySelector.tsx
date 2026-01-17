'use client';

import { Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface DaySelectorProps {
  onDaySelect: (day: number) => void;
  selectedDay: number;
}

export function DaySelector({ onDaySelect, selectedDay }: DaySelectorProps) {
  const { progress } = useApp();
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <nav aria-label="Tagesauswahl" className="w-full">
      <div className="flex justify-between gap-1.5">
        {days.map((day) => {
          const isCompleted = progress.completedDays.includes(day);
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => onDaySelect(day)}
              className={`relative flex min-h-[56px] min-w-[44px] flex-1 flex-col items-center justify-center rounded-[12px] text-sm font-medium transition-none active:opacity-80 ${
                isSelected
                  ? 'bg-[var(--system-blue)] text-white'
                  : isCompleted
                  ? 'bg-[var(--system-green)]/15 text-[var(--system-green)]'
                  : 'bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)]'
              }`}
              aria-label={`Tag ${day}${isCompleted ? ', erledigt' : ''}${isSelected ? ', ausgewählt' : ''}`}
              aria-current={isSelected ? 'true' : undefined}
            >
              <span className={`text-[10px] ${isSelected ? 'opacity-80' : 'opacity-60'}`}>
                Tag
              </span>
              <span className="text-lg font-semibold">{day}</span>
              {isCompleted && !isSelected && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--system-green)]"
                  aria-hidden="true"
                >
                  <Check size={12} strokeWidth={3} className="text-white" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
