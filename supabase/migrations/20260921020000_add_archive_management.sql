alter table public.events
  add column if not exists archived_at timestamptz;

alter table public.applications
  add column if not exists archived_at timestamptz;

create index if not exists events_archived_at_idx
  on public.events(archived_at);

create index if not exists applications_archived_at_idx
  on public.applications(archived_at);

create index if not exists applications_created_at_idx
  on public.applications(created_at);

create index if not exists applications_event_status_idx
  on public.applications(event_id, status);
