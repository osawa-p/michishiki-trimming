import Link from "next/link";
import { Search, Star, ClipboardList, PawPrint, ArrowRight, MapPin, BookOpen, Calculator, Scissors } from "lucide-react";

const popularAreas = [
  { name: "東京都", slug: "tokyo" },
  { name: "大阪府", slug: "osaka" },
  { name: "神奈川県", slug: "kanagawa" },
  { name: "愛知県", slug: "aichi" },
  { name: "埼玉県", slug: "saitama" },
  { name: "千葉県", slug: "chiba" },
  { name: "兵庫県", slug: "hyogo" },
  { name: "福岡県", slug: "fukuoka" },
];

const popularBreeds = [
  { name: "トイプードル", id: 1 },
  { name: "チワワ", id: 2 },
  { name: "柴犬", id: 3 },
  { name: "ミニチュアダックスフンド", id: 4 },
  { name: "ポメラニアン", id: 5 },
  { name: "ヨークシャーテリア", id: 6 },
  { name: "シーズー", id: 7 },
  { name: "マルチーズ", id: 8 },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="flex justify-center mb-6">
            <PawPrint className="h-16 w-16 text-white/90" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight mb-5">
            愛犬に合うトリミングサロンを<br />かんたん検索
          </h1>
          <p className="text-green-100 text-lg text-center mb-10 max-w-xl mx-auto">
            地域・犬種・サービスで絞り込み。<br className="sm:hidden" />
            レビューと料金を比較して、最高のサロンを見つけよう。
          </p>

          {/* Search Box */}
          <form
            action="/salons"
            method="GET"
            className="max-w-2xl mx-auto bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg"
          >
            <input
              type="text"
              name="q"
              placeholder="エリアやサロン名を入力（例：渋谷区）"
              className="flex-1 px-4 py-3 text-gray-800 text-sm rounded-xl focus:outline-none"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-center whitespace-nowrap"
            >
              サロンを探す
            </button>
          </form>
        </div>
      </section>

      {/* Popular Areas */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">人気のエリアから探す</h2>
          <p className="text-gray-500 text-sm mt-2">主要エリアのトリミングサロンを見つけよう</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularAreas.map((area) => (
            <Link
              key={area.slug}
              href={`/area/${area.slug}`}
              className="flex items-center gap-2 px-5 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-green-600 font-medium text-sm"
            >
              <MapPin className="w-4 h-4 text-green-500 shrink-0" />
              {area.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Breeds */}
      <section className="py-16 bg-green-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">人気の犬種から探す</h2>
            <p className="text-gray-500 text-sm mt-2">犬種に対応したサロンを見つけよう</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularBreeds.map((breed) => (
              <Link
                key={breed.id}
                href={`/salons?breeds=${breed.id}`}
                className="flex items-center gap-2 px-5 py-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-gray-700 hover:text-green-600 font-medium text-sm"
              >
                <PawPrint className="w-4 h-4 text-green-500 shrink-0" />
                {breed.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">うちの犬スタイルの特徴</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Search className="h-10 w-10 text-green-600" />,
              title: "多彩な検索条件",
              desc: "エリア・犬種・料金・営業時間など、細かい条件でサロンを絞り込めます。",
            },
            {
              icon: <Star className="h-10 w-10 text-yellow-500" />,
              title: "リアルなレビュー",
              desc: "実際に利用したユーザーの口コミ・評価を参考にサロンを選べます。",
            },
            {
              icon: <ClipboardList className="h-10 w-10 text-green-600" />,
              title: "サービス・料金を比較",
              desc: "トリミングのメニューや料金をサロンごとに比較できます。",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Useful Content */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">お役立ちコンテンツ</h2>
          <p className="text-gray-500 text-sm mt-2">トリミングに関する情報を充実させています</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/breeds" className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <PawPrint className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">犬種別トリミングガイド</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">犬種ごとのおすすめカットスタイル、トリミング頻度、自宅ケアのポイントを詳しく解説。</p>
            <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium mt-3">
              ガイドを見る <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link href="/price-simulator" className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <Calculator className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">料金シミュレーター</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">犬種とメニューを選ぶだけで、トリミング料金の目安がわかるシミュレーター。</p>
            <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium mt-3">
              シミュレーションする <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link href="/guide" className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">はじめてのトリミング</h3>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">初めてのトリミングで不安な方へ。準備からサロン選びまで完全ガイド。</p>
            <span className="inline-flex items-center gap-1 text-green-600 text-sm font-medium mt-3">
              ガイドを見る <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Salon Owner CTA */}
      <section className="bg-green-50 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">サロンオーナーの方へ</h2>
          <p className="text-gray-600 mb-8 text-sm leading-relaxed">
            あなたのサロンを無料で掲載できます。<br />
            多くのペットオーナーにサービスを届けましょう。
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
          >
            サロンを無料登録する
          </Link>
        </div>
      </section>
    </>
  );
}
