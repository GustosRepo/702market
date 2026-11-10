-- Preserve the previous section's visibility, but retire its announcement copy.
insert into public.site_content (key, content, active)
values (
  'home.countdown',
  jsonb_build_object(
    'heading', 'UPCOMING MARKET',
    'emptyMessage', 'More market dates coming soon. Stay tuned!'
  ),
  coalesce((select active from public.site_content where key = 'home.new_location'), true)
)
on conflict (key) do nothing;

-- Visitors must be able to read the off switch instead of falling back to visible.
create policy "Homepage countdown visibility is publicly readable"
  on public.site_content for select
  using (key = 'home.countdown');
