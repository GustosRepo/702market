create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null check (submission_type in ('contact', 'podcast_story', 'podcast_chisme')),
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  subject text not null default '',
  message text not null,
  newsletter_opt_in boolean not null default false,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_submissions_status_created_idx
  on public.contact_submissions(status, created_at desc);

alter table public.contact_submissions enable row level security;

create or replace function public.enforce_application_capacity()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  option_capacity integer;
  event_capacity integer;
  option_count integer;
  event_count integer;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.event_id::text, 0));

  select capacity into option_capacity
  from public.event_vendor_options
  where id = new.vendor_option_id and event_id = new.event_id;

  if option_capacity is not null then
    select count(*) into option_count
    from public.applications
    where event_id = new.event_id
      and vendor_option_id = new.vendor_option_id
      and archived_at is null
      and status::text <> 'rejected';

    if option_count >= option_capacity then
      raise exception using errcode = 'P0001', message = 'That vendor option is full.';
    end if;
  end if;

  select vendor_capacity into event_capacity
  from public.events
  where id = new.event_id;

  if event_capacity is not null then
    select count(*) into event_count
    from public.applications
    where event_id = new.event_id
      and archived_at is null
      and status::text <> 'rejected';

    if event_count >= event_capacity then
      raise exception using errcode = 'P0001', message = 'Applications for this event have reached capacity.';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_application_capacity_before_insert on public.applications;
create trigger enforce_application_capacity_before_insert
  before insert on public.applications
  for each row execute function public.enforce_application_capacity();

update public.events
set
  application_rules = replace(replace(application_rules, '702 Market', 'MarketElla'), '702Market', 'MarketElla'),
  food_application_rules = replace(replace(food_application_rules, '702 Market', 'MarketElla'), '702Market', 'MarketElla'),
  updated_at = now();

update public.events
set published = false, status = 'completed', updated_at = now()
where lower(title) = 'test' or slug = 'test';

update public.merch_products
set active = false, updated_at = now()
where external_url = '#' or name ilike 'sample %';

update public.podcast_episodes
set published = false, updated_at = now()
where listen_url is null or trim(listen_url) = '';
