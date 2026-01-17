'use client';

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
      <div className="flex justify-between gap-1 sm:gap-2">
        {days.map((day) => {
          const isCompleted = progress.completedDays.includes(day);
          const isSelected = selectedDay === day;

          return (
            <button
              key={day}
              onClick={() => onDaySelect(day)}
              className={`relative flex h-12 w-12 flex-col items-center justify-center rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:h-14 sm:w-14 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : isCompleted
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              aria-label={`Tag ${day}${isCompleted ? ', erledigt' : ''}${isSelected ? ', ausgewählt' : ''}`}
              aria-current={isSelected ? 'true' : undefined}
            >
              <span className="text-xs opacity-70">Tag</span>
              <span className="text-lg font-bold">{day}</span>
              {isCompleted && !isSelected && (
                <span
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white"
                  aria-hidden="true"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
