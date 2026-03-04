/**
 * サロンデータインポートユーティリティ
 *
 * 指定した JSON ファイルからサロンデータを読み込み、Supabase に登録します。
 * バリデーションを行い、結果をサマリーとして出力します。
 *
 * 使い方:
 *   npx tsx scripts/import-salons.ts scripts/data/salons-sample.json
 *
 * 必要な環境変数(.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// .env.local から環境変数を読み込む
config({ path: resolve(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('エラー: 環境変数が設定されていません。');
  console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ========================================
// 型定義
// ========================================

interface SalonService {
  name: string;
  price: number;
  duration_min: number;
}

interface SalonEntry {
  name: string;
  address: string;
  prefecture_slug: string;
  city_slug: string;
  postal_code?: string;
  phone?: string;
  business_hours?: string;
  holidays?: string;
  description?: string;
  lat?: number;
  lng?: number;
  services?: SalonService[];
  breeds?: string[];
  features?: string[];
}

// ========================================
// バリデーション
// ========================================

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function validateSalonEntry(entry: unknown, index: number): ValidationResult {
  const errors: string[] = [];

  if (typeof entry !== 'object' || entry === null) {
    return { valid: false, errors: [`[${index}] エントリがオブジェクトではありません`] };
  }

  const salon = entry as Record<string, unknown>;

  // 必須フィールドのチェック
  if (!salon.name || typeof salon.name !== 'string') {
    errors.push(`[${index}] "name" は必須の文字列フィールドです`);
  }
  if (!salon.address || typeof salon.address !== 'string') {
    errors.push(`[${index}] "address" は必須の文字列フィールドです`);
  }
  if (!salon.prefecture_slug || typeof salon.prefecture_slug !== 'string') {
    errors.push(`[${index}] "prefecture_slug" は必須の文字列フィールドです`);
  }
  if (!salon.city_slug || typeof salon.city_slug !== 'string') {
    errors.push(`[${index}] "city_slug" は必須の文字列フィールドです`);
  }

  // オプショナルフィールドの型チェック
  if (salon.lat !== undefined && typeof salon.lat !== 'number') {
    errors.push(`[${index}] "lat" は数値フィールドです`);
  }
  if (salon.lng !== undefined && typeof salon.lng !== 'number') {
    errors.push(`[${index}] "lng" は数値フィールドです`);
  }
  if (salon.services !== undefined && !Array.isArray(salon.services)) {
    errors.push(`[${index}] "services" は配列フィールドです`);
  }
  if (salon.breeds !== undefined && !Array.isArray(salon.breeds)) {
    errors.push(`[${index}] "breeds" は配列フィールドです`);
  }
  if (salon.features !== undefined && !Array.isArray(salon.features)) {
    errors.push(`[${index}] "features" は配列フィールドです`);
  }

  // サービスの内容チェック
  if (Array.isArray(salon.services)) {
    for (let i = 0; i < (salon.services as unknown[]).length; i++) {
      const svc = (salon.services as Record<string, unknown>[])[i];
      if (!svc.name || typeof svc.name !== 'string') {
        errors.push(`[${index}] services[${i}].name は必須の文字列です`);
      }
      if (svc.price !== undefined && typeof svc.price !== 'number') {
        errors.push(`[${index}] services[${i}].price は数値です`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ========================================
// キャッシュ用マップ
// ========================================

const prefectureCache = new Map<string, number>();
const cityCache = new Map<string, number>();
const breedCache = new Map<string, number>();
const featureCache = new Map<string, number>();

async function resolvePrefectureId(slug: string): Promise<number | null> {
  if (prefectureCache.has(slug)) return prefectureCache.get(slug)!;
  const { data, error } = await supabase
    .from('prefectures')
    .select('id')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  prefectureCache.set(slug, data.id);
  return data.id;
}

async function resolveCityId(slug: string, prefectureId: number): Promise<number | null> {
  const key = `${prefectureId}:${slug}`;
  if (cityCache.has(key)) return cityCache.get(key)!;
  const { data, error } = await supabase
    .from('cities')
    .select('id')
    .eq('slug', slug)
    .eq('prefecture_id', prefectureId)
    .single();
  if (error || !data) return null;
  cityCache.set(key, data.id);
  return data.id;
}

async function resolveBreedId(name: string): Promise<number | null> {
  if (breedCache.has(name)) return breedCache.get(name)!;
  const { data, error } = await supabase
    .from('dog_breeds')
    .select('id')
    .eq('name', name)
    .single();
  if (error || !data) return null;
  breedCache.set(name, data.id);
  return data.id;
}

async function resolveFeatureId(slug: string): Promise<number | null> {
  if (featureCache.has(slug)) return featureCache.get(slug)!;
  const { data, error } = await supabase
    .from('features')
    .select('id')
    .eq('slug', slug)
    .single();
  if (error || !data) return null;
  featureCache.set(slug, data.id);
  return data.id;
}

// ========================================
// インポート処理
// ========================================

type ImportResult = 'inserted' | 'skipped' | 'failed';

async function importSalon(entry: SalonEntry): Promise<ImportResult> {
  try {
    // 都道府県を解決
    const prefectureId = await resolvePrefectureId(entry.prefecture_slug);
    if (!prefectureId) {
      console.error(`  エラー: 都道府県が見つかりません (slug: ${entry.prefecture_slug})`);
      return 'failed';
    }

    // 市区町村を解決
    const cityId = await resolveCityId(entry.city_slug, prefectureId);
    if (!cityId) {
      console.error(`  エラー: 市区町村が見つかりません (slug: ${entry.city_slug})`);
      return 'failed';
    }

    // サロン本体を挿入
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .insert({
        name: entry.name,
        address: entry.address,
        prefecture_id: prefectureId,
        city_id: cityId,
        postal_code: entry.postal_code || null,
        phone: entry.phone || null,
        business_hours: entry.business_hours || null,
        holidays: entry.holidays || null,
        description: entry.description || null,
        lat: entry.lat || null,
        lng: entry.lng || null,
      })
      .select('id')
      .single();

    if (salonError || !salon) {
      if (salonError?.code === '23505') {
        console.warn(`  スキップ(重複): ${entry.name}`);
        return 'skipped';
      }
      console.error(`  エラー(サロン挿入): ${salonError?.message}`);
      return 'failed';
    }

    const salonId = salon.id;

    // 犬種リンク
    if (entry.breeds && entry.breeds.length > 0) {
      for (const breedName of entry.breeds) {
        const breedId = await resolveBreedId(breedName);
        if (breedId) {
          await supabase
            .from('salon_breeds')
            .insert({ salon_id: salonId, breed_id: breedId });
        } else {
          console.warn(`  警告: 犬種が見つかりません (${breedName})`);
        }
      }
    }

    // 特徴リンク
    if (entry.features && entry.features.length > 0) {
      for (const featureSlug of entry.features) {
        const featureId = await resolveFeatureId(featureSlug);
        if (featureId) {
          await supabase
            .from('salon_features')
            .insert({ salon_id: salonId, feature_id: featureId });
        } else {
          console.warn(`  警告: 特徴が見つかりません (${featureSlug})`);
        }
      }
    }

    // サービス
    if (entry.services && entry.services.length > 0) {
      for (const service of entry.services) {
        await supabase.from('services').insert({
          salon_id: salonId,
          name: service.name,
          price: service.price,
          duration_min: service.duration_min,
        });
      }
    }

    return 'inserted';
  } catch (err) {
    console.error(`  例外: ${err}`);
    return 'failed';
  }
}

// ========================================
// メイン処理
// ========================================

async function main() {
  // コマンドライン引数からファイルパスを取得
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('使い方: npx tsx scripts/import-salons.ts <JSONファイルパス>');
    console.error('例:     npx tsx scripts/import-salons.ts scripts/data/salons-sample.json');
    process.exit(1);
  }

  const filePath = resolve(args[0]);
  console.log('========================================');
  console.log('サロンデータインポートユーティリティ');
  console.log('========================================\n');
  console.log(`ファイル: ${filePath}\n`);

  // JSON ファイルを読み込む
  let rawData: unknown[];
  try {
    const raw = readFileSync(filePath, 'utf-8');
    rawData = JSON.parse(raw);
    if (!Array.isArray(rawData)) {
      console.error('エラー: JSON ファイルのルートは配列である必要があります');
      process.exit(1);
    }
  } catch (err) {
    console.error(`ファイルの読み込みに失敗しました: ${err}`);
    process.exit(1);
  }

  console.log(`読み込み件数: ${rawData.length} 件\n`);

  // バリデーション
  console.log('--- バリデーション ---');
  let hasValidationError = false;
  const validEntries: SalonEntry[] = [];

  for (let i = 0; i < rawData.length; i++) {
    const result = validateSalonEntry(rawData[i], i);
    if (!result.valid) {
      hasValidationError = true;
      result.errors.forEach((e) => console.error(`  ${e}`));
    } else {
      validEntries.push(rawData[i] as SalonEntry);
    }
  }

  if (hasValidationError) {
    console.warn(`\n警告: ${rawData.length - validEntries.length} 件のバリデーションエラーがあります。`);
    console.log(`有効なエントリ ${validEntries.length} 件のみインポートを続行します。\n`);
  } else {
    console.log(`全 ${validEntries.length} 件のバリデーションOK\n`);
  }

  if (validEntries.length === 0) {
    console.error('インポート可能なエントリがありません。処理を中止します。');
    process.exit(1);
  }

  // インポート実行
  console.log('--- インポート開始 ---');
  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < validEntries.length; i++) {
    const entry = validEntries[i];
    console.log(`[${i + 1}/${validEntries.length}] ${entry.name}`);

    const result = await importSalon(entry);
    switch (result) {
      case 'inserted':
        inserted++;
        console.log(`  -> 登録完了`);
        break;
      case 'skipped':
        skipped++;
        break;
      case 'failed':
        failed++;
        break;
    }
  }

  // 結果サマリー
  console.log('\n========================================');
  console.log('インポート結果');
  console.log('========================================');
  console.log(`  登録 (inserted): ${inserted} 件`);
  console.log(`  スキップ (skipped): ${skipped} 件`);
  console.log(`  失敗 (failed): ${failed} 件`);
  console.log(`  合計: ${validEntries.length} 件`);
  console.log('========================================');

  // 失敗があった場合は終了コード1
  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('予期しないエラーが発生しました:', err);
  process.exit(1);
});
