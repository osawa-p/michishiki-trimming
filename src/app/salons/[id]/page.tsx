import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Service, Review } from "@/lib/types/database";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("salons").select("name").eq("id", id).single();
  return { title: data?.name ?? "サロン詳細" };
}

export default async function SalonDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: salon } = await supabase.from("salons").select("*").eq("id", id).single();
  if (!salon) notFound();

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("salon_id", id)
    .returns<Service[]>();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(display_name)")
    .eq("salon_id", id)
    .order("created_at", { ascending: false })
    .returns<Review[]>();

  const avgRating =
    reviews && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{salon.name}</h1>
            <p className="text-gray-500 text-sm">📍 {salon.address}</p>
            {salon.phone && <p className="text-gray-500 text-sm">📞 {salon.phone}</p>}
          </div>
          {avgRating && (
            <div className="bg-green-50 rounded-xl px-5 py-3 text-center">
              <p className="text-3xl font-bold text-green-700">⭐ {avgRating}</p>
              <p className="text-xs text-gray-500">{reviews?.length}件のレビュー</p>
            </div>
          )}
        </div>
        {salon.description && (
          <p className="mt-4 text-gray-700 text-sm leading-relaxed">{salon.description}</p>
        )}
      </div>

      {/* Services */}
      {services && services.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">サービス・料金</h2>
          <div className="divide-y divide-gray-100">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">{service.name}</p>
                  {service.duration_min && (
                    <p className="text-xs text-gray-400">所要時間: 約{service.duration_min}分</p>
                  )}
                </div>
                <p className="text-green-700 font-bold">
                  {service.price != null ? `¥${service.price.toLocaleString()}〜` : "要問合せ"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-5">
          レビュー {reviews && reviews.length > 0 ? `(${reviews.length}件)` : ""}
        </h2>
        {!reviews || reviews.length === 0 ? (
          <p className="text-gray-400 text-sm">まだレビューはありません。</p>
        ) : (
          <div className="space-y-5">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-sm text-gray-800">
                    {review.profiles?.display_name ?? "匿名"}
                  </span>
                  <span className="text-yellow-500 text-sm">{"⭐".repeat(review.rating)}</span>
                  <span className="text-xs text-gray-400">{review.created_at.slice(0, 10)}</span>
                </div>
                {review.comment && <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
