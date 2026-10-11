alter type public.application_status add value if not exists 'submitted';
alter type public.application_status add value if not exists 'under_review';
alter type public.application_status add value if not exists 'rejected';
alter type public.application_status add value if not exists 'confirmed';
