'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mic, Bell, CheckCircle2, XCircle, Smartphone } from 'lucide-react';

interface PermissionSetupProps {
  onComplete: () => void;
}

type PermissionState = 'pending' | 'granted' | 'denied' | 'unavailable';

interface Permissions {
  camera: PermissionState;
  microphone: PermissionState;
  notifications: PermissionState;
}

export function PermissionSetup({ onComplete }: PermissionSetupProps) {
  const [step, setStep] = useState(0);
  const [permissions, setPermissions] = useState<Permissions>({
    camera: 'pending',
    microphone: 'pending',
    notifications: 'pending',
  });
  const [isRequesting, setIsRequesting] = useState(false);

  // Check if already set up
  useEffect(() => {
    const alreadySetup = localStorage.getItem('meal-planner-permissions-setup');
    if (alreadySetup === 'true') {
      onComplete();
    }
  }, [onComplete]);

  const requestCameraAndMic = async () => {
    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      // Stop tracks immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());

      setPermissions(prev => ({
        ...prev,
        camera: 'granted',
        microphone: 'granted',
      }));
    } catch (error) {
      console.warn('Camera/Mic permission denied:', error);
      // Try audio only
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioStream.getTracks().forEach(track => track.stop());
        setPermissions(prev => ({
          ...prev,
          microphone: 'granted',
          camera: 'denied',
        }));
      } catch {
        setPermissions(prev => ({
          ...prev,
          camera: 'denied',
          microphone: 'denied',
        }));
      }
    }
    setIsRequesting(false);
    setStep(1);
  };

  const requestNotifications = async () => {
    setIsRequesting(true);
    try {
      if (!('Notification' in window)) {
        setPermissions(prev => ({ ...prev, notifications: 'unavailable' }));
      } else if (Notification.permission === 'granted') {
        setPermissions(prev => ({ ...prev, notifications: 'granted' }));
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        setPermissions(prev => ({
          ...prev,
          notifications: permission === 'granted' ? 'granted' : 'denied'
        }));
      } else {
        setPermissions(prev => ({ ...prev, notifications: 'denied' }));
      }
    } catch {
      setPermissions(prev => ({ ...prev, notifications: 'denied' }));
    }
    setIsRequesting(false);
    setStep(2);
  };

  const finishSetup = () => {
    localStorage.setItem('meal-planner-permissions-setup', 'true');
    onComplete();
  };

  const getStatusIcon = (status: PermissionState) => {
    switch (status) {
      case 'granted':
        return <CheckCircle2 size={20} className="text-[var(--system-green)]" />;
      case 'denied':
        return <XCircle size={20} className="text-[var(--system-red)]" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: PermissionState) => {
    switch (status) {
      case 'granted':
        return 'Erlaubt';
      case 'denied':
        return 'Abgelehnt';
      case 'unavailable':
        return 'Nicht verfügbar';
      default:
        return 'Ausstehend';
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--background)] p-4">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
            <Smartphone size={40} className="text-[var(--system-blue)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">
            App einrichten
          </h1>
          <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
            Erlaube Zugriff für Anrufe und Benachrichtigungen
          </p>
        </div>

        {/* Permission Cards */}
        <div className="space-y-3">
          {/* Camera & Microphone */}
          <motion.div
            className={`glass-card p-4 ${step === 0 ? 'ring-2 ring-[var(--system-blue)]' : ''}`}
            animate={{ scale: step === 0 ? 1.02 : 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-green)]/15">
                <div className="flex gap-1">
                  <Camera size={16} className="text-[var(--system-green)]" />
                  <Mic size={16} className="text-[var(--system-green)]" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[var(--foreground)]">Kamera & Mikrofon</p>
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  Für Video- und Sprachanrufe
                </p>
              </div>
              {permissions.camera !== 'pending' ? (
                <div className="flex items-center gap-2">
                  {getStatusIcon(permissions.camera)}
                  <span className="text-xs text-[var(--foreground-secondary)]">
                    {getStatusText(permissions.camera)}
                  </span>
                </div>
              ) : step === 0 ? (
                <motion.button
                  onClick={requestCameraAndMic}
                  disabled={isRequesting}
                  className="rounded-full bg-[var(--system-green)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  {isRequesting ? 'Lädt...' : 'Erlauben'}
                </motion.button>
              ) : null}
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            className={`glass-card p-4 ${step === 1 ? 'ring-2 ring-[var(--system-blue)]' : ''}`}
            animate={{ scale: step === 1 ? 1.02 : 1 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-orange)]/15">
                <Bell size={24} className="text-[var(--system-orange)]" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[var(--foreground)]">Benachrichtigungen</p>
                <p className="text-xs text-[var(--foreground-tertiary)]">
                  Für Anrufe und neue Nachrichten
                </p>
              </div>
              {permissions.notifications !== 'pending' ? (
                <div className="flex items-center gap-2">
                  {getStatusIcon(permissions.notifications)}
                  <span className="text-xs text-[var(--foreground-secondary)]">
                    {getStatusText(permissions.notifications)}
                  </span>
                </div>
              ) : step === 1 ? (
                <motion.button
                  onClick={requestNotifications}
                  disabled={isRequesting}
                  className="rounded-full bg-[var(--system-orange)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  whileTap={{ scale: 0.95 }}
                >
                  {isRequesting ? 'Lädt...' : 'Erlauben'}
                </motion.button>
              ) : null}
            </div>
          </motion.div>
        </div>

        {/* Continue Button */}
        <AnimatePresence>
          {step >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <motion.button
                onClick={finishSetup}
                className="w-full rounded-[14px] bg-[var(--system-blue)] py-4 text-lg font-semibold text-white"
                whileTap={{ scale: 0.98 }}
              >
                App starten
              </motion.button>

              {(permissions.camera === 'denied' || permissions.notifications === 'denied') && (
                <p className="mt-3 text-center text-xs text-[var(--foreground-tertiary)]">
                  Du kannst die Berechtigungen später in den Browser-Einstellungen ändern.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip option for step 0 */}
        {step < 2 && (
          <button
            onClick={() => {
              if (step === 0) {
                setPermissions(prev => ({ ...prev, camera: 'denied', microphone: 'denied' }));
                setStep(1);
              } else {
                setPermissions(prev => ({ ...prev, notifications: 'denied' }));
                setStep(2);
              }
            }}
            className="mt-4 w-full text-center text-sm text-[var(--foreground-tertiary)]"
          >
            Überspringen
          </button>
        )}
      </motion.div>
    </div>
  );
}
