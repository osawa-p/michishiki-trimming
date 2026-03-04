export type ServiceEntry = {
  name: string;
  slug: string;
  minPrice: number;
  maxPrice: number;
  isOption: boolean;
};

export type PriceEntry = {
  breed: string;
  sizeCategory: '小型犬' | '中型犬' | '大型犬';
  popular?: boolean;
  services: ServiceEntry[];
};

/**
 * 犬種別トリミング料金データ（市場相場ベース）
 * 料金は全国平均的なサロン価格帯を参考に設定
 */
export const priceData: PriceEntry[] = [
  // === 小型犬 ===
  {
    breed: 'トイプードル',
    sizeCategory: '小型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 4000, maxPrice: 6000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 6000, maxPrice: 10000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2500, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 3000, isOption: true },
    ],
  },
  {
    breed: 'チワワ',
    sizeCategory: '小型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 3000, maxPrice: 4500, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 4500, maxPrice: 7000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 800, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 2500, isOption: true },
    ],
  },
  {
    breed: 'ミニチュアダックスフンド',
    sizeCategory: '小型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 3500, maxPrice: 5000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 5000, maxPrice: 7500, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 800, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 2500, isOption: true },
    ],
  },
  {
    breed: 'ポメラニアン',
    sizeCategory: '小型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 3500, maxPrice: 5500, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 5500, maxPrice: 8500, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1000, maxPrice: 1800, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 800, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 2500, isOption: true },
    ],
  },
  {
    breed: 'ヨークシャーテリア',
    sizeCategory: '小型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 3500, maxPrice: 5000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 5500, maxPrice: 8000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 800, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 2500, isOption: true },
    ],
  },
  {
    breed: 'シーズー',
    sizeCategory: '小型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 3500, maxPrice: 5500, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 5500, maxPrice: 8500, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 800, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 2500, isOption: true },
    ],
  },
  {
    breed: 'マルチーズ',
    sizeCategory: '小型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 3500, maxPrice: 5000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 5500, maxPrice: 8000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 800, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 2500, isOption: true },
    ],
  },
  {
    breed: 'パピヨン',
    sizeCategory: '小型犬',
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 3500, maxPrice: 5000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 5000, maxPrice: 7500, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 800, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 800, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 2500, isOption: true },
    ],
  },
  {
    breed: 'ミニチュアシュナウザー',
    sizeCategory: '小型犬',
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 4000, maxPrice: 5500, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 6000, maxPrice: 9000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1000, maxPrice: 1800, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 500, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1000, maxPrice: 2500, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 1500, maxPrice: 3000, isOption: true },
    ],
  },
  // === 中型犬 ===
  {
    breed: '柴犬',
    sizeCategory: '中型犬',
    popular: true,
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 4500, maxPrice: 7000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 6500, maxPrice: 9000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1500, maxPrice: 3000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 2000, maxPrice: 3500, isOption: true },
    ],
  },
  {
    breed: 'コーギー',
    sizeCategory: '中型犬',
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 5000, maxPrice: 7000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 7000, maxPrice: 10000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1500, maxPrice: 3000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 2000, maxPrice: 3500, isOption: true },
    ],
  },
  {
    breed: 'フレンチブルドッグ',
    sizeCategory: '中型犬',
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 4500, maxPrice: 6500, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 6000, maxPrice: 8500, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1000, maxPrice: 1800, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 500, maxPrice: 1000, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 1500, maxPrice: 3000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 2000, maxPrice: 3500, isOption: true },
    ],
  },
  // === 大型犬 ===
  {
    breed: 'ゴールデンレトリバー',
    sizeCategory: '大型犬',
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 7000, maxPrice: 11000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 10000, maxPrice: 16000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1500, maxPrice: 3000, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 2500, maxPrice: 4500, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 3000, maxPrice: 5000, isOption: true },
    ],
  },
  {
    breed: 'ラブラドールレトリバー',
    sizeCategory: '大型犬',
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 7000, maxPrice: 10000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 9000, maxPrice: 14000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 1500, maxPrice: 2500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 2500, maxPrice: 4000, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 3000, maxPrice: 5000, isOption: true },
    ],
  },
  {
    breed: 'スタンダードプードル',
    sizeCategory: '大型犬',
    services: [
      { name: 'シャンプーコース', slug: 'shampoo', minPrice: 8000, maxPrice: 12000, isOption: false },
      { name: 'シャンプー＆カットコース', slug: 'shampoo-cut', minPrice: 12000, maxPrice: 18000, isOption: false },
      { name: '部分カット', slug: 'partial-cut', minPrice: 2000, maxPrice: 3500, isOption: true },
      { name: '爪切り', slug: 'nail', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '耳掃除', slug: 'ear', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: '歯磨き', slug: 'teeth', minPrice: 1000, maxPrice: 2000, isOption: true },
      { name: '肛門腺絞り', slug: 'anal-gland', minPrice: 800, maxPrice: 1500, isOption: true },
      { name: 'マイクロバブル', slug: 'micro-bubble', minPrice: 2500, maxPrice: 4500, isOption: true },
      { name: '泥パック', slug: 'mud-pack', minPrice: 3000, maxPrice: 5500, isOption: true },
    ],
  },
];

/** 犬種名一覧を取得 */
export function getBreedNames(): string[] {
  return priceData.map((entry) => entry.breed);
}

/** 犬種名からデータを取得 */
export function getPriceByBreed(breed: string): PriceEntry | undefined {
  return priceData.find((entry) => entry.breed === breed);
}

/** サイズカテゴリ一覧 */
export const sizeCategories = ['小型犬', '中型犬', '大型犬'] as const;

/** サイズカテゴリの説明 */
export const sizeCategoryDescriptions: Record<string, string> = {
  '小型犬': '5kg未満',
  '中型犬': '5〜15kg',
  '大型犬': '15kg以上',
};
