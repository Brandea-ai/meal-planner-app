'use client';

import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { useCloudSync } from '@/hooks/useCloudSync';
import { UserProgress, UserPreferences, MealType, IngredientCustomization, StoredMealNote, LocalCustomShoppingItem } from '@/types';

const defaultPreferences: UserPreferences = {
  prepTimePreference: 'normal',
  mealPrepEnabled: false,
  dietaryRestrictions: [],
  servings: 3, // Default: 3 Personen
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
  resetSync: () => Promise<void>;
  // New: Ingredient management
  hideIngredient: (mealId: number, mealType: MealType, ingredientName: string) => void;
  showIngredient: (mealId: number, mealType: MealType, ingredientName: string) => void;
  updateIngredientAmount: (mealId: number, mealType: MealType, ingredientName: string, amount: string) => void;
  updateIngredientName: (mealId: number, mealType: MealType, originalName: string, customName: string) => void;
  resetIngredientAmount: (mealId: number, mealType: MealType, ingredientName: string) => void;
  resetIngredientName: (mealId: number, mealType: MealType, ingredientName: string) => void;
  getIngredientCustomization: (mealId: number, mealType: MealType, ingredientName: string) => IngredientCustomization | undefined;
  // New: Notes management
  saveMealNote: (mealId: number, mealType: MealType, note: string) => void;
  getMealNote: (mealId: number, mealType: MealType) => string;
  deleteMealNote: (mealId: number, mealType: MealType) => void;
  // New: Custom shopping items
  addCustomShoppingItem: (item: Omit<LocalCustomShoppingItem, 'id' | 'isChecked'>) => void;
  removeCustomShoppingItem: (id: string) => void;
  toggleCustomShoppingItem: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { progress, setProgress, isLoaded, syncStatus, switchDevice, resetSync, deviceId } = useCloudSync();

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
      ingredientCustomizations: [],
      mealNotes: [],
      customShoppingItems: [],
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

  // ============================================
  // Ingredient Management
  // ============================================

  const hideIngredient = useCallback((mealId: number, mealType: MealType, ingredientName: string) => {
    setProgress((prev) => {
      const existing = prev.ingredientCustomizations.find(
        (c) => c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName
      );

      if (existing) {
        return {
          ...prev,
          ingredientCustomizations: prev.ingredientCustomizations.map((c) =>
            c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName
              ? { ...c, isHidden: true }
              : c
          ),
        };
      }

      return {
        ...prev,
        ingredientCustomizations: [
          ...prev.ingredientCustomizations,
          { mealId, mealType, ingredientName, isHidden: true },
        ],
      };
    });
  }, [setProgress]);

  const showIngredient = useCallback((mealId: number, mealType: MealType, ingredientName: string) => {
    setProgress((prev) => ({
      ...prev,
      ingredientCustomizations: prev.ingredientCustomizations.filter(
        (c) => !(c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName && c.isHidden)
      ),
    }));
  }, [setProgress]);

  const updateIngredientAmount = useCallback((mealId: number, mealType: MealType, ingredientName: string, amount: string) => {
    setProgress((prev) => {
      const existing = prev.ingredientCustomizations.find(
        (c) => c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName
      );

      if (existing) {
        return {
          ...prev,
          ingredientCustomizations: prev.ingredientCustomizations.map((c) =>
            c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName
              ? { ...c, customAmount: amount }
              : c
          ),
        };
      }

      return {
        ...prev,
        ingredientCustomizations: [
          ...prev.ingredientCustomizations,
          { mealId, mealType, ingredientName, customAmount: amount, isHidden: false },
        ],
      };
    });
  }, [setProgress]);

  const updateIngredientName = useCallback((mealId: number, mealType: MealType, originalName: string, customName: string) => {
    setProgress((prev) => {
      const existing = prev.ingredientCustomizations.find(
        (c) => c.mealId === mealId && c.mealType === mealType && c.ingredientName === originalName
      );

      if (existing) {
        return {
          ...prev,
          ingredientCustomizations: prev.ingredientCustomizations.map((c) =>
            c.mealId === mealId && c.mealType === mealType && c.ingredientName === originalName
              ? { ...c, customName }
              : c
          ),
        };
      }

      return {
        ...prev,
        ingredientCustomizations: [
          ...prev.ingredientCustomizations,
          { mealId, mealType, ingredientName: originalName, customName, isHidden: false },
        ],
      };
    });
  }, [setProgress]);

  const resetIngredientAmount = useCallback((mealId: number, mealType: MealType, ingredientName: string) => {
    setProgress((prev) => ({
      ...prev,
      ingredientCustomizations: prev.ingredientCustomizations.map((c) =>
        c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName
          ? { ...c, customAmount: undefined }
          : c
      ).filter((c) => c.customAmount !== undefined || c.customName !== undefined || c.isHidden),
    }));
  }, [setProgress]);

  const resetIngredientName = useCallback((mealId: number, mealType: MealType, ingredientName: string) => {
    setProgress((prev) => ({
      ...prev,
      ingredientCustomizations: prev.ingredientCustomizations.map((c) =>
        c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName
          ? { ...c, customName: undefined }
          : c
      ).filter((c) => c.customAmount !== undefined || c.customName !== undefined || c.isHidden),
    }));
  }, [setProgress]);

  const getIngredientCustomization = useCallback((mealId: number, mealType: MealType, ingredientName: string) => {
    return progress.ingredientCustomizations.find(
      (c) => c.mealId === mealId && c.mealType === mealType && c.ingredientName === ingredientName
    );
  }, [progress.ingredientCustomizations]);

  // ============================================
  // Notes Management
  // ============================================

  const saveMealNote = useCallback((mealId: number, mealType: MealType, note: string) => {
    setProgress((prev) => {
      const existing = prev.mealNotes.find((n) => n.mealId === mealId && n.mealType === mealType);

      if (existing) {
        return {
          ...prev,
          mealNotes: prev.mealNotes.map((n) =>
            n.mealId === mealId && n.mealType === mealType
              ? { ...n, note, updatedAt: new Date().toISOString() }
              : n
          ),
        };
      }

      return {
        ...prev,
        mealNotes: [
          ...prev.mealNotes,
          { mealId, mealType, note, updatedAt: new Date().toISOString() } as StoredMealNote,
        ],
      };
    });
  }, [setProgress]);

  const getMealNote = useCallback((mealId: number, mealType: MealType) => {
    const note = progress.mealNotes.find((n) => n.mealId === mealId && n.mealType === mealType);
    return note?.note || '';
  }, [progress.mealNotes]);

  const deleteMealNote = useCallback((mealId: number, mealType: MealType) => {
    setProgress((prev) => ({
      ...prev,
      mealNotes: prev.mealNotes.filter((n) => !(n.mealId === mealId && n.mealType === mealType)),
    }));
  }, [setProgress]);

  // ============================================
  // Custom Shopping Items Management
  // ============================================

  const addCustomShoppingItem = useCallback((item: Omit<LocalCustomShoppingItem, 'id' | 'isChecked'>) => {
    setProgress((prev) => ({
      ...prev,
      customShoppingItems: [
        ...prev.customShoppingItems,
        {
          ...item,
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          isChecked: false,
        },
      ],
    }));
  }, [setProgress]);

  const removeCustomShoppingItem = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      customShoppingItems: prev.customShoppingItems.filter((item) => item.id !== id),
    }));
  }, [setProgress]);

  const toggleCustomShoppingItem = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      customShoppingItems: prev.customShoppingItems.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      ),
    }));
  }, [setProgress]);

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
    resetSync,
    hideIngredient,
    showIngredient,
    updateIngredientAmount,
    updateIngredientName,
    resetIngredientAmount,
    resetIngredientName,
    getIngredientCustomization,
    saveMealNote,
    getMealNote,
    deleteMealNote,
    addCustomShoppingItem,
    removeCustomShoppingItem,
    toggleCustomShoppingItem,
  }), [
    progress, isLoaded, syncStatus, deviceId, completeDay, uncompleteDay, setCurrentDay,
    updatePreferences, toggleShoppingItem, resetProgress, startPlan, getCompletionPercentage,
    switchDevice, resetSync, hideIngredient, showIngredient, updateIngredientAmount, updateIngredientName,
    resetIngredientAmount, resetIngredientName, getIngredientCustomization, saveMealNote, getMealNote, deleteMealNote,
    addCustomShoppingItem, removeCustomShoppingItem, toggleCustomShoppingItem,
  ]);

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
