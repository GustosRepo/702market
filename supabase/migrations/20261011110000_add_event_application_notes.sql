alter table public.events
  add column if not exists application_notes text not null default '',
  add column if not exists food_application_notes text not null default '';
