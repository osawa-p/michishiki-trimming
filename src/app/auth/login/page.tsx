import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ログイン",
};

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ログイン</h1>
          <p className="text-gray-500 text-sm">アカウントをお持ちの方はこちら</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="email">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="example@mail.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="password">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
            >
              ログイン
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            アカウントをお持ちでない方は{" "}
            <Link href="/auth/signup" className="text-green-600 font-semibold hover:underline">
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
