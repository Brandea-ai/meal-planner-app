-- Meal events table for tracking user actions
create table if not exists meal_events (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  event_type text not null,
  meal_id integer,
  day_number integer,
  timestamp timestamp with time zone default now()
);

-- Enable Row Level Security
alter table meal_events enable row level security;

-- Policy: Anyone can manage their own events
create policy "Users can manage their own meal events"
  on meal_events
  for all
  using (true)
  with check (true);

-- Index for faster lookups
create index if not exists idx_meal_events_device_id on meal_events(device_id);
create index if not exists idx_meal_events_timestamp on meal_events(timestamp);
create index if not exists idx_meal_events_event_type on meal_events(event_type);

-- Constraint for valid event types
alter table meal_events
  add constraint valid_event_type check (
    event_type in ('complete', 'uncomplete', 'shopping_check', 'shopping_uncheck')
  );

-- User streaks table
create table if not exists user_streaks (
  id uuid primary key default gen_random_uuid(),
  device_id text unique not null,
  current_streak integer default 0,
  longest_streak integer default 0,
  last_completion_date date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table user_streaks enable row level security;

-- Policy: Anyone can manage their own streaks
create policy "Users can manage their own streaks"
  on user_streaks
  for all
  using (true)
  with check (true);

-- Index for faster lookups
create index if not exists idx_user_streaks_device_id on user_streaks(device_id);

-- Trigger to auto-update updated_at
create trigger update_user_streaks_updated_at
  before update on user_streaks
  for each row
  execute function update_updated_at_column();
