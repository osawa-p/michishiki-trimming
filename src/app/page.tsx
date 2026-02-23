import Link from "next/link";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="flex justify-center mb-6 text-6xl">🐕</div>
          <h1 className="text-3xl md:text-5xl font-bold text-center leading-tight mb-5">
            愛犬に合うトリミングサロンを<br />かんたん検索
          </h1>
          <p className="text-green-100 text-lg text-center mb-10 max-w-xl mx-auto">
            地域・犬種・サービスで絞り込み。<br className="sm:hidden" />
            レビューと料金を比較して、最高のサロンを見つけよう。
          </p>

          {/* Search Box (UI only — 機能はsalons/page.tsxで実装) */}
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
            <input
              type="text"
              placeholder="エリアを入力（例：渋谷区）"
              className="flex-1 px-4 py-3 text-gray-800 text-sm rounded-xl focus:outline-none"
            />
            <Link
              href="/salons"
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors text-center whitespace-nowrap"
            >
              サロンを探す
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">トリムDBの特徴</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🔍",
              title: "多彩な検索条件",
              desc: "エリア・犬種・料金・営業時間など、細かい条件でサロンを絞り込めます。",
            },
            {
              icon: "⭐",
              title: "リアルなレビュー",
              desc: "実際に利用したユーザーの口コミ・評価を参考にサロンを選べます。",
            },
            {
              icon: "📋",
              title: "サービス・料金を比較",
              desc: "トリミングのメニューや料金をサロンごとに比較できます。",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
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
