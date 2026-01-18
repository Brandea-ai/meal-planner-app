'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Leaf, Drumstick, Milk, Bean, Wheat, Droplets, Sparkles, Plus, Trash2, Search, X, Pencil, Check, RefreshCw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { unifiedShoppingList, categoryLabels } from '@/data/meals';
import { LocalCustomShoppingItem, ShoppingItem, Ingredient } from '@/types';
import { scaleAmount, getServingsLabel } from '@/utils/portionScaling';
import { CustomItemForm } from './CustomItemForm';
import confetti from 'canvas-confetti';

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

interface EditingItem {
  name: string;
  newName: string;
  newAmount: string;
}

export function ShoppingList() {
  const { progress, toggleShoppingItem, addCustomShoppingItem, removeCustomShoppingItem, toggleCustomShoppingItem, propagateIngredientChange, findMealsWithIngredient, hideIngredient } = useApp();
  const [expandedCategories, setExpandedCategories] = useState<string[]>(categoryOrder);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [showSyncConfirm, setShowSyncConfirm] = useState<{ item: ShoppingItem; affectedMeals: number } | null>(null);
  const [addingToCategory, setAddingToCategory] = useState<string | null>(null);
  const [newCategoryItem, setNewCategoryItem] = useState({ name: '', amount: '' });
  const [deletingItem, setDeletingItem] = useState<{ name: string; affectedMeals: number } | null>(null);

  // Confetti animation for checking off items
  const triggerConfetti = useCallback((e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { x, y },
      colors: ['#34C759', '#30D158', '#32D74B', '#FFD60A', '#FF9F0A'],
      ticks: 100,
      gravity: 1.2,
      scalar: 0.8,
      shapes: ['circle', 'square'],
      disableForReducedMotion: true,
    });
  }, []);

  // Toggle with confetti for standard items
  const handleToggleWithConfetti = useCallback((itemName: string, isCurrentlyChecked: boolean, e: React.MouseEvent) => {
    if (!isCurrentlyChecked) {
      triggerConfetti(e);
    }
    toggleShoppingItem(itemName);
  }, [toggleShoppingItem, triggerConfetti]);

  // Toggle with confetti for custom items
  const handleToggleCustomWithConfetti = useCallback((itemId: string, isCurrentlyChecked: boolean, e: React.MouseEvent) => {
    if (!isCurrentlyChecked) {
      triggerConfetti(e);
    }
    toggleCustomShoppingItem(itemId);
  }, [toggleCustomShoppingItem, triggerConfetti]);

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

  const handleStartEdit = (item: ShoppingItem) => {
    setEditingItem({
      name: item.name,
      newName: item.name,
      newAmount: scaleAmount(item.amount, servings, item.category),
    });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    const originalItem = shoppingList.find((i) => i.name === editingItem.name);
    if (!originalItem) return;

    // Check if name changed and find affected meals
    if (editingItem.newName !== editingItem.name) {
      const affectedMeals = findMealsWithIngredient(editingItem.name);
      if (affectedMeals.length > 0) {
        setShowSyncConfirm({
          item: originalItem,
          affectedMeals: affectedMeals.length,
        });
        return;
      }
    }

    setEditingItem(null);
  };

  const handleConfirmSync = () => {
    if (!editingItem || !showSyncConfirm) return;

    // Propagate the name change to all meals
    propagateIngredientChange(
      editingItem.name,
      editingItem.newName,
      showSyncConfirm.item.category as Ingredient['category']
    );

    setShowSyncConfirm(null);
    setEditingItem(null);
  };

  const handleCancelSync = () => {
    setShowSyncConfirm(null);
    setEditingItem(null);
  };

  // Category-specific add
  const handleStartAddToCategory = (category: string) => {
    setAddingToCategory(category);
    setNewCategoryItem({ name: '', amount: '' });
  };

  const handleCancelAddToCategory = () => {
    setAddingToCategory(null);
    setNewCategoryItem({ name: '', amount: '' });
  };

  const handleAddToCategory = () => {
    if (!addingToCategory || !newCategoryItem.name.trim()) return;

    addCustomShoppingItem({
      name: newCategoryItem.name.trim(),
      amount: newCategoryItem.amount.trim() || '-',
      category: addingToCategory as LocalCustomShoppingItem['category'],
      mealType: 'both',
    });

    setAddingToCategory(null);
    setNewCategoryItem({ name: '', amount: '' });
  };

  // Delete with confirmation
  const handleDeleteItem = (itemName: string) => {
    const affectedMeals = findMealsWithIngredient(itemName);
    if (affectedMeals.length > 0) {
      setDeletingItem({ name: itemName, affectedMeals: affectedMeals.length });
    } else {
      // No meals affected, just hide it
      // For standard items, we need to hide them in all meals
      affectedMeals.forEach(({ mealId, mealType }) => {
        hideIngredient(mealId, mealType, itemName);
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    // Hide from all affected meals
    const affectedMeals = findMealsWithIngredient(deletingItem.name);
    affectedMeals.forEach(({ mealId, mealType }) => {
      hideIngredient(mealId, mealType, deletingItem.name);
    });

    setDeletingItem(null);
  };

  const handleCancelDelete = () => {
    setDeletingItem(null);
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
          const customCategoryItems = getCategoryCustomItems(category);
          const { checked, total } = getCategoryProgress(category);
          const isExpanded = expandedCategories.includes(category);
          const IconComponent = categoryIcons[category] || Sparkles;
          const categoryColor = categoryColors[category];

          return (
            <div key={category}>
              <div className="flex min-h-[56px] w-full items-center justify-between px-5 py-4">
                <motion.button
                  onClick={() => toggleCategory(category)}
                  className="flex flex-1 items-center gap-3 text-left"
                  aria-expanded={isExpanded}
                  aria-controls={`category-${category}`}
                  whileTap={{ scale: 0.99 }}
                >
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
                </motion.button>

                <div className="flex items-center gap-2">
                  {/* Add Button - Clear label */}
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartAddToCategory(category);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `color-mix(in srgb, ${categoryColor} 15%, transparent)`,
                      color: categoryColor
                    }}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    aria-label={`Zu ${categoryLabels[category]} hinzufügen`}
                  >
                    <Plus size={14} />
                    <span>Neu</span>
                  </motion.button>

                  <div className="glass-inner px-2.5 py-1 text-sm">
                    <span className="font-semibold" style={{ color: checked === total && total > 0 ? 'var(--system-green)' : 'var(--foreground-secondary)' }}>
                      {checked}
                    </span>
                    <span className="text-[var(--foreground-tertiary)]">/{total}</span>
                  </div>
                  <motion.button
                    onClick={() => toggleCategory(category)}
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <ChevronDown size={20} className="text-[var(--gray-2)]" />
                  </motion.button>
                </div>
              </div>

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
                    {/* Add Form - appears at TOP when clicked */}
                    <AnimatePresence>
                      {addingToCategory === category && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-5 pt-3 overflow-hidden"
                        >
                          <div className="p-3 bg-[var(--fill-secondary)] rounded-[12px] border-2" style={{ borderColor: categoryColor }}>
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full" style={{ backgroundColor: categoryColor }}>
                                <Plus size={12} className="text-white" />
                              </div>
                              <span className="font-semibold text-sm" style={{ color: categoryColor }}>
                                Neue Zutat hinzufügen
                              </span>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={newCategoryItem.name}
                                onChange={(e) => setNewCategoryItem({ ...newCategoryItem, name: e.target.value })}
                                placeholder="Name der Zutat"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleAddToCategory()}
                                className="w-full bg-[var(--background)] rounded-[8px] px-3 py-2.5 text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
                              />
                              <input
                                type="text"
                                value={newCategoryItem.amount}
                                onChange={(e) => setNewCategoryItem({ ...newCategoryItem, amount: e.target.value })}
                                placeholder="Menge (z.B. 200g, 1 Stück)"
                                onKeyDown={(e) => e.key === 'Enter' && handleAddToCategory()}
                                className="w-full bg-[var(--background)] rounded-[8px] px-3 py-2.5 text-[14px] text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
                              />
                            </div>
                            <div className="flex gap-2 mt-3">
                              <motion.button
                                onClick={handleCancelAddToCategory}
                                className="flex-1 py-2.5 rounded-[10px] bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)] font-semibold text-sm"
                                whileTap={{ scale: 0.98 }}
                              >
                                Abbrechen
                              </motion.button>
                              <motion.button
                                onClick={handleAddToCategory}
                                disabled={!newCategoryItem.name.trim()}
                                className="flex-1 py-2.5 rounded-[10px] text-white font-semibold text-sm disabled:opacity-50"
                                style={{ backgroundColor: categoryColor }}
                                whileTap={{ scale: 0.98 }}
                              >
                                Hinzufügen
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

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
                          const isEditing = editingItem?.name === item.name;

                          return (
                            <motion.li
                              key={item.name}
                              variants={listItemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              transition={{ delay: index * 0.02 }}
                              className="group"
                            >
                              <AnimatePresence mode="wait">
                                {isEditing ? (
                                  <motion.div
                                    key="editing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[var(--fill-tertiary)]"
                                  >
                                    <div className="flex-1 space-y-2">
                                      <input
                                        type="text"
                                        value={editingItem.newName}
                                        onChange={(e) => setEditingItem({ ...editingItem, newName: e.target.value })}
                                        className="w-full bg-[var(--background)] rounded-[8px] px-3 py-2 text-[14px] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
                                        autoFocus
                                      />
                                      <input
                                        type="text"
                                        value={editingItem.newAmount}
                                        onChange={(e) => setEditingItem({ ...editingItem, newAmount: e.target.value })}
                                        className="w-full bg-[var(--background)] rounded-[8px] px-3 py-2 text-[14px] text-[var(--foreground)] border border-[var(--glass-border)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]/30"
                                      />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                      <motion.button
                                        onClick={handleSaveEdit}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--system-green)] text-white"
                                        whileTap={{ scale: 0.9 }}
                                      >
                                        <Check size={16} />
                                      </motion.button>
                                      <motion.button
                                        onClick={handleCancelEdit}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--fill-secondary)] text-[var(--foreground-secondary)]"
                                        whileTap={{ scale: 0.9 }}
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
                                    onClick={(e) => handleToggleWithConfetti(item.name, isChecked, e)}
                                    className="flex min-h-[48px] items-center gap-3 px-5 py-2.5 transition-colors hover:bg-[var(--vibrancy-regular)] cursor-pointer active:scale-[0.99]"
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && toggleShoppingItem(item.name)}
                                  >
                                    <motion.div
                                      whileTap={{ scale: 0.85 }}
                                      className="relative"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <div
                                        onClick={(e) => handleToggleWithConfetti(item.name, isChecked, e)}
                                        className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                                          isChecked
                                            ? 'border-[var(--system-green)] bg-[var(--system-green)]'
                                            : 'border-[var(--gray-2)] bg-transparent hover:border-[var(--gray-1)]'
                                        }`}
                                      >
                                        {isChecked && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                          >
                                            <Check size={14} className="text-white" strokeWidth={3} />
                                          </motion.div>
                                        )}
                                      </div>
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
                                    <div
                                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <motion.button
                                        onClick={() => handleStartEdit(item)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--foreground-secondary)] hover:bg-[var(--fill-secondary)]"
                                        whileTap={{ scale: 0.9 }}
                                        aria-label={`${item.name} bearbeiten`}
                                      >
                                        <Pencil size={14} />
                                      </motion.button>
                                      <motion.button
                                        onClick={() => handleDeleteItem(item.name)}
                                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--system-red)] hover:bg-[var(--system-red)]/10"
                                        whileTap={{ scale: 0.9 }}
                                        aria-label={`${item.name} löschen`}
                                      >
                                        <Trash2 size={14} />
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
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
                                className="group"
                              >
                                <div
                                  onClick={(e) => handleToggleCustomWithConfetti(item.id, item.isChecked, e)}
                                  className="flex min-h-[48px] items-center gap-3 px-5 py-2.5 cursor-pointer hover:bg-[var(--vibrancy-regular)] transition-colors active:scale-[0.99]"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => e.key === 'Enter' && toggleCustomShoppingItem(item.id)}
                                >
                                  <motion.div
                                    whileTap={{ scale: 0.85 }}
                                    className="relative"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div
                                      onClick={(e) => handleToggleCustomWithConfetti(item.id, item.isChecked, e)}
                                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all cursor-pointer ${
                                        item.isChecked
                                          ? 'border-[var(--system-green)] bg-[var(--system-green)]'
                                          : 'border-[var(--gray-2)] bg-transparent hover:border-[var(--gray-1)]'
                                      }`}
                                    >
                                      {item.isChecked && (
                                        <motion.div
                                          initial={{ scale: 0 }}
                                          animate={{ scale: 1 }}
                                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        >
                                          <Check size={14} className="text-white" strokeWidth={3} />
                                        </motion.div>
                                      )}
                                    </div>
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeCustomShoppingItem(item.id);
                                    }}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--system-red)] bg-[var(--system-red)]/10 opacity-0 group-hover:opacity-100 transition-opacity"
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

      {/* Sync Confirmation Modal */}
      <AnimatePresence>
        {showSyncConfirm && editingItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelSync}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="pointer-events-auto mx-4 max-w-md w-full glass-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-blue)]/15">
                    <RefreshCw size={24} className="text-[var(--system-blue)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">Änderung synchronisieren?</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {showSyncConfirm.affectedMeals} Mahlzeit{showSyncConfirm.affectedMeals !== 1 ? 'en' : ''} betroffen
                    </p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-[var(--fill-tertiary)] rounded-[12px]">
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    &quot;{editingItem.name}&quot; wird in allen betroffenen Mahlzeiten zu &quot;{editingItem.newName}&quot; geändert.
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={handleCancelSync}
                    className="flex-1 py-3.5 rounded-[12px] bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)] font-semibold"
                    whileTap={{ scale: 0.98 }}
                  >
                    Abbrechen
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmSync}
                    className="flex-1 py-3.5 rounded-[12px] bg-[var(--system-blue)] text-white font-semibold"
                    whileTap={{ scale: 0.98 }}
                  >
                    Synchronisieren
                  </motion.button>
                </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingItem && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelDelete}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="pointer-events-auto mx-4 max-w-md w-full glass-card overflow-hidden">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-red)]/15">
                    <Trash2 size={24} className="text-[var(--system-red)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--foreground)]">Zutat löschen?</h3>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      {deletingItem.affectedMeals} Mahlzeit{deletingItem.affectedMeals !== 1 ? 'en' : ''} betroffen
                    </p>
                  </div>
                </div>

                <div className="mb-4 p-3 bg-[var(--fill-tertiary)] rounded-[12px]">
                  <p className="text-sm text-[var(--foreground-secondary)]">
                    &quot;{deletingItem.name}&quot; wird aus allen betroffenen Mahlzeiten entfernt.
                  </p>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={handleCancelDelete}
                    className="flex-1 py-3.5 rounded-[12px] bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)] font-semibold"
                    whileTap={{ scale: 0.98 }}
                  >
                    Abbrechen
                  </motion.button>
                  <motion.button
                    onClick={handleConfirmDelete}
                    className="flex-1 py-3.5 rounded-[12px] bg-[var(--system-red)] text-white font-semibold"
                    whileTap={{ scale: 0.98 }}
                  >
                    Löschen
                  </motion.button>
                </div>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
