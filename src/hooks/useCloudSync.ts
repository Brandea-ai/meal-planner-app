'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getDeviceId, setDeviceId } from '@/lib/supabase';
import { UserProgress, UserPreferences } from '@/types';

const defaultPreferences: UserPreferences = {
  prepTimePreference: 'normal',
  mealPrepEnabled: false,
  dietaryRestrictions: [],
  servings: 3, // Default: 3 Personen
  shoppingListFilter: 'all',
  autoSyncShoppingFilter: true,
};

const defaultProgress: UserProgress = {
  completedDays: [],
  currentDay: 1,
  startDate: null,
  preferences: defaultPreferences,
  shoppingListChecked: [],
  ingredientCustomizations: [],
  mealNotes: [],
  customShoppingItems: [],
};

interface CloudSyncReturn {
  progress: UserProgress;
  setProgress: (value: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  isLoaded: boolean;
  syncStatus: string | null;
  switchDevice: (newDeviceId: string) => Promise<void>;
  deviceId: string;
}

export function useCloudSync(): CloudSyncReturn {
  const [progress, setProgressState] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const deviceIdRef = useRef<string>('');
  const isSyncing = useRef(false);

  // Load data function
  const loadData = useCallback(async (deviceId: string) => {
    if (!deviceId) return;

    deviceIdRef.current = deviceId;
    setCurrentDeviceId(deviceId);
    setSyncStatus('syncing');

    // Fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('device_id', deviceId)
        .maybeSingle(); // Use maybeSingle to avoid 406 error when no row exists

      if (error) {
        console.warn('Supabase fetch error:', error);
        setSyncStatus('error');
      }

      if (data) {
        const cloudProgress: UserProgress = {
          completedDays: data.completed_days || [],
          currentDay: data.current_day || 1,
          startDate: data.start_date,
          preferences: { ...defaultPreferences, ...data.preferences },
          shoppingListChecked: data.shopping_list_checked || [],
          ingredientCustomizations: data.ingredient_customizations || [],
          mealNotes: data.meal_notes || [],
          customShoppingItems: data.custom_shopping_items || [],
        };
        setProgressState(cloudProgress);
        localStorage.setItem('meal-planner-progress', JSON.stringify(cloudProgress));
        setSyncStatus('synced');
      } else {
        // No data found for this device, use defaults
        setProgressState(defaultProgress);
        setSyncStatus('synced');
      }
    } catch (e) {
      console.warn('Failed to fetch from Supabase:', e);
      setSyncStatus('offline');

      // Try to load from localStorage as fallback
      try {
        const localData = localStorage.getItem('meal-planner-progress');
        if (localData) {
          const parsed = JSON.parse(localData);
          // Ensure new fields exist
          setProgressState({
            ...defaultProgress,
            ...parsed,
            ingredientCustomizations: parsed.ingredientCustomizations || [],
            mealNotes: parsed.mealNotes || [],
            customShoppingItems: parsed.customShoppingItems || [],
          });
        }
      } catch (le) {
        console.warn('Failed to load from localStorage:', le);
      }
    }

    setIsLoaded(true);
  }, []);

  // Initial load
  useEffect(() => {
    const deviceId = getDeviceId();
    loadData(deviceId);
  }, [loadData]);

  // Switch to a different device ID (for QR code sync)
  const switchDevice = useCallback(async (newDeviceId: string) => {
    setIsLoaded(false);
    setDeviceId(newDeviceId);
    await loadData(newDeviceId);
  }, [loadData]);

  // Sync to cloud
  const syncToCloud = useCallback(async (newProgress: UserProgress) => {
    if (!deviceIdRef.current || isSyncing.current) return;

    isSyncing.current = true;
    setSyncStatus('syncing');

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          device_id: deviceIdRef.current,
          completed_days: newProgress.completedDays,
          current_day: newProgress.currentDay,
          start_date: newProgress.startDate,
          shopping_list_checked: newProgress.shoppingListChecked,
          preferences: newProgress.preferences,
          ingredient_customizations: newProgress.ingredientCustomizations,
          meal_notes: newProgress.mealNotes,
          custom_shopping_items: newProgress.customShoppingItems,
        }, {
          onConflict: 'device_id',
        });

      if (error) {
        console.warn('Supabase sync error:', error);
        setSyncStatus('error');
      } else {
        setSyncStatus('synced');
      }
    } catch (e) {
      console.warn('Failed to sync to Supabase:', e);
      setSyncStatus('offline');
    } finally {
      isSyncing.current = false;
    }
  }, []);

  // Set progress with sync
  const setProgress = useCallback((value: UserProgress | ((prev: UserProgress) => UserProgress)) => {
    setProgressState((prev) => {
      const newProgress = value instanceof Function ? value(prev) : value;

      // Save to localStorage immediately
      try {
        localStorage.setItem('meal-planner-progress', JSON.stringify(newProgress));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }

      // Sync to cloud
      syncToCloud(newProgress);

      return newProgress;
    });
  }, [syncToCloud]);

  return {
    progress,
    setProgress,
    isLoaded,
    syncStatus,
    switchDevice,
    deviceId: currentDeviceId,
  };
}
