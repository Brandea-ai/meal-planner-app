'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { meals } from '@/data/meals';
import { MealCard } from './MealCard';
import { DaySelector } from './DaySelector';
import { ShoppingList } from './ShoppingList';
import { Settings } from './Settings';
import { Navigation } from './Navigation';

export function MealPlanApp() {
  const { progress, isLoaded, startPlan } = useApp();
  const [activeTab, setActiveTab] = useState<'plan' | 'shopping' | 'settings'>('plan');
  const [selectedDay, setSelectedDay] = useState(1);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const hasStarted = useRef(false);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Initialize selected day and start plan after load
  useEffect(() => {
    if (!isLoaded) return;

    if (!hasInitialized.current && progress.currentDay) {
      hasInitialized.current = true;
      setSelectedDay(progress.currentDay);
    }

    if (!hasStarted.current && !progress.startDate) {
      hasStarted.current = true;
      startPlan();
    }
  }, [isLoaded, progress.currentDay, progress.startDate, startPlan]);

  const handleSwipe = useCallback((startX: number, endX: number) => {
    const distance = startX - endX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (activeTab === 'plan') {
      if (isLeftSwipe) {
        setSelectedDay((prev) => Math.min(prev + 1, 7));
      }
      if (isRightSwipe) {
        setSelectedDay((prev) => Math.max(prev - 1, 1));
      }
    }
  }, [activeTab]);

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
          setSelectedDay((prev) => Math.min(prev + 1, 7));
        }
        if (e.key === 'ArrowLeft') {
          setSelectedDay((prev) => Math.max(prev - 1, 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  const selectedMeal = useMemo(() =>
    meals.find((m) => m.day === selectedDay),
    [selectedDay]
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
        <div className="mx-auto max-w-lg px-4 py-4">
          <h1 className="text-center text-xl font-bold text-gray-900 dark:text-white">
            Frühstücksplan
          </h1>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Albanisch • Deutsch • Französisch
          </p>
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
            <DaySelector selectedDay={selectedDay} onDaySelect={setSelectedDay} />

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
