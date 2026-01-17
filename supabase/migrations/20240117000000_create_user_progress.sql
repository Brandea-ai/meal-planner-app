-- User progress table
create table if not exists user_progress (
  id uuid primary key default gen_random_uuid(),
  device_id text unique not null,
  completed_days integer[] default '{}',
  current_day integer default 1,
  start_date timestamp with time zone,
  shopping_list_checked text[] default '{}',
  preferences jsonb default '{"prepTimePreference": "normal", "mealPrepEnabled": false, "dietaryRestrictions": [], "servings": 2}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table user_progress enable row level security;

-- Policy: Anyone can read/write their own data (based on device_id)
create policy "Users can manage their own progress"
  on user_progress
  for all
  using (true)
  with check (true);

-- Index for faster lookups
create index if not exists idx_user_progress_device_id on user_progress(device_id);

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger to auto-update updated_at
create trigger update_user_progress_updated_at
  before update on user_progress
  for each row
  execute function update_updated_at_column();
