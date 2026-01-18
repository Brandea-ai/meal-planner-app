'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AppNotification, NotificationType } from '@/components/InAppNotification';

// Auto-dismiss time in ms
const AUTO_DISMISS_TIME = 5000;

export function useNotification() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const callAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Message notification sound (using Web Audio API for a simple beep)
      audioRef.current = new Audio();
      // We'll use a data URI for a simple notification sound
      audioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleUgSL5fO6KVzJQVMrODkjEMRMqbh5oM9DTC25OZ9Ow0xvOTlfzwPML/k5H49EC+/5OJ+PhEvvuTifT8RL7/k4n0+ES+/5ON9PhEvv+TjfT4RL7/k4309ES+/5OR9PhEvv+TkfT4RL7/k5H0+ES+/5OR9PhEvv+TkfT4RL7/k5H0+ES+/5OR9PhEvv+TkfT4RL7/k5H0+ES+/5OR9PhEvv+TkfT4RL8Dk5H0+ES/A5OR9PhEvwOTkfT4RL8Dk5H0+';
      audioRef.current.volume = 0.5;

      // Call ringtone
      callAudioRef.current = new Audio();
      callAudioRef.current.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleUgSL5fO6KVzJQVMrODkjEMRMqbh5oM9DTC25OZ9Ow0xvOTlfzwPML/k5H49EC+/5OJ+PhEvvuTifT8RL7/k4n0+ES+/5ON9PhEvv+TjfT4RL7/k4309ES+/5OR9PhEvv+TkfT4RL7/k5H0+ES+/5OR9PhEvv+TkfT4RL7/k5H0+ES+/5OR9PhEvv+TkfT4RL7/k5H0+ES+/5OR9PhEvv+TkfT4RL8Dk5H0+ES/A5OR9PhEvwOTkfT4RL8Dk5H0+';
      callAudioRef.current.volume = 0.8;
      callAudioRef.current.loop = true;
    }

    return () => {
      audioRef.current?.pause();
      callAudioRef.current?.pause();
    };
  }, []);

  const showNotification = useCallback((
    type: NotificationType,
    title: string,
    message: string
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification: AppNotification = {
      id,
      type,
      title,
      message,
      timestamp: new Date(),
    };

    setNotifications(prev => [...prev, notification]);

    // Play appropriate sound
    try {
      if (type === 'message') {
        audioRef.current?.play().catch(() => {});
        // Also try to vibrate on mobile
        if ('vibrate' in navigator) {
          navigator.vibrate(200);
        }
      } else if (type === 'call-audio' || type === 'call-video') {
        callAudioRef.current?.play().catch(() => {});
        // Stronger vibration pattern for calls
        if ('vibrate' in navigator) {
          navigator.vibrate([500, 200, 500, 200, 500]);
        }
      }
    } catch {
      // Ignore audio errors
    }

    // Show browser notification if permission granted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: '/icon-192x192.png',
          tag: id,
          requireInteraction: type.startsWith('call'),
        });
      } catch {
        // Ignore notification errors
      }
    }

    // Auto-dismiss after timeout (not for calls)
    if (type === 'message') {
      setTimeout(() => {
        dismissNotification(id);
      }, AUTO_DISMISS_TIME);
    }

    return id;
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const stopCallSound = useCallback(() => {
    if (callAudioRef.current) {
      callAudioRef.current.pause();
      callAudioRef.current.currentTime = 0;
    }
    // Stop vibration
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }, []);

  return {
    notifications,
    showNotification,
    dismissNotification,
    clearAllNotifications,
    stopCallSound,
  };
}
