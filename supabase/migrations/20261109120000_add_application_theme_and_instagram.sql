-- Nullable fields preserve the distinction between legacy applications and new answers.
alter table public.applications
  add column if not exists theme_fit text,
  add column if not exists following_instagram boolean;

comment on column public.applications.theme_fit is 'Applicant explanation of how their business fits the event theme.';
comment on column public.applications.following_instagram is 'Self-reported Instagram follow confirmation; null for older applications.';
