import type { Metadata } from 'next';
import Link from 'next/link';
import { PawPrint, Scissors, Clock, ArrowRight } from 'lucide-react';
import { breedGuides, getBreedGuidesBySizeCategory } from '@/lib/data/breed-guides';
import { generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';
import Breadcrumb from '@/components/Breadcrumb';

const BASE_URL = 'https://trimming.michi-biki.jp';

export const metadata: Metadata = {
  title: '犬種別トリミングガイド',
  description:
    '犬種ごとのトリミング頻度・おすすめカットスタイル・料金目安・自宅ケアのポイントを詳しく解説。トイプードル、チワワ、柴犬など主要15犬種のトリミングガイドをお届けします。',
  openGraph: {
    title: '犬種別トリミングガイド | うちの犬スタイル',
    description:
      '犬種ごとのトリミング頻度・おすすめカットスタイル・料金目安・自宅ケアのポイントを詳しく解説。',
    url: `${BASE_URL}/breeds`,
    type: 'website',
  },
  alternates: {
    canonical: `${BASE_URL}/breeds`,
  },
};

const sizeCategories = ['小型犬', '中型犬', '大型犬'] as const;

const sizeCategoryDescriptions: Record<(typeof sizeCategories)[number], string> = {
  小型犬: '体重10kg未満の小さな犬種。室内飼いに適しており、トリミング料金も比較的リーズナブルです。',
  中型犬: '体重10〜25kg程度の犬種。活発で運動量が多く、被毛のケアも定期的に必要です。',
  大型犬: '体重25kg以上の大きな犬種。トリミングには広いスペースと時間が必要で、料金もやや高めです。',
};

export default function BreedsPage() {
  const breadcrumbItems = [
    { label: 'TOP', href: '/' },
    { label: '犬種別トリミングガイド', href: '/breeds' },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'TOP', url: BASE_URL },
    { name: '犬種別トリミングガイド', url: `${BASE_URL}/breeds` },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* パンくず */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* ヘッダー */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Scissors className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          犬種別トリミングガイド
        </h1>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          愛犬のトリミングは、見た目を整えるだけでなく、皮膚の健康維持や病気の早期発見にもつながる大切なケアです。
          犬種によって被毛の特徴やお手入れ方法は大きく異なります。
          このガイドでは、主要{breedGuides.length}犬種のトリミング情報を詳しくご紹介します。
        </p>
      </div>

      {/* サイズカテゴリ別 */}
      {sizeCategories.map((category) => {
        const breeds = getBreedGuidesBySizeCategory(category);
        if (breeds.length === 0) return null;

        return (
          <section key={category} className="mb-12">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <PawPrint className="h-6 w-6 text-green-600" />
                {category}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {sizeCategoryDescriptions[category]}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {breeds.map((breed) => (
                <Link
                  key={breed.slug}
                  href={`/breeds/${breed.slug}`}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  {/* プレースホルダーイラスト */}
                  <div className="bg-green-50 rounded-xl h-32 flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                    <PawPrint className="h-12 w-12 text-green-300 group-hover:text-green-400 transition-colors" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {breed.name}
                  </h3>

                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                        {breed.sizeCategory}
                      </span>
                      <span className="text-gray-300">|</span>
                      <span>{breed.coatType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      <span>トリミング頻度: {breed.trimmingFrequency}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Scissors className="h-3.5 w-3.5 text-green-500 shrink-0" />
                      <span>料金目安: {breed.priceRange}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600 group-hover:gap-2 transition-all">
                    ガイドを見る
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* CTA */}
      <section className="bg-green-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          愛犬に合うトリミングサロンを探しましょう
        </h2>
        <p className="text-gray-600 text-sm mb-6 max-w-lg mx-auto">
          犬種や地域から、あなたの愛犬にぴったりのトリミングサロンを見つけることができます。
        </p>
        <Link
          href="/salons"
          className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
        >
          サロンを探す
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
