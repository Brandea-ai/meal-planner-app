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
  category: 'fresh' | 'protein' | 'dairy' | 'legumes' | 'grains' | 'basics' | 'extras';
  checked: boolean;
  mealType?: MealType | 'both';
}
