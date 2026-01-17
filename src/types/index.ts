export interface Ingredient {
  name: string;
  amount?: string;
  category: 'fresh' | 'protein' | 'basics' | 'extras';
}

export interface Meal {
  id: number;
  day: number;
  title: string;
  subtitle: string;
  culturalOrigin: string[];
  ingredients: Ingredient[];
  sideDish?: string;
  benefit: string;
  prepTime: number; // in minutes
  tags: string[];
}

export interface UserProgress {
  completedDays: number[];
  currentDay: number;
  startDate: string | null;
  preferences: UserPreferences;
  shoppingListChecked: string[];
}

export interface UserPreferences {
  prepTimePreference: 'quick' | 'normal' | 'extended';
  mealPrepEnabled: boolean;
  dietaryRestrictions: string[];
  servings: number;
}

export interface ShoppingItem {
  name: string;
  amount: string;
  category: 'fresh' | 'protein' | 'basics' | 'extras';
  checked: boolean;
}
