-- ============================================
-- Mainzer Fashion – Supabase Setup
-- Führe dieses Script im Supabase SQL Editor aus
-- ============================================

-- 1. Produkte-Tabelle
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  price numeric(10, 2) not null,
  original_price numeric(10, 2),
  size text,
  sizes text[] default '{}',
  category text not null,
  gender text check (gender in ('Dame', 'Herr', 'Unisex')) default 'Unisex',
  condition text check (condition in ('Neu', 'Gebraucht')) default 'Gebraucht',
  status text check (status in ('verfügbar', 'reserviert', 'verkauft')) default 'verfügbar',
  image_url text default '',
  created_at timestamptz default now()
);

-- Migrationen für bestehende Tabellen:
alter table products add column if not exists original_price numeric(10, 2);
alter table products add column if not exists sizes text[] default '{}';
alter table products alter column size drop not null;

-- Bestehende Produkte mit Einzel-Größe in das neue Array übernehmen:
update products
  set sizes = array[size]
  where (sizes is null or array_length(sizes, 1) is null)
    and size is not null and size <> '';

-- 2. Row Level Security aktivieren
alter table products enable row level security;

-- 3. Alle dürfen lesen (öffentliche Galerie)
create policy "Öffentlich lesbar"
  on products for select
  using (true);

-- 4. Alle dürfen einfügen (Admin-Seite, kein Auth)
--    Tipp: Für mehr Sicherheit später Auth hinzufügen!
create policy "Einfügen erlaubt"
  on products for insert
  with check (true);

-- 5. Update & Delete erlauben (für Status-Änderungen)
create policy "Update erlaubt"
  on products for update
  using (true);

-- ============================================
-- Storage Bucket für Bilder
-- ============================================

-- Bucket erstellen (alternativ in der Supabase UI)
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

-- Storage Policies
create policy "Bilder öffentlich lesbar"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Bilder hochladen erlaubt"
  on storage.objects for insert
  with check (bucket_id = 'product-images');
