-- Meal notes table
create table if not exists meal_notes (
  id uuid primary key default gen_random_uuid(),
  device_id text not null,
  meal_id integer not null,
  meal_type text not null,
  note text not null default '',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table meal_notes enable row level security;

-- Policy: Anyone can manage their own notes
create policy "Users can manage their own meal notes"
  on meal_notes
  for all
  using (true)
  with check (true);

-- Index for faster lookups
create index if not exists idx_meal_notes_device_id on meal_notes(device_id);
create index if not exists idx_meal_notes_meal_id on meal_notes(meal_id);

-- Unique constraint: one note per meal per device
create unique index if not exists idx_meal_notes_unique
  on meal_notes(device_id, meal_id, meal_type);

-- Constraint for valid meal types
alter table meal_notes
  add constraint valid_meal_type check (
    meal_type in ('breakfast', 'dinner')
  );

-- Trigger to auto-update updated_at
create trigger update_meal_notes_updated_at
  before update on meal_notes
  for each row
  execute function update_updated_at_column();
