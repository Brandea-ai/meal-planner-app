'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { breakfastMeals, dinnerMeals, mealTypeLabels } from '@/data/meals';
import { MealType } from '@/types';
import { MealCard } from './MealCard';
import { DaySelector } from './DaySelector';
import { ShoppingList } from './ShoppingList';
import { Settings } from './Settings';
import { Navigation } from './Navigation';

export function MealPlanApp() {
  const { progress, isLoaded, startPlan } = useApp();
  const [activeTab, setActiveTab] = useState<'plan' | 'shopping' | 'settings'>('plan');
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

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/80">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="text-center text-xl font-bold text-gray-900 dark:text-white">
            7-Tage Mahlzeitenplan
          </h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Albanisch - Deutsch - Französisch
          </p>

          {/* Meal Type Toggle */}
          {activeTab === 'plan' && (
            <div className="mt-3 flex justify-center">
              <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                <button
                  onClick={() => setMealType('breakfast')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    mealType === 'breakfast'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {mealTypeLabels.breakfast}
                </button>
                <button
                  onClick={() => setMealType('dinner')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    mealType === 'dinner'
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {mealTypeLabels.dinner}
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main
        ref={contentRef}
        className="mx-auto max-w-lg px-4 py-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {activeTab === 'plan' && (
          <div className="space-y-4">
            <DaySelector selectedDay={displayDay} onDaySelect={setSelectedDay} />

            {/* Swipe hint */}
            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              Wische oder nutze Pfeiltasten zum Navigieren
            </p>

            {selectedMeal && (
              <div className="transition-all duration-300">
                <MealCard meal={selectedMeal} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'shopping' && <ShoppingList />}

        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
