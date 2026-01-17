'use client';

import { useState } from 'react';
import { X, Plus, Leaf, Drumstick, Milk, Bean, Wheat, Droplets, Sparkles } from 'lucide-react';
import { categoryLabels, mealTypeLabels } from '@/data/meals';

type Category = 'fresh' | 'protein' | 'dairy' | 'legumes' | 'grains' | 'basics' | 'extras';
type MealType = 'breakfast' | 'dinner' | 'both';

interface CustomItemFormProps {
  onSubmit: (item: {
    name: string;
    amount: string;
    category: Category;
    mealType: MealType;
  }) => void;
  onClose: () => void;
}

const categoryIcons: Record<Category, React.ComponentType<{ size?: number; className?: string }>> = {
  fresh: Leaf,
  protein: Drumstick,
  dairy: Milk,
  legumes: Bean,
  grains: Wheat,
  basics: Droplets,
  extras: Sparkles,
};

export function CustomItemForm({ onSubmit, onClose }: CustomItemFormProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('extras');
  const [mealType, setMealType] = useState<MealType>('both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        amount: amount.trim(),
        category,
        mealType,
      });
      onClose();
    }
  };

  const categories: Category[] = ['fresh', 'protein', 'dairy', 'legumes', 'grains', 'basics', 'extras'];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-sm rounded-t-[20px] bg-[var(--background)] p-6 sm:rounded-[20px]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="w-10" />
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Artikel hinzufügen
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fill-tertiary)] transition-none active:opacity-80"
            aria-label="Schließen"
          >
            <X size={20} className="text-[var(--foreground)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Tomaten"
              className="w-full rounded-[10px] border-0 bg-[var(--fill-tertiary)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
              required
              autoFocus
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              Menge (optional)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="z.B. 500g"
              className="w-full rounded-[10px] border-0 bg-[var(--fill-tertiary)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--system-blue)]"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              Kategorie
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat];
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center gap-1 rounded-[10px] p-2 transition-none active:opacity-80 ${
                      isSelected
                        ? 'bg-[var(--system-blue)] text-white'
                        : 'bg-[var(--fill-tertiary)] text-[var(--foreground-secondary)]'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-[10px] leading-tight">{categoryLabels[cat].split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meal Type Selection */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[var(--foreground)]">
              Für
            </label>
            <div className="flex rounded-[10px] bg-[var(--fill-tertiary)] p-0.5">
              <button
                type="button"
                onClick={() => setMealType('breakfast')}
                className={`flex-1 rounded-[8px] py-2 text-sm font-medium transition-none active:opacity-80 ${
                  mealType === 'breakfast'
                    ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-secondary)]'
                }`}
              >
                {mealTypeLabels.breakfast}
              </button>
              <button
                type="button"
                onClick={() => setMealType('dinner')}
                className={`flex-1 rounded-[8px] py-2 text-sm font-medium transition-none active:opacity-80 ${
                  mealType === 'dinner'
                    ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-secondary)]'
                }`}
              >
                {mealTypeLabels.dinner}
              </button>
              <button
                type="button"
                onClick={() => setMealType('both')}
                className={`flex-1 rounded-[8px] py-2 text-sm font-medium transition-none active:opacity-80 ${
                  mealType === 'both'
                    ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--foreground-secondary)]'
                }`}
              >
                Beides
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--system-blue)] py-3.5 font-semibold text-white transition-none active:opacity-80 disabled:opacity-50"
          >
            <Plus size={18} />
            Hinzufügen
          </button>
        </form>
      </div>
    </div>
  );
}
