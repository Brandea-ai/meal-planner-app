'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Globe, Utensils, ChefHat, Sparkles, X, RotateCcw, Pencil } from 'lucide-react';
import { Meal, MealType } from '@/types';
import { useApp } from '@/context/AppContext';
import { scaleAmount, getServingsLabel } from '@/utils/portionScaling';
import { MealNoteEditor } from './MealNoteEditor';

interface MealCardProps {
  meal: Meal;
}

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

const ingredientVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

export function MealCard({ meal }: MealCardProps) {
  const {
    progress,
    completeDay,
    uncompleteDay,
    hideIngredient,
    showIngredient,
    updateIngredientAmount,
    updateIngredientName,
    resetIngredientAmount,
    resetIngredientName,
    getIngredientCustomization,
    saveMealNote,
    getMealNote,
  } = useApp();

  const isCompleted = progress.completedDays.includes(meal.day);
  const servings = progress.preferences.servings;
  const [editingIngredient, setEditingIngredient] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  const hiddenIngredients = progress.ingredientCustomizations
    .filter((c) => c.mealId === meal.id && c.mealType === meal.type && c.isHidden)
    .map((c) => c.ingredientName);

  const handleToggleComplete = () => {
    if (isCompleted) {
      uncompleteDay(meal.day);
    } else {
      completeDay(meal.day);
    }
  };

  const handleHideIngredient = (ingredientName: string) => {
    hideIngredient(meal.id, meal.type as MealType, ingredientName);
  };

  const handleShowIngredient = (ingredientName: string) => {
    showIngredient(meal.id, meal.type as MealType, ingredientName);
  };

  const handleStartEdit = (ingredientName: string, currentName: string, currentAmount: string) => {
    setEditingIngredient(ingredientName);
    setEditName(currentName);
    setEditAmount(currentAmount);
  };

  const handleSaveEdit = (originalIngredientName: string) => {
    if (editName.trim() && editName.trim() !== originalIngredientName) {
      updateIngredientName(meal.id, meal.type as MealType, originalIngredientName, editName.trim());
    }
    if (editAmount.trim()) {
      updateIngredientAmount(meal.id, meal.type as MealType, originalIngredientName, editAmount.trim());
    }
    setEditingIngredient(null);
    setEditName('');
    setEditAmount('');
  };

  const handleResetEdit = (ingredientName: string) => {
    resetIngredientAmount(meal.id, meal.type as MealType, ingredientName);
    resetIngredientName(meal.id, meal.type as MealType, ingredientName);
    setEditingIngredient(null);
    setEditName('');
    setEditAmount('');
  };

  const handleSaveNote = (note: string) => {
    saveMealNote(meal.id, meal.type as MealType, note);
  };

  const getDisplayAmount = (ingredientName: string, originalAmount: string | undefined, category: string) => {
    const customization = getIngredientCustomization(meal.id, meal.type as MealType, ingredientName);
    if (customization?.customAmount) {
      return customization.customAmount;
    }
    return scaleAmount(originalAmount, servings, category);
  };

  const getDisplayName = (ingredientName: string) => {
    const customization = getIngredientCustomization(meal.id, meal.type as MealType, ingredientName);
    return customization?.customName || ingredientName;
  };

  const currentNote = getMealNote(meal.id, meal.type as MealType);

  return (
    <motion.article
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`glass-card overflow-hidden ${
        isCompleted ? 'ring-2 ring-[var(--system-green)]/50' : ''
      }`}
      aria-label={`Tag ${meal.day}: ${meal.title}`}
    >
      {/* Completed Overlay */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--system-green)]/8 pointer-events-none z-0"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="relative z-10 p-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <motion.span
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-tertiary)]"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Tag {meal.day} · {getServingsLabel(servings)}
            </motion.span>
            <motion.h2
              className="mt-1 text-2xl font-bold text-[var(--foreground)]"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {meal.title}
            </motion.h2>
            <motion.p
              className="mt-1 text-sm text-[var(--foreground-secondary)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {meal.subtitle}
            </motion.p>
          </div>
          <motion.div
            className="glass-inner flex items-center gap-1.5 px-3 py-1.5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.05 }}
          >
            <Clock size={14} className="text-[var(--system-orange)]" />
            <span className="text-xs font-semibold text-[var(--system-orange)]">
              {meal.prepTime} Min
            </span>
          </motion.div>
        </div>

        {/* Cultural Tags */}
        <motion.div
          className="mt-4 flex flex-wrap gap-2"
          role="list"
          aria-label="Kulturelle Einflüsse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {meal.culturalOrigin.map((origin, index) => (
            <motion.span
              key={origin}
              role="listitem"
              className="glass-inner flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[var(--system-blue)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 + index * 0.05 }}
            >
              <Globe size={10} />
              {origin}
            </motion.span>
          ))}
        </motion.div>
      </header>

      {/* Ingredients Section */}
      <section className="relative z-10 px-5 pb-4" aria-labelledby={`ingredients-${meal.id}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--fill-tertiary)]">
              <Utensils size={14} className="text-[var(--foreground-secondary)]" />
            </div>
            <h3 id={`ingredients-${meal.id}`} className="text-sm font-semibold text-[var(--foreground)]">
              Zutaten
            </h3>
          </div>
          <span className="text-xs text-[var(--foreground-tertiary)]">
            Tippen zum Bearbeiten
          </span>
        </div>

        {(() => {
          const mainIngredients = meal.ingredients.filter((i) => !i.forSideDish);
          const sideIngredients = meal.ingredients.filter((i) => i.forSideDish);

          const renderIngredient = (ingredient: typeof meal.ingredients[0], index: number) => {
            const isHidden = hiddenIngredients.includes(ingredient.name);
            const isEditing = editingIngredient === ingredient.name;
            const displayAmount = getDisplayAmount(ingredient.name, ingredient.amount, ingredient.category);
            const displayName = getDisplayName(ingredient.name);
            const customization = getIngredientCustomization(meal.id, meal.type as MealType, ingredient.name);
            const hasCustomAmount = !!customization?.customAmount;
            const hasCustomName = !!customization?.customName;
            const hasCustomization = hasCustomAmount || hasCustomName;

            if (isHidden) {
              return (
                <motion.li
                  key={ingredient.name}
                  variants={ingredientVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  layout
                  className="flex items-center justify-between glass-inner px-3 py-2.5 opacity-50"
                >
                  <span className="text-sm text-[var(--foreground-tertiary)] line-through">
                    {displayName}
                  </span>
                  <motion.button
                    onClick={() => handleShowIngredient(ingredient.name)}
                    className="flex items-center gap-1 text-xs text-[var(--system-blue)] font-medium"
                    whileTap={{ scale: 0.95 }}
                  >
                    <RotateCcw size={12} />
                    Wiederherstellen
                  </motion.button>
                </motion.li>
              );
            }

            if (isEditing) {
              return (
                <motion.li
                  key={ingredient.name}
                  layout
                  className="glass-inner p-4 ring-2 ring-[var(--system-blue)]/30"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--foreground-tertiary)]">
                      Original: {ingredient.name}
                    </span>
                    <button
                      onClick={() => setEditingIngredient(null)}
                      className="text-[var(--foreground-tertiary)]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="mt-3 space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Zutat-Name..."
                      className="w-full rounded-[10px] bg-[var(--background)] px-3 py-2 text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="Menge..."
                        className="flex-1 rounded-[10px] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                      />
                      <motion.button
                        onClick={() => handleSaveEdit(ingredient.name)}
                        className="rounded-[10px] bg-[var(--system-blue)] px-4 py-2 text-sm font-semibold text-white"
                        whileTap={{ scale: 0.95 }}
                      >
                        OK
                      </motion.button>
                    </div>
                  </div>
                  {hasCustomization && (
                    <button
                      onClick={() => handleResetEdit(ingredient.name)}
                      className="mt-3 flex items-center gap-1 text-xs text-[var(--foreground-tertiary)]"
                    >
                      <RotateCcw size={10} />
                      Auf Original zurücksetzen
                    </button>
                  )}
                </motion.li>
              );
            }

            return (
              <motion.li
                key={ingredient.name}
                variants={ingredientVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                layout
                transition={{ delay: index * 0.03 }}
                className="flex items-center justify-between glass-inner px-3 py-2.5 hover:bg-[var(--vibrancy-regular)] transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <motion.button
                    onClick={() => handleHideIngredient(ingredient.name)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--fill-secondary)] text-[var(--foreground-tertiary)]"
                    aria-label={`${displayName} entfernen`}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <X size={12} />
                  </motion.button>
                  <button
                    onClick={() => handleStartEdit(ingredient.name, displayName, displayAmount)}
                    className={`text-sm ${
                      hasCustomName
                        ? 'font-semibold text-[var(--system-blue)]'
                        : 'text-[var(--foreground)]'
                    }`}
                  >
                    {displayName}
                  </button>
                </div>
                <button
                  onClick={() => handleStartEdit(ingredient.name, displayName, displayAmount)}
                  className={`flex items-center gap-1.5 text-sm ${
                    hasCustomAmount
                      ? 'font-semibold text-[var(--system-blue)]'
                      : 'text-[var(--foreground-tertiary)]'
                  }`}
                >
                  {displayAmount}
                  <Pencil size={10} className="opacity-40" />
                </button>
              </motion.li>
            );
          };

          return (
            <>
              {/* Main Dish Section */}
              {mainIngredients.length > 0 && (
                <div className="mb-3">
                  <span className="text-xs font-semibold text-[var(--system-blue)] mb-2 block">
                    Hauptgericht
                  </span>
                  <ul className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {mainIngredients.map((ing, i) => renderIngredient(ing, i))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}

              {/* Side Dish Section */}
              {sideIngredients.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-[var(--system-teal)]">
                      {meal.sideDish || 'Beilage'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    <AnimatePresence mode="popLayout">
                      {sideIngredients.map((ing, i) => renderIngredient(ing, i))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}
            </>
          );
        })()}

        <AnimatePresence>
          {hiddenIngredients.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-3 text-center text-xs text-[var(--foreground-tertiary)]"
            >
              {hiddenIngredients.length} Zutat(en) ausgeblendet
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* Protein Options */}
      {meal.proteinOptions && meal.proteinOptions.length > 0 && (
        <section className="relative z-10 border-t border-[var(--glass-border)] px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--system-purple)]/15">
              <ChefHat size={12} className="text-[var(--system-purple)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--foreground)]">Protein-Optionen</span>
          </div>
          <p className="text-sm text-[var(--foreground-secondary)] pl-8">
            {meal.proteinOptions.join(' / ')}
          </p>
        </section>
      )}

      {/* Benefit */}
      <section className="relative z-10 border-t border-[var(--glass-border)] bg-[var(--vibrancy-thin)] px-5 py-4">
        <div className="flex items-start gap-2.5">
          <motion.div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--system-yellow)]/20"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles size={12} className="text-[var(--system-yellow)]" />
          </motion.div>
          <p className="text-sm text-[var(--foreground-secondary)] flex-1">
            {meal.benefit}
          </p>
        </div>
      </section>

      {/* Tags */}
      <section className="relative z-10 px-5 py-4" aria-label="Tags">
        <div className="flex flex-wrap gap-2">
          {meal.tags.map((tag, index) => (
            <motion.span
              key={tag}
              className="glass-inner px-2.5 py-1 text-xs font-medium text-[var(--foreground-secondary)]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              #{tag}
            </motion.span>
          ))}
        </div>
      </section>

      {/* Note Section */}
      <section className="relative z-10 border-t border-[var(--glass-border)] px-5 py-4">
        <MealNoteEditor
          mealId={meal.id}
          mealType={meal.type as MealType}
          initialNote={currentNote}
          onSave={handleSaveNote}
        />
      </section>

      {/* Complete Button */}
      <footer className="relative z-10 p-5 pt-0">
        <motion.button
          onClick={handleToggleComplete}
          className={`flex w-full items-center justify-center gap-2.5 rounded-[16px] py-4 font-semibold shadow-sm ${
            isCompleted
              ? 'bg-[var(--system-green)] text-white shadow-glow-green'
              : 'bg-[var(--foreground)] text-[var(--background)]'
          }`}
          aria-pressed={isCompleted}
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <AnimatePresence mode="wait">
            {isCompleted && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
              >
                <Check size={18} strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
          {isCompleted ? 'Erledigt' : 'Als erledigt markieren'}
        </motion.button>
      </footer>
    </motion.article>
  );
}
