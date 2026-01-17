'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { breakfastMeals, dinnerMeals, mealTypeLabels } from '@/data/meals';
import { MealType } from '@/types';
import { MealCard } from './MealCard';
import { DaySelector } from './DaySelector';
import { ShoppingList } from './ShoppingList';
import { Settings } from './Settings';
import { Navigation } from './Navigation';
import { Statistics } from './statistics/Statistics';

export function MealPlanApp() {
  const { progress, isLoaded, startPlan, updatePreferences } = useApp();
  const [activeTab, setActiveTab] = useState<'plan' | 'shopping' | 'statistics' | 'settings'>('plan');
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

  // Auto-sync shopping list filter when meal type changes
  useEffect(() => {
    if (progress.preferences.autoSyncShoppingFilter && activeTab === 'plan') {
      updatePreferences({ shoppingListFilter: mealType });
    }
  }, [mealType, progress.preferences.autoSyncShoppingFilter, activeTab, updatePreferences]);

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
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--system-blue)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[var(--separator)] bg-[var(--background)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 py-3">
          <h1 className="text-center text-lg font-semibold text-[var(--foreground)]">
            7-Tage Mahlzeitenplan
          </h1>
          <p className="text-center text-xs text-[var(--foreground-tertiary)]">
            Albanisch · Deutsch · Französisch
          </p>

          {/* Meal Type Toggle - Segmented Control */}
          {activeTab === 'plan' && (
            <div className="mt-3">
              <div className="flex rounded-[10px] bg-[var(--fill-tertiary)] p-0.5">
                <button
                  onClick={() => setMealType('breakfast')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-[8px] px-4 py-2 text-sm font-medium transition-none active:opacity-80 ${
                    mealType === 'breakfast'
                      ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                      : 'text-[var(--foreground-secondary)]'
                  }`}
                >
                  <Sun size={16} />
                  {mealTypeLabels.breakfast}
                </button>
                <button
                  onClick={() => setMealType('dinner')}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-[8px] px-4 py-2 text-sm font-medium transition-none active:opacity-80 ${
                    mealType === 'dinner'
                      ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                      : 'text-[var(--foreground-secondary)]'
                  }`}
                >
                  <Moon size={16} />
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

            {selectedMeal && (
              <MealCard meal={selectedMeal} />
            )}
          </div>
        )}

        {activeTab === 'shopping' && <ShoppingList />}

        {activeTab === 'statistics' && <Statistics />}

        {activeTab === 'settings' && <Settings />}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
