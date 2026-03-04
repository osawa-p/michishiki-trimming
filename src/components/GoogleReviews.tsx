import { Star, ExternalLink } from "lucide-react";
import type { ExternalReview } from "@/lib/types/database";
import ExpandableReviewText from "@/components/ExpandableReviewText";

type Props = {
  reviews: ExternalReview[];
  googleRating?: number | null;
  googleReviewCount?: number | null;
  googlePlaceId?: string | null;
};

/* ------------------------------------------------------------------
   Google "G" logo rendered as inline SVG (brand-compliant colours)
   ------------------------------------------------------------------ */
function GoogleGIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------
   Relative time helper  (e.g. "3ヶ月前", "1年前")
   ------------------------------------------------------------------ */
function relativeTime(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (diffYear >= 1) return `${diffYear}年前`;
  if (diffMonth >= 1) return `${diffMonth}ヶ月前`;
  if (diffDay >= 7) return `${Math.floor(diffDay / 7)}週間前`;
  if (diffDay >= 1) return `${diffDay}日前`;
  if (diffHour >= 1) return `${diffHour}時間前`;
  if (diffMin >= 1) return `${diffMin}分前`;
  return "たった今";
}

/* ------------------------------------------------------------------
   Star rating row
   ------------------------------------------------------------------ */
function StarRating({
  rating,
  size = "h-4 w-4",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------
   Author avatar (first letter fallback)
   ------------------------------------------------------------------ */
function AuthorAvatar({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  const initial = name.charAt(0).toUpperCase();

  if (photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photoUrl}
        alt={name}
        className="h-9 w-9 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
      {initial}
    </div>
  );
}

/* ==================================================================
   Main component
   ================================================================== */
export default function GoogleReviews({
  reviews,
  googleRating,
  googleReviewCount,
  googlePlaceId,
}: Props) {
  // If there are no Google reviews, render nothing
  if (!reviews || reviews.length === 0) return null;

  const googleMapsUrl = googlePlaceId
    ? `https://www.google.com/maps/place/?q=place_id:${googlePlaceId}`
    : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
      {/* ---- Header with Google attribution ---- */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <GoogleGIcon className="h-6 w-6" />
          Google の口コミ
        </h2>

        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Google で口コミを見る
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      {/* ---- Rating summary ---- */}
      {googleRating != null && (
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-4xl font-bold text-gray-800">
            {googleRating.toFixed(1)}
          </p>
          <div>
            <StarRating rating={googleRating} size="h-5 w-5" />
            {googleReviewCount != null && (
              <p className="text-xs text-gray-500 mt-0.5">
                Google 上の口コミ {googleReviewCount}件
              </p>
            )}
          </div>
        </div>
      )}

      {/* ---- Individual review cards ---- */}
      <div className="space-y-5">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-5 last:border-0"
          >
            {/* Author row */}
            <div className="flex items-center gap-3 mb-2">
              <AuthorAvatar
                name={review.author_name}
                photoUrl={review.author_photo_url}
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm text-gray-800 truncate">
                  {review.author_name}
                </p>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} />
                  {review.published_at && (
                    <span className="text-xs text-gray-400">
                      {relativeTime(review.published_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Review text */}
            {review.text && <ExpandableReviewText text={review.text} />}
          </div>
        ))}
      </div>

      {/* ---- Google attribution footer ---- */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-gray-400 flex items-center gap-1.5">
          <GoogleGIcon className="h-4 w-4" />
          Google が提供する口コミ
        </p>
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            Google マップで見る
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
