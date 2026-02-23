import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Salon } from "@/lib/types/database";
import Link from "next/link";

export const metadata: Metadata = {
  title: "サロン一覧",
};

export default async function SalonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from("salons")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.ilike("address", `%${q}%`);
  }

  const { data: salons, error } = await query.returns<Salon[]>();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {q ? `「${q}」のサロン一覧` : "サロン一覧"}
        </h1>
        {/* Search Bar */}
        <form className="flex gap-2 max-w-lg">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="エリアで検索（例：渋谷区）"
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700"
          >
            検索
          </button>
        </form>
      </div>

      {error && (
        <div className="text-center py-10 text-gray-500">
          <p>データの取得に失敗しました。Supabaseの接続設定を確認してください。</p>
        </div>
      )}

      {!error && (!salons || salons.length === 0) ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🐾</p>
          <p className="text-lg font-medium mb-2">サロンが見つかりませんでした</p>
          <p className="text-sm">別のエリアで検索するか、サロンを登録してください。</p>
          <Link
            href="/register"
            className="inline-block mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
          >
            サロンを登録する
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(salons ?? []).map((salon) => (
            <Link
              key={salon.id}
              href={`/salons/${salon.id}`}
              className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="text-3xl mb-4">✂️</div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{salon.name}</h2>
              <p className="text-sm text-gray-500 mb-2">📍 {salon.address}</p>
              {salon.description && (
                <p className="text-sm text-gray-600 line-clamp-2">{salon.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
