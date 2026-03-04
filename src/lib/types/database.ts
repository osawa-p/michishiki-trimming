export type Prefecture = {
  id: number;
  name: string;
  slug: string;
  region: string;
};

export type City = {
  id: number;
  prefecture_id: number;
  name: string;
  slug: string;
};

export type Feature = {
  id: number;
  name: string;
  slug: string;
};

export type Salon = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  description: string | null;
  prefecture_id: number | null;
  city_id: number | null;
  postal_code: string | null;
  business_hours: string | null;
  holidays: string | null;
  image_url: string | null;
  website_url: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export type SalonWithRelations = Salon & {
  prefectures?: Prefecture | null;
  cities?: City | null;
  salon_features?: { features: Feature }[];
  salon_breeds?: { dog_breeds: DogBreed }[];
  services?: Service[];
  reviews?: Review[];
};

export type DogBreed = {
  id: number;
  name: string;
  size_category: '小型' | '中型' | '大型' | null;
  sort_order: number;
};

export type Service = {
  id: number;
  salon_id: string;
  name: string;
  price: number | null;
  duration_min: number | null;
};

export type Review = {
  id: number;
  salon_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles?: {
    display_name: string | null;
  };
};

export type Profile = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type SearchParams = {
  q?: string;
  prefecture?: string;
  city?: string;
  breeds?: number[];
  features?: string[];
  page?: number;
  perPage?: number;
};
