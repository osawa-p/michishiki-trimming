import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "新規登録",
};

export default function SignupPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">新規登録</h1>
          <p className="text-gray-500 text-sm">無料でアカウントを作成</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="name">
                お名前
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="山田 太郎"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
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
                placeholder="8文字以上"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
            >
              アカウントを作成する
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            すでにアカウントをお持ちの方は{" "}
            <Link href="/auth/login" className="text-green-600 font-semibold hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
