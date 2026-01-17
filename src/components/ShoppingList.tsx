'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { shoppingList, categoryLabels } from '@/data/meals';

export function ShoppingList() {
  const { progress, toggleShoppingItem } = useApp();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['fresh', 'protein', 'basics', 'extras']);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const categories = ['fresh', 'protein', 'basics', 'extras'] as const;

  const getCategoryItems = (category: typeof categories[number]) =>
    shoppingList.filter((item) => item.category === category);

  const getCategoryProgress = (category: typeof categories[number]) => {
    const items = getCategoryItems(category);
    const checked = items.filter((item) =>
      progress.shoppingListChecked.includes(item.name)
    ).length;
    return { checked, total: items.length };
  };

  const totalProgress = {
    checked: progress.shoppingListChecked.length,
    total: shoppingList.length,
  };

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
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Für 2 Personen / 7 Tage
        </p>
        {/* Progress bar */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${(totalProgress.checked / totalProgress.total) * 100}%` }}
            role="progressbar"
            aria-valuenow={totalProgress.checked}
            aria-valuemin={0}
            aria-valuemax={totalProgress.total}
            aria-label={`${totalProgress.checked} von ${totalProgress.total} Artikeln eingekauft`}
          />
        </div>
      </header>

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {categories.map((category) => {
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
                    {category === 'fresh' && '🥬'}
                    {category === 'protein' && '🥚'}
                    {category === 'basics' && '🍞'}
                    {category === 'extras' && '🥜'}
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
