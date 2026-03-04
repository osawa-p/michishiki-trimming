import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  PawPrint,
  Scissors,
  Clock,
  Home,
  CircleDollarSign,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import {
  breedGuides,
  getBreedGuideBySlug,
  getAllBreedSlugs,
} from '@/lib/data/breed-guides';
import {
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
} from '@/lib/seo/jsonld';
import Breadcrumb from '@/components/Breadcrumb';

const BASE_URL = 'https://trimming.michi-biki.jp';

type Props = {
  params: Promise<{ slug: string }>;
};

/* ------------------------------------------------------------------
   generateStaticParams
   ------------------------------------------------------------------ */
export async function generateStaticParams() {
  return getAllBreedSlugs().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------
   generateMetadata
   ------------------------------------------------------------------ */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const breed = getBreedGuideBySlug(slug);

  if (!breed) {
    return { title: '犬種が見つかりません' };
  }

  const title = `${breed.name}のトリミングガイド｜カットスタイル・料金・頻度`;
  const description = `${breed.name}（${breed.sizeCategory}）のトリミング頻度・おすすめカットスタイル・料金目安（${breed.priceRange}）・自宅ケアのポイントを詳しく解説。${breed.name}のトリミングに関するよくある質問にもお答えします。`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | うちの犬スタイル`,
      description,
      url: `${BASE_URL}/breeds/${slug}`,
      type: 'article',
    },
    alternates: {
      canonical: `${BASE_URL}/breeds/${slug}`,
    },
  };
}

/* ------------------------------------------------------------------
   Page component
   ------------------------------------------------------------------ */
export default async function BreedGuidePage({ params }: Props) {
  const { slug } = await params;
  const breed = getBreedGuideBySlug(slug);

  if (!breed) notFound();

  // パンくず
  const breadcrumbItems = [
    { label: 'TOP', href: '/' },
    { label: '犬種別トリミングガイド', href: '/breeds' },
    { label: breed.name, href: `/breeds/${breed.slug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'TOP', url: BASE_URL },
    { name: '犬種別トリミングガイド', url: `${BASE_URL}/breeds` },
    { name: breed.name, url: `${BASE_URL}/breeds/${breed.slug}` },
  ]);

  // Article JSON-LD
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${breed.name}のトリミングガイド`,
    description: breed.description,
    url: `${BASE_URL}/breeds/${breed.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'うちの犬スタイル',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/breeds/${breed.slug}`,
    },
  };

  // FAQ JSON-LD
  const faqJsonLd = generateFAQJsonLd(breed.faq);

  // 同じサイズカテゴリの他の犬種（関連ガイド用）
  const relatedBreeds = breedGuides
    .filter((b) => b.sizeCategory === breed.sizeCategory && b.slug !== breed.slug)
    .slice(0, 4);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* パンくず */}
      <div className="mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* ===== 1. ヘッダー ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* プレースホルダーイラスト */}
          <div className="bg-green-50 rounded-xl w-full md:w-48 h-48 flex items-center justify-center shrink-0">
            <PawPrint className="h-16 w-16 text-green-300" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {breed.sizeCategory}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {breed.name}のトリミングガイド
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {breed.description}
            </p>

            {/* 基本情報 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-medium">被毛タイプ</p>
                <p className="text-sm text-gray-700 font-medium">{breed.coatType}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-medium">性格</p>
                <p className="text-sm text-gray-700 font-medium line-clamp-2">{breed.personality}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-medium">トリミング頻度</p>
                <p className="text-sm text-green-700 font-bold">{breed.trimmingFrequency}</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400 font-medium">料金目安</p>
                <p className="text-sm text-green-700 font-bold">{breed.priceRange}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 2. トリミング頻度の目安 ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          トリミング頻度の目安
        </h2>
        <div className="bg-green-50 rounded-xl p-5">
          <p className="text-lg font-bold text-green-700 mb-2">
            推奨頻度: {breed.trimmingFrequency}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            {breed.name}の被毛タイプは「{breed.coatType}」です。
            被毛の状態を健康に保つためには、{breed.trimmingFrequency}程度のトリミングが推奨されます。
            トリミングの間隔が空きすぎると、毛玉や皮膚トラブルの原因になることがあります。
            季節や被毛の状態に合わせて、サロンのトリマーに相談しながら最適な頻度を見つけましょう。
          </p>
        </div>
      </div>

      {/* ===== 3. おすすめカットスタイル ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Scissors className="h-5 w-5 text-green-600" />
          おすすめカットスタイル
        </h2>
        <div className="space-y-4">
          {breed.cutStyles.map((style, idx) => (
            <div
              key={idx}
              className="border border-gray-100 rounded-xl p-5 hover:border-green-200 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="bg-green-50 rounded-lg w-16 h-16 flex items-center justify-center shrink-0">
                  <Sparkles className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{style.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {style.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 4. 自宅ケアのポイント ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Home className="h-5 w-5 text-green-600" />
          自宅ケアのポイント
        </h2>
        <ul className="space-y-3">
          {breed.homeCare.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== 5. 料金の目安 ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CircleDollarSign className="h-5 w-5 text-green-600" />
          トリミング料金の目安
        </h2>
        <div className="bg-gray-50 rounded-xl p-5">
          <p className="text-2xl font-bold text-green-700 mb-2">{breed.priceRange}</p>
          <p className="text-sm text-gray-600 leading-relaxed">
            上記は{breed.name}（{breed.sizeCategory}）のトリミング料金の一般的な目安です。
            料金はサロンの立地、カットスタイル、被毛の状態（毛玉の有無など）によって変動します。
            シャンプーのみのコースは上記より安く、オプション（歯磨き、パック、アロマバスなど）を追加すると高くなる場合があります。
            初回利用時は事前に料金を確認しておくと安心です。
          </p>
        </div>
      </div>

      {/* ===== 6. よくある質問（FAQ） ===== */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-green-600" />
          よくある質問
        </h2>
        <dl className="space-y-4">
          {breed.faq.map((item, idx) => (
            <div
              key={idx}
              className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
            >
              <dt className="font-semibold text-gray-800 text-sm mb-2 flex items-start gap-2">
                <span className="bg-green-600 text-white rounded px-1.5 py-0.5 text-xs font-bold shrink-0">
                  Q
                </span>
                {item.question}
              </dt>
              <dd className="text-sm text-gray-600 leading-relaxed pl-7 flex items-start gap-2">
                <span className="bg-gray-200 text-gray-600 rounded px-1.5 py-0.5 text-xs font-bold shrink-0">
                  A
                </span>
                <span>{item.answer}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* ===== 7. サロンへのリンク ===== */}
      <div className="bg-green-50 rounded-2xl p-8 mb-6 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          {breed.name}に対応しているサロンを探す
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          {breed.name}のトリミングが得意なサロンを、地域やレビューから探してみましょう。
        </p>
        <Link
          href="/salons"
          className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
        >
          サロンを探す
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ===== 8. 関連する犬種ガイド ===== */}
      {relatedBreeds.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            関連する犬種ガイド
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedBreeds.map((related) => (
              <Link
                key={related.slug}
                href={`/breeds/${related.slug}`}
                className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl hover:border-green-200 hover:shadow-sm transition-all group"
              >
                <div className="bg-green-50 rounded-lg w-12 h-12 flex items-center justify-center shrink-0">
                  <PawPrint className="h-5 w-5 text-green-300 group-hover:text-green-400 transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-green-600 transition-colors">
                    {related.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {related.sizeCategory} / {related.trimmingFrequency}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-green-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/breeds"
              className="text-sm text-green-700 hover:underline inline-flex items-center gap-1"
            >
              すべての犬種ガイドを見る
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
