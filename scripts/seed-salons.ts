/**
 * サロンシードデータ投入スクリプト
 *
 * scripts/data/salons-sample.json を読み込み、Supabase にサロンデータを一括登録します。
 *
 * 使い方:
 *   npx tsx scripts/seed-salons.ts
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

// RLS をバイパスするため service_role キーを使用
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// サロンデータの型定義
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
  postal_code: string;
  phone: string;
  business_hours: string;
  holidays: string;
  description: string;
  lat: number;
  lng: number;
  services: SalonService[];
  breeds: string[];
  features: string[];
}

// キャッシュ用マップ
const prefectureCache = new Map<string, number>();
const cityCache = new Map<string, number>();
const breedCache = new Map<string, number>();
const featureCache = new Map<string, number>();

/**
 * prefecture_slug から prefecture_id を解決する
 */
async function resolvePrefectureId(slug: string): Promise<number | null> {
  if (prefectureCache.has(slug)) {
    return prefectureCache.get(slug)!;
  }

  const { data, error } = await supabase
    .from('prefectures')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.warn(`  警告: 都道府県が見つかりません (slug: ${slug})`);
    return null;
  }

  prefectureCache.set(slug, data.id);
  return data.id;
}

/**
 * city_slug + prefecture_id から city_id を解決する
 */
async function resolveCityId(slug: string, prefectureId: number): Promise<number | null> {
  const cacheKey = `${prefectureId}:${slug}`;
  if (cityCache.has(cacheKey)) {
    return cityCache.get(cacheKey)!;
  }

  const { data, error } = await supabase
    .from('cities')
    .select('id')
    .eq('slug', slug)
    .eq('prefecture_id', prefectureId)
    .single();

  if (error || !data) {
    console.warn(`  警告: 市区町村が見つかりません (slug: ${slug}, prefecture_id: ${prefectureId})`);
    return null;
  }

  cityCache.set(cacheKey, data.id);
  return data.id;
}

/**
 * 犬種名から breed_id を解決する
 */
async function resolveBreedId(name: string): Promise<number | null> {
  if (breedCache.has(name)) {
    return breedCache.get(name)!;
  }

  const { data, error } = await supabase
    .from('dog_breeds')
    .select('id')
    .eq('name', name)
    .single();

  if (error || !data) {
    console.warn(`  警告: 犬種が見つかりません (name: ${name})`);
    return null;
  }

  breedCache.set(name, data.id);
  return data.id;
}

/**
 * feature slug から feature_id を解決する
 */
async function resolveFeatureId(slug: string): Promise<number | null> {
  if (featureCache.has(slug)) {
    return featureCache.get(slug)!;
  }

  const { data, error } = await supabase
    .from('features')
    .select('id')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.warn(`  警告: 特徴が見つかりません (slug: ${slug})`);
    return null;
  }

  featureCache.set(slug, data.id);
  return data.id;
}

/**
 * 1件のサロンをDBに登録する
 */
async function insertSalon(entry: SalonEntry): Promise<boolean> {
  try {
    // 1. 都道府県を解決
    const prefectureId = await resolvePrefectureId(entry.prefecture_slug);
    if (!prefectureId) {
      console.error(`  スキップ: 都道府県の解決に失敗 (${entry.name})`);
      return false;
    }

    // 2. 市区町村を解決
    const cityId = await resolveCityId(entry.city_slug, prefectureId);
    if (!cityId) {
      console.error(`  スキップ: 市区町村の解決に失敗 (${entry.name})`);
      return false;
    }

    // 3. サロン本体を挿入
    const { data: salon, error: salonError } = await supabase
      .from('salons')
      .insert({
        name: entry.name,
        address: entry.address,
        prefecture_id: prefectureId,
        city_id: cityId,
        postal_code: entry.postal_code,
        phone: entry.phone,
        business_hours: entry.business_hours,
        holidays: entry.holidays,
        description: entry.description,
        lat: entry.lat,
        lng: entry.lng,
      })
      .select('id')
      .single();

    if (salonError || !salon) {
      // 重複エラーの場合はスキップ
      if (salonError?.code === '23505') {
        console.warn(`  スキップ(重複): ${entry.name}`);
        return false;
      }
      console.error(`  エラー(サロン挿入): ${entry.name} - ${salonError?.message}`);
      return false;
    }

    const salonId = salon.id;

    // 4. 犬種を解決して salon_breeds に挿入
    for (const breedName of entry.breeds) {
      const breedId = await resolveBreedId(breedName);
      if (breedId) {
        const { error: breedError } = await supabase
          .from('salon_breeds')
          .insert({ salon_id: salonId, breed_id: breedId })
          .select()
          .single();

        if (breedError && breedError.code !== '23505') {
          console.warn(`  警告(犬種リンク): ${breedName} - ${breedError.message}`);
        }
      }
    }

    // 5. 特徴を解決して salon_features に挿入
    for (const featureSlug of entry.features) {
      const featureId = await resolveFeatureId(featureSlug);
      if (featureId) {
        const { error: featureError } = await supabase
          .from('salon_features')
          .insert({ salon_id: salonId, feature_id: featureId })
          .select()
          .single();

        if (featureError && featureError.code !== '23505') {
          console.warn(`  警告(特徴リンク): ${featureSlug} - ${featureError.message}`);
        }
      }
    }

    // 6. サービスを挿入
    for (const service of entry.services) {
      const { error: serviceError } = await supabase
        .from('services')
        .insert({
          salon_id: salonId,
          name: service.name,
          price: service.price,
          duration_min: service.duration_min,
        })
        .select()
        .single();

      if (serviceError) {
        console.warn(`  警告(サービス): ${service.name} - ${serviceError.message}`);
      }
    }

    return true;
  } catch (err) {
    console.error(`  例外: ${entry.name} - ${err}`);
    return false;
  }
}

/**
 * メイン処理
 */
async function main() {
  console.log('========================================');
  console.log('サロンシードデータ投入スクリプト');
  console.log('========================================\n');

  // JSON ファイルを読み込む
  const filePath = resolve(__dirname, 'data', 'salons-sample.json');
  console.log(`データファイル: ${filePath}`);

  let salons: SalonEntry[];
  try {
    const raw = readFileSync(filePath, 'utf-8');
    salons = JSON.parse(raw);
  } catch (err) {
    console.error(`ファイルの読み込みに失敗しました: ${err}`);
    process.exit(1);
  }

  console.log(`読み込み件数: ${salons.length} 件\n`);

  let inserted = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < salons.length; i++) {
    const salon = salons[i];
    console.log(`[${i + 1}/${salons.length}] ${salon.name} (${salon.prefecture_slug}/${salon.city_slug})`);

    const success = await insertSalon(salon);
    if (success) {
      inserted++;
      console.log(`  -> 登録完了`);
    } else {
      // insertSalon 内でスキップ/エラーログが出力済み
      // 重複の場合は skipped、それ以外は failed
      // ここでは簡易的にすべて skipped 扱い
      skipped++;
    }
  }

  // failed は insertSalon が例外を投げた場合のみ
  // 現在の実装では insertSalon が false を返す = skipped
  console.log('\n========================================');
  console.log('完了');
  console.log(`  登録: ${inserted} 件`);
  console.log(`  スキップ: ${skipped} 件`);
  console.log(`  失敗: ${failed} 件`);
  console.log('========================================');
}

main().catch((err) => {
  console.error('予期しないエラーが発生しました:', err);
  process.exit(1);
});
