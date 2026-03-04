/**
 * Nano Banana (Gemini API) で全サロンのOG画像を一括生成するスクリプト
 *
 * 使い方:
 *   npx tsx scripts/generate-og-images.ts
 *
 * 必要な環境変数:
 *   GOOGLE_AI_API_KEY - Google AI Studio から取得
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * 注意: Gemini 無料枠は50リクエスト/日。50店舗以上ある場合は複数日に分けてください。
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const googleApiKey = process.env.GOOGLE_AI_API_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}

if (!googleApiKey) {
  console.error("Error: GOOGLE_AI_API_KEY is required. Get one at https://aistudio.google.com/apikey");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);
const genAI = new GoogleGenerativeAI(googleApiKey);

async function generateImage(
  salonName: string,
  area: string,
  breeds: string[]
): Promise<Buffer | null> {
  const breedText = breeds.length > 0 ? breeds.slice(0, 3).join("、") : "犬";

  const prompt = `Create a cute, warm, and professional illustration for a dog grooming salon called "${salonName}" located in ${area}, Japan.
The illustration should feature adorable ${breedText} dogs being groomed or freshly groomed, looking happy and cute.
Style: Soft pastel colors, kawaii Japanese illustration style, clean and modern.
The image should work as a social media card (1200x630 pixels, landscape).
Do NOT include any text in the image - only illustration.
Make it look professional and trustworthy, suitable for a pet grooming business listing.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "image/png" },
    });

    const parts = result.response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
    }
    return null;
  } catch (error) {
    console.error("  Image generation failed:", error);
    return null;
  }
}

async function main() {
  console.log("=== Nano Banana OG Image Generator ===\n");

  // Fetch salons without images
  const { data: salons, error } = await supabase
    .from("salons")
    .select(
      "id, name, address, image_url, prefectures(name), cities(name), salon_breeds(dog_breeds(name))"
    )
    .is("image_url", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch salons:", error);
    process.exit(1);
  }

  if (!salons || salons.length === 0) {
    console.log("All salons already have images. Nothing to generate.");
    return;
  }

  console.log(`Found ${salons.length} salons without images.\n`);

  // Limit to 50 per day (free tier)
  const batch = salons.slice(0, 50);
  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const salon of batch) {
    const salonData = salon as any;
    const area =
      salonData.cities?.name ?? salonData.prefectures?.name ?? "日本";
    const breeds: string[] = (salonData.salon_breeds ?? [])
      .map((sb: any) => sb.dog_breeds?.name)
      .filter(Boolean);

    console.log(
      `[${generated + skipped + failed + 1}/${batch.length}] ${salonData.name} (${area})...`
    );

    const imageBuffer = await generateImage(salonData.name, area, breeds);

    if (!imageBuffer) {
      console.log("  FAILED - Image generation returned null");
      failed++;
      continue;
    }

    // Upload to Supabase Storage
    const fileName = `og/${salonData.id}.png`;
    const { error: uploadError } = await supabase.storage
      .from("salon-images")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.log(`  FAILED - Upload error: ${uploadError.message}`);
      failed++;
      continue;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("salon-images").getPublicUrl(fileName);

    // Update salon
    const { error: updateError } = await supabase
      .from("salons")
      .update({ image_url: publicUrl })
      .eq("id", salonData.id);

    if (updateError) {
      console.log(`  FAILED - DB update error: ${updateError.message}`);
      failed++;
      continue;
    }

    console.log(`  OK - ${publicUrl}`);
    generated++;

    // Rate limit: wait 2 seconds between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(
    `\n=== Complete ===\nGenerated: ${generated}\nSkipped: ${skipped}\nFailed: ${failed}\nRemaining: ${Math.max(0, salons.length - batch.length)}`
  );
}

main().catch(console.error);
