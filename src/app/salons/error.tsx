"use client";

import Link from "next/link";

export default function SalonsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="text-5xl mb-4">🐾</p>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        データの読み込みに失敗しました
      </h2>
      <p className="text-gray-500 mb-6">
        一時的なエラーが発生しています。時間をおいて再度お試しください。
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors"
        >
          再読み込み
        </button>
        <Link
          href="/"
          className="px-6 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-full hover:bg-gray-50 transition-colors"
        >
          TOPに戻る
        </Link>
      </div>
    </div>
  );
}
