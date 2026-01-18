'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, Trash2, ArrowRight } from 'lucide-react';
import { MealType, Ingredient } from '@/types';

interface ReplacementPromptProps {
  isOpen: boolean;
  ingredientName: string;
  mealId: number;
  mealType: MealType;
  onConfirmReplacement: (replacementName: string) => void;
  onDeleteWithoutReplacement: () => void;
  onCancel: () => void;
  suggestedReplacements?: string[];
  category?: Ingredient['category'];
}

const defaultSuggestions: Record<Ingredient['category'], string[]> = {
  protein: ['Hähnchen', 'Tofu', 'Lachs', 'Garnelen', 'Rinderhack', 'Putenbrust'],
  fresh: ['Paprika', 'Zucchini', 'Tomaten', 'Gurke', 'Spinat', 'Brokkoli'],
  dairy: ['Feta', 'Mozzarella', 'Joghurt', 'Frischkäse', 'Parmesan'],
  legumes: ['Kichererbsen', 'Linsen', 'Schwarze Bohnen', 'Edamame'],
  grains: ['Vollkornreis', 'Bulgur', 'Quinoa', 'Vollkornpasta', 'Couscous'],
  basics: ['Olivenöl', 'Sojasauce', 'Tahini', 'Ajvar'],
  extras: ['Walnüsse', 'Sesam', 'Kürbiskerne', 'Mandeln'],
};

export function ReplacementPrompt({
  isOpen,
  ingredientName,
  onConfirmReplacement,
  onDeleteWithoutReplacement,
  onCancel,
  suggestedReplacements,
  category = 'fresh',
}: ReplacementPromptProps) {
  const [customReplacement, setCustomReplacement] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const suggestions = suggestedReplacements || defaultSuggestions[category] || [];

  const handleSelectReplacement = (replacement: string) => {
    onConfirmReplacement(replacement);
    setCustomReplacement('');
    setShowCustomInput(false);
  };

  const handleCustomSubmit = () => {
    if (customReplacement.trim()) {
      onConfirmReplacement(customReplacement.trim());
      setCustomReplacement('');
      setShowCustomInput(false);
    }
  };

  const handleClose = () => {
    setCustomReplacement('');
    setShowCustomInput(false);
    onCancel();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed left-4 right-4 bottom-8 z-50 mx-auto max-w-md glass-card overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--glass-border)]">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--system-orange)]/15">
                  <RefreshCw size={20} className="text-[var(--system-orange)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--foreground)]">Zutat ersetzen?</h3>
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    &quot;{ingredientName}&quot; wird entfernt
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill-secondary)]"
                whileTap={{ scale: 0.9 }}
              >
                <X size={16} className="text-[var(--foreground-secondary)]" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-4">
              {!showCustomInput ? (
                <>
                  {/* Suggestions */}
                  <p className="text-sm font-medium text-[var(--foreground-secondary)] mb-3">
                    Vorschläge
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestions.slice(0, 6).map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        onClick={() => handleSelectReplacement(suggestion)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-[var(--fill-tertiary)] text-[14px] text-[var(--foreground)] hover:bg-[var(--system-blue)]/10 hover:text-[var(--system-blue)] transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <ArrowRight size={12} />
                        {suggestion}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom input trigger */}
                  <motion.button
                    onClick={() => setShowCustomInput(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-[12px] border border-dashed border-[var(--glass-border)] text-[14px] text-[var(--foreground-secondary)] hover:border-[var(--system-blue)] hover:text-[var(--system-blue)] transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Eigenen Ersatz eingeben
                  </motion.button>
                </>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={customReplacement}
                    onChange={(e) => setCustomReplacement(e.target.value)}
                    placeholder="z.B. Tofu, Tempeh..."
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                    className="w-full bg-[var(--fill-tertiary)] rounded-[12px] px-4 py-3 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
                  />
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => setShowCustomInput(false)}
                      className="flex-1 py-3 rounded-[12px] bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)] font-medium"
                      whileTap={{ scale: 0.98 }}
                    >
                      Zurück
                    </motion.button>
                    <motion.button
                      onClick={handleCustomSubmit}
                      disabled={!customReplacement.trim()}
                      className="flex-1 py-3 rounded-[12px] bg-[var(--system-blue)] text-white font-medium disabled:opacity-50"
                      whileTap={{ scale: 0.98 }}
                    >
                      Ersetzen
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex gap-2 p-4 pt-0">
              <motion.button
                onClick={onDeleteWithoutReplacement}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-[12px] bg-[var(--system-red)]/10 text-[var(--system-red)] font-semibold"
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 size={16} />
                Ohne Ersatz löschen
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
