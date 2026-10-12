create table if not exists public.site_content (
  key text primary key,
  content jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Active site content is publicly readable" on public.site_content;

create policy "Active site content is publicly readable"
  on public.site_content for select
  using (active = true);

insert into public.site_content (key, content, active)
values (
  'home.new_location',
  jsonb_build_object(
    'topMarqueePhrases', jsonb_build_array('not your average market', 'where everyone''s a star'),
    'headingLabel', 'now in:',
    'locationName', 'las vegas',
    'description', 'we heard the 702 needed a new market that focuses on vintage goods and handmade items.....',
    'buttonLabel', 'Tell me more',
    'buttonHref', '/events',
    'bottomMarqueePhrases', jsonb_build_array('apply to sell')
  ),
  true
)
on conflict (key) do update
set
  content = coalesce(public.site_content.content, '{}'::jsonb) || jsonb_build_object(
    'headingLabel', 'now in:',
    'locationName', 'las vegas',
    'description', 'we heard the 702 needed a new market that focuses on vintage goods and handmade items.....'
  ),
  updated_at = now();
