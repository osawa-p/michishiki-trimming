-- ========================================
-- 都道府県・市区町村マスタデータ
-- 47都道府県 + 主要10都道府県の市区町村
-- ========================================

-- 47都道府県
insert into prefectures (name, slug, region) values
  ('北海道', 'hokkaido', '北海道'),
  ('青森県', 'aomori', '東北'),
  ('岩手県', 'iwate', '東北'),
  ('宮城県', 'miyagi', '東北'),
  ('秋田県', 'akita', '東北'),
  ('山形県', 'yamagata', '東北'),
  ('福島県', 'fukushima-pref', '東北'),
  ('茨城県', 'ibaraki', '関東'),
  ('栃木県', 'tochigi', '関東'),
  ('群馬県', 'gunma', '関東'),
  ('埼玉県', 'saitama', '関東'),
  ('千葉県', 'chiba', '関東'),
  ('東京都', 'tokyo', '関東'),
  ('神奈川県', 'kanagawa', '関東'),
  ('新潟県', 'niigata', '中部'),
  ('富山県', 'toyama', '中部'),
  ('石川県', 'ishikawa', '中部'),
  ('福井県', 'fukui', '中部'),
  ('山梨県', 'yamanashi', '中部'),
  ('長野県', 'nagano', '中部'),
  ('岐阜県', 'gifu', '中部'),
  ('静岡県', 'shizuoka', '中部'),
  ('愛知県', 'aichi', '中部'),
  ('三重県', 'mie', '近畿'),
  ('滋賀県', 'shiga', '近畿'),
  ('京都府', 'kyoto', '近畿'),
  ('大阪府', 'osaka', '近畿'),
  ('兵庫県', 'hyogo', '近畿'),
  ('奈良県', 'nara', '近畿'),
  ('和歌山県', 'wakayama', '近畿'),
  ('鳥取県', 'tottori', '中国'),
  ('島根県', 'shimane', '中国'),
  ('岡山県', 'okayama', '中国'),
  ('広島県', 'hiroshima', '中国'),
  ('山口県', 'yamaguchi', '中国'),
  ('徳島県', 'tokushima', '四国'),
  ('香川県', 'kagawa', '四国'),
  ('愛媛県', 'ehime', '四国'),
  ('高知県', 'kochi', '四国'),
  ('福岡県', 'fukuoka', '九州'),
  ('佐賀県', 'saga', '九州'),
  ('長崎県', 'nagasaki', '九州'),
  ('熊本県', 'kumamoto', '九州'),
  ('大分県', 'oita', '九州'),
  ('宮崎県', 'miyazaki', '九州'),
  ('鹿児島県', 'kagoshima', '九州'),
  ('沖縄県', 'okinawa', '九州')
on conflict (name) do nothing;

-- ========================================
-- 東京都の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'tokyo'), '千代田区', 'chiyoda'),
  ((select id from prefectures where slug = 'tokyo'), '中央区', 'chuo'),
  ((select id from prefectures where slug = 'tokyo'), '港区', 'minato'),
  ((select id from prefectures where slug = 'tokyo'), '新宿区', 'shinjuku'),
  ((select id from prefectures where slug = 'tokyo'), '文京区', 'bunkyo'),
  ((select id from prefectures where slug = 'tokyo'), '台東区', 'taito'),
  ((select id from prefectures where slug = 'tokyo'), '墨田区', 'sumida'),
  ((select id from prefectures where slug = 'tokyo'), '江東区', 'koto'),
  ((select id from prefectures where slug = 'tokyo'), '品川区', 'shinagawa'),
  ((select id from prefectures where slug = 'tokyo'), '目黒区', 'meguro'),
  ((select id from prefectures where slug = 'tokyo'), '大田区', 'ota'),
  ((select id from prefectures where slug = 'tokyo'), '世田谷区', 'setagaya'),
  ((select id from prefectures where slug = 'tokyo'), '渋谷区', 'shibuya'),
  ((select id from prefectures where slug = 'tokyo'), '中野区', 'nakano'),
  ((select id from prefectures where slug = 'tokyo'), '杉並区', 'suginami'),
  ((select id from prefectures where slug = 'tokyo'), '豊島区', 'toshima'),
  ((select id from prefectures where slug = 'tokyo'), '北区', 'kita'),
  ((select id from prefectures where slug = 'tokyo'), '荒川区', 'arakawa'),
  ((select id from prefectures where slug = 'tokyo'), '板橋区', 'itabashi'),
  ((select id from prefectures where slug = 'tokyo'), '練馬区', 'nerima'),
  ((select id from prefectures where slug = 'tokyo'), '足立区', 'adachi'),
  ((select id from prefectures where slug = 'tokyo'), '葛飾区', 'katsushika'),
  ((select id from prefectures where slug = 'tokyo'), '江戸川区', 'edogawa'),
  ((select id from prefectures where slug = 'tokyo'), '八王子市', 'hachioji'),
  ((select id from prefectures where slug = 'tokyo'), '町田市', 'machida'),
  ((select id from prefectures where slug = 'tokyo'), '府中市', 'fuchu'),
  ((select id from prefectures where slug = 'tokyo'), '調布市', 'chofu'),
  ((select id from prefectures where slug = 'tokyo'), '武蔵野市', 'musashino'),
  ((select id from prefectures where slug = 'tokyo'), '三鷹市', 'mitaka'),
  ((select id from prefectures where slug = 'tokyo'), '立川市', 'tachikawa')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 大阪府の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'osaka'), '大阪市北区', 'kita'),
  ((select id from prefectures where slug = 'osaka'), '大阪市中央区', 'chuo'),
  ((select id from prefectures where slug = 'osaka'), '大阪市浪速区', 'naniwa'),
  ((select id from prefectures where slug = 'osaka'), '大阪市天王寺区', 'tennoji'),
  ((select id from prefectures where slug = 'osaka'), '大阪市住吉区', 'sumiyoshi'),
  ((select id from prefectures where slug = 'osaka'), '大阪市阿倍野区', 'abeno'),
  ((select id from prefectures where slug = 'osaka'), '大阪市都島区', 'miyakojima'),
  ((select id from prefectures where slug = 'osaka'), '大阪市城東区', 'joto'),
  ((select id from prefectures where slug = 'osaka'), '堺市', 'sakai'),
  ((select id from prefectures where slug = 'osaka'), '豊中市', 'toyonaka'),
  ((select id from prefectures where slug = 'osaka'), '吹田市', 'suita'),
  ((select id from prefectures where slug = 'osaka'), '高槻市', 'takatsuki'),
  ((select id from prefectures where slug = 'osaka'), '枚方市', 'hirakata'),
  ((select id from prefectures where slug = 'osaka'), '東大阪市', 'higashiosaka')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 神奈川県の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'kanagawa'), '横浜市西区', 'yokohama-nishi'),
  ((select id from prefectures where slug = 'kanagawa'), '横浜市青葉区', 'yokohama-aoba'),
  ((select id from prefectures where slug = 'kanagawa'), '横浜市港北区', 'yokohama-kohoku'),
  ((select id from prefectures where slug = 'kanagawa'), '横浜市中区', 'yokohama-naka'),
  ((select id from prefectures where slug = 'kanagawa'), '横浜市戸塚区', 'yokohama-totsuka'),
  ((select id from prefectures where slug = 'kanagawa'), '川崎市', 'kawasaki'),
  ((select id from prefectures where slug = 'kanagawa'), '相模原市', 'sagamihara'),
  ((select id from prefectures where slug = 'kanagawa'), '藤沢市', 'fujisawa'),
  ((select id from prefectures where slug = 'kanagawa'), '鎌倉市', 'kamakura'),
  ((select id from prefectures where slug = 'kanagawa'), '横須賀市', 'yokosuka'),
  ((select id from prefectures where slug = 'kanagawa'), '平塚市', 'hiratsuka'),
  ((select id from prefectures where slug = 'kanagawa'), '茅ヶ崎市', 'chigasaki')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 埼玉県の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'saitama'), 'さいたま市浦和区', 'urawa'),
  ((select id from prefectures where slug = 'saitama'), 'さいたま市大宮区', 'omiya'),
  ((select id from prefectures where slug = 'saitama'), '川越市', 'kawagoe'),
  ((select id from prefectures where slug = 'saitama'), '越谷市', 'koshigaya'),
  ((select id from prefectures where slug = 'saitama'), '川口市', 'kawaguchi'),
  ((select id from prefectures where slug = 'saitama'), '所沢市', 'tokorozawa'),
  ((select id from prefectures where slug = 'saitama'), '春日部市', 'kasukabe'),
  ((select id from prefectures where slug = 'saitama'), '草加市', 'soka'),
  ((select id from prefectures where slug = 'saitama'), '熊谷市', 'kumagaya'),
  ((select id from prefectures where slug = 'saitama'), '上尾市', 'ageo')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 千葉県の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'chiba'), '千葉市中央区', 'chiba-chuo'),
  ((select id from prefectures where slug = 'chiba'), '船橋市', 'funabashi'),
  ((select id from prefectures where slug = 'chiba'), '柏市', 'kashiwa'),
  ((select id from prefectures where slug = 'chiba'), '市川市', 'ichikawa'),
  ((select id from prefectures where slug = 'chiba'), '松戸市', 'matsudo'),
  ((select id from prefectures where slug = 'chiba'), '浦安市', 'urayasu'),
  ((select id from prefectures where slug = 'chiba'), '習志野市', 'narashino'),
  ((select id from prefectures where slug = 'chiba'), '流山市', 'nagareyama'),
  ((select id from prefectures where slug = 'chiba'), '木更津市', 'kisarazu')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 北海道の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'hokkaido'), '札幌市中央区', 'sapporo-chuo'),
  ((select id from prefectures where slug = 'hokkaido'), '札幌市北区', 'sapporo-kita'),
  ((select id from prefectures where slug = 'hokkaido'), '札幌市豊平区', 'sapporo-toyohira'),
  ((select id from prefectures where slug = 'hokkaido'), '札幌市白石区', 'sapporo-shiroishi'),
  ((select id from prefectures where slug = 'hokkaido'), '旭川市', 'asahikawa'),
  ((select id from prefectures where slug = 'hokkaido'), '函館市', 'hakodate'),
  ((select id from prefectures where slug = 'hokkaido'), '小樽市', 'otaru'),
  ((select id from prefectures where slug = 'hokkaido'), '帯広市', 'obihiro')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 愛知県の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'aichi'), '名古屋市中区', 'nagoya-naka'),
  ((select id from prefectures where slug = 'aichi'), '名古屋市中村区', 'nagoya-nakamura'),
  ((select id from prefectures where slug = 'aichi'), '名古屋市千種区', 'nagoya-chikusa'),
  ((select id from prefectures where slug = 'aichi'), '名古屋市名東区', 'nagoya-meito'),
  ((select id from prefectures where slug = 'aichi'), '豊田市', 'toyota'),
  ((select id from prefectures where slug = 'aichi'), '岡崎市', 'okazaki'),
  ((select id from prefectures where slug = 'aichi'), '一宮市', 'ichinomiya'),
  ((select id from prefectures where slug = 'aichi'), '豊橋市', 'toyohashi'),
  ((select id from prefectures where slug = 'aichi'), '春日井市', 'kasugai')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 福岡県の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'fukuoka'), '福岡市中央区', 'fukuoka-chuo'),
  ((select id from prefectures where slug = 'fukuoka'), '福岡市博多区', 'fukuoka-hakata'),
  ((select id from prefectures where slug = 'fukuoka'), '福岡市早良区', 'fukuoka-sawara'),
  ((select id from prefectures where slug = 'fukuoka'), '北九州市小倉北区', 'kitakyushu-kokura'),
  ((select id from prefectures where slug = 'fukuoka'), '久留米市', 'kurume'),
  ((select id from prefectures where slug = 'fukuoka'), '春日市', 'kasuga'),
  ((select id from prefectures where slug = 'fukuoka'), '大野城市', 'onojo')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 京都府の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'kyoto'), '京都市中京区', 'nakagyo'),
  ((select id from prefectures where slug = 'kyoto'), '京都市下京区', 'shimogyo'),
  ((select id from prefectures where slug = 'kyoto'), '京都市左京区', 'sakyo'),
  ((select id from prefectures where slug = 'kyoto'), '京都市右京区', 'ukyo'),
  ((select id from prefectures where slug = 'kyoto'), '京都市東山区', 'higashiyama'),
  ((select id from prefectures where slug = 'kyoto'), '宇治市', 'uji')
on conflict (prefecture_id, slug) do nothing;

-- ========================================
-- 兵庫県の市区町村
-- ========================================
insert into cities (prefecture_id, name, slug) values
  ((select id from prefectures where slug = 'hyogo'), '神戸市中央区', 'kobe-chuo'),
  ((select id from prefectures where slug = 'hyogo'), '神戸市東灘区', 'kobe-higashinada'),
  ((select id from prefectures where slug = 'hyogo'), '神戸市灘区', 'kobe-nada'),
  ((select id from prefectures where slug = 'hyogo'), '西宮市', 'nishinomiya'),
  ((select id from prefectures where slug = 'hyogo'), '尼崎市', 'amagasaki'),
  ((select id from prefectures where slug = 'hyogo'), '姫路市', 'himeji'),
  ((select id from prefectures where slug = 'hyogo'), '明石市', 'akashi'),
  ((select id from prefectures where slug = 'hyogo'), '宝塚市', 'takarazuka')
on conflict (prefecture_id, slug) do nothing;
