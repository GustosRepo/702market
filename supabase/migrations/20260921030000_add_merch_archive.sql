alter table public.merch_products
  add column if not exists archived_at timestamptz;

create index if not exists merch_products_archived_at_idx
  on public.merch_products(archived_at);
