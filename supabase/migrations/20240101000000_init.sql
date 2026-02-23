-- ========================================
-- トリミングサロンDB 初期テーブル定義
-- Supabase SQL Editor で実行してください
-- ========================================

-- profiles（Supabase Auth の users と紐付け）
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);
alter table profiles enable row level security;
create policy "プロフィールは本人のみ更新可" on profiles
  for update using (auth.uid() = id);
create policy "プロフィールは全員閲覧可" on profiles
  for select using (true);

-- ユーザー登録時に自動でprofilesを作成するFunction
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- salons（サロン情報）
create table if not exists salons (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  lat double precision,
  lng double precision,
  phone text,
  description text,
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz default now() not null
);
alter table salons enable row level security;
create policy "サロンは全員閲覧可" on salons
  for select using (true);
create policy "サロンはオーナーのみ編集可" on salons
  for all using (auth.uid() = owner_id);

-- dog_breeds（犬種マスタ）
create table if not exists dog_breeds (
  id serial primary key,
  name text not null unique
);
insert into dog_breeds (name) values
  ('トイプードル'), ('チワワ'), ('柴犬'), ('ダックスフンド'),
  ('ゴールデンレトリバー'), ('シーズー'), ('ポメラニアン'),
  ('ヨークシャーテリア'), ('マルチーズ'), ('その他');

-- salon_breeds（サロン対応犬種）
create table if not exists salon_breeds (
  salon_id uuid references salons(id) on delete cascade,
  breed_id int references dog_breeds(id) on delete cascade,
  primary key (salon_id, breed_id)
);
alter table salon_breeds enable row level security;
create policy "サロン対応犬種は全員閲覧可" on salon_breeds
  for select using (true);

-- services（サービス・料金）
create table if not exists services (
  id serial primary key,
  salon_id uuid references salons(id) on delete cascade not null,
  name text not null,
  price int,
  duration_min int
);
alter table services enable row level security;
create policy "サービスは全員閲覧可" on services
  for select using (true);

-- reviews（レビュー）
create table if not exists reviews (
  id serial primary key,
  salon_id uuid references salons(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now() not null,
  unique (salon_id, user_id)
);
alter table reviews enable row level security;
create policy "レビューは全員閲覧可" on reviews
  for select using (true);
create policy "レビューは本人のみ投稿・編集可" on reviews
  for all using (auth.uid() = user_id);
