import { NextRequest, NextResponse } from "next/server";
import { generateSalonImage } from "@/lib/gemini/client";
import { getSalonById } from "@/lib/supabase/queries";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const salonId = request.nextUrl.searchParams.get("id");

  if (!salonId) {
    return NextResponse.json({ error: "id parameter required" }, { status: 400 });
  }

  try {
    const salon = await getSalonById(salonId);
    if (!salon) {
      return NextResponse.json({ error: "Salon not found" }, { status: 404 });
    }

    // Already has an image
    if (salon.image_url) {
      return NextResponse.json({
        message: "Salon already has an image",
        image_url: salon.image_url,
      });
    }

    const area = salon.cities?.name ?? salon.prefectures?.name ?? "日本";
    const breeds =
      salon.salon_breeds?.map((sb) => sb.dog_breeds.name).filter(Boolean) ?? [];

    const imageBuffer = await generateSalonImage(salon.name, area, breeds);

    if (!imageBuffer) {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      );
    }

    // Try to upload to Supabase Storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceRoleKey) {
      const supabase = createClient(supabaseUrl, serviceRoleKey);

      const fileName = `og/${salonId}.png`;
      const { error: uploadError } = await supabase.storage
        .from("salon-images")
        .upload(fileName, imageBuffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("salon-images").getPublicUrl(fileName);

        // Update salon with the image URL
        await supabase
          .from("salons")
          .update({ image_url: publicUrl })
          .eq("id", salonId);

        return NextResponse.json({
          message: "Image generated and saved",
          image_url: publicUrl,
        });
      }

      console.error("Upload failed:", uploadError);
    }

    // Fallback: return the image directly
    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("OG generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
