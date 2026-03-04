import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getPrefectures, getSalonCountByPrefecture } from "@/lib/supabase/queries";
import Breadcrumb from "@/components/Breadcrumb";
import { generateBreadcrumbJsonLd } from "@/lib/seo/jsonld";

const BASE_URL = "https://trimming.michi-biki.jp";

export const metadata: Metadata = {
  title: "エリアからトリミングサロンを探す",
  description:
    "全国47都道府県からトリミングサロンを検索。お住まいの地域のサロンを料金・レビューで比較できます。",
  alternates: { canonical: "https://trimming.michi-biki.jp/area" },
};

const REGION_ORDER = [
  "北海道",
  "東北",
  "関東",
  "中部",
  "近畿",
  "中国",
  "四国",
  "九州",
] as const;

export default async function AreaIndexPage() {
  const [prefectures, salonCounts] = await Promise.all([
    getPrefectures(),
    getSalonCountByPrefecture(),
  ]);

  const countMap = new Map(
    salonCounts.map((sc) => [sc.prefecture_id, sc.count])
  );

  // 都道府県を地方ごとにグループ化
  const regionGroups = new Map<string, typeof prefectures>();
  for (const pref of prefectures) {
    const group = regionGroups.get(pref.region) ?? [];
    group.push(pref);
    regionGroups.set(pref.region, group);
  }

  const breadcrumbItems = [
    { label: "TOP", href: "/" },
    { label: "エリアから探す", href: "/area" },
  ];

  const breadcrumbJsonLdItems = [
    { name: "TOP", url: BASE_URL },
    { name: "エリアから探す", url: `${BASE_URL}/area` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbJsonLdItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* パンくずリスト */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* ページタイトル */}
        <div className="mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            エリアからトリミングサロンを探す
          </h1>
          <p className="text-gray-600">
            全国47都道府県からお近くのトリミングサロンを検索できます。
          </p>
        </div>

        {/* 地方ごとのセクション */}
        <div className="space-y-10">
          {REGION_ORDER.map((region) => {
            const prefs = regionGroups.get(region) ?? [];
            if (prefs.length === 0) return null;

            return (
              <section key={region}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {region}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {prefs.map((pref) => {
                    const count = countMap.get(pref.id) ?? 0;
                    return (
                      <Link
                        key={pref.id}
                        href={`/area/${pref.slug}`}
                        className="flex flex-col items-center justify-center gap-1 bg-white rounded-xl border border-gray-100 px-4 py-5 hover:shadow-md hover:border-green-200 transition-all"
                      >
                        <span className="text-base font-semibold text-gray-800">
                          {pref.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          {count > 0 ? `${count}件` : "準備中"}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
