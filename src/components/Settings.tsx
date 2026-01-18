'use client';

import { motion } from 'framer-motion';
import {
  ChevronRight,
  RotateCcw,
  Users,
  Timer,
  Dumbbell,
  Leaf,
  Wheat,
  Droplets,
  Bean,
  Fish,
  Beef,
  Scale,
  Download,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useChat } from '@/hooks/useChat';
import { ProgressRing } from './ProgressRing';
import { InfoPopup } from './InfoPopup';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Settings() {
  const { progress, updatePreferences, resetProgress } = useApp();
  const { messages, exportChat } = useChat();

  const handleServingsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ servings: parseInt(e.target.value, 10) });
  };

  const handlePrepTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updatePreferences({ prepTimePreference: e.target.value as 'quick' | 'normal' | 'extended' });
  };

  const handleReset = () => {
    if (window.confirm('Möchtest du deinen gesamten Fortschritt wirklich zurücksetzen?')) {
      resetProgress();
    }
  };

  const handleExportChat = () => {
    const exportData = exportChat();
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meal-planner-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Progress Section */}
      <motion.section variants={itemVariants} className="glass-card overflow-hidden">
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
      </motion.section>

      {/* Preferences Section */}
      <motion.section variants={itemVariants} className="glass-card overflow-hidden">
        <div className="p-5 pb-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Einstellungen
          </h2>
        </div>

        {/* Portionen */}
        <div className="flex min-h-[56px] items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
              <Users size={20} className="text-[var(--system-blue)]" />
            </div>
            <span className="text-[var(--foreground)]">Portionen</span>
            <InfoPopup title="Portionen" iconColor="var(--system-blue)">
              <p className="mb-3">
                Die Portionseinstellung passt automatisch alle Mengenangaben in den Rezepten und der Einkaufsliste an.
              </p>
              <p className="mb-3">
                <strong>Evidenzbasierte Skalierung:</strong>
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li>Hauptzutaten werden linear skaliert</li>
                <li>Gewürze werden sublinear berechnet (du brauchst nicht doppelt so viel Salz für 2 Personen)</li>
              </ul>
            </InfoPopup>
          </div>
          <select
            value={progress.preferences.servings}
            onChange={handleServingsChange}
            className="glass-inner rounded-[12px] border-0 px-4 py-2 text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
          >
            <option value={1}>1 Person</option>
            <option value={2}>2 Personen</option>
            <option value={3}>3 Personen</option>
            <option value={4}>4 Personen</option>
            <option value={5}>5 Personen</option>
            <option value={6}>6 Personen</option>
          </select>
        </div>

        <div className="mx-5 h-px bg-[var(--glass-border)]" />

        {/* Zubereitungszeit */}
        <div className="flex min-h-[56px] items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-orange)]/15">
              <Timer size={20} className="text-[var(--system-orange)]" />
            </div>
            <span className="text-[var(--foreground)]">Zubereitungszeit</span>
            <InfoPopup title="Zubereitungszeit" iconColor="var(--system-orange)">
              <p className="mb-3">
                Wenn ein Gericht länger dauert als deine Präferenz, siehst du eine Warnung mit einer schnelleren Alternative.
              </p>
              <p className="mb-3">
                <strong>Optionen:</strong>
              </p>
              <ul className="list-inside list-disc space-y-1">
                <li><strong>≤12 Min:</strong> Für sehr schnelle Mahlzeiten</li>
                <li><strong>≤25 Min:</strong> Standard-Kochzeit für Alltagsgerichte</li>
                <li><strong>Unbegrenzt:</strong> Keine Warnungen</li>
              </ul>
            </InfoPopup>
          </div>
          <select
            value={progress.preferences.prepTimePreference}
            onChange={handlePrepTimeChange}
            className="glass-inner rounded-[12px] border-0 px-4 py-2 text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
          >
            <option value="quick">≤12 Min</option>
            <option value="normal">≤25 Min</option>
            <option value="extended">Unbegrenzt</option>
          </select>
        </div>
      </motion.section>

      {/* Chat Export Section */}
      <motion.section
        variants={itemVariants}
        className="glass-card overflow-hidden ring-1 ring-[var(--system-purple)]/20"
      >
        <motion.button
          onClick={handleExportChat}
          disabled={messages.length === 0}
          className="flex min-h-[56px] w-full items-center justify-between p-4 disabled:opacity-50"
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-purple)]"
              whileHover={{ scale: 1.05 }}
            >
              <Download size={22} className="text-white" />
            </motion.div>
            <div className="text-left">
              <span className="block font-semibold text-[var(--foreground)]">
                Chat exportieren
              </span>
              <span className="text-sm text-[var(--foreground-secondary)]">
                {messages.length} Nachrichten als JSON
              </span>
            </div>
          </div>
          <ChevronRight size={20} className="text-[var(--gray-2)]" />
        </motion.button>
        <div className="border-t border-[var(--glass-border)] px-5 py-3 bg-[var(--vibrancy-thin)]">
          <div className="flex items-start gap-2">
            <MessageCircle size={16} className="mt-0.5 flex-shrink-0 text-[var(--system-purple)]" />
            <p className="text-xs text-[var(--foreground-secondary)]">
              Exportiere deine Chat-Chronik als JSON-Datei zur KI-Analyse. Perfekt um die nächste Woche zu planen!
            </p>
          </div>
        </div>
      </motion.section>

      {/* Principles Section */}
      <motion.section variants={itemVariants} className="glass-card overflow-hidden">
        <div className="p-5 pb-3">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Unsere Prinzipien
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 p-5 pt-2">
          {principles.map((principle, index) => {
            const IconComponent = principle.icon;
            return (
              <motion.div
                key={principle.title}
                className="glass-inner p-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
                  <IconComponent size={18} className="text-[var(--system-blue)]" />
                </div>
                <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                  {principle.title}
                </p>
                <p className="mt-1 text-xs text-[var(--foreground-tertiary)]">
                  {principle.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Reset Section */}
      <motion.section
        variants={itemVariants}
        className="glass-card overflow-hidden ring-1 ring-[var(--system-red)]/20"
      >
        <motion.button
          onClick={handleReset}
          className="flex min-h-[56px] w-full items-center justify-between p-4"
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-red)]"
              whileHover={{ scale: 1.05 }}
            >
              <RotateCcw size={22} className="text-white" />
            </motion.div>
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
        </motion.button>
      </motion.section>
    </motion.div>
  );
}
