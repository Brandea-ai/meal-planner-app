'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Clock, Lightbulb, ChefHat, AlertTriangle, Heart } from 'lucide-react';
import { PreparationStep } from '@/types';
import confetti from 'canvas-confetti';

interface PreparationChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  mealTitle: string;
  steps: PreparationStep[];
  mealId: number;
}

// Süße Liebes-Nachrichten für die Zubereitung
const loveMessages = [
  { message: "Danke mein Bebuliki! 💕", emoji: "👨‍🍳" },
  { message: "Danke mein Schatz! 💖", emoji: "💝" },
  { message: "Du bist die Beste! 🌟", emoji: "⭐" },
  { message: "Ich liebe dich! ❤️", emoji: "💕" },
  { message: "Du kochst so toll! 👩‍🍳", emoji: "🍳" },
  { message: "Mein Liebling, danke! 💗", emoji: "😘" },
  { message: "Du bist wunderbar! ✨", emoji: "🌈" },
  { message: "Beste Köchin der Welt! 🏆", emoji: "👑" },
];

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
  const [showLoveMessage, setShowLoveMessage] = useState(false);
  const [currentLoveMessage, setCurrentLoveMessage] = useState(loveMessages[0]);

  // Mini confetti for completing a step
  const triggerStepConfetti = useCallback(() => {
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { x: 0.5, y: 0.6 },
      colors: ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB'],
      ticks: 60,
      gravity: 1.2,
      scalar: 0.7,
      disableForReducedMotion: true,
    });
  }, []);

  // Big love confetti for completing all steps
  const triggerLoveConfetti = useCallback(() => {
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#FF69B4', '#FF1493', '#E91E63', '#F44336', '#FFD700'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#FF69B4', '#FF1493', '#E91E63', '#F44336', '#FFD700'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

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
    setCompletedSteps((prev) => {
      const isCurrentlyCompleted = prev.includes(stepNumber);
      const newSteps = isCurrentlyCompleted
        ? prev.filter((s) => s !== stepNumber)
        : [...prev, stepNumber];

      // Check if all steps are now completed
      if (!isCurrentlyCompleted && newSteps.length === steps.length) {
        // All steps completed! Show love message
        const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
        setCurrentLoveMessage(randomMessage);
        setShowLoveMessage(true);
        triggerLoveConfetti();
      } else if (!isCurrentlyCompleted) {
        // Single step completed
        triggerStepConfetti();
      }

      return newSteps;
    });
  };

  const resetSteps = () => {
    setCompletedSteps([]);
    setShowLoveMessage(false);
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

                            {/* Pro-Tip */}
                            {step.tip && (
                              <div className="mt-2 flex items-start gap-2 rounded-lg bg-[var(--system-yellow)]/10 p-2">
                                <Lightbulb size={14} className="mt-0.5 flex-shrink-0 text-[var(--system-yellow)]" />
                                <p className="text-xs text-[var(--foreground-secondary)]">
                                  <span className="font-medium text-[var(--system-yellow)]">Pro-Tipp: </span>
                                  {step.tip}
                                </p>
                              </div>
                            )}

                            {/* Typischer Fehler */}
                            {step.typicalMistake && (
                              <div className="mt-2 flex items-start gap-2 rounded-lg bg-[var(--system-red)]/10 p-2">
                                <AlertTriangle size={14} className="mt-0.5 flex-shrink-0 text-[var(--system-red)]" />
                                <p className="text-xs text-[var(--foreground-secondary)]">
                                  <span className="font-medium text-[var(--system-red)]">Vermeiden: </span>
                                  {step.typicalMistake}
                                </p>
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

            {/* Love Message Popup */}
            <AnimatePresence>
              {showLoveMessage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20"
                  onClick={() => setShowLoveMessage(false)}
                >
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                    className="bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-6 rounded-[24px] mx-6 text-center shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                      className="text-6xl mb-4"
                    >
                      {currentLoveMessage.emoji}
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      {currentLoveMessage.message}
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-white/80 text-sm mb-4"
                    >
                      Alle Schritte fertig! 🎉
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      onClick={() => setShowLoveMessage(false)}
                      className="bg-white text-pink-500 font-semibold py-2.5 px-6 rounded-full flex items-center gap-2 mx-auto"
                      whileTap={{ scale: 0.95 }}
                    >
                      <Heart size={16} fill="currentColor" />
                      Weiter
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
