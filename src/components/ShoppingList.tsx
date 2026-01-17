'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Leaf, Drumstick, Milk, Bean, Wheat, Droplets, Sparkles, Plus, Trash2, Search, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { unifiedShoppingList, categoryLabels } from '@/data/meals';
import { LocalCustomShoppingItem } from '@/types';
import { scaleAmount, getServingsLabel } from '@/utils/portionScaling';
import { CustomItemForm } from './CustomItemForm';

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  fresh: Leaf,
  protein: Drumstick,
  dairy: Milk,
  legumes: Bean,
  grains: Wheat,
  basics: Droplets,
  extras: Sparkles,
};

const categoryColors: Record<string, string> = {
  fresh: 'var(--system-green)',
  protein: 'var(--system-red)',
  dairy: 'var(--system-blue)',
  legumes: 'var(--system-orange)',
  grains: 'var(--system-yellow)',
  basics: 'var(--system-teal)',
  extras: 'var(--system-purple)',
};

const categoryOrder = ['fresh', 'protein', 'dairy', 'legumes', 'grains', 'basics', 'extras'];

const listItemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 10 },
};

export function ShoppingList() {
  const { progress, toggleShoppingItem, addCustomShoppingItem, removeCustomShoppingItem, toggleCustomShoppingItem } = useApp();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categoryOrder);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const servings = progress.preferences.servings;
  const customItems = progress.customShoppingItems || [];
  const shoppingList = unifiedShoppingList;

  // Filter items based on search query
  const normalizedQuery = searchQuery.toLowerCase().trim();

  const filteredShoppingList = useMemo(() => {
    if (!normalizedQuery) return shoppingList;
    return shoppingList.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery)
    );
  }, [shoppingList, normalizedQuery]);

  const filteredCustomItems = useMemo(() => {
    if (!normalizedQuery) return customItems;
    return customItems.filter((item) =>
      item.name.toLowerCase().includes(normalizedQuery)
    );
  }, [customItems, normalizedQuery]);

  const availableCategories = useMemo(() => {
    const cats = new Set([
      ...filteredShoppingList.map((item) => item.category),
      ...filteredCustomItems.map((item) => item.category),
    ]);
    return categoryOrder.filter((cat) => cats.has(cat as typeof shoppingList[number]['category']));
  }, [filteredShoppingList, filteredCustomItems, shoppingList]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryItems = (category: string) =>
    filteredShoppingList.filter((item) => item.category === category);

  const getCategoryMainItems = (category: string) =>
    filteredShoppingList.filter((item) => item.category === category && !item.forSideDish);

  const getCategorySideItems = (category: string) =>
    filteredShoppingList.filter((item) => item.category === category && item.forSideDish);

  const getCategoryCustomItems = (category: string) =>
    filteredCustomItems.filter((item) => item.category === category);

  const getCategoryProgress = (category: string) => {
    const standardItems = getCategoryItems(category);
    const customCategoryItems = getCategoryCustomItems(category);
    const standardChecked = standardItems.filter((item) =>
      progress.shoppingListChecked.includes(item.name)
    ).length;
    const customChecked = customCategoryItems.filter((item) => item.isChecked).length;
    return {
      checked: standardChecked + customChecked,
      total: standardItems.length + customCategoryItems.length
    };
  };

  const totalProgress = useMemo(() => {
    const standardChecked = shoppingList.filter((item) =>
      progress.shoppingListChecked.includes(item.name)
    ).length;
    const customChecked = customItems.filter((item) => item.isChecked).length;
    return {
      checked: standardChecked + customChecked,
      total: shoppingList.length + customItems.length,
    };
  }, [shoppingList, progress.shoppingListChecked, customItems]);

  const handleAddCustomItem = (item: { name: string; amount: string; category: LocalCustomShoppingItem['category']; mealType: 'breakfast' | 'dinner' | 'both' }) => {
    addCustomShoppingItem(item);
    setShowCustomForm(false);
  };

  return (
    <motion.section
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Header */}
      <header className="p-5 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">
            Einkaufsliste
          </h2>
          <motion.div
            className="glass-inner px-3 py-1.5 flex items-center gap-1.5"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-bold text-[var(--system-blue)]">
              {totalProgress.checked}
            </span>
            <span className="text-sm text-[var(--foreground-tertiary)]">/</span>
            <span className="text-sm text-[var(--foreground-tertiary)]">
              {totalProgress.total}
            </span>
          </motion.div>
        </div>

        <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
          Alle Zutaten für Frühstück + Abendessen
        </p>

        <p className="mt-1 text-center text-sm text-[var(--foreground-tertiary)]">
          {getServingsLabel(servings)} · 7 Tage
        </p>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[var(--fill-tertiary)]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--system-green)] to-[var(--system-teal)]"
            initial={{ width: 0 }}
            animate={{ width: `${totalProgress.total > 0 ? (totalProgress.checked / totalProgress.total) * 100 : 0}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            role="progressbar"
            aria-valuenow={totalProgress.checked}
            aria-valuemin={0}
            aria-valuemax={totalProgress.total}
            aria-label={`${totalProgress.checked} von ${totalProgress.total} Artikeln eingekauft`}
          />
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-tertiary)]">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Zutat suchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-[12px] border border-[var(--glass-border)] bg-[var(--fill-tertiary)] py-3 pl-10 pr-10 text-[15px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
          />
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--fill-secondary)] text-[var(--foreground-secondary)]"
              >
                <X size={14} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Add Custom Item Button */}
      <div className="border-t border-[var(--glass-border)] px-5 py-4">
        <motion.button
          onClick={() => setShowCustomForm(true)}
          className="flex w-full items-center justify-center gap-2 glass-inner py-3.5 text-sm font-semibold text-[var(--system-blue)]"
          whileTap={{ scale: 0.98 }}
          whileHover={{ scale: 1.01 }}
        >
          <Plus size={18} />
          Eigenen Artikel hinzufügen
        </motion.button>
      </div>

      {/* Categories */}
      <div className="divide-y divide-[var(--glass-border)]">
        {/* No results message */}
        {searchQuery && availableCategories.length === 0 && (
          <div className="px-5 py-8 text-center">
            <div className="flex justify-center mb-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--fill-tertiary)]">
                <Search size={24} className="text-[var(--foreground-tertiary)]" />
              </div>
            </div>
            <p className="text-[var(--foreground-secondary)]">
              Keine Zutaten gefunden für &quot;{searchQuery}&quot;
            </p>
          </div>
        )}

        {availableCategories.map((category) => {
          const items = getCategoryItems(category);
          const customCategoryItems = getCategoryCustomItems(category);
          const { checked, total } = getCategoryProgress(category);
          const isExpanded = expandedCategories.includes(category);
          const IconComponent = categoryIcons[category] || Sparkles;
          const categoryColor = categoryColors[category];

          return (
            <div key={category}>
              <motion.button
                onClick={() => toggleCategory(category)}
                className="flex min-h-[56px] w-full items-center justify-between px-5 py-4 text-left"
                aria-expanded={isExpanded}
                aria-controls={`category-${category}`}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: `color-mix(in srgb, ${categoryColor} 15%, transparent)` }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <span style={{ color: categoryColor }}>
                      <IconComponent size={20} />
                    </span>
                  </motion.div>
                  <span className="font-semibold text-[var(--foreground)]">
                    {categoryLabels[category]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="glass-inner px-2.5 py-1 text-sm">
                    <span className="font-semibold" style={{ color: checked === total && total > 0 ? 'var(--system-green)' : 'var(--foreground-secondary)' }}>
                      {checked}
                    </span>
                    <span className="text-[var(--foreground-tertiary)]">/{total}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <ChevronDown size={20} className="text-[var(--gray-2)]" />
                  </motion.div>
                </div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    id={`category-${category}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="overflow-hidden bg-[var(--vibrancy-thin)]"
                  >
                    <div className="pb-3">
                      {(() => {
                        const mainItems = getCategoryMainItems(category);
                        const sideItems = getCategorySideItems(category);
                        const hasMainItems = mainItems.length > 0;
                        const hasSideItems = sideItems.length > 0;
                        const showLabels = hasMainItems && hasSideItems;

                        const renderItem = (item: typeof shoppingList[0], index: number) => {
                          const isChecked = progress.shoppingListChecked.includes(item.name);
                          const scaledAmount = scaleAmount(item.amount, servings, item.category);

                          return (
                            <motion.li
                              key={item.name}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ delay: index * 0.02 }}
                            >
                              <label className="flex min-h-[48px] cursor-pointer items-center gap-3 px-5 py-2.5 transition-colors hover:bg-[var(--vibrancy-regular)]">
                                <motion.div whileTap={{ scale: 0.9 }}>
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleShoppingItem(item.name)}
                                    className="flex-shrink-0"
                                  />
                                </motion.div>
                                <span
                                  className={`flex-1 text-[15px] transition-all ${
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
                            </motion.li>
                          );
                        };

                        return (
                          <>
                            {hasMainItems && (
                              <>
                                {showLabels && (
                                  <div className="px-5 pt-3 pb-1">
                                    <span className="text-xs font-semibold text-[var(--system-blue)]">Hauptgericht</span>
                                  </div>
                                )}
                                <ul>
                                  {mainItems.map((item, index) => renderItem(item, index))}
                                </ul>
                              </>
                            )}

                            {hasSideItems && (
                              <>
                                {showLabels && (
                                  <div className="px-5 pt-3 pb-1">
                                    <span className="text-xs font-semibold text-[var(--system-teal)]">Beilage / Dip</span>
                                  </div>
                                )}
                                <ul>
                                  {sideItems.map((item, index) => renderItem(item, index))}
                                </ul>
                              </>
                            )}
                          </>
                        );
                      })()}

                      {/* Custom items */}
                      {customCategoryItems.length > 0 && (
                        <>
                          <div className="px-5 pt-3 pb-1">
                            <span className="text-xs font-semibold text-[var(--system-purple)]">Eigene Einträge</span>
                          </div>
                          <ul>
                            {customCategoryItems.map((item, index) => (
                              <motion.li
                                key={item.id}
                                variants={listItemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                transition={{ delay: index * 0.02 }}
                              >
                                <div className="flex min-h-[48px] items-center gap-3 px-5 py-2.5">
                                  <motion.div whileTap={{ scale: 0.9 }}>
                                    <input
                                      type="checkbox"
                                      checked={item.isChecked}
                                      onChange={() => toggleCustomShoppingItem(item.id)}
                                      className="flex-shrink-0"
                                    />
                                  </motion.div>
                                  <span
                                    className={`flex-1 text-[15px] ${
                                      item.isChecked
                                        ? 'text-[var(--foreground-tertiary)] line-through'
                                        : 'text-[var(--foreground)]'
                                    }`}
                                  >
                                    {item.name}
                                  </span>
                                  <span className="text-sm text-[var(--foreground-tertiary)]">
                                    {item.amount || '-'}
                                  </span>
                                  <motion.button
                                    onClick={() => removeCustomShoppingItem(item.id)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--system-red)] bg-[var(--system-red)]/10"
                                    aria-label={`${item.name} löschen`}
                                    whileTap={{ scale: 0.9 }}
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    <Trash2 size={14} />
                                  </motion.button>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Custom Item Form Modal */}
      <AnimatePresence>
        {showCustomForm && (
          <CustomItemForm
            onSubmit={handleAddCustomItem}
            onClose={() => setShowCustomForm(false)}
          />
        )}
      </AnimatePresence>
    </motion.section>
  );
}
