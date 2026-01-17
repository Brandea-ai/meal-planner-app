-- Custom shopping items table
create table if not exists custom_shopping_items (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  name text not null,
  amount text not null default '',
  category text not null default 'extras',
  meal_type text not null default 'both',
  is_checked boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table custom_shopping_items enable row level security;

-- Policy: Anyone can manage their own items
create policy "Users can manage their own custom items"
  on custom_shopping_items
  for all
  using (true)
  with check (true);

-- Index for faster lookups
create index if not exists idx_custom_shopping_items_device_id on custom_shopping_items(device_id);

-- Constraint for valid categories
alter table custom_shopping_items
  add constraint valid_category check (
    category in ('fresh', 'protein', 'dairy', 'legumes', 'grains', 'basics', 'extras')
  );

-- Constraint for valid meal types
alter table custom_shopping_items
  add constraint valid_meal_type check (
    meal_type in ('breakfast', 'dinner', 'both')
  );
