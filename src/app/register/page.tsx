import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "サロンを登録する",
};

export default function RegisterPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">サロンを登録する</h1>
        <p className="text-gray-500 text-sm">
          無料でサロン情報を掲載できます。<br />
          掲載後すぐに検索対象となります。
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-8 md:p-10">
        {/* NOTE: フォーム送信はServer Action or APIルートで実装予定 */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="name">
              サロン名 <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              placeholder="ドッグサロン〇〇"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="address">
              住所 <span className="text-red-500">*</span>
            </label>
            <input
              id="address"
              type="text"
              required
              placeholder="東京都渋谷区〇〇 1-2-3"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="phone">
              電話番号
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="03-0000-0000"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="description">
              サロンの説明
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="サロンの特徴・こだわり・対応可能な犬種などをご記入ください"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
          >
            サロンを登録する（無料）
          </button>
        </form>
      </div>
    </div>
  );
}
