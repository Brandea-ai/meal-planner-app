'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Leaf, Drumstick, Milk, Bean, Wheat, Droplets, Sparkles, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { breakfastShoppingList, dinnerShoppingList, categoryLabels, mealTypeLabels } from '@/data/meals';
import { MealType } from '@/types';
import { scaleAmount, getServingsLabel } from '@/utils/portionScaling';

type ShoppingFilter = MealType | 'all';

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  fresh: Leaf,
  protein: Drumstick,
  dairy: Milk,
  legumes: Bean,
  grains: Wheat,
  basics: Droplets,
  extras: Sparkles,
};

const categoryOrder = ['fresh', 'protein', 'dairy', 'legumes', 'grains', 'basics', 'extras'];

export function ShoppingList() {
  const { progress, toggleShoppingItem } = useApp();
  const [filter, setFilter] = useState<ShoppingFilter>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categoryOrder);

  const servings = progress.preferences.servings;

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
    <section className="overflow-hidden rounded-[12px] bg-[var(--background-secondary)]">
      {/* Header */}
      <header className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[var(--foreground)]">
            Einkaufsliste
          </h2>
          <span className="rounded-full bg-[var(--system-blue)]/15 px-3 py-1 text-sm font-semibold text-[var(--system-blue)]">
            {totalProgress.checked}/{totalProgress.total}
          </span>
        </div>

        {/* Filter Toggle - Segmented Control */}
        <div className="mt-4">
          <div className="flex rounded-[10px] bg-[var(--fill-tertiary)] p-0.5">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 rounded-[8px] px-3 py-2 text-sm font-medium transition-none active:opacity-80 ${
                filter === 'all'
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--foreground-secondary)]'
              }`}
            >
              Alles
            </button>
            <button
              onClick={() => setFilter('breakfast')}
              className={`flex-1 rounded-[8px] px-3 py-2 text-sm font-medium transition-none active:opacity-80 ${
                filter === 'breakfast'
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--foreground-secondary)]'
              }`}
            >
              {mealTypeLabels.breakfast}
            </button>
            <button
              onClick={() => setFilter('dinner')}
              className={`flex-1 rounded-[8px] px-3 py-2 text-sm font-medium transition-none active:opacity-80 ${
                filter === 'dinner'
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--foreground-secondary)]'
              }`}
            >
              {mealTypeLabels.dinner}
            </button>
          </div>
        </div>

        <p className="mt-3 text-center text-sm text-[var(--foreground-tertiary)]">
          {getServingsLabel(servings)} · 7 Tage
        </p>

        {/* Progress bar */}
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-[var(--fill-secondary)]">
          <div
            className="h-full bg-[var(--system-green)] transition-all duration-300"
            style={{ width: `${totalProgress.total > 0 ? (totalProgress.checked / totalProgress.total) * 100 : 0}%` }}
            role="progressbar"
            aria-valuenow={totalProgress.checked}
            aria-valuemin={0}
            aria-valuemax={totalProgress.total}
            aria-label={`${totalProgress.checked} von ${totalProgress.total} Artikeln eingekauft`}
          />
        </div>
      </header>

      {/* Add Custom Item Button */}
      <div className="border-t border-[var(--separator)] px-4 py-3">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--fill-tertiary)] py-3 text-sm font-medium text-[var(--system-blue)] transition-none active:opacity-80"
        >
          <Plus size={18} />
          Eigenen Artikel hinzufügen
        </button>
      </div>

      {/* Categories */}
      <div>
        {availableCategories.map((category, index) => {
          const items = getCategoryItems(category);
          const { checked, total } = getCategoryProgress(category);
          const isExpanded = expandedCategories.includes(category);
          const IconComponent = categoryIcons[category] || Sparkles;

          return (
            <div key={category}>
              {/* Inset separator (not on first item) */}
              {index > 0 && <div className="inset-separator" />}

              <button
                onClick={() => toggleCategory(category)}
                className="flex min-h-[44px] w-full items-center justify-between px-4 py-3 text-left transition-none active:opacity-80"
                aria-expanded={isExpanded}
                aria-controls={`category-${category}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--fill-secondary)]">
                    <IconComponent size={18} className="text-[var(--foreground-secondary)]" />
                  </div>
                  <span className="font-semibold text-[var(--foreground)]">
                    {categoryLabels[category]}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[var(--foreground-tertiary)]">
                    {checked}/{total}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-[var(--gray-2)] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {isExpanded && (
                <ul
                  id={`category-${category}`}
                  className="bg-[var(--background)] pb-2"
                >
                  {items.map((item) => {
                    const isChecked = progress.shoppingListChecked.includes(item.name);
                    const scaledAmount = scaleAmount(item.amount, servings, item.category);

                    return (
                      <li key={item.name}>
                        <label className="flex min-h-[44px] cursor-pointer items-center gap-3 px-4 py-2 transition-none active:opacity-80">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleShoppingItem(item.name)}
                            className="flex-shrink-0"
                          />
                          <span
                            className={`flex-1 text-[15px] ${
                              isChecked
                                ? 'text-[var(--foreground-tertiary)] line-through'
                                : 'text-[var(--foreground)]'
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-sm text-[var(--foreground-tertiary)]">
                            {scaledAmount}
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
