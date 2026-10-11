create table if not exists public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null default '',
  episode_number integer not null check (episode_number > 0),
  image_path text,
  listen_url text,
  published boolean not null default false,
  sort_order integer not null default 0,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists podcast_episodes_public_idx
  on public.podcast_episodes(published, archived_at, sort_order, episode_number);

alter table public.podcast_episodes enable row level security;

drop policy if exists "Published podcast episodes are publicly readable" on public.podcast_episodes;

create policy "Published podcast episodes are publicly readable"
  on public.podcast_episodes for select
  using (published = true and archived_at is null);

insert into public.podcast_episodes
  (title, slug, description, episode_number, image_path, listen_url, published, sort_order)
values
  ('three year anniversary', 'three-year-anniversary', 'Episode coming soon.', 1, '/IMG_3215.JPG', null, true, 1),
  ('all things markets', 'all-things-markets', 'Episode coming soon.', 2, '/IMG_3223.JPG', null, true, 2),
  ('vendor stories', 'vendor-stories', 'Episode coming soon.', 3, '/IMG_3220.JPG', null, true, 3)
on conflict (slug) do nothing;
