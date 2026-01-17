'use client';

import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
};

export function MealInsights({ topMeals, nutritionProfile }: MealInsightsProps) {
  const totalMeals =
    nutritionProfile.proteinMeals +
    nutritionProfile.vegetarianMeals +
    nutritionProfile.omega3Meals +
    nutritionProfile.legumeMeals;

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

  const getMedalStyle = (index: number) => {
    if (index === 0) {
      return {
        background: 'linear-gradient(135deg, var(--system-yellow), #d4a000)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(255, 214, 10, 0.4)',
      };
    }
    if (index === 1) {
      return {
        background: 'linear-gradient(135deg, #a8a8a8, #787878)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(120, 120, 128, 0.3)',
      };
    }
    if (index === 2) {
      return {
        background: 'linear-gradient(135deg, #cd7f32, #a0522d)',
        color: 'white',
        boxShadow: '0 2px 8px rgba(205, 127, 50, 0.3)',
      };
    }
    return {
      background: 'var(--fill-secondary)',
      color: 'var(--foreground-secondary)',
    };
  };

  return (
    <div className="space-y-4">
      {/* Top Meals */}
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.2 }}
      >
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Meistgekochte Gerichte</h3>

        {topMeals.length > 0 ? (
          <motion.div
            className="mt-3 space-y-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {topMeals.map((meal, index) => (
              <motion.div
                key={meal.mealId}
                variants={itemVariants}
                className="glass-inner flex items-center gap-3 rounded-[12px] p-3"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold"
                  style={getMedalStyle(index)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.3 + index * 0.1 }}
                >
                  {index + 1}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{meal.title}</p>
                </div>
                <span className="text-sm font-medium text-[var(--foreground-tertiary)] tabular-nums">
                  {meal.count}x
                </span>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="mt-3 text-sm text-[var(--foreground-tertiary)]">Noch keine Daten vorhanden</p>
        )}
      </motion.div>

      {/* Nutrition Profile */}
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
      >
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Ernährungs-Profil</h3>

        <motion.div
          className="mt-3 grid grid-cols-2 gap-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {nutritionItems.map((item, index) => {
            const Icon = item.icon;
            const percentage = totalMeals > 0 ? Math.round((item.count / totalMeals) * 100) : 0;

            return (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="glass-inner rounded-[12px] p-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)` }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Icon size={14} style={{ color: item.color }} />
                  </motion.div>
                  <span className="text-xs text-[var(--foreground-secondary)]">{item.label}</span>
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-1">
                    <motion.span
                      className="text-xl font-bold text-[var(--foreground)] tabular-nums"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.05 }}
                    >
                      {item.count}
                    </motion.span>
                    <span className="text-xs text-[var(--foreground-tertiary)]">({percentage}%)</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
