/**
 * Google Places API (New) ラッパーモジュール
 *
 * Text Search API / Place Details API を使ってトリミングサロン情報を取得する。
 * Rate limiting、リトライ、型定義を含む。
 *
 * 必要な環境変数:
 *   GOOGLE_PLACES_API_KEY
 *
 * 参考:
 *   https://developers.google.com/maps/documentation/places/web-service/text-search
 *   https://developers.google.com/maps/documentation/places/web-service/place-details
 */

// ========================================
// Google Places API レスポンス型定義
// ========================================

/** 場所の座標 */
export interface LatLng {
  latitude: number;
  longitude: number;
}

/** 表示名 */
export interface DisplayName {
  text: string;
  languageCode: string;
}

/** 営業時間の期間 */
export interface OpeningHoursPeriod {
  open: {
    day: number; // 0=日 ~ 6=土
    hour: number;
    minute: number;
  };
  close: {
    day: number;
    hour: number;
    minute: number;
  };
}

/** 営業時間 */
export interface RegularOpeningHours {
  openNow?: boolean;
  periods?: OpeningHoursPeriod[];
  weekdayDescriptions?: string[];
}

/** 写真リファレンス */
export interface PlacePhoto {
  name: string; // "places/{place_id}/photos/{photo_reference}"
  widthPx: number;
  heightPx: number;
  authorAttributions: Array<{
    displayName: string;
    uri: string;
    photoUri: string;
  }>;
}

/** レビュー著者の属性 */
export interface AuthorAttribution {
  displayName: string;
  uri: string;
  photoUri: string;
}

/** レビュー */
export interface PlaceReview {
  name: string; // レビューのリソース名
  relativePublishTimeDescription: string;
  rating: number;
  text?: {
    text: string;
    languageCode: string;
  };
  originalText?: {
    text: string;
    languageCode: string;
  };
  authorAttribution: AuthorAttribution;
  publishTime: string; // ISO 8601
}

/** Place オブジェクト（Text Search / Place Details 共通） */
export interface GooglePlace {
  id: string; // Place ID (例: "ChIJ...")
  displayName: DisplayName;
  formattedAddress?: string;
  location?: LatLng;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  websiteUri?: string;
  regularOpeningHours?: RegularOpeningHours;
  rating?: number;
  userRatingCount?: number;
  photos?: PlacePhoto[];
  reviews?: PlaceReview[];
  types?: string[];
  businessStatus?: string;
  googleMapsUri?: string;
}

/** Text Search API レスポンス */
export interface TextSearchResponse {
  places?: GooglePlace[];
  nextPageToken?: string;
}

/** Place Details API レスポンス */
export type PlaceDetailsResponse = GooglePlace;

// ========================================
// Rate Limiter
// ========================================

class RateLimiter {
  private lastRequestTime = 0;
  private readonly minIntervalMs: number;

  constructor(requestsPerSecond: number = 1) {
    this.minIntervalMs = 1000 / requestsPerSecond;
  }

  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < this.minIntervalMs) {
      const waitTime = this.minIntervalMs - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();
  }
}

// ========================================
// エラークラス
// ========================================

export class GooglePlacesApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly responseBody?: string
  ) {
    super(message);
    this.name = 'GooglePlacesApiError';
  }
}

export class ApiQuotaExceededError extends GooglePlacesApiError {
  constructor(message: string, statusCode: number, responseBody?: string) {
    super(message, statusCode, responseBody);
    this.name = 'ApiQuotaExceededError';
  }
}

// ========================================
// Google Places API クライアント
// ========================================

/** Text Search のオプション */
export interface SearchPlacesOptions {
  /** 検索結果の最大件数（APIの上限は20） */
  maxResultCount?: number;
  /** ページトークン（次ページ取得用） */
  pageToken?: string;
  /** 言語コード */
  languageCode?: string;
}

/** Place Details のオプション */
export interface GetPlaceDetailsOptions {
  /** 取得するフィールド */
  fieldMask?: string;
  /** 言語コード */
  languageCode?: string;
}

/** Text Search で使用する FieldMask（サロン情報向け） */
const TEXT_SEARCH_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.location',
  'places.nationalPhoneNumber',
  'places.websiteUri',
  'places.regularOpeningHours',
  'places.rating',
  'places.userRatingCount',
  'places.photos',
  'places.reviews',
  'places.types',
  'places.businessStatus',
  'places.googleMapsUri',
  'nextPageToken',
].join(',');

/** Place Details で使用する FieldMask（レビュー取得向け） */
const PLACE_DETAILS_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'location',
  'nationalPhoneNumber',
  'websiteUri',
  'regularOpeningHours',
  'rating',
  'userRatingCount',
  'photos',
  'reviews',
  'types',
  'businessStatus',
].join(',');

/** レビュー取得専用の FieldMask */
const REVIEWS_ONLY_FIELD_MASK = [
  'id',
  'displayName',
  'rating',
  'userRatingCount',
  'reviews',
].join(',');

export class GooglePlacesClient {
  private readonly apiKey: string;
  private readonly rateLimiter: RateLimiter;
  private readonly maxRetries: number;

  constructor(apiKey: string, options?: { requestsPerSecond?: number; maxRetries?: number }) {
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(options?.requestsPerSecond ?? 1);
    this.maxRetries = options?.maxRetries ?? 3;
  }

  /**
   * Text Search API でトリミングサロンを検索する
   */
  async searchPlaces(
    query: string,
    options?: SearchPlacesOptions
  ): Promise<TextSearchResponse> {
    await this.rateLimiter.wait();

    const body: Record<string, unknown> = {
      textQuery: query,
      languageCode: options?.languageCode ?? 'ja',
    };

    if (options?.maxResultCount) {
      body.maxResultCount = options.maxResultCount;
    }

    if (options?.pageToken) {
      body.pageToken = options.pageToken;
    }

    const response = await this.fetchWithRetry(
      'https://places.googleapis.com/v1/places:searchText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': TEXT_SEARCH_FIELD_MASK,
        },
        body: JSON.stringify(body),
      }
    );

    return response as TextSearchResponse;
  }

  /**
   * Place Details API で場所の詳細を取得する
   */
  async getPlaceDetails(
    placeId: string,
    options?: GetPlaceDetailsOptions
  ): Promise<PlaceDetailsResponse> {
    await this.rateLimiter.wait();

    const fieldMask = options?.fieldMask ?? PLACE_DETAILS_FIELD_MASK;
    const languageCode = options?.languageCode ?? 'ja';

    const response = await this.fetchWithRetry(
      `https://places.googleapis.com/v1/places/${placeId}?languageCode=${languageCode}`,
      {
        method: 'GET',
        headers: {
          'X-Goog-Api-Key': this.apiKey,
          'X-Goog-FieldMask': fieldMask,
        },
      }
    );

    return response as PlaceDetailsResponse;
  }

  /**
   * Place Details API でレビューのみを取得する
   */
  async getPlaceReviews(placeId: string): Promise<PlaceDetailsResponse> {
    return this.getPlaceDetails(placeId, {
      fieldMask: REVIEWS_ONLY_FIELD_MASK,
    });
  }

  /**
   * Text Search API で全ページ分の結果を取得する
   * nextPageToken が無くなるまで自動的にページネーション
   */
  async searchAllPlaces(
    query: string,
    options?: Omit<SearchPlacesOptions, 'pageToken'>
  ): Promise<GooglePlace[]> {
    const allPlaces: GooglePlace[] = [];
    let pageToken: string | undefined;

    do {
      const response = await this.searchPlaces(query, {
        ...options,
        pageToken,
      });

      if (response.places) {
        allPlaces.push(...response.places);
      }

      pageToken = response.nextPageToken;

      // 次のページがある場合は少し待つ（Google推奨）
      if (pageToken) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } while (pageToken);

    return allPlaces;
  }

  // ========================================
  // 内部メソッド
  // ========================================

  /**
   * リトライ付き fetch
   */
  private async fetchWithRetry(
    url: string,
    init: RequestInit,
    retryCount = 0
  ): Promise<unknown> {
    try {
      const response = await fetch(url, init);

      if (!response.ok) {
        const body = await response.text();

        // Quota 超過
        if (response.status === 429) {
          if (retryCount < this.maxRetries) {
            const waitTime = Math.pow(2, retryCount + 1) * 1000; // 指数バックオフ
            console.warn(
              `[Google Places API] Quota exceeded. ${waitTime / 1000}秒後にリトライします... (${retryCount + 1}/${this.maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            return this.fetchWithRetry(url, init, retryCount + 1);
          }
          throw new ApiQuotaExceededError(
            `API Quota exceeded after ${this.maxRetries} retries`,
            response.status,
            body
          );
        }

        // サーバーエラー（500系）はリトライ
        if (response.status >= 500 && retryCount < this.maxRetries) {
          const waitTime = Math.pow(2, retryCount + 1) * 1000;
          console.warn(
            `[Google Places API] Server error (${response.status}). ${waitTime / 1000}秒後にリトライします... (${retryCount + 1}/${this.maxRetries})`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          return this.fetchWithRetry(url, init, retryCount + 1);
        }

        throw new GooglePlacesApiError(
          `Google Places API error: ${response.status} ${response.statusText}`,
          response.status,
          body
        );
      }

      return await response.json();
    } catch (error) {
      // ネットワークエラーのリトライ
      if (
        error instanceof TypeError &&
        error.message.includes('fetch') &&
        retryCount < this.maxRetries
      ) {
        const waitTime = Math.pow(2, retryCount + 1) * 1000;
        console.warn(
          `[Google Places API] Network error. ${waitTime / 1000}秒後にリトライします... (${retryCount + 1}/${this.maxRetries})`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        return this.fetchWithRetry(url, init, retryCount + 1);
      }
      throw error;
    }
  }
}

// ========================================
// ヘルパー関数
// ========================================

/**
 * 営業時間の配列をテキストに変換する
 * 例: "月: 10:00-19:00\n火: 10:00-19:00\n..."
 */
export function formatOpeningHours(
  openingHours: RegularOpeningHours | undefined
): string | null {
  if (!openingHours?.weekdayDescriptions) {
    return null;
  }
  return openingHours.weekdayDescriptions.join('\n');
}

/**
 * 営業時間から定休日を推定する
 * weekdayDescriptions に "定休日" や "Closed" が含まれる曜日を抽出
 */
export function extractHolidays(
  openingHours: RegularOpeningHours | undefined
): string | null {
  if (!openingHours?.weekdayDescriptions) {
    return null;
  }

  const dayNames = ['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'];
  const closedDays: string[] = [];

  for (const desc of openingHours.weekdayDescriptions) {
    // "月曜日: 定休日" や "Monday: Closed" のパターンを検出
    if (desc.includes('定休日') || desc.toLowerCase().includes('closed')) {
      for (const day of dayNames) {
        if (desc.includes(day)) {
          closedDays.push(day);
          break;
        }
      }
      // 英語の曜日もチェック
      const englishDays: Record<string, string> = {
        'Monday': '月曜日',
        'Tuesday': '火曜日',
        'Wednesday': '水曜日',
        'Thursday': '木曜日',
        'Friday': '金曜日',
        'Saturday': '土曜日',
        'Sunday': '日曜日',
      };
      for (const [eng, jpn] of Object.entries(englishDays)) {
        if (desc.includes(eng) && !closedDays.includes(jpn)) {
          closedDays.push(jpn);
          break;
        }
      }
    }
  }

  return closedDays.length > 0 ? closedDays.join('、') : null;
}

/**
 * 写真リファレンスから写真URLの配列を構築する
 * Google Places API (New) の photos は name フィールドから取得
 */
export function buildPhotoUrls(
  photos: PlacePhoto[] | undefined,
  apiKey: string,
  maxPhotos: number = 5
): string[] {
  if (!photos || photos.length === 0) {
    return [];
  }

  return photos.slice(0, maxPhotos).map((photo) => {
    // Place Photo API (New) の URL 形式
    return `https://places.googleapis.com/v1/${photo.name}/media?maxHeightPx=800&maxWidthPx=800&key=${apiKey}`;
  });
}

/**
 * Google Place レビューの一意ID を生成する
 * Review の name フィールドがない場合は著者名+公開日時からハッシュ
 */
export function getReviewId(review: PlaceReview): string {
  if (review.name) {
    return review.name;
  }
  // フォールバック: 著者名 + 公開日時
  return `${review.authorAttribution.displayName}_${review.publishTime}`;
}
