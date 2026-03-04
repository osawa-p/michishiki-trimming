/**
 * Google Places API を使ったトリミングサロン スクレイピングスクリプト
 *
 * 都道府県・市区町村ごとに Text Search API で「トリミングサロン」を検索し、
 * 取得した結果を Supabase の salons テーブルに upsert する。
 *
 * 使い方:
 *   # 全都道府県スクレイピング
 *   npx tsx --env-file=.env.local scripts/scrape-google-places.ts
 *
 *   # 特定都道府県のみ
 *   npx tsx --env-file=.env.local scripts/scrape-google-places.ts --prefecture tokyo
 *
 *   # ドライラン（DB書き込みなし）
 *   npx tsx --env-file=.env.local scripts/scrape-google-places.ts --dry-run
 *
 *   # 組み合わせ
 *   npx tsx --env-file=.env.local scripts/scrape-google-places.ts --prefecture tokyo --dry-run
 *
 * 必要な環境変数(.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL      - Supabase プロジェクトURL
 *   SUPABASE_SERVICE_ROLE_KEY     - Supabase Service Role Key (RLSバイパス)
 *   GOOGLE_PLACES_API_KEY         - Google Places API (New) キー
 *
 * 環境変数の読み込みについて:
 *   npx tsx はデフォルトでは .env.local を読み込みません。
 *   --env-file=.env.local オプションを付けるか、
 *   もしくは dotenv を使う場合はこのスクリプト冒頭で config() を呼んでください。
 *
 * Google Cloud Console での準備:
 *   1. APIs & Services > Credentials で API キーを作成
 *   2. APIs & Services > Library で "Places API (New)" を有効化
 *   3. API キーを .env.local に設定:
 *      GOOGLE_PLACES_API_KEY=your_api_key_here
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import {
  GooglePlacesClient,
  GooglePlace,
  formatOpeningHours,
  extractHolidays,
  buildPhotoUrls,
  getReviewId,
  ApiQuotaExceededError,
} from './lib/google-places';

// .env.local から環境変数を読み込む（--env-file を使わない場合のフォールバック）
config({ path: resolve(__dirname, '..', '.env.local') });

// ========================================
// 環境変数チェック
// ========================================

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('エラー: Supabase の環境変数が設定されていません。');
  console.error('NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください。');
  process.exit(1);
}

if (!GOOGLE_API_KEY) {
  console.error('エラー: GOOGLE_PLACES_API_KEY が設定されていません。');
  console.error('');
  console.error('Google Cloud Console で API キーを取得してください:');
  console.error('  1. https://console.cloud.google.com/apis/credentials で API キーを作成');
  console.error('  2. Places API (New) を有効化');
  console.error('  3. .env.local に追加: GOOGLE_PLACES_API_KEY=your_api_key_here');
  process.exit(1);
}

// ========================================
// クライアント初期化
// ========================================

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const placesClient = new GooglePlacesClient(GOOGLE_API_KEY, {
  requestsPerSecond: 1,
  maxRetries: 3,
});

// ========================================
// コマンドライン引数解析
// ========================================

interface CliOptions {
  prefecture?: string;   // 特定都道府県のslug（例: "tokyo"）
  dryRun: boolean;       // DB書き込みなし
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    dryRun: false,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--prefecture' && i + 1 < args.length) {
      options.prefecture = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('使い方:');
      console.log('  npx tsx --env-file=.env.local scripts/scrape-google-places.ts [オプション]');
      console.log('');
      console.log('オプション:');
      console.log('  --prefecture <slug>  特定の都道府県のみスクレイピング (例: tokyo, osaka)');
      console.log('  --dry-run            DB書き込みなしの確認モード');
      console.log('  --help, -h           このヘルプを表示');
      process.exit(0);
    }
  }

  return options;
}

// ========================================
// 型定義
// ========================================

interface Prefecture {
  id: number;
  name: string;
  slug: string;
  region: string;
}

interface City {
  id: number;
  name: string;
  slug: string;
  prefecture_id: number;
}

interface ScrapeStats {
  totalSearches: number;
  totalPlacesFound: number;
  inserted: number;
  updated: number;
  skipped: number;
  failed: number;
  reviewsInserted: number;
}

// ========================================
// データ取得関数
// ========================================

/**
 * 都道府県一覧を Supabase から取得する
 */
async function fetchPrefectures(prefectureSlug?: string): Promise<Prefecture[]> {
  let query = supabase.from('prefectures').select('id, name, slug, region').order('id');

  if (prefectureSlug) {
    query = query.eq('slug', prefectureSlug);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`都道府県の取得に失敗: ${error.message}`);
  }

  if (!data || data.length === 0) {
    if (prefectureSlug) {
      throw new Error(`都道府県が見つかりません: ${prefectureSlug}`);
    }
    throw new Error('都道府県データが登録されていません');
  }

  return data;
}

/**
 * 指定都道府県の市区町村一覧を取得する
 */
async function fetchCities(prefectureId: number): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('id, name, slug, prefecture_id')
    .eq('prefecture_id', prefectureId)
    .order('id');

  if (error) {
    throw new Error(`市区町村の取得に失敗: ${error.message}`);
  }

  return data || [];
}

/**
 * 住所文字列から都道府県名を抽出して prefecture_id を推定する
 */
async function matchPrefectureFromAddress(
  address: string,
  prefecturesCache: Prefecture[]
): Promise<number | null> {
  for (const pref of prefecturesCache) {
    if (address.includes(pref.name)) {
      return pref.id;
    }
  }
  return null;
}

/**
 * 住所文字列から市区町村名を抽出して city_id を推定する
 */
async function matchCityFromAddress(
  address: string,
  prefectureId: number
): Promise<number | null> {
  const { data: cities } = await supabase
    .from('cities')
    .select('id, name')
    .eq('prefecture_id', prefectureId);

  if (!cities) return null;

  for (const city of cities) {
    if (address.includes(city.name)) {
      return city.id;
    }
  }

  return null;
}

// ========================================
// Upsert ロジック
// ========================================

/**
 * Google Place の情報を salons テーブルに upsert する
 */
async function upsertSalon(
  place: GooglePlace,
  prefectureId: number,
  cityId: number | null,
  allPrefectures: Prefecture[],
  dryRun: boolean
): Promise<'inserted' | 'updated' | 'skipped' | 'failed'> {
  try {
    const googlePlaceId = place.id;
    const name = place.displayName?.text;
    const address = place.formattedAddress;

    if (!name || !address) {
      console.warn(`    スキップ: 名前または住所が取得できませんでした`);
      return 'skipped';
    }

    // 住所からprefecture_id/city_idを再推定（検索結果が別の都道府県の場合がある）
    let resolvedPrefId = prefectureId;
    let resolvedCityId = cityId;

    const matchedPrefId = await matchPrefectureFromAddress(address, allPrefectures);
    if (matchedPrefId) {
      resolvedPrefId = matchedPrefId;
      resolvedCityId = await matchCityFromAddress(address, resolvedPrefId);
    }

    // 営業時間
    const businessHours = formatOpeningHours(place.regularOpeningHours);
    const holidays = extractHolidays(place.regularOpeningHours);

    // 写真URL
    const photoUrls = buildPhotoUrls(place.photos, GOOGLE_API_KEY!, 10);

    // upsert用のデータ
    const salonData = {
      name,
      address,
      lat: place.location?.latitude ?? null,
      lng: place.location?.longitude ?? null,
      phone: place.nationalPhoneNumber ?? null,
      prefecture_id: resolvedPrefId,
      city_id: resolvedCityId,
      business_hours: businessHours,
      holidays,
      image_url: photoUrls.length > 0 ? photoUrls[0] : null,
      website_url: place.websiteUri ?? null,
      google_place_id: googlePlaceId,
      google_rating: place.rating ?? null,
      google_review_count: place.userRatingCount ?? 0,
      google_photos: photoUrls,
      last_scraped_at: new Date().toISOString(),
    };

    if (dryRun) {
      console.log(`    [DRY RUN] upsert: ${name} (${address})`);
      return 'inserted';
    }

    // google_place_id で既存チェック
    const { data: existing } = await supabase
      .from('salons')
      .select('id')
      .eq('google_place_id', googlePlaceId)
      .maybeSingle();

    if (existing) {
      // UPDATE
      const { error: updateError } = await supabase
        .from('salons')
        .update({
          ...salonData,
          updated_at: new Date().toISOString(),
        })
        .eq('google_place_id', googlePlaceId);

      if (updateError) {
        console.error(`    エラー(更新): ${name} - ${updateError.message}`);
        return 'failed';
      }
      return 'updated';
    } else {
      // INSERT
      const { data: inserted, error: insertError } = await supabase
        .from('salons')
        .insert(salonData)
        .select('id')
        .single();

      if (insertError) {
        // 名前+住所の重複の可能性
        if (insertError.code === '23505') {
          console.warn(`    スキップ(重複): ${name}`);
          return 'skipped';
        }
        console.error(`    エラー(挿入): ${name} - ${insertError.message}`);
        return 'failed';
      }

      // レビューを保存
      if (inserted && place.reviews && place.reviews.length > 0) {
        await upsertReviews(inserted.id, place.reviews, dryRun);
      }

      return 'inserted';
    }
  } catch (error) {
    console.error(`    例外: ${error}`);
    return 'failed';
  }
}

/**
 * レビューを external_reviews テーブルに upsert する
 */
async function upsertReviews(
  salonId: string,
  reviews: GooglePlace['reviews'],
  dryRun: boolean
): Promise<number> {
  if (!reviews || reviews.length === 0) return 0;

  let count = 0;

  for (const review of reviews) {
    const sourceReviewId = getReviewId(review);
    const rating = Math.min(5, Math.max(1, Math.round(review.rating)));

    const reviewData = {
      salon_id: salonId,
      source: 'google' as const,
      source_review_id: sourceReviewId,
      author_name: review.authorAttribution?.displayName ?? '匿名',
      author_photo_url: review.authorAttribution?.photoUri ?? null,
      rating,
      text: review.text?.text ?? review.originalText?.text ?? null,
      published_at: review.publishTime ?? null,
      language: review.text?.languageCode ?? review.originalText?.languageCode ?? 'ja',
    };

    if (dryRun) {
      console.log(`      [DRY RUN] レビュー: ${reviewData.author_name} (${rating}点)`);
      count++;
      continue;
    }

    const { error } = await supabase
      .from('external_reviews')
      .upsert(reviewData, {
        onConflict: 'source,source_review_id',
      });

    if (error) {
      console.warn(`      レビュー保存エラー: ${error.message}`);
    } else {
      count++;
    }
  }

  return count;
}

// ========================================
// メイン処理
// ========================================

async function main(): Promise<void> {
  const options = parseArgs();

  console.log('========================================');
  console.log('Google Places API トリミングサロン スクレイピング');
  console.log('========================================');
  if (options.dryRun) {
    console.log('[DRY RUN モード] DB書き込みは行いません');
  }
  if (options.prefecture) {
    console.log(`対象都道府県: ${options.prefecture}`);
  }
  console.log('');

  // Ctrl+C ハンドリング
  let interrupted = false;
  process.on('SIGINT', () => {
    console.log('\n\n中断されました。現在の進捗までの結果を表示します...');
    interrupted = true;
  });

  // 統計
  const stats: ScrapeStats = {
    totalSearches: 0,
    totalPlacesFound: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    reviewsInserted: 0,
  };

  try {
    // 都道府県一覧を取得
    const prefectures = await fetchPrefectures(options.prefecture);
    const allPrefectures = options.prefecture
      ? await fetchPrefectures()
      : prefectures;

    console.log(`対象都道府県: ${prefectures.length} 件`);
    console.log('');

    // 都道府県ループ
    for (let prefIdx = 0; prefIdx < prefectures.length; prefIdx++) {
      if (interrupted) break;

      const prefecture = prefectures[prefIdx];
      console.log(`[${prefIdx + 1}/${prefectures.length}] ${prefecture.name} (${prefecture.slug})`);

      // 市区町村を取得
      const cities = await fetchCities(prefecture.id);

      if (cities.length === 0) {
        // 市区町村が登録されていない場合は都道府県名で検索
        console.log(`  市区町村データなし -> 都道府県名で検索`);
        await searchAndUpsert(
          `トリミングサロン ${prefecture.name}`,
          prefecture.id,
          null,
          allPrefectures,
          stats,
          options.dryRun
        );
        if (interrupted) break;
      } else {
        // 各市区町村で検索
        for (let cityIdx = 0; cityIdx < cities.length; cityIdx++) {
          if (interrupted) break;

          const city = cities[cityIdx];
          console.log(`  [${cityIdx + 1}/${cities.length}] ${city.name}`);

          await searchAndUpsert(
            `トリミングサロン ${prefecture.name}${city.name}`,
            prefecture.id,
            city.id,
            allPrefectures,
            stats,
            options.dryRun
          );
        }
      }

      console.log(`  -> ${prefecture.name} 完了`);
      console.log('');
    }
  } catch (error) {
    if (error instanceof ApiQuotaExceededError) {
      console.error('');
      console.error('=== API Quota 超過 ===');
      console.error('Google Places API の利用制限に達しました。');
      console.error('しばらく待ってから再実行してください。');
      console.error('既に登録済みのデータは保持されています。');
    } else {
      console.error(`\n予期しないエラー: ${error}`);
    }
  }

  // 結果サマリー
  printSummary(stats, options.dryRun);
}

/**
 * 検索クエリを実行し、結果を upsert する
 */
async function searchAndUpsert(
  query: string,
  prefectureId: number,
  cityId: number | null,
  allPrefectures: Prefecture[],
  stats: ScrapeStats,
  dryRun: boolean
): Promise<void> {
  try {
    stats.totalSearches++;

    const places = await placesClient.searchAllPlaces(query);

    if (!places || places.length === 0) {
      console.log(`    検索結果: 0 件`);
      return;
    }

    console.log(`    検索結果: ${places.length} 件`);
    stats.totalPlacesFound += places.length;

    for (const place of places) {
      const displayName = place.displayName?.text ?? '(名前なし)';
      const result = await upsertSalon(place, prefectureId, cityId, allPrefectures, dryRun);

      switch (result) {
        case 'inserted':
          stats.inserted++;
          console.log(`    + ${displayName}`);
          // レビュー数をカウント（insertedの場合はupsertSalon内で保存済み）
          if (place.reviews) {
            stats.reviewsInserted += place.reviews.length;
          }
          break;
        case 'updated':
          stats.updated++;
          console.log(`    ~ ${displayName} (更新)`);
          break;
        case 'skipped':
          stats.skipped++;
          break;
        case 'failed':
          stats.failed++;
          break;
      }
    }
  } catch (error) {
    if (error instanceof ApiQuotaExceededError) {
      throw error; // Quota超過はメインで処理
    }
    console.error(`    検索エラー: ${error}`);
    stats.failed++;
  }
}

/**
 * 結果サマリーを表示する
 */
function printSummary(stats: ScrapeStats, dryRun: boolean): void {
  console.log('');
  console.log('========================================');
  console.log('スクレイピング結果サマリー');
  if (dryRun) {
    console.log('[DRY RUN モード]');
  }
  console.log('========================================');
  console.log(`  検索回数:         ${stats.totalSearches} 回`);
  console.log(`  検索結果合計:     ${stats.totalPlacesFound} 件`);
  console.log('  ---');
  console.log(`  新規登録:         ${stats.inserted} 件`);
  console.log(`  更新:             ${stats.updated} 件`);
  console.log(`  スキップ(重複):   ${stats.skipped} 件`);
  console.log(`  失敗:             ${stats.failed} 件`);
  console.log('  ---');
  console.log(`  レビュー登録:     ${stats.reviewsInserted} 件`);
  console.log('========================================');
}

// ========================================
// エントリポイント
// ========================================

main().catch((err) => {
  console.error('予期しないエラーが発生しました:', err);
  process.exit(1);
});
