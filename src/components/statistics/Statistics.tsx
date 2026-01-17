'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ShoppingCart, Clock, TrendingUp, Lightbulb } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { breakfastMeals, dinnerMeals } from '@/data/meals';
import { StatCard } from './StatCard';
import { StreakTracker } from './StreakTracker';
import { CompletionChart } from './CompletionChart';
import { MealInsights } from './MealInsights';

// Calculate days since start date (pure function, called outside of useMemo)
function calculateDaysSinceStart(startDate: string | null): number {
  if (!startDate) return 0;
  const startTime = new Date(startDate).getTime();
  const now = new Date().getTime();
  return Math.floor((now - startTime) / (1000 * 60 * 60 * 24));
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
};

export function Statistics() {
  const { progress } = useApp();

  // Calculate days since start
  const daysSinceStart = calculateDaysSinceStart(progress.startDate);

  // Calculate statistics from current progress
  const stats = useMemo(() => {
    const completedDays = progress.completedDays;
    const totalDays = 7;

    // Calculate completion rates
    const totalRate = (completedDays.length / totalDays) * 100;

    // For weekly/monthly, we use the same value for now since it's a 7-day plan
    const weeklyRate = totalRate;
    const monthlyRate = totalRate;

    // Calculate current streak (consecutive days from day 1)
    let currentStreak = 0;
    for (let i = 1; i <= 7; i++) {
      if (completedDays.includes(i)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Longest streak is at least the current streak
    const longestStreak = Math.max(currentStreak, completedDays.length);

    // Shopping list progress
    const shoppingProgress = progress.shoppingListChecked.length;

    // Calculate top meals based on completed days
    const allMeals = [...breakfastMeals, ...dinnerMeals];
    const topMeals = completedDays
      .flatMap((day) => allMeals.filter((meal) => meal.day === day))
      .reduce<Record<number, { count: number; title: string }>>((acc, meal) => {
        if (!acc[meal.id]) {
          acc[meal.id] = { count: 0, title: meal.title };
        }
        acc[meal.id].count++;
        return acc;
      }, {});

    const sortedTopMeals = Object.entries(topMeals)
      .map(([id, data]) => ({
        mealId: parseInt(id),
        title: data.title,
        count: data.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Calculate nutrition profile from completed meals
    const completedMeals = completedDays.flatMap((day) =>
      allMeals.filter((meal) => meal.day === day)
    );

    const nutritionProfile = {
      proteinMeals: completedMeals.filter((m) => m.tags.includes('proteinreich')).length,
      vegetarianMeals: completedMeals.filter((m) => m.tags.includes('vegetarisch')).length,
      omega3Meals: completedMeals.filter((m) => m.tags.includes('omega-3')).length,
      legumeMeals: completedMeals.filter((m) => m.tags.includes('hulsenfruchte')).length,
    };

    return {
      completionRate: {
        weekly: weeklyRate,
        monthly: monthlyRate,
        total: totalRate,
      },
      streak: {
        current: currentStreak,
        longest: longestStreak,
      },
      topMeals: sortedTopMeals,
      shoppingProgress,
      nutritionProfile,
      completedDaysCount: completedDays.length,
    };
  }, [progress]);

  const getTipMessage = () => {
    if (stats.streak.current >= 3) {
      return 'Großartig! Du bist auf einer Serie. Bleib dran!';
    }
    if (stats.completedDaysCount === 0) {
      return 'Starte jetzt mit Tag 1 und baue deine erste Serie auf!';
    }
    return 'Mach weiter so! Versuche, jeden Tag abzuschließen.';
  };

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Quick Stats */}
      <motion.div className="grid grid-cols-2 gap-3" variants={itemVariants}>
        <StatCard
          title="Tage erledigt"
          value={`${stats.completedDaysCount}/7`}
          icon={Calendar}
          iconColor="var(--system-blue)"
        />
        <StatCard
          title="Eingekauft"
          value={stats.shoppingProgress}
          subtitle="Artikel abgehakt"
          icon={ShoppingCart}
          iconColor="var(--system-green)"
        />
        <StatCard
          title="Aktive Tage"
          value={daysSinceStart}
          subtitle="seit Start"
          icon={Clock}
          iconColor="var(--system-orange)"
        />
        <StatCard
          title="Fortschritt"
          value={`${Math.round(stats.completionRate.total)}%`}
          icon={TrendingUp}
          iconColor="var(--system-purple)"
        />
      </motion.div>

      {/* Streak Tracker */}
      <motion.div variants={itemVariants}>
        <StreakTracker
          currentStreak={stats.streak.current}
          longestStreak={stats.streak.longest}
        />
      </motion.div>

      {/* Completion Chart */}
      <motion.div variants={itemVariants}>
        <CompletionChart
          weeklyRate={stats.completionRate.weekly}
          monthlyRate={stats.completionRate.monthly}
          totalRate={stats.completionRate.total}
        />
      </motion.div>

      {/* Meal Insights */}
      <motion.div variants={itemVariants}>
        <MealInsights
          topMeals={stats.topMeals}
          nutritionProfile={stats.nutritionProfile}
        />
      </motion.div>

      {/* Tips Section */}
      <motion.div
        className="glass-card overflow-hidden"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div
          className="p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.1), rgba(0, 122, 255, 0.05))',
          }}
        >
          <div className="flex items-start gap-3">
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(0, 122, 255, 0.15)' }}
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                repeat: Infinity,
                repeatType: 'reverse',
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              <Lightbulb size={18} className="text-[var(--system-blue)]" />
            </motion.div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">Tipp</h3>
              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">{getTipMessage()}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
