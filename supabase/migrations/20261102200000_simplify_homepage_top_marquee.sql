update public.site_content
set content = jsonb_set(
    coalesce(content, '{}'::jsonb),
    '{topMarqueePhrases}',
    '["Not your average market"]'::jsonb
  ),
  updated_at = now()
where key = 'home.new_location';
