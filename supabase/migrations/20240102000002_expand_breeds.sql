-- ========================================
-- 犬種マスタ拡張
-- 既存10種にsize_category追加 + 新規25種追加
-- ========================================

-- 既存犬種にsize_categoryとsort_orderを設定
update dog_breeds set size_category = '小型', sort_order = 1 where name = 'トイプードル';
update dog_breeds set size_category = '小型', sort_order = 2 where name = 'チワワ';
update dog_breeds set size_category = '中型', sort_order = 3 where name = '柴犬';
update dog_breeds set size_category = '小型', sort_order = 4 where name = 'ダックスフンド';
update dog_breeds set size_category = '大型', sort_order = 5 where name = 'ゴールデンレトリバー';
update dog_breeds set size_category = '小型', sort_order = 6 where name = 'シーズー';
update dog_breeds set size_category = '小型', sort_order = 7 where name = 'ポメラニアン';
update dog_breeds set size_category = '小型', sort_order = 8 where name = 'ヨークシャーテリア';
update dog_breeds set size_category = '小型', sort_order = 9 where name = 'マルチーズ';

-- 新規犬種追加
insert into dog_breeds (name, size_category, sort_order) values
  ('ミニチュアシュナウザー', '小型', 10),
  ('パピヨン', '小型', 11),
  ('ペキニーズ', '小型', 12),
  ('フレンチブルドッグ', '中型', 13),
  ('ウェルシュ・コーギー', '中型', 14),
  ('ビションフリーゼ', '小型', 15),
  ('キャバリア', '小型', 16),
  ('ジャックラッセルテリア', '小型', 17),
  ('ボーダーコリー', '中型', 18),
  ('ラブラドールレトリバー', '大型', 19),
  ('スタンダードプードル', '大型', 20),
  ('ウエストハイランドホワイトテリア', '小型', 21),
  ('ミニチュアダックスフンド', '小型', 22),
  ('秋田犬', '大型', 23),
  ('日本スピッツ', '中型', 24),
  ('アメリカンコッカースパニエル', '中型', 25),
  ('シェットランドシープドッグ', '中型', 26),
  ('ミニチュアピンシャー', '小型', 27),
  ('ボストンテリア', '小型', 28),
  ('狆', '小型', 29),
  ('サモエド', '大型', 30),
  ('バーニーズマウンテンドッグ', '大型', 31),
  ('ワイマラナー', '大型', 32),
  ('イタリアングレーハウンド', '小型', 33),
  ('豆柴', '小型', 34)
on conflict (name) do nothing;

-- 「その他」をsort_order最後に
update dog_breeds set size_category = null, sort_order = 100 where name = 'その他';
