-- Append the supplied photos without replacing existing media or display order.
with photos (position, slot, storage_path, alt_text, caption) as (
  values
  (1, 'home.gallery.4', '/assets/site/dsc01138-web.webp', 'Pug riding in a pink stroller at MarketElla.', 'Furry friends welcome'),
  (2, 'home.gallery.5', '/assets/site/dsc01376-web.webp', 'Shopper carrying a cream 702 Market tote with a pink heart design.', 'Shop small, carry the love'),
  (3, 'home.gallery.6', '/assets/site/img-1279-web.webp', 'Whimsical Sweets vendor showing a pink treat at her MarketElla booth.', 'Something sweet'),
  (4, 'home.gallery.7', '/assets/site/img-1410-web.webp', 'Two vendors posing beside a vintage clothing display at MarketElla.', 'Meet the makers'),
  (5, 'home.gallery.8', '/assets/site/img-1485-web.webp', 'Two shoppers browsing racks of vintage clothing at MarketElla.', 'Find your next favorite'),
  (6, 'home.gallery.9', '/assets/site/img-1588-web.webp', 'Fashion boutique vendor posing beside colorful outfits and handbags at MarketElla.', 'Small business spotlight'),
  (7, 'home.gallery.10', '/assets/site/img-1599-web.webp', 'Guest posing in front of a pink, orange, and gold balloon backdrop at MarketElla.', 'Picture perfect moments'),
  (8, 'home.gallery.11', '/assets/site/img-1617-web.webp', 'DJ playing music at MarketElla outside Fergusons Downtown.', 'Good music, good company'),
  (9, 'home.gallery.12', '/assets/site/img-1622-web.webp', 'Guest wearing a cherry-patterned denim hat and carrying a small dog at MarketElla.', 'Bring your best friend'),
  (10, 'home.gallery.13', '/assets/site/img-1748-web.webp', 'Guests enjoying a MarketElla evening market under string lights.', 'Making memories together'),
  (11, 'home.gallery.14', '/assets/site/img-2420-web.webp', 'Family in costumes with face paint and treat bags at a MarketElla Halloween event.', 'A little spooky, a lot of fun'),
  (12, 'home.gallery.15', '/assets/site/img-2668-web.webp', 'Two friends posing together at MarketElla outside Fergusons Downtown.', 'Market days with your girls'),
  (13, 'home.gallery.16', '/assets/site/img-6780-web.webp', 'Couple standing beside a mirror and flowering wall at MarketElla.', 'A day out together')
),
last_photo as (
  select coalesce(max(sort_order), 0) as sort_order
  from public.site_media
  where slot like 'home.gallery.%'
)
insert into public.site_media (slot, storage_path, alt_text, caption, sort_order, active)
select photos.slot, photos.storage_path, photos.alt_text, photos.caption,
       last_photo.sort_order + photos.position, true
from photos cross join last_photo
on conflict (slot) do nothing;
