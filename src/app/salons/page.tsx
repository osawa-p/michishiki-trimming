import type { Metadata } from "next";
import Link from "next/link";
import { PawPrint, Search } from "lucide-react";
import { searchSalons, getDogBreeds } from "@/lib/supabase/queries";
import SalonCard from "@/components/SalonCard";
import AreaSidebar from "@/components/AreaSidebar";
import BreedFilter from "@/components/BreedFilter";
import Breadcrumb from "@/components/Breadcrumb";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "サロン一覧",
  description:
    "全国のトリミングサロンをエリア・犬種で検索。料金やレビューを比較して最適なサロンを見つけよう。",
};

export default async function SalonsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; breeds?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q;
  const selectedBreeds = params.breeds
    ? params.breeds.split(",").map(Number).filter(Boolean)
    : [];
  const currentPage = Math.max(1, Number(params.page) || 1);
  const perPage = 12;

  const [{ salons, total }, breeds] = await Promise.all([
    searchSalons({ q, breeds: selectedBreeds.length > 0 ? selectedBreeds : undefined, page: currentPage, perPage }),
    getDogBreeds(),
  ]);

  const totalPages = Math.ceil(total / perPage);

  const searchParamsObj: Record<string, string> = {};
  if (q) searchParamsObj.q = q;
  if (params.breeds) searchParamsObj.breeds = params.breeds;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "TOP", href: "/" },
          { label: "サロン一覧", href: "/salons" },
        ]}
      />

      <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-6">
        {q ? `「${q}」の検索結果` : "トリミングサロン一覧"}
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0 space-y-6">
          {/* Search */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <form className="flex flex-col gap-2">
              <label htmlFor="search-q" className="text-sm font-semibold text-gray-700">
                キーワード検索
              </label>
              <div className="flex gap-2">
                <input
                  id="search-q"
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="エリア・サロン名"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  aria-label="検索"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Breed Filter */}
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">犬種で絞り込み</h2>
            <BreedFilter breeds={breeds} selectedBreeds={selectedBreeds} />
          </div>

          {/* Area Sidebar */}
          <AreaSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {salons.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <PawPrint className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">
                サロンが見つかりませんでした
              </p>
              <p className="text-sm mb-6">
                別のエリアで検索するか、サロンを登録してください。
              </p>
              <Link
                href="/register"
                className="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
              >
                サロンを登録する
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {total}件のサロンが見つかりました
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {salons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/salons"
                  searchParams={searchParamsObj}
                />
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
