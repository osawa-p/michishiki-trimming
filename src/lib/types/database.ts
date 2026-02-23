export type Salon = {
  id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  description: string | null;
  created_at: string;
};

export type DogBreed = {
  id: number;
  name: string;
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
