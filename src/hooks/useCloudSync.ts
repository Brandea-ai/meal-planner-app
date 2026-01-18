'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getDeviceId, setDeviceId, resetDeviceId } from '@/lib/supabase';
import { UserProgress, UserPreferences } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';

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
  customMealIngredients: [],
  pendingChanges: [],
};

interface CloudSyncReturn {
  progress: UserProgress;
  setProgress: (value: UserProgress | ((prev: UserProgress) => UserProgress)) => void;
  isLoaded: boolean;
  syncStatus: string | null;
  switchDevice: (newDeviceId: string) => Promise<void>;
  resetSync: () => Promise<void>;
  deviceId: string;
}

export function useCloudSync(): CloudSyncReturn {
  const [progress, setProgressState] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [currentDeviceId, setCurrentDeviceId] = useState('');
  const deviceIdRef = useRef<string>('');
  const isSyncing = useRef(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastSyncTimestamp = useRef<number>(0);

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
          customMealIngredients: data.custom_meal_ingredients || [],
          pendingChanges: data.pending_changes || [],
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

  // Parse realtime payload to UserProgress
  const parseRealtimeData = useCallback((data: Record<string, unknown>): UserProgress => {
    return {
      completedDays: (data.completed_days as number[]) || [],
      currentDay: (data.current_day as number) || 1,
      startDate: data.start_date as string | null,
      preferences: { ...defaultPreferences, ...(data.preferences as Partial<UserPreferences>) },
      shoppingListChecked: (data.shopping_list_checked as string[]) || [],
      ingredientCustomizations: (data.ingredient_customizations as UserProgress['ingredientCustomizations']) || [],
      mealNotes: (data.meal_notes as UserProgress['mealNotes']) || [],
      customShoppingItems: (data.custom_shopping_items as UserProgress['customShoppingItems']) || [],
      customMealIngredients: (data.custom_meal_ingredients as UserProgress['customMealIngredients']) || [],
      pendingChanges: (data.pending_changes as UserProgress['pendingChanges']) || [],
    };
  }, []);

  // Setup realtime subscription
  const setupRealtimeSubscription = useCallback((deviceId: string) => {
    // Cleanup existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!deviceId) return;

    // Create new subscription channel
    const channel = supabase
      .channel(`user_progress_${deviceId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'user_progress',
          filter: `device_id=eq.${deviceId}`,
        },
        (payload) => {
          // Ignore our own updates (within 2 seconds)
          const now = Date.now();
          if (now - lastSyncTimestamp.current < 2000) {
            return;
          }

          if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
            const newData = payload.new as Record<string, unknown>;
            const cloudProgress = parseRealtimeData(newData);

            setProgressState(cloudProgress);
            localStorage.setItem('meal-planner-progress', JSON.stringify(cloudProgress));
            setSyncStatus('synced');
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Realtime subscription active for device:', deviceId.slice(0, 8));
        }
      });

    channelRef.current = channel;
  }, [parseRealtimeData]);

  // Initial load
  useEffect(() => {
    const deviceId = getDeviceId();
    loadData(deviceId);
  }, [loadData]);

  // Setup realtime when deviceId changes
  useEffect(() => {
    if (currentDeviceId) {
      setupRealtimeSubscription(currentDeviceId);
    }

    // Cleanup on unmount or deviceId change
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [currentDeviceId, setupRealtimeSubscription]);

  // Switch to a different device ID (for QR code sync)
  const switchDevice = useCallback(async (newDeviceId: string) => {
    setIsLoaded(false);
    setDeviceId(newDeviceId);
    await loadData(newDeviceId);
  }, [loadData]);

  // Reset sync (generate new device ID and start fresh)
  const resetSync = useCallback(async () => {
    setIsLoaded(false);
    const newDeviceId = resetDeviceId();
    setProgressState(defaultProgress);
    localStorage.removeItem('meal-planner-progress');
    await loadData(newDeviceId);
  }, [loadData]);

  // Sync to cloud
  const syncToCloud = useCallback(async (newProgress: UserProgress) => {
    if (!deviceIdRef.current || isSyncing.current) return;

    isSyncing.current = true;
    setSyncStatus('syncing');

    // Mark timestamp to ignore our own realtime updates
    lastSyncTimestamp.current = Date.now();

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
          updated_at: new Date().toISOString(), // Track last update time
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
    resetSync,
    deviceId: currentDeviceId,
  };
}
