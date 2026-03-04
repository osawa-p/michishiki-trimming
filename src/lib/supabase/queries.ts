import { createClient } from "./server";
import type {
  Salon,
  SalonWithRelations,
  Prefecture,
  City,
  DogBreed,
  Feature,
  Service,
  Review,
  SearchParams,
} from "@/lib/types/database";

// ========================================
// 都道府県・市区町村
// ========================================

export async function getPrefectures(): Promise<Prefecture[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prefectures")
    .select("*")
    .order("id");
  if (error) throw error;
  return data ?? [];
}

export async function getPrefectureBySlug(
  slug: string
): Promise<Prefecture | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("prefectures")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getCitiesByPrefecture(
  prefectureId: number
): Promise<City[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("cities")
    .select("*")
    .eq("prefecture_id", prefectureId)
    .order("slug");
  if (error) throw error;
  return data ?? [];
}

export async function getCityBySlug(
  prefectureSlug: string,
  citySlug: string
): Promise<(City & { prefectures: Prefecture }) | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cities")
    .select("*, prefectures!inner(*)")
    .eq("slug", citySlug)
    .eq("prefectures.slug", prefectureSlug)
    .single();
  return data;
}

// ========================================
// サロン
// ========================================

export async function getSalonById(
  id: string
): Promise<SalonWithRelations | null> {
  const supabase = await createClient();
  const { data: salon } = await supabase
    .from("salons")
    .select(
      "*, prefectures(*), cities(*), salon_features(features(*)), salon_breeds(dog_breeds(*))"
    )
    .eq("id", id)
    .single();

  if (!salon) return null;

  const { data: services } = await supabase
    .from("services")
    .select("*")
    .eq("salon_id", id)
    .returns<Service[]>();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(display_name)")
    .eq("salon_id", id)
    .order("created_at", { ascending: false })
    .returns<Review[]>();

  return {
    ...salon,
    services: services ?? [],
    reviews: reviews ?? [],
  } as SalonWithRelations;
}

export async function getSalonsByPrefecture(
  prefectureSlug: string,
  page = 1,
  perPage = 12
): Promise<{ salons: Salon[]; total: number }> {
  const supabase = await createClient();

  const prefecture = await getPrefectureBySlug(prefectureSlug);
  if (!prefecture) return { salons: [], total: 0 };

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
    .from("salons")
    .select("*", { count: "exact" })
    .eq("prefecture_id", prefecture.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { salons: (data as Salon[]) ?? [], total: count ?? 0 };
}

export async function getSalonsByCity(
  prefectureSlug: string,
  citySlug: string,
  page = 1,
  perPage = 12
): Promise<{ salons: Salon[]; total: number; city: City | null; prefecture: Prefecture | null }> {
  const supabase = await createClient();

  const cityData = await getCityBySlug(prefectureSlug, citySlug);
  if (!cityData) return { salons: [], total: 0, city: null, prefecture: null };

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  const { data, count, error } = await supabase
    .from("salons")
    .select("*", { count: "exact" })
    .eq("city_id", cityData.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return {
    salons: (data as Salon[]) ?? [],
    total: count ?? 0,
    city: cityData,
    prefecture: cityData.prefectures,
  };
}

export async function searchSalons(
  params: SearchParams
): Promise<{ salons: Salon[]; total: number }> {
  const supabase = await createClient();
  const { q, prefecture, breeds, page = 1, perPage = 12 } = params;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("salons")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`name.ilike.%${q}%,address.ilike.%${q}%`);
  }

  if (prefecture) {
    const pref = await getPrefectureBySlug(prefecture);
    if (pref) {
      query = query.eq("prefecture_id", pref.id);
    }
  }

  if (breeds && breeds.length > 0) {
    const { data: salonIds } = await supabase
      .from("salon_breeds")
      .select("salon_id")
      .in("breed_id", breeds);
    if (salonIds && salonIds.length > 0) {
      const ids = [...new Set(salonIds.map((s) => s.salon_id))];
      query = query.in("id", ids);
    } else {
      return { salons: [], total: 0 };
    }
  }

  query = query.range(from, to);
  const { data, count, error } = await query;

  if (error) throw error;
  return { salons: (data as Salon[]) ?? [], total: count ?? 0 };
}

// ========================================
// 犬種・設備
// ========================================

export async function getDogBreeds(): Promise<DogBreed[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("dog_breeds")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data as DogBreed[]) ?? [];
}

export async function getFeatures(): Promise<Feature[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("features")
    .select("*")
    .order("id");
  if (error) throw error;
  return data ?? [];
}

// ========================================
// 統計
// ========================================

export async function getSalonCountByPrefecture(): Promise<
  { prefecture_id: number; count: number }[]
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("salons")
    .select("prefecture_id")
    .not("prefecture_id", "is", null);

  if (error) throw error;
  if (!data) return [];

  const counts = new Map<number, number>();
  for (const row of data) {
    if (row.prefecture_id) {
      counts.set(row.prefecture_id, (counts.get(row.prefecture_id) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([prefecture_id, count]) => ({
    prefecture_id,
    count,
  }));
}

export async function getSalonCountByCity(
  prefectureId: number
): Promise<{ city_id: number; count: number }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("salons")
    .select("city_id")
    .eq("prefecture_id", prefectureId)
    .not("city_id", "is", null);

  if (error) throw error;
  if (!data) return [];

  const counts = new Map<number, number>();
  for (const row of data) {
    if (row.city_id) {
      counts.set(row.city_id, (counts.get(row.city_id) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([city_id, count]) => ({
    city_id,
    count,
  }));
}
