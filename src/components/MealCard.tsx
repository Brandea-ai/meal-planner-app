'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Globe, ChefHat, Sparkles, ListChecks, Heart } from 'lucide-react';
import { Meal, MealType } from '@/types';
import { useApp } from '@/context/AppContext';
import { getServingsLabel } from '@/utils/portionScaling';
import { MealNoteEditor } from './MealNoteEditor';
import { PreparationChecklist } from './PreparationChecklist';
import confetti from 'canvas-confetti';

interface MealCardProps {
  meal: Meal;
}

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

export function MealCard({ meal }: MealCardProps) {
  const {
    progress,
    completeDay,
    uncompleteDay,
    saveMealNote,
    getMealNote,
  } = useApp();

  const isCompleted = progress.completedDays.includes(meal.day);
  const servings = progress.preferences.servings;
  const [isPreparationOpen, setIsPreparationOpen] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const mealType = meal.type as MealType;

  // Riesen Feuerwerk Animation
  const triggerFireworks = useCallback(() => {
    const duration = 4000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 100 * (timeLeft / duration);

      // Feuerwerk von verschiedenen Positionen
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FF69B4', '#FF1493', '#FFD700', '#FF6347', '#00CED1', '#9400D3'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#FF69B4', '#FF1493', '#FFD700', '#FF6347', '#00CED1', '#9400D3'],
      });
    }, 250);

    // Extra große Herzen-Explosion in der Mitte
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#FF69B4', '#FF1493', '#E91E63', '#F44336'],
        shapes: ['circle'],
        scalar: 1.5,
      });
    }, 500);
  }, []);

  const handleToggleComplete = () => {
    if (isCompleted) {
      uncompleteDay(meal.day);
    } else {
      completeDay(meal.day);
      // Feuerwerk und Danke-Nachricht anzeigen
      triggerFireworks();
      setShowThankYouMessage(true);
    }
  };

  const handleSaveNote = (note: string) => {
    saveMealNote(meal.id, mealType, note);
  };

  const currentNote = getMealNote(meal.id, mealType);
  const hasPreparationSteps = meal.preparationSteps && meal.preparationSteps.length > 0;

  return (
    <>
      <motion.article
        variants={cardVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`glass-card overflow-hidden ${
          isCompleted ? 'ring-2 ring-[var(--system-green)]/50' : ''
        }`}
        aria-label={`Tag ${meal.day}: ${meal.title}`}
      >
        {/* Completed Overlay */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[var(--system-green)]/8 pointer-events-none z-0"
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <header className="relative z-10 p-5 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <motion.span
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-tertiary)]"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Tag {meal.day} · {getServingsLabel(servings)}
              </motion.span>
              <motion.h2
                className="mt-1 text-2xl font-bold text-[var(--foreground)]"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {meal.title}
              </motion.h2>
              <motion.p
                className="mt-1 text-sm text-[var(--foreground-secondary)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {meal.subtitle}
              </motion.p>
            </div>
            <motion.div
              className="glass-inner flex items-center gap-1.5 px-3 py-1.5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              whileHover={{ scale: 1.05 }}
            >
              <Clock size={14} className="text-[var(--system-orange)]" />
              <span className="text-xs font-semibold text-[var(--system-orange)]">
                {meal.prepTime} Min
              </span>
            </motion.div>
          </div>

          {/* Cultural Tags */}
          <motion.div
            className="mt-4 flex flex-wrap gap-2"
            role="list"
            aria-label="Kulturelle Einflüsse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {meal.culturalOrigin.map((origin, index) => (
              <motion.span
                key={origin}
                role="listitem"
                className="glass-inner flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--system-blue)]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 + index * 0.05 }}
              >
                <Globe size={10} />
                {origin}
              </motion.span>
            ))}
          </motion.div>
        </header>

        {/* Preparation Button */}
        {hasPreparationSteps && (
          <section className="relative z-10 px-5 pb-4">
            <motion.button
              onClick={() => setIsPreparationOpen(true)}
              className="flex w-full items-center justify-between rounded-[16px] bg-[var(--system-green)]/10 px-4 py-4 transition-colors hover:bg-[var(--system-green)]/15"
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-green)]/20">
                  <ListChecks size={20} className="text-[var(--system-green)]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[var(--foreground)]">Zubereitung</p>
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    {meal.preparationSteps?.length} Schritte · Schritt-für-Schritt
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--system-green)] text-white">
                <ChefHat size={16} />
              </div>
            </motion.button>
          </section>
        )}

        {/* Protein Options */}
        {meal.proteinOptions && meal.proteinOptions.length > 0 && (
          <section className="relative z-10 border-t border-[var(--glass-border)] px-5 py-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--system-purple)]/15">
                <ChefHat size={12} className="text-[var(--system-purple)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--foreground)]">Protein-Optionen</span>
            </div>
            <p className="text-sm text-[var(--foreground-secondary)] pl-8">
              {meal.proteinOptions.join(' / ')}
            </p>
          </section>
        )}

        {/* Benefit */}
        <section className="relative z-10 border-t border-[var(--glass-border)] bg-[var(--vibrancy-thin)] px-5 py-4">
          <div className="flex items-start gap-2.5">
            <motion.div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--system-yellow)]/20"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles size={12} className="text-[var(--system-yellow)]" />
            </motion.div>
            <p className="text-sm text-[var(--foreground-secondary)] flex-1">
              {meal.benefit}
            </p>
          </div>
        </section>

        {/* Tags */}
        <section className="relative z-10 px-5 py-4" aria-label="Tags">
          <div className="flex flex-wrap gap-2">
            {meal.tags.map((tag, index) => (
              <motion.span
                key={tag}
                className="glass-inner px-2.5 py-1 text-xs font-medium text-[var(--foreground-secondary)]"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
              >
                #{tag}
              </motion.span>
            ))}
          </div>
        </section>

        {/* Note Section */}
        <section className="relative z-10 border-t border-[var(--glass-border)] px-5 py-4">
          <MealNoteEditor
            mealId={meal.id}
            mealType={meal.type as MealType}
            initialNote={currentNote}
            onSave={handleSaveNote}
          />
        </section>

        {/* Complete Button */}
        <footer className="relative z-10 p-5 pt-0">
          <motion.button
            onClick={handleToggleComplete}
            className={`flex w-full items-center justify-center gap-2.5 rounded-[16px] py-4 font-semibold shadow-sm ${
              isCompleted
                ? 'bg-[var(--system-green)] text-white shadow-glow-green'
                : 'bg-[var(--foreground)] text-[var(--background)]'
            }`}
            aria-pressed={isCompleted}
            whileTap={{ scale: 0.98 }}
            whileHover={{ y: -1 }}
            transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
          >
            <AnimatePresence mode="wait">
              {isCompleted && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  <Check size={18} strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
            {isCompleted ? 'Erledigt' : 'Als erledigt markieren'}
          </motion.button>
        </footer>
      </motion.article>

      {/* Preparation Checklist Popup */}
      {hasPreparationSteps && (
        <PreparationChecklist
          isOpen={isPreparationOpen}
          onClose={() => setIsPreparationOpen(false)}
          mealTitle={meal.title}
          steps={meal.preparationSteps || []}
          mealId={meal.id}
        />
      )}

      {/* Thank You Love Message */}
      <AnimatePresence>
        {showThankYouMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
            onClick={() => setShowThankYouMessage(false)}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
              className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-8 rounded-[32px] mx-6 text-center shadow-2xl max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated Hearts */}
              <div className="relative mb-4">
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-7xl"
                >
                  💖
                </motion.div>
                <motion.div
                  animate={{ y: [-5, 5, -5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-2 -left-2 text-3xl"
                >
                  ✨
                </motion.div>
                <motion.div
                  animate={{ y: [5, -5, 5], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-2 -right-2 text-3xl"
                >
                  ✨
                </motion.div>
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold text-white mb-3"
              >
                Danke für das Essen!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/95 text-lg mb-2"
              >
                Du bist die beste und
              </motion.p>

              <motion.p
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 300 }}
                className="text-white text-xl font-bold mb-4"
              >
                schönste Frau der Welt! 👑
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex justify-center gap-2 mb-5"
              >
                {['❤️', '💕', '💖', '💗', '💝'].map((heart, i) => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 0.5, delay: i * 0.1, repeat: Infinity, repeatDelay: 1 }}
                    className="text-2xl"
                  >
                    {heart}
                  </motion.span>
                ))}
              </motion.div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={() => setShowThankYouMessage(false)}
                className="bg-white text-pink-500 font-bold py-3 px-8 rounded-full flex items-center gap-2 mx-auto shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart size={20} fill="currentColor" />
                Ich liebe dich auch!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
