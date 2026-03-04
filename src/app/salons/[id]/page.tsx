import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Phone,
  Star,
  Clock,
  Calendar,
  ExternalLink,
  ChevronRight,
  PawPrint,
  Car,
  CreditCard,
  Eye,
  Building2,
  Baby,
  Heart,
  Cat,
  DoorOpen,
} from "lucide-react";
import { getSalonById, getExternalReviews } from "@/lib/supabase/queries";
import GoogleReviews from "@/components/GoogleReviews";
import {
  generateSalonJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo/jsonld";
import { createClient } from "@/lib/supabase/server";
import type { Salon } from "@/lib/types/database";

const BASE_URL = "https://trimming.michi-biki.jp";

type Props = {
  params: Promise<{ id: string }>;
};

/* ------------------------------------------------------------------
   Feature slug → icon mapping
   ------------------------------------------------------------------ */
const featureIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  parking: Car,
  pickup: Car,
  "credit-card": CreditCard,
  observation: Eye,
  "pet-hotel": Building2,
  "vet-clinic": Heart,
  puppy: Baby,
  "senior-dog": Heart,
  "cat-ok": Cat,
  "private-room": DoorOpen,
};

/* ------------------------------------------------------------------
   generateMetadata  (SEO: location-rich title & description)
   ------------------------------------------------------------------ */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("salons")
    .select("name, description, address, image_url, prefectures(name), cities(name)")
    .eq("id", id)
    .single();

  if (!data) {
    return { title: "サロンが見つかりません | うちの犬スタイル" };
  }

  const cityName =
    (data.cities as unknown as { name: string } | null)?.name ?? "";
  const prefectureName =
    (data.prefectures as unknown as { name: string } | null)?.name ?? "";
  const locationLabel = cityName || prefectureName;

  const title = locationLabel
    ? `${data.name}（${locationLabel}のトリミングサロン）`
    : data.name;

  const description = locationLabel
    ? `${locationLabel}にある${data.name}の料金・メニュー・口コミ・アクセス情報。トリミング料金やサービス内容を詳しくご紹介。`
    : `${data.name}の料金・メニュー・口コミ・アクセス情報。トリミング料金やサービス内容を詳しくご紹介。`;

  const url = `${BASE_URL}/salons/${id}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | うちの犬スタイル`,
      description,
      url,
      type: "article",
      ...(data.image_url ? { images: [{ url: data.image_url }] } : {}),
    },
    alternates: {
      canonical: url,
    },
  };
}

/* ------------------------------------------------------------------
   Page component
   ------------------------------------------------------------------ */
export default async function SalonDetailPage({ params }: Props) {
  const { id } = await params;

  // ---- Main data via ready-made query ----
  const salon = await getSalonById(id);
  if (!salon) notFound();

  const services = salon.services ?? [];
  const reviews = salon.reviews ?? [];
  const features = (salon.salon_features ?? []).map((sf) => sf.features);
  const breeds = (salon.salon_breeds ?? []).map((sb) => sb.dog_breeds);
  const prefecture = salon.prefectures;
  const city = salon.cities;

  // ---- Derived values ----
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;
  const avgRatingDisplay = avgRating !== null ? avgRating.toFixed(1) : null;

  const prices = services
    .map((s) => s.price)
    .filter((p): p is number => p !== null);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  const breedsBySize: Record<string, typeof breeds> = {};
  for (const breed of breeds) {
    const category = breed.size_category
      ? `${breed.size_category}犬`
      : "その他";
    if (!breedsBySize[category]) breedsBySize[category] = [];
    breedsBySize[category].push(breed);
  }
  const sizeOrder = ["小型犬", "中型犬", "大型犬", "その他"];

  // ---- Nearby salons (same city, then same prefecture) ----
  let nearbySalons: Salon[] = [];
  {
    const supabase = await createClient();
    if (salon.city_id) {
      const { data } = await supabase
        .from("salons")
        .select("*")
        .eq("city_id", salon.city_id)
        .neq("id", salon.id)
        .limit(3);
      if (data && data.length > 0) nearbySalons = data as Salon[];
    }
    if (nearbySalons.length === 0 && salon.prefecture_id) {
      const { data } = await supabase
        .from("salons")
        .select("*")
        .eq("prefecture_id", salon.prefecture_id)
        .neq("id", salon.id)
        .limit(3);
      if (data && data.length > 0) nearbySalons = data as Salon[];
    }
  }

  // ---- Google reviews ----
  const googleReviews = await getExternalReviews(salon.id);
  const googleOnlyReviews = googleReviews.filter((r) => r.source === "google");

  // ---- Breadcrumb ----
  const breadcrumbItems = [
    { name: "TOP", url: BASE_URL },
    { name: "エリアから探す", url: `${BASE_URL}/area` },
    ...(prefecture
      ? [{ name: prefecture.name, url: `${BASE_URL}/area/${prefecture.slug}` }]
      : []),
    ...(prefecture && city
      ? [
          {
            name: city.name,
            url: `${BASE_URL}/area/${prefecture.slug}/${city.slug}`,
          },
        ]
      : []),
    { name: salon.name, url: `${BASE_URL}/salons/${salon.id}` },
  ];

  // ---- FAQ generation ----
  const faqItems: { question: string; answer: string }[] = [];

  faqItems.push({
    question: "予約は必要ですか？",
    answer: salon.phone
      ? `お電話にてご予約を承っております。TEL: ${salon.phone}`
      : "ご予約方法の詳細はサロンまでお問い合わせください。",
  });

  if (breeds.length > 0) {
    const breedNames = breeds.map((b) => b.name).join("、");
    faqItems.push({
      question: "どんな犬種に対応していますか？",
      answer: `当サロンでは${breedNames}に対応しております。`,
    });
  }

  if (minPrice !== null && maxPrice !== null) {
    faqItems.push({
      question: "料金はいくらですか？",
      answer:
        minPrice === maxPrice
          ? `料金は${minPrice.toLocaleString()}円です。詳しくは料金表をご覧ください。`
          : `料金は${minPrice.toLocaleString()}円〜${maxPrice.toLocaleString()}円です。詳しくは料金表をご覧ください。`,
    });
  }

  const hasParking = features.some((f) => f.slug === "parking");
  faqItems.push({
    question: "駐車場はありますか？",
    answer: hasParking
      ? "はい、駐車場をご用意しております。"
      : "駐車場の有無については、直接サロンまでお問い合わせください。",
  });

  if (salon.business_hours) {
    faqItems.push({
      question: "営業時間を教えてください。",
      answer: salon.holidays
        ? `${salon.business_hours}、定休日は${salon.holidays}です。`
        : `${salon.business_hours}です。`,
    });
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  // ---- Render ----
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ===== JSON-LD ===== */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbItems)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateSalonJsonLd(salon)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ===== 1. Breadcrumb Navigation ===== */}
      <nav aria-label="パンくずリスト" className="mb-6 text-sm text-gray-500">
        <ol className="flex items-center gap-1 flex-wrap">
          {breadcrumbItems.map((item, idx) => (
            <li key={item.url} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
              {idx === breadcrumbItems.length - 1 ? (
                <span className="text-gray-900 font-medium">{item.name}</span>
              ) : (
                <Link
                  href={new URL(item.url).pathname}
                  className="hover:text-green-600 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* ===== 2. Salon Header ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {salon.name}
            </h1>

            {/* Rating summary */}
            {avgRatingDisplay && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(avgRating!)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </span>
                <span className="text-sm font-semibold text-gray-700">
                  {avgRatingDisplay}
                </span>
                <span className="text-xs text-gray-400">
                  ({reviews.length}件)
                </span>
              </div>
            )}

            {/* Address */}
            <p className="text-gray-600 text-sm flex items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-green-600" />
              {salon.address}
            </p>

            {/* Phone (clickable) */}
            {salon.phone && (
              <p className="text-sm flex items-center gap-1.5">
                <Phone className="h-4 w-4 shrink-0 text-green-600" />
                <a
                  href={`tel:${salon.phone}`}
                  className="text-green-700 hover:underline font-medium"
                >
                  {salon.phone}
                </a>
              </p>
            )}

            {/* Website */}
            {salon.website_url && (
              <p className="text-sm flex items-center gap-1.5">
                <ExternalLink className="h-4 w-4 shrink-0 text-green-600" />
                <a
                  href={salon.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:underline"
                >
                  公式サイトを見る
                </a>
              </p>
            )}
          </div>

          {/* Rating badge */}
          {avgRatingDisplay && (
            <div className="bg-green-50 rounded-xl px-5 py-3 text-center">
              <p className="text-3xl font-bold text-green-700 flex items-center justify-center gap-1">
                <Star className="h-7 w-7 fill-yellow-400 text-yellow-400" />
                {avgRatingDisplay}
              </p>
              <p className="text-xs text-gray-500">{reviews.length}件のレビュー</p>
            </div>
          )}
        </div>

        {/* Description */}
        {salon.description && (
          <p className="mt-4 text-gray-700 text-sm leading-relaxed">
            {salon.description}
          </p>
        )}
      </div>

      {/* ===== 3. Business Info Card ===== */}
      {(salon.business_hours || salon.holidays) && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {salon.business_hours && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">
                    営業時間
                  </p>
                  <p className="text-sm text-gray-700">
                    {salon.business_hours}
                  </p>
                </div>
              </div>
            )}
            {salon.holidays && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">
                    定休日
                  </p>
                  <p className="text-sm text-gray-700">{salon.holidays}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== 4. Features / Amenities ===== */}
      {features.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-green-600" />
            設備・特徴
          </h2>
          <div className="flex flex-wrap gap-2">
            {features.map((feature) => {
              const Icon = featureIconMap[feature.slug] ?? PawPrint;
              return (
                <span
                  key={feature.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm"
                >
                  <Icon className="h-4 w-4" />
                  {feature.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== 5. Supported Breeds ===== */}
      {breeds.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-green-600" />
            対応犬種
          </h2>
          {sizeOrder
            .filter((size) => breedsBySize[size])
            .map((size) => (
              <div key={size} className="mb-4 last:mb-0">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  {size}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {breedsBySize[size].map((breed) => (
                    <Link
                      key={breed.id}
                      href={`/salons?breeds=${breed.id}`}
                      className="inline-flex px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      {breed.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ===== 6. Services & Pricing ===== */}
      {services.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            サービス・料金
          </h2>

          {/* Price range summary */}
          {minPrice !== null && maxPrice !== null && (
            <p className="text-sm text-gray-500 mb-5">
              料金目安:{" "}
              <span className="font-semibold text-green-700">
                ¥{minPrice.toLocaleString()}
              </span>
              {minPrice !== maxPrice && (
                <>
                  {" 〜 "}
                  <span className="font-semibold text-green-700">
                    ¥{maxPrice.toLocaleString()}
                  </span>
                </>
              )}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-2 pr-4 font-semibold text-gray-600">
                    メニュー
                  </th>
                  <th className="py-2 pr-4 font-semibold text-gray-600 text-right">
                    料金
                  </th>
                  <th className="py-2 font-semibold text-gray-600 text-right">
                    所要時間
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.map((service) => (
                  <tr key={service.id}>
                    <td className="py-3 pr-4 font-medium text-gray-800">
                      {service.name}
                    </td>
                    <td className="py-3 pr-4 text-right text-green-700 font-bold whitespace-nowrap">
                      {service.price != null
                        ? `¥${service.price.toLocaleString()}`
                        : "要問合せ"}
                    </td>
                    <td className="py-3 text-right text-gray-500 whitespace-nowrap">
                      {service.duration_min
                        ? `約${service.duration_min}分`
                        : "−"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== 7. Reviews ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          口コミ・レビュー（{reviews.length}件）
        </h2>

        {/* Average rating display */}
        {avgRatingDisplay && (
          <div className="flex items-center gap-4 mb-6 p-4 bg-green-50 rounded-xl">
            <p className="text-4xl font-bold text-green-700">
              {avgRatingDisplay}
            </p>
            <div>
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.round(avgRating!)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </span>
              <p className="text-xs text-gray-500 mt-0.5">
                {reviews.length}件の口コミ
              </p>
            </div>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">まだレビューはありません。</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-5 last:border-0"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-sm text-gray-800">
                    {review.profiles?.display_name ?? "匿名"}
                  </span>
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </span>
                  <span className="text-xs text-gray-400">
                    {review.created_at.slice(0, 10)}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== 7.5 Google Reviews ===== */}
      <GoogleReviews
        reviews={googleOnlyReviews}
        googleRating={salon.google_rating}
        googleReviewCount={salon.google_review_count}
        googlePlaceId={salon.google_place_id}
      />

      {/* ===== 8. FAQ ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5">よくある質問</h2>
        <dl className="space-y-4">
          {faqItems.map((item, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-4 last:border-0">
              <dt className="font-semibold text-gray-800 text-sm mb-1">
                Q. {item.question}
              </dt>
              <dd className="text-sm text-gray-600 leading-relaxed pl-4">
                A. {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ===== 9. Nearby Salons ===== */}
      {nearbySalons.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            このエリアの他のサロン
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {nearbySalons.map((ns) => (
              <Link
                key={ns.id}
                href={`/salons/${ns.id}`}
                className="block p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {ns.name}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  {ns.address}
                </p>
              </Link>
            ))}
          </div>

          {/* Link to area page */}
          {prefecture && city && (
            <div className="mt-4 text-right">
              <Link
                href={`/area/${prefecture.slug}/${city.slug}`}
                className="text-sm text-green-700 hover:underline inline-flex items-center gap-1"
              >
                {city.name}のサロンをすべて見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
          {prefecture && !city && (
            <div className="mt-4 text-right">
              <Link
                href={`/area/${prefecture.slug}`}
                className="text-sm text-green-700 hover:underline inline-flex items-center gap-1"
              >
                {prefecture.name}のサロンをすべて見る
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
