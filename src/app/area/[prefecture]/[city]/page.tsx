import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSalonsByCity, getCityBySlug } from '@/lib/supabase/queries';
import { generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import SalonCard from '@/components/SalonCard';

const BASE_URL = 'https://trimming.michi-biki.jp';
const PER_PAGE = 12;

type Props = {
  params: Promise<{ prefecture: string; city: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { prefecture: prefectureSlug, city: citySlug } = await params;
  const cityData = await getCityBySlug(prefectureSlug, citySlug);

  if (!cityData) {
    return { title: 'ページが見つかりません' };
  }

  const prefectureName = cityData.prefectures.name;
  const cityName = cityData.name;
  const title = `${cityName}のトリミングサロン | ${prefectureName}`;
  const description = `${prefectureName}${cityName}のトリミングサロンを探すなら うちの犬スタイル。${cityName}にある犬のトリミングサロンの料金・レビュー・サービスを比較して、愛犬に最適なサロンを見つけましょう。`;
  const canonicalUrl = `${BASE_URL}/area/${prefectureSlug}/${citySlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CityPage({ params, searchParams }: Props) {
  const { prefecture: prefectureSlug, city: citySlug } = await params;
  const { page: pageParam } = await searchParams;

  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);
  const { salons, total, city, prefecture } = await getSalonsByCity(
    prefectureSlug,
    citySlug,
    page,
    PER_PAGE
  );

  if (!city || !prefecture) notFound();

  const totalPages = Math.ceil(total / PER_PAGE);

  const breadcrumbItems = [
    { name: 'TOP', url: BASE_URL },
    { name: 'エリアから探す', url: `${BASE_URL}/area` },
    { name: prefecture.name, url: `${BASE_URL}/area/${prefectureSlug}` },
    { name: city.name, url: `${BASE_URL}/area/${prefectureSlug}/${citySlug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbItems);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6" aria-label="パンくずリスト">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-green-600 transition-colors">
                TOP
              </Link>
            </li>
            <li className="before:content-['>'] before:mx-1 before:text-gray-300">
              <span className="text-gray-400">エリアから探す</span>
            </li>
            <li className="before:content-['>'] before:mx-1 before:text-gray-300">
              <Link
                href={`/area/${prefectureSlug}`}
                className="hover:text-green-600 transition-colors"
              >
                {prefecture.name}
              </Link>
            </li>
            <li className="before:content-['>'] before:mx-1 before:text-gray-300">
              <span className="font-medium text-gray-700">{city.name}</span>
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          {city.name}のトリミングサロン一覧
        </h1>
        <p className="text-sm text-gray-500 mb-4">{prefecture.name}</p>
        <p className="text-gray-600 mb-8">
          {prefecture.name}{city.name}で犬のトリミングサロンをお探しなら、うちの犬スタイルで{total}件のサロンを比較。料金やレビュー、対応犬種から最適なサロンを見つけましょう。
        </p>

        {/* Salon Count */}
        <p className="text-sm text-gray-500 mb-4">
          {total}件のサロンが見つかりました
          {totalPages > 1 && `（${page} / ${totalPages} ページ）`}
        </p>

        {/* Salon List */}
        {salons.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🐾</p>
            <p className="text-lg font-medium mb-2">サロンが見つかりませんでした</p>
            <p className="text-sm">
              {city.name}にはまだサロンが登録されていません。
            </p>
            <Link
              href={`/area/${prefectureSlug}`}
              className="inline-block mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
            >
              {prefecture.name}のサロンを見る
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center items-center gap-2 mt-10" aria-label="ページネーション">
            {page > 1 && (
              <Link
                href={`/area/${prefectureSlug}/${citySlug}?page=${page - 1}`}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                前のページ
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/area/${prefectureSlug}/${citySlug}?page=${p}`}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  p === page
                    ? 'bg-green-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {p}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={`/area/${prefectureSlug}/${citySlug}?page=${page + 1}`}
                className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                次のページ
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  );
}
