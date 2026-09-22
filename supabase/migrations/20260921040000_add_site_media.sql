create table if not exists public.site_media (
  slot text primary key,
  storage_path text not null,
  alt_text text not null default '',
  caption text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.site_media enable row level security;

drop policy if exists "Active site media is publicly readable" on public.site_media;

create policy "Active site media is publicly readable"
  on public.site_media for select
  using (active = true);

insert into public.site_media (slot, storage_path, alt_text, caption, sort_order, active)
values
  ('home.hero', '/assets/site/home-hero.jpg', '702 Market photo wall with flowers and a pink cart.', null, 0, true),
  ('about.story', '/assets/site/about-story.jpg', '702 Market photo wall with flowers and a pink cart.', null, 0, true),
  ('contact.community', '/assets/site/contact-community.jpg', 'Friends holding shopping bags at 702Market.', null, 0, true),
  ('socials.cta', '/assets/site/social-cta.jpg', 'Vendor booth with clothing and accessories at 702Market.', null, 0, true),
  ('home.gallery.1', '/IMG_3076.JPG', 'Crowd browsing vendor tents at 702Market.', 'Market days', 1, true),
  ('home.gallery.2', '/IMG_3223.JPG', 'Vendor booth with clothing and accessories at 702Market.', 'Vendor corners', 2, true),
  ('home.gallery.3', '/IMG_3220.JPG', 'Music and vendor setup at an outdoor 702Market event.', 'Good energy', 3, true),
  ('about.gallery.1', '/IMG_3224.JPG', '702 Market photo wall with flowers and a pink cart.', 'The photo wall', 1, true),
  ('about.gallery.2', '/IMG_3214.JPG', 'Friends holding shopping bags at 702Market.', 'Shopping together', 2, true),
  ('about.gallery.3', '/IMG_3221.JPG', 'A 702Market vendor moment.', 'Local vendors', 3, true),
  ('about.gallery.4', '/IMG_3225.JPG', 'Details from a 702Market setup.', 'Tiny details', 4, true)
on conflict (slot) do nothing;
