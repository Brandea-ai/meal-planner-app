'use client';

import { Check, Clock, Globe, Utensils, ChefHat, Sparkles, StickyNote } from 'lucide-react';
import { Meal } from '@/types';
import { useApp } from '@/context/AppContext';

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  const { progress, completeDay, uncompleteDay } = useApp();
  const isCompleted = progress.completedDays.includes(meal.day);

  const handleToggleComplete = () => {
    if (isCompleted) {
      uncompleteDay(meal.day);
    } else {
      completeDay(meal.day);
    }
  };

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
              Tag {meal.day}
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

      {/* Ingredients */}
      <section className="px-4 pb-3" aria-labelledby={`ingredients-${meal.id}`}>
        <div className="flex items-center gap-2">
          <Utensils size={14} className="text-[var(--foreground-tertiary)]" />
          <h3 id={`ingredients-${meal.id}`} className="text-sm font-semibold text-[var(--foreground)]">
            Zutaten
          </h3>
        </div>
        <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
          {meal.ingredients.map((ingredient, idx) => (
            <li
              key={idx}
              className="flex items-baseline gap-1.5 text-sm text-[var(--foreground-secondary)]"
            >
              <span className="h-1 w-1 flex-shrink-0 rounded-full bg-[var(--gray-3)]" aria-hidden="true" />
              <span className="flex-1">
                {ingredient.name}
                {ingredient.amount && (
                  <span className="text-[var(--foreground-tertiary)]"> ({ingredient.amount})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
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

      {/* Side Dish */}
      {meal.sideDish && (
        <section className="border-t border-[var(--separator)] px-4 py-3">
          <div className="flex items-center gap-2">
            <Utensils size={14} className="text-[var(--system-teal)]" />
            <span className="text-sm font-medium text-[var(--foreground)]">Beilage</span>
          </div>
          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">{meal.sideDish}</p>
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

      {/* Note Section Placeholder - Will be filled by MealNoteEditor */}
      <section className="border-t border-[var(--separator)] px-4 py-3">
        <div className="flex items-center gap-2 text-[var(--foreground-tertiary)]">
          <StickyNote size={14} />
          <span className="text-sm">Notiz hinzufügen...</span>
        </div>
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
