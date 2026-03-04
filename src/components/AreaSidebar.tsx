import Link from "next/link";
import { getPrefectures, getSalonCountByPrefecture } from "@/lib/supabase/queries";

const REGION_ORDER = [
  "北海道",
  "東北",
  "関東",
  "中部",
  "近畿",
  "中国",
  "四国",
  "九州",
] as const;

export default async function AreaSidebar() {
  const [prefectures, salonCounts] = await Promise.all([
    getPrefectures(),
    getSalonCountByPrefecture(),
  ]);

  const countMap = new Map(
    salonCounts.map((sc) => [sc.prefecture_id, sc.count])
  );

  // Group prefectures by region
  const regionGroups = new Map<string, typeof prefectures>();
  for (const pref of prefectures) {
    const group = regionGroups.get(pref.region) ?? [];
    group.push(pref);
    regionGroups.set(pref.region, group);
  }

  // Filter regions: show if any prefecture has salons, or if it's 関東
  const visibleRegions = REGION_ORDER.filter((region) => {
    if (region === "関東") return regionGroups.has(region);
    const prefs = regionGroups.get(region);
    if (!prefs) return false;
    return prefs.some((p) => (countMap.get(p.id) ?? 0) > 0);
  });

  return (
    <aside className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h2 className="text-base font-bold text-gray-900">
          エリアから探す
        </h2>
      </div>

      <div className="divide-y divide-gray-50">
        {visibleRegions.map((region) => {
          const prefs = regionGroups.get(region) ?? [];
          const regionHasSalons = prefs.some(
            (p) => (countMap.get(p.id) ?? 0) > 0
          );

          return (
            <details
              key={region}
              className="group"
              open={regionHasSalons}
            >
              <summary className="flex items-center justify-between px-5 py-3 cursor-pointer text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors select-none">
                <span>{region}</span>
                <span className="text-xs text-gray-400 group-open:rotate-90 transition-transform">
                  ▶
                </span>
              </summary>

              <ul className="px-5 pb-3 space-y-1">
                {prefs.map((pref) => {
                  const count = countMap.get(pref.id) ?? 0;
                  return (
                    <li key={pref.id}>
                      <Link
                        href={`/area/${pref.slug}`}
                        className="flex items-center justify-between py-1.5 px-3 text-sm text-gray-600 rounded-lg hover:bg-green-50 hover:text-green-700 transition-colors"
                      >
                        <span>{pref.name}</span>
                        {count > 0 && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                            {count}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </aside>
  );
}
