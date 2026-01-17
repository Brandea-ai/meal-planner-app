'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface DaySelectorProps {
  onDaySelect: (day: number) => void;
  selectedDay: number;
}

const dayNames = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export function DaySelector({ onDaySelect, selectedDay }: DaySelectorProps) {
  const { progress } = useApp();
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <nav aria-label="Tagesauswahl" className="w-full">
      {/* Glass Container */}
      <motion.div
        className="glass-card p-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Day Pills */}
        <motion.div
          className="grid grid-cols-7 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {days.map((day, index) => {
            const isCompleted = progress.completedDays.includes(day);
            const isSelected = selectedDay === day;

            return (
              <motion.button
                key={day}
                variants={itemVariants}
                onClick={() => onDaySelect(day)}
                className="relative flex aspect-square flex-col items-center justify-center rounded-[16px]"
                aria-label={`${dayNames[index]}, Tag ${day}${isCompleted ? ', erledigt' : ''}${isSelected ? ', ausgewählt' : ''}`}
                aria-current={isSelected ? 'true' : undefined}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Selected Background */}
                {isSelected && (
                  <motion.div
                    className="absolute inset-0 rounded-[16px] bg-[var(--system-blue)]"
                    layoutId="day-selector-bg"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 35,
                    }}
                    style={{
                      boxShadow: '0 4px 16px rgba(0, 122, 255, 0.35)',
                    }}
                  />
                )}

                {/* Completed Background (when not selected) */}
                {isCompleted && !isSelected && (
                  <div className="absolute inset-0 rounded-[16px] bg-[var(--system-green)]/15" />
                )}

                {/* Default Background (when neither selected nor completed) */}
                {!isSelected && !isCompleted && (
                  <div className="absolute inset-0 rounded-[16px] glass-inner" />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center">
                  <span
                    className={`text-[11px] font-semibold ${
                      isSelected
                        ? 'text-white/80'
                        : isCompleted
                        ? 'text-[var(--system-green)]'
                        : 'text-[var(--foreground-tertiary)]'
                    }`}
                  >
                    {dayNames[index]}
                  </span>
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
                </div>

                {/* Completion Badge */}
                {isCompleted && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full shadow-sm ${
                      isSelected
                        ? 'bg-white text-[var(--system-blue)]'
                        : 'bg-[var(--system-green)] text-white'
                    }`}
                    aria-hidden="true"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Progress Bar */}
        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--fill-tertiary)]"
            role="progressbar"
            aria-valuenow={progress.completedDays.length}
            aria-valuemin={0}
            aria-valuemax={7}
            aria-label={`${progress.completedDays.length} von 7 Tagen abgeschlossen`}
          >
            <motion.div
              className="h-full rounded-full bg-[var(--system-green)]"
              initial={{ width: 0 }}
              animate={{ width: `${(progress.completedDays.length / 7) * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
          <motion.span
            className="text-sm font-semibold text-[var(--foreground-tertiary)]"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {progress.completedDays.length}/7
          </motion.span>
        </div>
      </motion.div>
    </nav>
  );
}
