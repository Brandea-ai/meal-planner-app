'use client';

import { useApp } from '@/context/AppContext';
import { ProgressRing } from './ProgressRing';
import { principles } from '@/data/meals';

export function Settings() {
  const { progress, updatePreferences, resetProgress } = useApp();

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

  return (
    <div className="space-y-6">
      {/* Progress Section */}
      <section className="rounded-2xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-center text-xl font-bold text-gray-900 dark:text-white">
          Dein Fortschritt
        </h2>
        <ProgressRing />
        {progress.startDate && (
          <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Gestartet am{' '}
            {new Date(progress.startDate).toLocaleDateString('de-DE', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}
      </section>

      {/* Preferences Section */}
      <section className="rounded-2xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Einstellungen
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="servings" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Portionen
            </label>
            <select
              id="servings"
              value={progress.preferences.servings}
              onChange={handleServingsChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value={1}>1 Person</option>
              <option value={2}>2 Personen</option>
              <option value={3}>3 Personen</option>
              <option value={4}>4 Personen</option>
            </select>
          </div>

          <div>
            <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Zubereitungszeit
            </label>
            <select
              id="prepTime"
              value={progress.preferences.prepTimePreference}
              onChange={handlePrepTimeChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="quick">Schnell (unter 10 Min)</option>
              <option value="normal">Normal (10-15 Min)</option>
              <option value="extended">Ausführlich (15+ Min)</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meal Prep aktivieren
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Vorbereitung am Wochenende
              </span>
            </div>
            <button
              onClick={handleMealPrepToggle}
              className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                progress.preferences.mealPrepEnabled
                  ? 'bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={progress.preferences.mealPrepEnabled}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                  progress.preferences.mealPrepEnabled ? 'translate-x-5' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Principles Section */}
      <section className="rounded-2xl border-2 border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Unsere Prinzipien
        </h2>
        <ul className="grid grid-cols-2 gap-3">
          {principles.map((principle) => (
            <li
              key={principle.title}
              className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50"
            >
              <span className="text-2xl" aria-hidden="true">
                {principle.icon}
              </span>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {principle.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {principle.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Reset Section */}
      <section className="rounded-2xl border-2 border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/30">
        <h2 className="mb-2 text-lg font-bold text-red-800 dark:text-red-200">
          Fortschritt zurücksetzen
        </h2>
        <p className="mb-4 text-sm text-red-700 dark:text-red-300">
          Dies löscht deinen gesamten Fortschritt und alle Einstellungen.
        </p>
        <button
          onClick={handleReset}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Zurücksetzen
        </button>
      </section>
    </div>
  );
}
