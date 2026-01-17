-- Add missing columns to user_progress table for full feature support

-- Add ingredient_customizations column (stores custom amounts and hidden ingredients)
alter table user_progress
add column if not exists ingredient_customizations jsonb default '[]';

-- Add meal_notes column (stores user notes per meal)
alter table user_progress
add column if not exists meal_notes jsonb default '[]';

-- Add custom_shopping_items column (stores user-added shopping items)
alter table user_progress
add column if not exists custom_shopping_items jsonb default '[]';

-- Update default preferences to include new fields
comment on column user_progress.preferences is 'User preferences including: prepTimePreference, mealPrepEnabled, dietaryRestrictions, servings, shoppingListFilter, autoSyncShoppingFilter';
comment on column user_progress.ingredient_customizations is 'Array of {mealId, mealType, ingredientName, customAmount?, isHidden}';
comment on column user_progress.meal_notes is 'Array of {mealId, mealType, note, updatedAt}';
comment on column user_progress.custom_shopping_items is 'Array of {id, name, amount, category, mealType, isChecked}';
