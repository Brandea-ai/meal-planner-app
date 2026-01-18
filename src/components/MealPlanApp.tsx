'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { breakfastMeals, dinnerMeals, mealTypeLabels } from '@/data/meals';
import { MealType } from '@/types';
import { MealCard } from './MealCard';
import { DaySelector } from './DaySelector';
import { ShoppingList } from './ShoppingList';
import { Settings } from './Settings';
import { Navigation } from './Navigation';
import { Statistics } from './statistics/Statistics';
import { Chat } from './Chat';

/**
 * Prep Time Thresholds (evidenzbasiert)
 *
 * Basiert auf Zeitmanagement-Forschung:
 * - "Quick": ≤12 Min - Passt in kurze Pausen, minimaler Aufwand
 * - "Normal": ≤25 Min - Standard-Kochzeit für Alltagsgerichte
 * - "Extended": Keine Grenze - Für Wochenenden oder wenn Zeit vorhanden
 *
 * Quellen: Time-use studies, Home cooking behavior research
 */
const PREP_TIME_LIMITS = {
  quick: 12,
  normal: 25,
  extended: Infinity,
};

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: {
      duration: 0.15,
      ease: 'easeOut' as const,
    },
  },
};

// Header variants
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
};

export function MealPlanApp() {
  const { progress, isLoaded, startPlan } = useApp();
  const [activeTab, setActiveTab] = useState<'plan' | 'shopping' | 'chat' | 'statistics' | 'settings'>('plan');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasStarted = useRef(false);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Derive the display day - use selectedDay if set, otherwise use progress.currentDay
  const displayDay = selectedDay ?? progress.currentDay ?? 1;

  // Get meals based on type
  const currentMeals = mealType === 'breakfast' ? breakfastMeals : dinnerMeals;

  // Start plan on first load (only once)
  useEffect(() => {
    if (!isLoaded) return;

    if (!hasStarted.current && !progress.startDate) {
      hasStarted.current = true;
      startPlan();
    }
  }, [isLoaded, progress.startDate, startPlan]);

  const handleSwipe = useCallback((startX: number, endX: number) => {
    const distance = startX - endX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (activeTab === 'plan') {
      if (isLeftSwipe) {
        setSelectedDay((prev) => Math.min((prev ?? displayDay) + 1, 7));
      }
      if (isRightSwipe) {
        setSelectedDay((prev) => Math.max((prev ?? displayDay) - 1, 1));
      }
    }
  }, [activeTab, displayDay]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;
    const endX = e.changedTouches[0].clientX;
    handleSwipe(touchStart, endX);
    setTouchStart(null);
  }, [touchStart, handleSwipe]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab === 'plan') {
        if (e.key === 'ArrowRight') {
          setSelectedDay((prev) => Math.min((prev ?? displayDay) + 1, 7));
        }
        if (e.key === 'ArrowLeft') {
          setSelectedDay((prev) => Math.max((prev ?? displayDay) - 1, 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, displayDay]);

  const selectedMeal = useMemo(() =>
    currentMeals.find((m) => m.day === displayDay),
    [currentMeals, displayDay]
  );

  // Check if meal exceeds user's time preference
  const timePreference = progress.preferences.prepTimePreference;
  const timeLimit = PREP_TIME_LIMITS[timePreference];
  const mealExceedsTimeLimit = selectedMeal && selectedMeal.prepTime > timeLimit;

  // Get suggested alternative (fastest meal of same type that's not completed)
  const fastestAlternative = useMemo(() => {
    if (!mealExceedsTimeLimit || !selectedMeal) return null;

    return currentMeals
      .filter((m) => m.day !== selectedMeal.day && !progress.completedDays.includes(m.day))
      .sort((a, b) => a.prepTime - b.prepTime)
      .find((m) => m.prepTime <= timeLimit);
  }, [currentMeals, selectedMeal, mealExceedsTimeLimit, progress.completedDays, timeLimit]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <motion.div
          className="h-10 w-10 rounded-full border-4 border-[var(--system-blue)] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  // Chat is fullscreen - no header, no navigation
  const isChatFullscreen = activeTab === 'chat';

  return (
    <div className={`min-h-screen bg-[var(--background)] ${isChatFullscreen ? '' : 'pb-20'}`}>
      {/* Header - hidden in chat mode */}
      <AnimatePresence>
        {!isChatFullscreen && (
          <motion.header
            className="glass-header sticky top-0 z-40"
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mx-auto max-w-lg px-4 py-3">
              <h1 className="text-center text-lg font-semibold text-[var(--foreground)]">
                7-Tage Mahlzeitenplan
              </h1>
              <p className="text-center text-xs text-[var(--foreground-tertiary)]">
                Albanisch · Deutsch · Französisch
              </p>

              {/* Meal Type Toggle - Segmented Control */}
              <AnimatePresence mode="wait">
                {activeTab === 'plan' && (
                  <motion.div
                    className="mt-3"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="relative flex rounded-[12px] bg-[var(--fill-tertiary)] p-1">
                      {/* Sliding indicator */}
                      <motion.div
                        className="absolute inset-y-1 rounded-[10px] bg-[var(--background)] shadow-sm"
                        style={{ width: 'calc(50% - 4px)' }}
                        animate={{ x: mealType === 'breakfast' ? 4 : 'calc(100% + 4px)' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                      <button
                        onClick={() => setMealType('breakfast')}
                        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-[10px] px-4 py-2.5 text-sm font-medium transition-colors ${
                          mealType === 'breakfast'
                            ? 'text-[var(--foreground)]'
                            : 'text-[var(--foreground-secondary)]'
                        }`}
                      >
                        <Sun size={16} />
                        {mealTypeLabels.breakfast}
                      </button>
                      <button
                        onClick={() => setMealType('dinner')}
                        className={`relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-[10px] px-4 py-2.5 text-sm font-medium transition-colors ${
                          mealType === 'dinner'
                            ? 'text-[var(--foreground)]'
                            : 'text-[var(--foreground-secondary)]'
                        }`}
                      >
                        <Moon size={16} />
                        {mealTypeLabels.dinner}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {isChatFullscreen ? (
        <Chat onBack={() => setActiveTab('plan')} />
      ) : (
        <main
          ref={contentRef}
          className="mx-auto max-w-lg px-4 py-4"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'plan' && (
              <motion.div
                key="plan"
                className="space-y-4"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <DaySelector selectedDay={displayDay} onDaySelect={setSelectedDay} />

                {/* Time Warning - shown when meal exceeds user's preference */}
                <AnimatePresence>
                  {mealExceedsTimeLimit && selectedMeal && (
                    <motion.div
                      className="glass-card overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                      <div
                        className="flex items-start gap-3 p-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 159, 10, 0.1), rgba(255, 159, 10, 0.05))',
                        }}
                      >
                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-[var(--system-orange)]" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            Dieses Gericht dauert {selectedMeal.prepTime} Min
                          </p>
                          <p className="mt-0.5 text-xs text-[var(--foreground-secondary)]">
                            Deine Einstellung: {timePreference === 'quick' ? 'Schnell (≤12 Min)' : 'Normal (≤25 Min)'}
                          </p>
                          {fastestAlternative && (
                            <motion.button
                              onClick={() => setSelectedDay(fastestAlternative.day)}
                              className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[var(--system-blue)]"
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Clock size={14} />
                              Schnellere Alternative: Tag {fastestAlternative.day} ({fastestAlternative.prepTime} Min)
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {selectedMeal && (
                  <MealCard meal={selectedMeal} />
                )}
              </motion.div>
            )}

            {activeTab === 'shopping' && (
              <motion.div
                key="shopping"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <ShoppingList />
              </motion.div>
            )}

            {activeTab === 'statistics' && (
              <motion.div
                key="statistics"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Statistics />
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Settings />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* Bottom Navigation - hidden in chat mode */}
      {!isChatFullscreen && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}
