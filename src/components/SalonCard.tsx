import Link from "next/link";
import Image from "next/image";
import { Scissors, MapPin, Clock, Star } from "lucide-react";
import type { Salon, Service } from "@/lib/types/database";

type Props = {
  salon: Salon & {
    services?: Service[];
    avg_rating?: number;
    review_count?: number;
  };
};

export default function SalonCard({ salon }: Props) {
  const minPrice = salon.services
    ?.map((s) => s.price)
    .filter((p): p is number => p !== null)
    .sort((a, b) => a - b)[0];

  return (
    <Link
      href={`/salons/${salon.id}`}
      className="block bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Image area */}
      <div className="relative w-full h-48 bg-gray-100">
        {salon.image_url ? (
          <Image
            src={salon.image_url}
            alt={`${salon.name}の写真`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Scissors className="w-12 h-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {salon.name}
        </h3>

        {/* Rating */}
        {salon.avg_rating !== undefined && salon.review_count !== undefined && salon.review_count > 0 && (
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i <= Math.round(salon.avg_rating ?? 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-200 fill-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-0.5">
              {salon.avg_rating?.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">
              ({salon.review_count}件)
            </span>
          </div>
        )}

        <div className="flex items-start gap-1.5 mt-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{salon.address}</span>
        </div>

        {salon.business_hours && (
          <div className="flex items-start gap-1.5 mt-1.5 text-sm text-gray-500">
            <Clock className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
            <span className="line-clamp-1">{salon.business_hours}</span>
          </div>
        )}

        {/* Starting price */}
        {minPrice !== undefined && (
          <p className="mt-2 text-sm font-semibold text-green-700">
            {minPrice.toLocaleString()}円〜
          </p>
        )}

        {salon.description && (
          <p className="mt-3 text-sm text-gray-600 line-clamp-2">
            {salon.description}
          </p>
        )}
      </div>
    </Link>
  );
}
