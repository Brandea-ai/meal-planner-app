'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getDeviceId } from '@/lib/supabase';
import { UserProgress, UserPreferences } from '@/types';

const defaultPreferences: UserPreferences = {
  prepTimePreference: 'normal',
  mealPrepEnabled: false,
  dietaryRestrictions: [],
  servings: 2,
};

const defaultProgress: UserProgress = {
  completedDays: [],
  currentDay: 1,
  startDate: null,
  preferences: defaultPreferences,
  shoppingListChecked: [],
};

export function useCloudSync(): [UserProgress, (value: UserProgress | ((prev: UserProgress) => UserProgress)) => void, boolean, string | null] {
  const [progress, setProgressState] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const deviceIdRef = useRef<string>('');
  const isSyncing = useRef(false);

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      // Get device ID
      deviceIdRef.current = getDeviceId();
      if (!deviceIdRef.current) {
        setIsLoaded(true);
        return;
      }

      // First, load from localStorage for instant UI
      try {
        const localData = localStorage.getItem('meal-planner-progress');
        if (localData) {
          setProgressState(JSON.parse(localData));
        }
      } catch (e) {
        console.warn('Failed to load from localStorage:', e);
      }

      // Then, fetch from Supabase
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('device_id', deviceIdRef.current)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows found (first time user)
          console.warn('Supabase fetch error:', error);
        }

        if (data) {
          const cloudProgress: UserProgress = {
            completedDays: data.completed_days || [],
            currentDay: data.current_day || 1,
            startDate: data.start_date,
            preferences: data.preferences || defaultPreferences,
            shoppingListChecked: data.shopping_list_checked || [],
          };
          setProgressState(cloudProgress);
          // Update localStorage with cloud data
          localStorage.setItem('meal-planner-progress', JSON.stringify(cloudProgress));
          setSyncStatus('synced');
        }
      } catch (e) {
        console.warn('Failed to fetch from Supabase:', e);
        setSyncStatus('offline');
      }

      setIsLoaded(true);
    }

    loadData();
  }, []);

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

      // Sync to cloud (debounced by nature of async)
      syncToCloud(newProgress);

      return newProgress;
    });
  }, [syncToCloud]);

  return [progress, setProgress, isLoaded, syncStatus];
}
