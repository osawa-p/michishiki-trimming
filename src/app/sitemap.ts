import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { getAllBreedSlugs } from '@/lib/data/breed-guides';

const BASE_URL = 'https://trimming.michi-biki.jp';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/salons`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/breeds`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/price-simulator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/area`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Prefecture pages from prefectures table
  const { data: prefectures } = await supabase
    .from('prefectures')
    .select('slug')
    .order('id');

  const prefecturePages: MetadataRoute.Sitemap = (prefectures ?? []).map((pref) => ({
    url: `${BASE_URL}/area/${pref.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // City pages
  const { data: cityData } = await supabase
    .from('cities')
    .select('slug, prefectures!inner(slug)')
    .order('id');

  const cityPages: MetadataRoute.Sitemap = (cityData ?? []).map((city: any) => ({
    url: `${BASE_URL}/area/${city.prefectures.slug}/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Salon detail pages from salons table
  const { data: salons } = await supabase
    .from('salons')
    .select('id, updated_at, created_at')
    .order('created_at', { ascending: false });

  const salonPages: MetadataRoute.Sitemap = (salons ?? []).map((salon) => ({
    url: `${BASE_URL}/salons/${salon.id}`,
    lastModified: new Date(salon.updated_at ?? salon.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Breed guide pages
  const breedPages: MetadataRoute.Sitemap = getAllBreedSlugs().map((slug) => ({
    url: `${BASE_URL}/breeds/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...breedPages, ...prefecturePages, ...cityPages, ...salonPages];
}
