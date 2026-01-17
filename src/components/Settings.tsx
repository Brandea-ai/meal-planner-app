'use client';

import { useState } from 'react';
import {
  QrCode,
  Cloud,
  ChevronRight,
  RotateCcw,
  Users,
  Timer,
  ChefHat,
  Dumbbell,
  Leaf,
  Wheat,
  Droplets,
  Bean,
  Fish,
  Beef,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ProgressRing } from './ProgressRing';
import { DeviceSync } from './DeviceSync';

// Principles with Lucide icons
const principles = [
  { icon: Dumbbell, title: 'Protein-reich', description: 'Eier, Joghurt, Fisch, Fleisch' },
  { icon: Leaf, title: 'Gemüse/Obst täglich', description: 'Farben auf dem Teller' },
  { icon: Wheat, title: 'Vollkorn-Standard', description: 'Bulgur, Naturreis, Pasta' },
  { icon: Droplets, title: 'Bewusste Fette', description: 'Olivenöl, Avocado, Nüsse' },
  { icon: Bean, title: 'Hülsenfrüchte 1x/Woche', description: 'Kichererbsen, Edamame' },
  { icon: Fish, title: 'Fisch 1x/Woche', description: 'Omega-3 für Gehirn & Herz' },
  { icon: Beef, title: 'Rotes Fleisch max 1x', description: 'Qualität vor Quantität' },
  { icon: Scale, title: 'Portions-Rule', description: '1/2 Gemüse · 1/4 Protein · 1/4 Beilage' },
];

export function Settings() {
  const { progress, syncStatus, deviceId, updatePreferences, resetProgress, switchDevice } = useApp();
  const [showDeviceSync, setShowDeviceSync] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleServingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ servings: parseInt(e.target.value, 10) });
  };

  const handlePrepTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ prepTimePreference: e.target.value as 'quick' | 'normal' | 'extended' });
  };

  const handleMealPrepToggle = () => {
    updatePreferences({ mealPrepEnabled: !progress.preferences.mealPrepEnabled });
  };

  const handleReset = () => {
    if (window.confirm('Möchtest du deinen gesamten Fortschritt wirklich zurücksetzen?')) {
      resetProgress();
    }
  };

  const handleDeviceSync = async (newDeviceId: string) => {
    await switchDevice(newDeviceId);
    setShowDeviceSync(false);
    setSyncSuccess(true);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {syncSuccess && (
        <div className="rounded-[12px] bg-[var(--system-green)]/15 p-4 text-center text-[var(--system-green)]">
          Geräte erfolgreich verbunden!
        </div>
      )}

      {/* Progress Section */}
      <section className="overflow-hidden rounded-[12px] bg-[var(--background-secondary)]">
        <div className="p-6">
          <h2 className="mb-4 text-center text-lg font-semibold text-[var(--foreground)]">
            Dein Fortschritt
          </h2>
          <ProgressRing />
          {progress.startDate && (
            <p className="mt-4 text-center text-sm text-[var(--foreground-tertiary)]">
              Gestartet am{' '}
              {new Date(progress.startDate).toLocaleDateString('de-DE', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          )}
        </div>
      </section>

      {/* Device Sync Section */}
      <section className="overflow-hidden rounded-[12px] bg-[var(--system-blue)]/10">
        <button
          onClick={() => setShowDeviceSync(true)}
          className="flex min-h-[44px] w-full items-center justify-between p-4 transition-none active:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-blue)]">
              <QrCode size={20} className="text-white" />
            </div>
            <div className="text-left">
              <span className="block font-semibold text-[var(--foreground)]">
                Geräte verbinden
              </span>
              <span className="text-sm text-[var(--foreground-secondary)]">
                QR-Code Sync
              </span>
            </div>
          </div>
          <ChevronRight size={20} className="text-[var(--gray-2)]" />
        </button>
      </section>

      {/* Cloud Sync Status */}
      <section className="overflow-hidden rounded-[12px] bg-[var(--background-secondary)]">
        <div className="flex min-h-[44px] items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fill-secondary)]">
              <Cloud size={20} className="text-[var(--foreground-secondary)]" />
            </div>
            <div>
              <span className="block font-semibold text-[var(--foreground)]">
                Cloud-Sync
              </span>
              {deviceId && (
                <span className="font-mono text-xs text-[var(--foreground-tertiary)]">
                  ID: {deviceId.slice(0, 8)}...
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${
              syncStatus === 'synced' ? 'bg-[var(--system-green)]' :
              syncStatus === 'syncing' ? 'bg-[var(--system-yellow)] animate-pulse' :
              syncStatus === 'error' ? 'bg-[var(--system-red)]' :
              'bg-[var(--gray-2)]'
            }`} />
            <span className="text-sm text-[var(--foreground-secondary)]">
              {syncStatus === 'synced' && 'Synchronisiert'}
              {syncStatus === 'syncing' && 'Synchronisiere...'}
              {syncStatus === 'error' && 'Sync-Fehler'}
              {syncStatus === 'offline' && 'Offline'}
              {!syncStatus && 'Verbinde...'}
            </span>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="overflow-hidden rounded-[12px] bg-[var(--background-secondary)]">
        <div className="p-4 pb-2">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Einstellungen
          </h2>
        </div>

        {/* Portionen */}
        <div className="flex min-h-[44px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Users size={20} className="text-[var(--system-blue)]" />
            <span className="text-[var(--foreground)]">Portionen</span>
          </div>
          <select
            value={progress.preferences.servings}
            onChange={handleServingsChange}
            className="rounded-[8px] border-0 bg-[var(--fill-tertiary)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none"
          >
            <option value={1}>1 Person</option>
            <option value={2}>2 Personen</option>
            <option value={3}>3 Personen</option>
            <option value={4}>4 Personen</option>
          </select>
        </div>

        <div className="inset-separator" />

        {/* Zubereitungszeit */}
        <div className="flex min-h-[44px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Timer size={20} className="text-[var(--system-orange)]" />
            <span className="text-[var(--foreground)]">Zubereitungszeit</span>
          </div>
          <select
            value={progress.preferences.prepTimePreference}
            onChange={handlePrepTimeChange}
            className="rounded-[8px] border-0 bg-[var(--fill-tertiary)] px-3 py-1.5 text-sm text-[var(--foreground)] focus:outline-none"
          >
            <option value="quick">Schnell</option>
            <option value="normal">Normal</option>
            <option value="extended">Ausführlich</option>
          </select>
        </div>

        <div className="inset-separator" />

        {/* Meal Prep Toggle */}
        <div className="flex min-h-[44px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <ChefHat size={20} className="text-[var(--system-purple)]" />
            <div>
              <span className="block text-[var(--foreground)]">Meal Prep</span>
              <span className="text-xs text-[var(--foreground-tertiary)]">
                Vorbereitung am Wochenende
              </span>
            </div>
          </div>
          <button
            onClick={handleMealPrepToggle}
            className={`toggle-switch ${progress.preferences.mealPrepEnabled ? 'active' : ''}`}
            role="switch"
            aria-checked={progress.preferences.mealPrepEnabled}
          >
            <span className="toggle-switch-knob" />
          </button>
        </div>

        <div className="inset-separator" />

        {/* Auto-Sync Shopping Filter Toggle */}
        <div className="flex min-h-[44px] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <RefreshCw size={20} className="text-[var(--system-teal)]" />
            <div>
              <span className="block text-[var(--foreground)]">Auto-Sync Filter</span>
              <span className="text-xs text-[var(--foreground-tertiary)]">
                Einkaufsliste folgt Mahlzeit-Tab
              </span>
            </div>
          </div>
          <button
            onClick={() => updatePreferences({ autoSyncShoppingFilter: !progress.preferences.autoSyncShoppingFilter })}
            className={`toggle-switch ${progress.preferences.autoSyncShoppingFilter ? 'active' : ''}`}
            role="switch"
            aria-checked={progress.preferences.autoSyncShoppingFilter || false}
          >
            <span className="toggle-switch-knob" />
          </button>
        </div>
      </section>

      {/* Principles Section */}
      <section className="overflow-hidden rounded-[12px] bg-[var(--background-secondary)]">
        <div className="p-4 pb-2">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Unsere Prinzipien
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-2 p-4 pt-2">
          {principles.map((principle) => {
            const IconComponent = principle.icon;
            return (
              <div
                key={principle.title}
                className="rounded-[10px] bg-[var(--fill-tertiary)] p-3"
              >
                <IconComponent size={20} className="text-[var(--system-blue)]" />
                <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                  {principle.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--foreground-tertiary)]">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reset Section */}
      <section className="overflow-hidden rounded-[12px] bg-[var(--system-red)]/10">
        <button
          onClick={handleReset}
          className="flex min-h-[44px] w-full items-center justify-between p-4 transition-none active:opacity-80"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-red)]">
              <RotateCcw size={20} className="text-white" />
            </div>
            <div className="text-left">
              <span className="block font-semibold text-[var(--system-red)]">
                Fortschritt zurücksetzen
              </span>
              <span className="text-sm text-[var(--foreground-secondary)]">
                Löscht alle Daten
              </span>
            </div>
          </div>
          <ChevronRight size={20} className="text-[var(--gray-2)]" />
        </button>
      </section>

      {/* Device Sync Modal */}
      {showDeviceSync && (
        <DeviceSync
          onSync={handleDeviceSync}
          onClose={() => setShowDeviceSync(false)}
        />
      )}
    </div>
  );
}
