import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
export const alt = "うちの犬スタイル - トリミングサロン";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: salon } = await supabase
    .from("salons")
    .select("name, address, description, prefectures(name), cities(name)")
    .eq("id", id)
    .single();

  const salonName = (salon as any)?.name ?? "トリミングサロン";
  const cityName = (salon as any)?.cities?.name ?? "";
  const prefName = (salon as any)?.prefectures?.name ?? "";
  const location = cityName
    ? `${prefName} ${cityName}`
    : (salon as any)?.address ?? "";
  const description = (salon as any)?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%)",
          fontFamily: "sans-serif",
          padding: "40px 60px",
        }}
      >
        {/* Brand badge */}
        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "40px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              color: "white",
              fontWeight: "bold",
              opacity: 0.9,
            }}
          >
            🐕 うちの犬スタイル
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px",
          }}
        >
          {/* Salon name */}
          <div
            style={{
              fontSize: salonName.length > 15 ? "48px" : "56px",
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
              maxWidth: "900px",
            }}
          >
            {salonName}
          </div>

          {/* Location */}
          {location && (
            <div
              style={{
                fontSize: "28px",
                color: "rgba(255, 255, 255, 0.85)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              📍 {location}
            </div>
          )}

          {/* Description */}
          {description && (
            <div
              style={{
                fontSize: "20px",
                color: "rgba(255, 255, 255, 0.7)",
                maxWidth: "800px",
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {description.slice(0, 80)}
              {description.length > 80 ? "..." : ""}
            </div>
          )}
        </div>

        {/* Decorative paws */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "40px",
            fontSize: "60px",
            opacity: 0.15,
          }}
        >
          🐾🐾🐾
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "40px",
            fontSize: "18px",
            color: "rgba(255, 255, 255, 0.6)",
          }}
        >
          犬のトリミングサロン検索サイト
        </div>
      </div>
    ),
    { ...size }
  );
}
