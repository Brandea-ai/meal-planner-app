'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Globe, ChefHat, Sparkles, ListChecks } from 'lucide-react';
import { Meal, MealType } from '@/types';
import { useApp } from '@/context/AppContext';
import { getServingsLabel } from '@/utils/portionScaling';
import { MealNoteEditor } from './MealNoteEditor';
import { PreparationChecklist } from './PreparationChecklist';

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

  const mealType = meal.type as MealType;

  const handleToggleComplete = () => {
    if (isCompleted) {
      uncompleteDay(meal.day);
    } else {
      completeDay(meal.day);
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
    </>
  );
}
