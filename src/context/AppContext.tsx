'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useCloudSync } from '@/hooks/useCloudSync';
import { UserProgress, UserPreferences } from '@/types';

const defaultPreferences: UserPreferences = {
  prepTimePreference: 'normal',
  mealPrepEnabled: false,
  dietaryRestrictions: [],
  servings: 2,
  shoppingListFilter: 'all',
  autoSyncShoppingFilter: true,
};

interface AppContextType {
  progress: UserProgress;
  isLoaded: boolean;
  syncStatus: string | null;
  deviceId: string;
  completeDay: (day: number) => void;
  uncompleteDay: (day: number) => void;
  setCurrentDay: (day: number) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleShoppingItem: (itemName: string) => void;
  resetProgress: () => void;
  startPlan: () => void;
  getCompletionPercentage: () => number;
  switchDevice: (deviceId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { progress, setProgress, isLoaded, syncStatus, switchDevice, deviceId } = useCloudSync();

  const completeDay = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      completedDays: prev.completedDays.includes(day)
        ? prev.completedDays
        : [...prev.completedDays, day].sort((a, b) => a - b),
      currentDay: day < 7 ? day + 1 : day,
    }));
  }, [setProgress]);

  const uncompleteDay = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      completedDays: prev.completedDays.filter((d) => d !== day),
    }));
  }, [setProgress]);

  const setCurrentDay = useCallback((day: number) => {
    setProgress((prev) => ({
      ...prev,
      currentDay: day,
    }));
  }, [setProgress]);

  const updatePreferences = useCallback((prefs: Partial<UserPreferences>) => {
    setProgress((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs },
    }));
  }, [setProgress]);

  const toggleShoppingItem = useCallback((itemName: string) => {
    setProgress((prev) => ({
      ...prev,
      shoppingListChecked: prev.shoppingListChecked.includes(itemName)
        ? prev.shoppingListChecked.filter((name) => name !== itemName)
        : [...prev.shoppingListChecked, itemName],
    }));
  }, [setProgress]);

  const resetProgress = useCallback(() => {
    setProgress({
      completedDays: [],
      currentDay: 1,
      startDate: null,
      preferences: defaultPreferences,
      shoppingListChecked: [],
    });
  }, [setProgress]);

  const startPlan = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      startDate: prev.startDate || new Date().toISOString(),
      currentDay: 1,
    }));
  }, [setProgress]);

  const getCompletionPercentage = useCallback(() => {
    return Math.round((progress.completedDays.length / 7) * 100);
  }, [progress.completedDays.length]);

  const value = useMemo(() => ({
    progress,
    isLoaded,
    syncStatus,
    deviceId,
    completeDay,
    uncompleteDay,
    setCurrentDay,
    updatePreferences,
    toggleShoppingItem,
    resetProgress,
    startPlan,
    getCompletionPercentage,
    switchDevice,
  }), [progress, isLoaded, syncStatus, deviceId, completeDay, uncompleteDay, setCurrentDay, updatePreferences, toggleShoppingItem, resetProgress, startPlan, getCompletionPercentage, switchDevice]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
