'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, Lightbulb, ChefHat } from 'lucide-react';
import { PreparationStep } from '@/types';

interface PreparationChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  mealTitle: string;
  steps: PreparationStep[];
  mealId: number;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: 50,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const stepVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function PreparationChecklist({ isOpen, onClose, mealTitle, steps, mealId }: PreparationChecklistProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Load completed steps from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`prep-steps-${mealId}`);
    if (saved) {
      setCompletedSteps(JSON.parse(saved));
    }
  }, [mealId]);

  // Save completed steps to localStorage
  useEffect(() => {
    localStorage.setItem(`prep-steps-${mealId}`, JSON.stringify(completedSteps));
  }, [completedSteps, mealId]);

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNumber)
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber]
    );
  };

  const resetSteps = () => {
    setCompletedSteps([]);
  };

  const progress = steps.length > 0 ? (completedSteps.length / steps.length) * 100 : 0;

  if (!steps || steps.length === 0) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-hidden rounded-t-[24px] sm:rounded-[24px] bg-[var(--background)] shadow-xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-[var(--separator)] bg-[var(--background)]/95 backdrop-blur-xl px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-green)]/15">
                    <ChefHat size={20} className="text-[var(--system-green)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">Zubereitung</h2>
                    <p className="text-sm text-[var(--foreground-secondary)]">{mealTitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)]"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[var(--foreground-secondary)]">
                    {completedSteps.length} von {steps.length} Schritten
                  </span>
                  <span className="font-medium text-[var(--system-green)]">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--fill-tertiary)] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--system-green)] to-[var(--system-blue)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring' as const, stiffness: 100, damping: 20 }}
                  />
                </div>
              </div>
            </div>

            {/* Steps List */}
            <div className="overflow-y-auto max-h-[60vh] px-5 py-4">
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {steps.map((step) => {
                  const isCompleted = completedSteps.includes(step.step);

                  return (
                    <motion.div
                      key={step.step}
                      variants={stepVariants}
                      className={`rounded-[16px] border transition-colors ${
                        isCompleted
                          ? 'border-[var(--system-green)]/30 bg-[var(--system-green)]/5'
                          : 'border-[var(--separator)] bg-[var(--background-secondary)]'
                      }`}
                    >
                      <button
                        onClick={() => toggleStep(step.step)}
                        className="w-full p-4 text-left"
                      >
                        <div className="flex items-start gap-3">
                          {/* Checkbox */}
                          <div
                            className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                              isCompleted
                                ? 'border-[var(--system-green)] bg-[var(--system-green)]'
                                : 'border-[var(--gray-2)]'
                            }`}
                          >
                            {isCompleted && <Check size={14} className="text-white" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-medium text-[var(--foreground-tertiary)]">
                                Schritt {step.step}
                              </span>
                              {step.duration && (
                                <span className="flex items-center gap-1 text-xs text-[var(--system-orange)]">
                                  <Clock size={12} />
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            <h3
                              className={`font-semibold mb-1 ${
                                isCompleted
                                  ? 'text-[var(--foreground-secondary)] line-through'
                                  : 'text-[var(--foreground)]'
                              }`}
                            >
                              {step.title}
                            </h3>
                            <p
                              className={`text-sm ${
                                isCompleted
                                  ? 'text-[var(--foreground-tertiary)]'
                                  : 'text-[var(--foreground-secondary)]'
                              }`}
                            >
                              {step.description}
                            </p>

                            {/* Tip */}
                            {step.tip && (
                              <div className="mt-2 flex items-start gap-2 rounded-lg bg-[var(--system-yellow)]/10 p-2">
                                <Lightbulb size={14} className="mt-0.5 flex-shrink-0 text-[var(--system-yellow)]" />
                                <p className="text-xs text-[var(--foreground-secondary)]">{step.tip}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-[var(--separator)] bg-[var(--background)] px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <div className="flex gap-3">
                <button
                  onClick={resetSteps}
                  className="flex-1 rounded-[12px] border border-[var(--separator)] py-3 text-sm font-medium text-[var(--foreground-secondary)]"
                >
                  Zurücksetzen
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 rounded-[12px] bg-[var(--system-green)] py-3 text-sm font-semibold text-white"
                >
                  {progress === 100 ? 'Fertig!' : 'Schließen'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
