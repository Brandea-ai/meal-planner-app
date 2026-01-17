'use client';

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
      className={`rounded-2xl border-2 transition-all duration-300 ${
        isCompleted
          ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
          : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
      }`}
      aria-label={`Tag ${meal.day}: ${meal.title}`}
    >
      {/* Header */}
      <header className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Tag {meal.day}
            </span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {meal.title}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {meal.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-full bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200">
              {meal.prepTime} Min
            </span>
          </div>
        </div>

        {/* Cultural Tags */}
        <div className="mt-2 flex flex-wrap gap-1" role="list" aria-label="Kulturelle Einflüsse">
          {meal.culturalOrigin.map((origin) => (
            <span
              key={origin}
              role="listitem"
              className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/50 dark:text-blue-200"
            >
              {origin}
            </span>
          ))}
        </div>
      </header>

      {/* Ingredients */}
      <section className="p-4 pt-2" aria-labelledby={`ingredients-${meal.id}`}>
        <h3 id={`ingredients-${meal.id}`} className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Zutaten
        </h3>
        <ul className="grid grid-cols-2 gap-1 text-sm">
          {meal.ingredients.map((ingredient, idx) => (
            <li
              key={idx}
              className="flex items-center gap-1 text-gray-600 dark:text-gray-400"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gray-400" aria-hidden="true" />
              <span>
                {ingredient.name}
                {ingredient.amount && (
                  <span className="text-gray-400"> ({ingredient.amount})</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Side Dish */}
      {meal.sideDish && (
        <section className="border-t border-gray-100 p-4 pt-3 dark:border-gray-700">
          <p className="text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Beilage: </span>
            <span className="text-gray-600 dark:text-gray-400">{meal.sideDish}</span>
          </p>
        </section>
      )}

      {/* Benefit */}
      <section className="border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/50">
        <p className="text-sm italic text-gray-600 dark:text-gray-400">
          {meal.benefit}
        </p>
      </section>

      {/* Tags */}
      <section className="px-4 py-2" aria-label="Tags">
        <div className="flex flex-wrap gap-1">
          {meal.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* Complete Button */}
      <footer className="p-4 pt-2">
        <button
          onClick={handleToggleComplete}
          className={`w-full rounded-xl py-3 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isCompleted
              ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
              : 'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100'
          }`}
          aria-pressed={isCompleted}
        >
          {isCompleted ? '✓ Erledigt' : 'Als erledigt markieren'}
        </button>
      </footer>
    </article>
  );
}
