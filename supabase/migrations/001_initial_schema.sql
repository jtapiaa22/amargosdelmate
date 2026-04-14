-- =============================================
-- Amargos del Mate — Schema inicial
-- Ejecutar en Supabase SQL Editor
-- =============================================

-- Categorías
create table if not exists categorias (
  id        serial primary key,
  nombre    text not null,
  slug      text not null unique,
  orden     int  not null default 0,
  activa    boolean not null default true
);

-- Productos
create table if not exists productos (
  id            serial primary key,
  nombre        text    not null,
  descripcion   text,
  precio        numeric not null check (precio >= 0),
  categoria_id  int     not null references categorias(id) on delete restrict,
  imagen_url    text,
  activo        boolean not null default true,
  es_promo      boolean not null default false,
  badge         text check (badge in ('Promo','Nuevo','Popular')),
  orden         int     not null default 0,
  created_at    timestamptz not null default now()
);

-- Índices
create index on productos(categoria_id);
create index on productos(activo);
create index on productos(es_promo);

-- =============================================
-- RLS (Row Level Security)
-- =============================================
alter table categorias enable row level security;
alter table productos   enable row level security;

-- Lectura pública: cualquiera puede leer
create policy "lectura_publica_categorias" on categorias
  for select using (activa = true);

create policy "lectura_publica_productos" on productos
  for select using (activo = true);

-- Escritura: solo usuarios autenticados (admin)
create policy "admin_all_categorias" on categorias
  for all using (auth.role() = 'authenticated');

create policy "admin_all_productos" on productos
  for all using (auth.role() = 'authenticated');

-- =============================================
-- Datos iniciales — Categorías
-- =============================================
insert into categorias (nombre, slug, orden) values
  ('Mates',      'mates',      1),
  ('Yerbas',     'yerbas',     2),
  ('Bombillas',  'bombillas',  3),
  ('Accesorios', 'accesorios', 4),
  ('Promos',     'promos',     5)
on conflict (slug) do nothing;

-- =============================================
-- Storage bucket para imágenes de productos
-- =============================================
-- Crear en Supabase Dashboard → Storage → New bucket
-- Nombre: "productos"
-- Public: true
