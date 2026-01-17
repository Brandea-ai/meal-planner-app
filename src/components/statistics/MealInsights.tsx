'use client';

import { ChefHat, Leaf, Fish, Bean } from 'lucide-react';

interface TopMeal {
  mealId: number;
  title: string;
  count: number;
}

interface NutritionProfile {
  proteinMeals: number;
  vegetarianMeals: number;
  omega3Meals: number;
  legumeMeals: number;
}

interface MealInsightsProps {
  topMeals: TopMeal[];
  nutritionProfile: NutritionProfile;
}

export function MealInsights({ topMeals, nutritionProfile }: MealInsightsProps) {
  const totalMeals = nutritionProfile.proteinMeals + nutritionProfile.vegetarianMeals + nutritionProfile.omega3Meals + nutritionProfile.legumeMeals;

  const nutritionItems = [
    {
      icon: ChefHat,
      label: 'Proteinreich',
      count: nutritionProfile.proteinMeals,
      color: 'var(--system-purple)',
    },
    {
      icon: Leaf,
      label: 'Vegetarisch',
      count: nutritionProfile.vegetarianMeals,
      color: 'var(--system-green)',
    },
    {
      icon: Fish,
      label: 'Omega-3',
      count: nutritionProfile.omega3Meals,
      color: 'var(--system-blue)',
    },
    {
      icon: Bean,
      label: 'Hülsenfrüchte',
      count: nutritionProfile.legumeMeals,
      color: 'var(--system-orange)',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top Meals */}
      <div className="rounded-[12px] bg-[var(--background-secondary)] p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Meistgekochte Gerichte</h3>

        {topMeals.length > 0 ? (
          <div className="mt-3 space-y-2">
            {topMeals.map((meal, index) => (
              <div
                key={meal.mealId}
                className="flex items-center gap-3 rounded-[10px] bg-[var(--fill-tertiary)] p-3"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                  index === 0
                    ? 'bg-[var(--system-yellow)] text-white'
                    : index === 1
                    ? 'bg-[var(--gray-3)] text-white'
                    : index === 2
                    ? 'bg-[var(--system-orange)]/70 text-white'
                    : 'bg-[var(--fill-secondary)] text-[var(--foreground-secondary)]'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">{meal.title}</p>
                </div>
                <span className="text-sm text-[var(--foreground-tertiary)]">
                  {meal.count}x
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-[var(--foreground-tertiary)]">
            Noch keine Daten vorhanden
          </p>
        )}
      </div>

      {/* Nutrition Profile */}
      <div className="rounded-[12px] bg-[var(--background-secondary)] p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Ernährungs-Profil</h3>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {nutritionItems.map((item) => {
            const Icon = item.icon;
            const percentage = totalMeals > 0 ? Math.round((item.count / totalMeals) * 100) : 0;

            return (
              <div
                key={item.label}
                className="rounded-[10px] bg-[var(--fill-tertiary)] p-3"
              >
                <div className="flex items-center gap-2">
                  <Icon size={16} style={{ color: item.color }} />
                  <span className="text-xs text-[var(--foreground-secondary)]">{item.label}</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[var(--foreground)]">{item.count}</span>
                    <span className="text-xs text-[var(--foreground-tertiary)]">({percentage}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
