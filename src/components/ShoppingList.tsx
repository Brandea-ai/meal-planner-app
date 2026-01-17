'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { breakfastShoppingList, dinnerShoppingList, categoryLabels, mealTypeLabels } from '@/data/meals';
import { MealType } from '@/types';

type ShoppingFilter = MealType | 'all';

const categoryIcons: Record<string, string> = {
  fresh: '🥬',
  protein: '🥩',
  dairy: '🥛',
  legumes: '🫘',
  grains: '🌾',
  basics: '🫒',
  extras: '🧂',
};

const categoryOrder = ['fresh', 'protein', 'dairy', 'legumes', 'grains', 'basics', 'extras'];

export function ShoppingList() {
  const { progress, toggleShoppingItem } = useApp();
  const [filter, setFilter] = useState<ShoppingFilter>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categoryOrder);

  // Get filtered shopping list
  const shoppingList = useMemo(() => {
    if (filter === 'breakfast') {
      return breakfastShoppingList;
    }
    if (filter === 'dinner') {
      return dinnerShoppingList;
    }
    // For 'all', combine both lists (items with mealType 'both' are already in breakfast list)
    const combined = [...breakfastShoppingList];
    dinnerShoppingList.forEach((item) => {
      // Check if item already exists (by name)
      const exists = combined.some((existing) => existing.name === item.name);
      if (!exists) {
        combined.push(item);
      }
    });
    return combined;
  }, [filter]);

  // Get available categories based on current shopping list
  const availableCategories = useMemo(() => {
    const cats = new Set(shoppingList.map((item) => item.category));
    return categoryOrder.filter((cat) => cats.has(cat as typeof shoppingList[number]['category']));
  }, [shoppingList]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryItems = (category: string) =>
    shoppingList.filter((item) => item.category === category);

  const getCategoryProgress = (category: string) => {
    const items = getCategoryItems(category);
    const checked = items.filter((item) =>
      progress.shoppingListChecked.includes(item.name)
    ).length;
    return { checked, total: items.length };
  };

  const totalProgress = useMemo(() => ({
    checked: shoppingList.filter((item) =>
      progress.shoppingListChecked.includes(item.name)
    ).length,
    total: shoppingList.length,
  }), [shoppingList, progress.shoppingListChecked]);

  return (
    <section className="rounded-2xl border-2 border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <header className="border-b border-gray-100 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Einkaufsliste
          </h2>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
            {totalProgress.checked}/{totalProgress.total}
          </span>
        </div>

        {/* Filter Toggle */}
        <div className="mt-3 flex justify-center">
          <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-gray-700">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === 'all'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Alles
            </button>
            <button
              onClick={() => setFilter('breakfast')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === 'breakfast'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {mealTypeLabels.breakfast}
            </button>
            <button
              onClick={() => setFilter('dinner')}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === 'dinner'
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              {mealTypeLabels.dinner}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          Für 2 Personen / 7 Tage
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${totalProgress.total > 0 ? (totalProgress.checked / totalProgress.total) * 100 : 0}%` }}
            role="progressbar"
            aria-valuenow={totalProgress.checked}
            aria-valuemin={0}
            aria-valuemax={totalProgress.total}
            aria-label={`${totalProgress.checked} von ${totalProgress.total} Artikeln eingekauft`}
          />
        </div>
      </header>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {availableCategories.map((category) => {
          const items = getCategoryItems(category);
          const { checked, total } = getCategoryProgress(category);
          const isExpanded = expandedCategories.includes(category);

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
                aria-expanded={isExpanded}
                aria-controls={`category-${category}`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl" aria-hidden="true">
                    {categoryIcons[category]}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {categoryLabels[category]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {checked}/{total}
                  </span>
                  <span
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </div>
              </button>

              {isExpanded && (
                <ul
                  id={`category-${category}`}
                  className="border-t border-gray-50 bg-gray-50/50 px-4 pb-4 dark:border-gray-700 dark:bg-gray-900/30"
                >
                  {items.map((item) => {
                    const isChecked = progress.shoppingListChecked.includes(item.name);
                    return (
                      <li key={item.name}>
                        <label className="flex cursor-pointer items-center gap-3 py-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleShoppingItem(item.name)}
                            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700"
                          />
                          <span
                            className={`flex-1 ${
                              isChecked
                                ? 'text-gray-400 line-through'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-400">
                            {item.amount}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
