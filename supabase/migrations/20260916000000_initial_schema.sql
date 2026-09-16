create extension if not exists "pgcrypto";

create type public.event_status as enum ('upcoming', 'completed', 'cancelled');
create type public.application_status as enum ('pending', 'approved', 'waitlisted', 'declined');
create type public.payment_status as enum ('unpaid', 'paid', 'waived', 'refunded');

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  event_date date not null,
  start_time time not null,
  end_time time not null,
  location_name text not null,
  address text not null default '',
  hero_image text,
  application_open_date date,
  application_deadline date,
  application_fee numeric(10, 2) not null default 0 check (application_fee >= 0),
  applications_enabled boolean not null default false,
  vendor_capacity integer check (vendor_capacity is null or vendor_capacity > 0),
  status public.event_status not null default 'upcoming',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text not null,
  business_name text not null,
  instagram text,
  website text,
  category text not null,
  product_description text not null,
  price_range text not null,
  booth_type text not null,
  electricity_required boolean not null default false,
  special_requests text,
  status public.application_status not null default 'pending',
  admin_notes text,
  application_fee numeric(10, 2) not null default 0 check (application_fee >= 0),
  payment_status public.payment_status not null default 'unpaid',
  payment_reference text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.application_images (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.merch_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  display_price numeric(10, 2) not null default 0 check (display_price >= 0),
  image_path text,
  external_url text not null,
  featured boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_event_id_idx on public.applications(event_id);
create index applications_status_idx on public.applications(status);
create index applications_payment_status_idx on public.applications(payment_status);
create index events_date_idx on public.events(event_date);

alter table public.events enable row level security;
alter table public.applications enable row level security;
alter table public.application_images enable row level security;
alter table public.merch_products enable row level security;

create policy "Published events are publicly readable"
  on public.events for select
  using (published = true);

create policy "Public merch is readable"
  on public.merch_products for select
  using (active = true);

create policy "Public applications can be submitted"
  on public.applications for insert
  with check (true);

create policy "Application images can be attached on submission"
  on public.application_images for insert
  with check (true);
