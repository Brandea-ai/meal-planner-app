'use client';

import { useState } from 'react';
import { Check, Clock, Globe, Utensils, ChefHat, Sparkles, X, RotateCcw, Pencil } from 'lucide-react';
import { Meal, MealType } from '@/types';
import { useApp } from '@/context/AppContext';
import { scaleAmount, getServingsLabel } from '@/utils/portionScaling';
import { MealNoteEditor } from './MealNoteEditor';

interface MealCardProps {
  meal: Meal;
}

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

  // Get hidden ingredients for this meal
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

  // Get customized or scaled amount for an ingredient
  const getDisplayAmount = (ingredientName: string, originalAmount: string | undefined, category: string) => {
    const customization = getIngredientCustomization(meal.id, meal.type as MealType, ingredientName);
    if (customization?.customAmount) {
      return customization.customAmount;
    }
    return scaleAmount(originalAmount, servings, category);
  };

  // Get customized or original name for an ingredient
  const getDisplayName = (ingredientName: string) => {
    const customization = getIngredientCustomization(meal.id, meal.type as MealType, ingredientName);
    return customization?.customName || ingredientName;
  };

  const currentNote = getMealNote(meal.id, meal.type as MealType);

  return (
    <article
      className={`overflow-hidden rounded-[12px] ${
        isCompleted
          ? 'bg-[var(--system-green)]/10'
          : 'bg-[var(--background-secondary)]'
      }`}
      aria-label={`Tag ${meal.day}: ${meal.title}`}
    >
      {/* Header */}
      <header className="p-4 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <span className="text-xs font-medium text-[var(--foreground-tertiary)]">
              Tag {meal.day} · {getServingsLabel(servings)}
            </span>
            <h2 className="mt-0.5 text-xl font-bold text-[var(--foreground)]">
              {meal.title}
            </h2>
            <p className="mt-0.5 text-sm text-[var(--foreground-secondary)]">
              {meal.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-[var(--system-orange)]/15 px-2.5 py-1">
            <Clock size={14} className="text-[var(--system-orange)]" />
            <span className="text-xs font-medium text-[var(--system-orange)]">
              {meal.prepTime} Min
            </span>
          </div>
        </div>

        {/* Cultural Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5" role="list" aria-label="Kulturelle Einflüsse">
          {meal.culturalOrigin.map((origin) => (
            <span
              key={origin}
              role="listitem"
              className="flex items-center gap-1 rounded-full bg-[var(--system-blue)]/10 px-2 py-0.5 text-xs font-medium text-[var(--system-blue)]"
            >
              <Globe size={10} />
              {origin}
            </span>
          ))}
        </div>
      </header>

      {/* Ingredients - Grouped by Main Dish and Side Dish */}
      <section className="px-4 pb-3" aria-labelledby={`ingredients-${meal.id}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Utensils size={14} className="text-[var(--foreground-tertiary)]" />
            <h3 id={`ingredients-${meal.id}`} className="text-sm font-semibold text-[var(--foreground)]">
              Zutaten
            </h3>
          </div>
          <span className="text-xs text-[var(--foreground-tertiary)]">
            Tippen zum Bearbeiten
          </span>
        </div>

        {/* Main Dish Ingredients */}
        {(() => {
          const mainIngredients = meal.ingredients.filter((i) => !i.forSideDish);
          const sideIngredients = meal.ingredients.filter((i) => i.forSideDish);

          const renderIngredient = (ingredient: typeof meal.ingredients[0]) => {
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
                <li
                  key={ingredient.name}
                  className="flex items-center justify-between rounded-[8px] bg-[var(--fill-tertiary)] px-3 py-2 opacity-50"
                >
                  <span className="text-sm text-[var(--foreground-tertiary)] line-through">
                    {displayName}
                  </span>
                  <button
                    onClick={() => handleShowIngredient(ingredient.name)}
                    className="flex items-center gap-1 text-xs text-[var(--system-blue)] transition-none active:opacity-80"
                  >
                    <RotateCcw size={12} />
                    Wiederherstellen
                  </button>
                </li>
              );
            }

            if (isEditing) {
              return (
                <li
                  key={ingredient.name}
                  className="rounded-[8px] bg-[var(--system-blue)]/10 p-3"
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
                  <div className="mt-2 space-y-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Zutat-Name..."
                      className="w-full rounded-[6px] bg-[var(--background)] px-2 py-1.5 text-sm font-medium text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="Menge..."
                        className="flex-1 rounded-[6px] bg-[var(--background)] px-2 py-1.5 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
                      />
                      <button
                        onClick={() => handleSaveEdit(ingredient.name)}
                        className="rounded-[6px] bg-[var(--system-blue)] px-3 py-1.5 text-sm font-medium text-white transition-none active:opacity-80"
                      >
                        OK
                      </button>
                    </div>
                  </div>
                  {hasCustomization && (
                    <button
                      onClick={() => handleResetEdit(ingredient.name)}
                      className="mt-2 flex items-center gap-1 text-xs text-[var(--foreground-tertiary)]"
                    >
                      <RotateCcw size={10} />
                      Auf Original zurücksetzen
                    </button>
                  )}
                </li>
              );
            }

            return (
              <li
                key={ingredient.name}
                className="flex items-center justify-between rounded-[8px] bg-[var(--fill-tertiary)] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHideIngredient(ingredient.name)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--fill-secondary)] text-[var(--foreground-tertiary)] transition-none active:opacity-80"
                    aria-label={`${displayName} entfernen`}
                  >
                    <X size={12} />
                  </button>
                  <button
                    onClick={() => handleStartEdit(ingredient.name, displayName, displayAmount)}
                    className={`text-sm transition-none active:opacity-80 ${
                      hasCustomName
                        ? 'font-medium text-[var(--system-blue)]'
                        : 'text-[var(--foreground)]'
                    }`}
                  >
                    {displayName}
                  </button>
                </div>
                <button
                  onClick={() => handleStartEdit(ingredient.name, displayName, displayAmount)}
                  className={`flex items-center gap-1 text-sm transition-none active:opacity-80 ${
                    hasCustomAmount
                      ? 'font-medium text-[var(--system-blue)]'
                      : 'text-[var(--foreground-tertiary)]'
                  }`}
                >
                  {displayAmount}
                  <Pencil size={10} className="opacity-50" />
                </button>
              </li>
            );
          };

          return (
            <>
              {/* Main Dish Section */}
              {mainIngredients.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs font-medium text-[var(--system-blue)]">Hauptgericht</span>
                  <ul className="mt-1.5 space-y-1.5">
                    {mainIngredients.map(renderIngredient)}
                  </ul>
                </div>
              )}

              {/* Side Dish Section */}
              {sideIngredients.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--system-teal)]">
                      {meal.sideDish || 'Beilage'}
                    </span>
                  </div>
                  <ul className="mt-1.5 space-y-1.5">
                    {sideIngredients.map(renderIngredient)}
                  </ul>
                </div>
              )}
            </>
          );
        })()}

        {hiddenIngredients.length > 0 && (
          <p className="mt-2 text-center text-xs text-[var(--foreground-tertiary)]">
            {hiddenIngredients.length} Zutat(en) ausgeblendet
          </p>
        )}
      </section>

      {/* Protein Options (for flexible meals) */}
      {meal.proteinOptions && meal.proteinOptions.length > 0 && (
        <section className="border-t border-[var(--separator)] px-4 py-3">
          <div className="flex items-center gap-2">
            <ChefHat size={14} className="text-[var(--system-purple)]" />
            <span className="text-sm font-medium text-[var(--foreground)]">Protein-Optionen</span>
          </div>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            {meal.proteinOptions.join(' / ')}
          </p>
        </section>
      )}

      {/* Benefit */}
      <section className="border-t border-[var(--separator)] bg-[var(--fill-quaternary)] px-4 py-3">
        <div className="flex items-start gap-2">
          <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-[var(--system-yellow)]" />
          <p className="text-sm text-[var(--foreground-secondary)]">
            {meal.benefit}
          </p>
        </div>
      </section>

      {/* Tags */}
      <section className="px-4 py-3" aria-label="Tags">
        <div className="flex flex-wrap gap-1.5">
          {meal.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--fill-secondary)] px-2 py-0.5 text-xs text-[var(--foreground-secondary)]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* Working Note Section */}
      <section className="border-t border-[var(--separator)] px-4 py-3">
        <MealNoteEditor
          mealId={meal.id}
          mealType={meal.type as MealType}
          initialNote={currentNote}
          onSave={handleSaveNote}
        />
      </section>

      {/* Complete Button */}
      <footer className="p-4 pt-0">
        <button
          onClick={handleToggleComplete}
          className={`flex w-full items-center justify-center gap-2 rounded-[12px] py-3.5 font-semibold transition-none active:opacity-80 ${
            isCompleted
              ? 'bg-[var(--system-green)] text-white'
              : 'bg-[var(--foreground)] text-[var(--background)]'
          }`}
          aria-pressed={isCompleted}
        >
          {isCompleted && <Check size={18} strokeWidth={3} />}
          {isCompleted ? 'Erledigt' : 'Als erledigt markieren'}
        </button>
      </footer>
    </article>
  );
}
