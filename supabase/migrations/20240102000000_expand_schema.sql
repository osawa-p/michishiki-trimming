-- ========================================
-- Phase 2: スキーマ拡張
-- prefectures, cities, features テーブル追加
-- salons テーブル拡張
-- ========================================

-- prefectures（都道府県マスタ）
create table if not exists prefectures (
  id serial primary key,
  name text not null unique,
  slug text not null unique,
  region text not null
);
alter table prefectures enable row level security;
create policy "都道府県は全員閲覧可" on prefectures
  for select using (true);

-- cities（市区町村マスタ）
create table if not exists cities (
  id serial primary key,
  prefecture_id int references prefectures(id) on delete cascade not null,
  name text not null,
  slug text not null,
  unique (prefecture_id, slug)
);
create index idx_cities_prefecture on cities(prefecture_id);
alter table cities enable row level security;
create policy "市区町村は全員閲覧可" on cities
  for select using (true);

-- features（設備・特徴マスタ）
create table if not exists features (
  id serial primary key,
  name text not null unique,
  slug text not null unique
);
alter table features enable row level security;
create policy "設備特徴は全員閲覧可" on features
  for select using (true);

-- salon_features（サロン × 設備 多対多）
create table if not exists salon_features (
  salon_id uuid references salons(id) on delete cascade,
  feature_id int references features(id) on delete cascade,
  primary key (salon_id, feature_id)
);
alter table salon_features enable row level security;
create policy "サロン設備は全員閲覧可" on salon_features
  for select using (true);

-- salons テーブル拡張
alter table salons add column if not exists prefecture_id int references prefectures(id);
alter table salons add column if not exists city_id int references cities(id);
alter table salons add column if not exists postal_code text;
alter table salons add column if not exists business_hours text;
alter table salons add column if not exists holidays text;
alter table salons add column if not exists image_url text;
alter table salons add column if not exists website_url text;
alter table salons add column if not exists updated_at timestamptz default now();

create index if not exists idx_salons_prefecture on salons(prefecture_id);
create index if not exists idx_salons_city on salons(city_id);

-- dog_breeds テーブル拡張
alter table dog_breeds add column if not exists size_category text
  check (size_category in ('小型', '中型', '大型'));
alter table dog_breeds add column if not exists sort_order int default 0;

-- features 初期データ
insert into features (name, slug) values
  ('駐車場あり', 'parking'),
  ('送迎サービス', 'pickup'),
  ('クレジットカード対応', 'credit-card'),
  ('トリミング中見学可', 'observation'),
  ('ペットホテル併設', 'pet-hotel'),
  ('動物病院併設', 'vet-clinic'),
  ('子犬対応', 'puppy'),
  ('高齢犬対応', 'senior-dog'),
  ('猫対応', 'cat-ok'),
  ('個室対応', 'private-room')
on conflict (name) do nothing;
