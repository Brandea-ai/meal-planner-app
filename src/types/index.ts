export interface Ingredient {
  name: string;
  amount?: string;
  category: 'fresh' | 'protein' | 'dairy' | 'legumes' | 'grains' | 'basics' | 'extras';
}

export type MealType = 'breakfast' | 'dinner';

export interface Meal {
  id: number;
  day: number;
  type: MealType;
  title: string;
  subtitle: string;
  culturalOrigin: string[];
  ingredients: Ingredient[];
  sideDish?: string;
  benefit: string;
  prepTime: number; // in minutes
  tags: string[];
  proteinOptions?: string[]; // For meals with protein alternatives
}

// Ingredient customization per meal
export interface IngredientCustomization {
  mealId: number;
  mealType: MealType;
  ingredientName: string;
  customAmount?: string; // User-modified amount
  isHidden: boolean; // User removed this ingredient
}

// Meal note stored locally
export interface StoredMealNote {
  mealId: number;
  mealType: MealType;
  note: string;
  updatedAt: string;
}

export interface UserProgress {
  completedDays: number[];
  currentDay: number;
  startDate: string | null;
  preferences: UserPreferences;
  shoppingListChecked: string[];
  // New: ingredient customizations
  ingredientCustomizations: IngredientCustomization[];
  // New: meal notes
  mealNotes: StoredMealNote[];
}

export interface UserPreferences {
  prepTimePreference: 'quick' | 'normal' | 'extended';
  mealPrepEnabled: boolean;
  dietaryRestrictions: string[];
  servings: number;
  // Smart Shopping List Sync
  shoppingListFilter: 'all' | 'breakfast' | 'dinner';
  autoSyncShoppingFilter: boolean;
}

export interface ShoppingItem {
  name: string;
  amount: string;
  category: 'fresh' | 'protein' | 'dairy' | 'legumes' | 'grains' | 'basics' | 'extras';
  checked: boolean;
  mealType?: MealType | 'both';
}

// Custom Shopping Items (user-added)
export interface CustomShoppingItem {
  id: string;
  deviceId: string;
  name: string;
  amount: string;
  category: 'fresh' | 'protein' | 'dairy' | 'legumes' | 'grains' | 'basics' | 'extras';
  mealType: MealType | 'both';
  isChecked: boolean;
  createdAt: string;
}

// Meal Notes
export interface MealNote {
  id: string;
  deviceId: string;
  mealId: number;
  mealType: MealType;
  note: string;
  createdAt: string;
  updatedAt: string;
}

// Statistics Types
export type MealEventType = 'complete' | 'uncomplete' | 'shopping_check' | 'shopping_uncheck';

export interface MealEvent {
  id: string;
  deviceId: string;
  eventType: MealEventType;
  mealId?: number;
  dayNumber?: number;
  timestamp: string;
}

export interface UserStreak {
  id: string;
  deviceId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
}

export interface MealStatistics {
  completionRate: {
    weekly: number;
    monthly: number;
    total: number;
  };
  streak: {
    current: number;
    longest: number;
  };
  topMeals: Array<{
    mealId: number;
    title: string;
    count: number;
  }>;
  shoppingTrend: {
    weeklyCompletionRate: number;
  };
  timeAnalysis: {
    mostActiveDay: string;
    mostActiveHour: number;
  };
  nutritionProfile: {
    proteinMeals: number;
    vegetarianMeals: number;
    omega3Meals: number;
    legumeMeals: number;
  };
}
