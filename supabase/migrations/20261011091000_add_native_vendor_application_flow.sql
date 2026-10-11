create table if not exists public.event_vendor_options (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  application_type text not null check (application_type in ('vendor', 'food')),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null default 0 check (price >= 0),
  capacity integer check (capacity is null or capacity > 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists event_vendor_options_event_type_idx
  on public.event_vendor_options(event_id, application_type, active, sort_order);

alter table public.events
  add column if not exists general_applications_enabled boolean not null default false,
  add column if not exists food_applications_enabled boolean not null default false,
  add column if not exists application_rules text not null default '',
  add column if not exists food_application_rules text not null default '';

update public.events
set general_applications_enabled = applications_enabled
where applications_enabled = true;

alter table public.applications
  add column if not exists application_type text not null default 'vendor'
    check (application_type in ('vendor', 'food')),
  add column if not exists vendor_option_id uuid references public.event_vendor_options(id) on delete set null,
  add column if not exists vendor_option_name text,
  add column if not exists business_license_number text,
  add column if not exists food_menu text,
  add column if not exists setup_measurements text,
  add column if not exists health_department_number text,
  add column if not exists rules_acknowledged boolean not null default false,
  add column if not exists rules_acknowledged_at timestamptz,
  add column if not exists reference_code text unique,
  add column if not exists submission_token text unique;

alter table public.applications alter column status set default 'submitted';

update public.applications
set
  vendor_option_name = coalesce(vendor_option_name, booth_type),
  rules_acknowledged = true,
  rules_acknowledged_at = coalesce(rules_acknowledged_at, created_at)
where vendor_option_name is null or rules_acknowledged = false;

update public.applications
set reference_code = 'MKT-' || upper(substr(replace(id::text, '-', ''), 1, 8))
where reference_code is null;

alter table public.application_images
  add column if not exists document_type text not null default 'setup_photo',
  add column if not exists original_name text,
  add column if not exists mime_type text,
  add column if not exists size_bytes bigint;

insert into public.event_vendor_options (
  event_id,
  application_type,
  name,
  description,
  price,
  active,
  sort_order
)
select
  events.id,
  'vendor',
  'Standard Vendor Space',
  'Standard market vendor space.',
  events.application_fee,
  true,
  0
from public.events
where events.applications_enabled = true
  and not exists (
    select 1
    from public.event_vendor_options options
    where options.event_id = events.id
      and options.application_type = 'vendor'
  );

alter table public.event_vendor_options enable row level security;

drop policy if exists "Active event vendor options are publicly readable" on public.event_vendor_options;
create policy "Active event vendor options are publicly readable"
  on public.event_vendor_options for select
  using (
    active = true
    and exists (
      select 1
      from public.events
      where events.id = event_vendor_options.event_id
        and events.published = true
        and events.archived_at is null
    )
  );

drop policy if exists "Public applications can be submitted" on public.applications;
drop policy if exists "Application images can be attached on submission" on public.application_images;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'application-images',
  'application-images',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  updated_at = now();
