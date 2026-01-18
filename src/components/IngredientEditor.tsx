'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Pencil, Trash2, RotateCcw } from 'lucide-react';
import { Ingredient, MealType } from '@/types';

interface IngredientEditorProps {
  ingredient: Ingredient;
  mealId: number;
  mealType: MealType;
  customization?: {
    customName?: string;
    customAmount?: string;
    isHidden: boolean;
    replacedWith?: string;
  };
  scaledAmount: string;
  onSave: (updates: { name?: string; amount?: string }) => void;
  onDelete: () => void;
  onReset?: () => void;
  isCustomIngredient?: boolean;
}

export function IngredientEditor({
  ingredient,
  customization,
  scaledAmount,
  onSave,
  onDelete,
  onReset,
  isCustomIngredient = false,
}: IngredientEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(customization?.customName || ingredient.name);
  const [editAmount, setEditAmount] = useState(customization?.customAmount || scaledAmount);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const displayName = customization?.customName || ingredient.name;
  const displayAmount = customization?.customAmount || scaledAmount;
  const isModified = customization?.customName || customization?.customAmount;

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setEditName(displayName);
    setEditAmount(displayAmount);
    setIsEditing(true);
  };

  const handleSave = () => {
    const updates: { name?: string; amount?: string } = {};

    if (editName.trim() !== ingredient.name) {
      updates.name = editName.trim();
    }
    if (editAmount.trim() !== scaledAmount) {
      updates.amount = editAmount.trim();
    }

    if (Object.keys(updates).length > 0) {
      onSave(updates);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(displayName);
    setEditAmount(displayAmount);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (customization?.isHidden) {
    return null;
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5, height: 0 }}
      className="group"
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 py-2 px-3 bg-[var(--fill-tertiary)] rounded-[12px]"
          >
            <div className="flex-1 flex flex-col gap-2">
              <input
                ref={nameInputRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Zutat"
                className="w-full bg-[var(--background)] rounded-[8px] px-3 py-2 text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
              />
              <input
                type="text"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Menge"
                className="w-full bg-[var(--background)] rounded-[8px] px-3 py-2 text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <motion.button
                onClick={handleSave}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--system-green)] text-white"
                whileTap={{ scale: 0.9 }}
                aria-label="Speichern"
              >
                <Check size={16} />
              </motion.button>
              <motion.button
                onClick={handleCancel}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fill-secondary)] text-[var(--foreground-secondary)]"
                whileTap={{ scale: 0.9 }}
                aria-label="Abbrechen"
              >
                <X size={16} />
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 py-2 px-1 rounded-[8px] hover:bg-[var(--vibrancy-thin)] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[14px] ${
                    isModified
                      ? 'text-[var(--system-blue)] font-medium'
                      : 'text-[var(--foreground)]'
                  }`}
                >
                  {displayName}
                </span>
                {isModified && !isCustomIngredient && (
                  <span className="text-[10px] text-[var(--system-blue)] bg-[var(--system-blue)]/10 px-1.5 py-0.5 rounded">
                    bearbeitet
                  </span>
                )}
                {isCustomIngredient && (
                  <span className="text-[10px] text-[var(--system-purple)] bg-[var(--system-purple)]/10 px-1.5 py-0.5 rounded">
                    hinzugefügt
                  </span>
                )}
              </div>
              <span className="text-[12px] text-[var(--foreground-tertiary)]">
                {displayAmount}
              </span>
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                onClick={handleStartEdit}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--foreground-secondary)] hover:bg-[var(--fill-secondary)]"
                whileTap={{ scale: 0.9 }}
                aria-label="Bearbeiten"
              >
                <Pencil size={14} />
              </motion.button>

              {isModified && onReset && !isCustomIngredient && (
                <motion.button
                  onClick={onReset}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--system-orange)] hover:bg-[var(--system-orange)]/10"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Zurücksetzen"
                >
                  <RotateCcw size={14} />
                </motion.button>
              )}

              <motion.button
                onClick={onDelete}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--system-red)] hover:bg-[var(--system-red)]/10"
                whileTap={{ scale: 0.9 }}
                aria-label="Löschen"
              >
                <Trash2 size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
