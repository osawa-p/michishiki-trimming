import type { Metadata } from 'next';
import { Calculator } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import PriceSimulator from '@/components/PriceSimulator';
import { generateBreadcrumbJsonLd } from '@/lib/seo/jsonld';

const BASE_URL = 'https://trimming.michi-biki.jp';

export const metadata: Metadata = {
  title: 'トリミング料金シミュレーター',
  description:
    '犬種・サイズ・メニューを選ぶだけでトリミング料金の目安がわかるシミュレーター。トイプードル、チワワ、柴犬など人気犬種のシャンプー・カット・オプション料金を簡単チェック。',
  alternates: { canonical: `${BASE_URL}/price-simulator` },
};

export default function PriceSimulatorPage() {
  const breadcrumbItems = [
    { label: 'TOP', href: '/' },
    { label: '料金シミュレーター', href: '/price-simulator' },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'TOP', url: BASE_URL },
    { name: '料金シミュレーター', url: `${BASE_URL}/price-simulator` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* パンくず */}
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* ページヘッダー */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Calculator className="w-8 h-8 text-emerald-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              トリミング料金シミュレーター
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            愛犬の犬種・サイズ・希望メニューを選ぶだけで、トリミング料金の目安がわかります。
            サロン選びの参考にお役立てください。
          </p>
        </div>

        {/* シミュレーター本体 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8 mb-12">
          <PriceSimulator />
        </div>

        {/* SEOリード文 */}
        <section className="max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            トリミング料金の相場について
          </h2>
          <div className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              トリミング料金は犬種・体の大きさ・被毛の状態・メニュー内容によって大きく変わります。
              一般的に、小型犬のシャンプーコースは3,000〜6,000円、シャンプー＆カットコースは5,000〜10,000円が相場です。
              中型犬は小型犬の1.2〜1.5倍、大型犬は2〜3倍ほどの料金が目安となります。
            </p>
            <p>
              爪切り・耳掃除・歯磨きなどの単品メニューは500〜1,500円程度ですが、
              コースに含まれているサロンも多いため、事前に確認するとよいでしょう。
              マイクロバブルや泥パックなどのスペシャルケアは1,000〜5,000円程度のオプション料金が一般的です。
            </p>
            <p>
              料金だけでなく、トリマーの技術力や接客対応、サロンの清潔感なども重要なポイントです。
              口コミやレビューも参考にしながら、愛犬に合ったサロンを見つけてみてください。
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
