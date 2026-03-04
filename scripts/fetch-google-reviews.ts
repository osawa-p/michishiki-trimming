/**
 * 既存サロンの Google レビュー更新スクリプト
 *
 * google_place_id が設定されているサロンに対して、
 * Place Details API でレビューを取得し external_reviews テーブルに upsert する。
 * 同時にサロンの google_rating / google_review_count も更新する。
 *
 * 使い方:
 *   # 全サロンのレビューを更新
 *   npx tsx --env-file=.env.local scripts/fetch-google-reviews.ts
 *
 *   # 最終スクレイピングから7日以上経過したサロンのみ
 *   npx tsx --env-file=.env.local scripts/fetch-google-reviews.ts --stale-days 7
 *
 *   # ドライラン
 *   npx tsx --env-file=.env.local scripts/fetch-google-reviews.ts --dry-run
 *
 *   # 処理するサロン数を制限
 *   npx tsx --env-file=.env.local scripts/fetch-google-reviews.ts --limit 50
 *
 * 必要な環境変数(.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL      - Supabase プロジェクトURL
 *   SUPABASE_SERVICE_ROLE_KEY     - Supabase Service Role Key (RLSバイパス)
 *   GOOGLE_PLACES_API_KEY         - Google Places API (New) キー
 *
 * 環境変数の読み込みについて:
 *   npx tsx はデフォルトでは .env.local を読み込みません。
 *   --env-file=.env.local オプションを付けるか、
 *   dotenv パッケージ経由で読み込んでください（このスクリプトでは dotenv/config も呼んでいます）。
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import {
  GooglePlacesClient,
  PlaceReview,
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
  dryRun: boolean;
  staleDays: number;  // この日数以上 last_scraped_at が古いサロンのみ対象
  limit: number;      // 処理するサロン数の上限（0 = 無制限）
}

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    dryRun: false,
    staleDays: 0,
    limit: 0,
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--stale-days' && i + 1 < args.length) {
      options.staleDays = parseInt(args[i + 1], 10);
      if (isNaN(options.staleDays) || options.staleDays < 0) {
        console.error('エラー: --stale-days は 0 以上の整数を指定してください');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--limit' && i + 1 < args.length) {
      options.limit = parseInt(args[i + 1], 10);
      if (isNaN(options.limit) || options.limit < 1) {
        console.error('エラー: --limit は 1 以上の整数を指定してください');
        process.exit(1);
      }
      i++;
    } else if (args[i] === '--help' || args[i] === '-h') {
      console.log('使い方:');
      console.log('  npx tsx --env-file=.env.local scripts/fetch-google-reviews.ts [オプション]');
      console.log('');
      console.log('オプション:');
      console.log('  --stale-days <N>  N日以上更新されていないサロンのみ対象 (デフォルト: 0=全て)');
      console.log('  --limit <N>       処理するサロン数を制限');
      console.log('  --dry-run         DB書き込みなしの確認モード');
      console.log('  --help, -h        このヘルプを表示');
      process.exit(0);
    }
  }

  return options;
}

// ========================================
// 型定義
// ========================================

interface SalonWithGoogleId {
  id: string;
  name: string;
  google_place_id: string;
  last_scraped_at: string | null;
}

interface ReviewStats {
  totalSalons: number;
  processed: number;
  reviewsInserted: number;
  reviewsUpdated: number;
  failed: number;
  skipped: number;
}

// ========================================
// メイン処理
// ========================================

/**
 * google_place_id が設定されているサロン一覧を取得する
 */
async function fetchSalonsWithGoogleId(options: CliOptions): Promise<SalonWithGoogleId[]> {
  let query = supabase
    .from('salons')
    .select('id, name, google_place_id, last_scraped_at')
    .not('google_place_id', 'is', null)
    .order('last_scraped_at', { ascending: true, nullsFirst: true });

  // stale-days フィルタ
  if (options.staleDays > 0) {
    const staleDate = new Date();
    staleDate.setDate(staleDate.getDate() - options.staleDays);
    query = query.or(`last_scraped_at.is.null,last_scraped_at.lt.${staleDate.toISOString()}`);
  }

  // limit
  if (options.limit > 0) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`サロン一覧の取得に失敗: ${error.message}`);
  }

  return (data || []) as SalonWithGoogleId[];
}

/**
 * 1件のサロンのレビューを取得・更新する
 */
async function updateSalonReviews(
  salon: SalonWithGoogleId,
  dryRun: boolean,
  stats: ReviewStats
): Promise<void> {
  try {
    // Place Details API でレビューを取得
    const placeDetails = await placesClient.getPlaceReviews(salon.google_place_id);

    // google_rating / google_review_count を更新
    const ratingUpdate = {
      google_rating: placeDetails.rating ?? null,
      google_review_count: placeDetails.userRatingCount ?? 0,
      last_scraped_at: new Date().toISOString(),
    };

    if (!dryRun) {
      const { error: updateError } = await supabase
        .from('salons')
        .update(ratingUpdate)
        .eq('id', salon.id);

      if (updateError) {
        console.error(`    評価更新エラー: ${updateError.message}`);
      }
    } else {
      console.log(`    [DRY RUN] 評価更新: ${placeDetails.rating ?? 'N/A'} (${placeDetails.userRatingCount ?? 0}件)`);
    }

    // レビューを upsert
    const reviews = placeDetails.reviews;
    if (!reviews || reviews.length === 0) {
      console.log(`    レビュー: 0 件`);
      return;
    }

    console.log(`    レビュー: ${reviews.length} 件`);

    for (const review of reviews) {
      await upsertSingleReview(salon.id, review, dryRun, stats);
    }
  } catch (error) {
    if (error instanceof ApiQuotaExceededError) {
      throw error;
    }
    console.error(`    エラー: ${error}`);
    stats.failed++;
  }
}

/**
 * 1件のレビューを external_reviews テーブルに upsert する
 */
async function upsertSingleReview(
  salonId: string,
  review: PlaceReview,
  dryRun: boolean,
  stats: ReviewStats
): Promise<void> {
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
    stats.reviewsInserted++;
    return;
  }

  // 既存チェック
  const { data: existing } = await supabase
    .from('external_reviews')
    .select('id')
    .eq('source', 'google')
    .eq('source_review_id', sourceReviewId)
    .maybeSingle();

  if (existing) {
    // UPDATE
    const { error } = await supabase
      .from('external_reviews')
      .update({
        rating: reviewData.rating,
        text: reviewData.text,
        author_name: reviewData.author_name,
        author_photo_url: reviewData.author_photo_url,
      })
      .eq('id', existing.id);

    if (error) {
      console.warn(`      レビュー更新エラー: ${error.message}`);
      stats.failed++;
    } else {
      stats.reviewsUpdated++;
    }
  } else {
    // INSERT
    const { error } = await supabase
      .from('external_reviews')
      .insert(reviewData);

    if (error) {
      if (error.code === '23505') {
        // 重複（race condition）-> 無視
        stats.skipped++;
      } else {
        console.warn(`      レビュー挿入エラー: ${error.message}`);
        stats.failed++;
      }
    } else {
      stats.reviewsInserted++;
    }
  }
}

/**
 * メイン関数
 */
async function main(): Promise<void> {
  const options = parseArgs();

  console.log('========================================');
  console.log('Google レビュー更新スクリプト');
  console.log('========================================');
  if (options.dryRun) {
    console.log('[DRY RUN モード] DB書き込みは行いません');
  }
  if (options.staleDays > 0) {
    console.log(`対象: 最終スクレイピングから ${options.staleDays} 日以上経過したサロン`);
  }
  if (options.limit > 0) {
    console.log(`処理上限: ${options.limit} 件`);
  }
  console.log('');

  // Ctrl+C ハンドリング
  let interrupted = false;
  process.on('SIGINT', () => {
    console.log('\n\n中断されました。現在の進捗までの結果を表示します...');
    interrupted = true;
  });

  const stats: ReviewStats = {
    totalSalons: 0,
    processed: 0,
    reviewsInserted: 0,
    reviewsUpdated: 0,
    failed: 0,
    skipped: 0,
  };

  try {
    // google_place_id が設定されているサロン一覧を取得
    const salons = await fetchSalonsWithGoogleId(options);
    stats.totalSalons = salons.length;

    if (salons.length === 0) {
      console.log('対象サロンがありません。');
      console.log('google_place_id が設定されたサロンが必要です。');
      console.log('先に scrape-google-places.ts を実行してサロンデータを取得してください。');
      return;
    }

    console.log(`対象サロン: ${salons.length} 件`);
    console.log('');

    // 各サロンのレビューを更新
    for (let i = 0; i < salons.length; i++) {
      if (interrupted) break;

      const salon = salons[i];
      console.log(`[${i + 1}/${salons.length}] ${salon.name}`);

      await updateSalonReviews(salon, options.dryRun, stats);
      stats.processed++;
    }
  } catch (error) {
    if (error instanceof ApiQuotaExceededError) {
      console.error('');
      console.error('=== API Quota 超過 ===');
      console.error('Google Places API の利用制限に達しました。');
      console.error('しばらく待ってから再実行してください。');
      console.error('既に更新済みのデータは保持されています。');
    } else {
      console.error(`\n予期しないエラー: ${error}`);
    }
  }

  // 結果サマリー
  console.log('');
  console.log('========================================');
  console.log('レビュー更新結果サマリー');
  if (options.dryRun) {
    console.log('[DRY RUN モード]');
  }
  console.log('========================================');
  console.log(`  対象サロン数:     ${stats.totalSalons} 件`);
  console.log(`  処理完了:         ${stats.processed} 件`);
  console.log('  ---');
  console.log(`  レビュー新規登録: ${stats.reviewsInserted} 件`);
  console.log(`  レビュー更新:     ${stats.reviewsUpdated} 件`);
  console.log(`  スキップ(重複):   ${stats.skipped} 件`);
  console.log(`  失敗:             ${stats.failed} 件`);
  console.log('========================================');
}

// ========================================
// エントリポイント
// ========================================

main().catch((err) => {
  console.error('予期しないエラーが発生しました:', err);
  process.exit(1);
});
