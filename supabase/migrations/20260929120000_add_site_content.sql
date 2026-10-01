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

insert into public.site_media (slot, storage_path, alt_text, caption, sort_order, active)
values (
  'home.new_location.strip',
  '/IMG_3226.JPG',
  'Marketella shoppers and event moments.',
  null,
  1,
  true
)
on conflict (slot) do nothing;

insert into public.site_content (key, content, active)
values (
  'home.new_location',
  '{
    "topMarqueePhrases": ["not your average market", "where everyone''s a star"],
    "headingLabel": "new location:",
    "locationName": "santa anita",
    "description": "we heard the 626 needed a new market that focuses on vintage goods and handmade items.....",
    "buttonLabel": "Tell me more",
    "buttonHref": "/events",
    "bottomMarqueePhrases": ["apply to sell"]
  }'::jsonb,
  true
)
on conflict (key) do nothing;
