'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakTracker({ currentStreak, longestStreak }: StreakTrackerProps) {
  const isOnFire = currentStreak >= 3;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
    },
  };

  const flameVariants = {
    idle: { scale: 1 },
    fire: {
      scale: [1, 1.1, 1],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut' as const,
      },
    },
  };

  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <h3 className="text-sm font-semibold text-[var(--foreground)]">Serien</h3>

      <div className="mt-4 flex gap-3">
        {/* Current Streak */}
        <motion.div
          className="flex-1"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <div
            className={`glass-inner flex items-center justify-center rounded-[16px] py-6 ${
              isOnFire ? 'ring-2 ring-[var(--system-orange)]/30' : ''
            }`}
            style={{
              background: isOnFire
                ? 'linear-gradient(135deg, rgba(255, 159, 10, 0.15), rgba(255, 159, 10, 0.05))'
                : undefined,
            }}
          >
            <div className="text-center">
              <motion.div
                className={`flex items-center justify-center gap-1 ${
                  isOnFire ? 'text-[var(--system-orange)]' : 'text-[var(--foreground-tertiary)]'
                }`}
                variants={flameVariants}
                animate={isOnFire ? 'fire' : 'idle'}
              >
                <Flame size={24} />
              </motion.div>
              <motion.p
                className={`mt-1 text-3xl font-bold tabular-nums ${
                  isOnFire ? 'text-[var(--system-orange)]' : 'text-[var(--foreground)]'
                }`}
                key={currentStreak}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {currentStreak}
              </motion.p>
              <p className="text-xs text-[var(--foreground-tertiary)]">Aktuelle Serie</p>
            </div>
          </div>
        </motion.div>

        {/* Longest Streak */}
        <motion.div
          className="flex-1"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <div
            className="glass-inner flex items-center justify-center rounded-[16px] py-6"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.15), rgba(255, 214, 10, 0.05))',
            }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center text-[var(--system-yellow)]">
                <Trophy size={24} />
              </div>
              <motion.p
                className="mt-1 text-3xl font-bold text-[var(--foreground)] tabular-nums"
                key={longestStreak}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                {longestStreak}
              </motion.p>
              <p className="text-xs text-[var(--foreground-tertiary)]">Rekord</p>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOnFire && (
          <motion.p
            className="mt-3 text-center text-sm font-medium text-[var(--system-orange)]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            Du bist auf einer heißen Serie!
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
