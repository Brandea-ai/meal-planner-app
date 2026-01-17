'use client';

import { useMemo } from 'react';
import { Calendar, ShoppingCart, Clock, TrendingUp } from 'lucide-react';
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

  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
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
      </div>

      {/* Streak Tracker */}
      <StreakTracker
        currentStreak={stats.streak.current}
        longestStreak={stats.streak.longest}
      />

      {/* Completion Chart */}
      <CompletionChart
        weeklyRate={stats.completionRate.weekly}
        monthlyRate={stats.completionRate.monthly}
        totalRate={stats.completionRate.total}
      />

      {/* Meal Insights */}
      <MealInsights
        topMeals={stats.topMeals}
        nutritionProfile={stats.nutritionProfile}
      />

      {/* Tips Section */}
      <div className="rounded-[12px] bg-[var(--system-blue)]/10 p-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">Tipp</h3>
        <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
          {stats.streak.current >= 3
            ? 'Großartig! Du bist auf einer Serie. Bleib dran!'
            : stats.completedDaysCount === 0
            ? 'Starte jetzt mit Tag 1 und baue deine erste Serie auf!'
            : 'Mach weiter so! Versuche, jeden Tag abzuschließen.'}
        </p>
      </div>
    </div>
  );
}
