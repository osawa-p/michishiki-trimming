"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import type { DogBreed } from "@/lib/types/database";

type Props = {
  breeds: DogBreed[];
  selectedBreeds: number[];
};

const SIZE_LABELS: Record<string, string> = {
  小型: "小型犬",
  中型: "中型犬",
  大型: "大型犬",
};

export default function BreedFilter({ breeds, selectedBreeds }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleToggle = useCallback(
    (breedId: number) => {
      const params = new URLSearchParams(searchParams.toString());
      let updated: number[];

      if (selectedBreeds.includes(breedId)) {
        updated = selectedBreeds.filter((id) => id !== breedId);
      } else {
        updated = [...selectedBreeds, breedId];
      }

      if (updated.length > 0) {
        params.set("breeds", updated.join(","));
      } else {
        params.delete("breeds");
      }

      // Reset to page 1 when filter changes
      params.delete("page");

      const qs = params.toString();
      router.push(`${pathname}${qs ? `?${qs}` : ""}`);
    },
    [router, pathname, searchParams, selectedBreeds]
  );

  // Group breeds by size_category
  const grouped = new Map<string, DogBreed[]>();
  for (const breed of breeds) {
    const key = breed.size_category ?? "その他";
    const group = grouped.get(key) ?? [];
    group.push(breed);
    grouped.set(key, group);
  }

  const sizeOrder = ["小型", "中型", "大型", "その他"];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-gray-900">犬種で絞り込む</h3>
      {sizeOrder.map((size) => {
        const group = grouped.get(size);
        if (!group || group.length === 0) return null;

        return (
          <div key={size}>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              {SIZE_LABELS[size] ?? size}
            </p>
            <div className="flex flex-wrap gap-2">
              {group.map((breed) => {
                const isSelected = selectedBreeds.includes(breed.id);
                return (
                  <button
                    key={breed.id}
                    type="button"
                    onClick={() => handleToggle(breed.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      isSelected
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-green-400 hover:text-green-600"
                    }`}
                  >
                    {breed.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
