import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GOOGLE_AI_API_KEY is not set. Get one at https://aistudio.google.com/apikey"
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateSalonImage(
  salonName: string,
  area: string,
  breeds: string[]
): Promise<Buffer | null> {
  const client = getGeminiClient();

  const breedText =
    breeds.length > 0 ? breeds.slice(0, 3).join("、") : "犬";

  const prompt = `Create a cute, warm, and professional illustration for a dog grooming salon called "${salonName}" located in ${area}, Japan.
The illustration should feature adorable ${breedText} dogs being groomed or freshly groomed, looking happy and cute.
Style: Soft pastel colors, kawaii Japanese illustration style, clean and modern.
The image should work as a social media card (1200x630 pixels, landscape).
Do NOT include any text in the image - only illustration.
Make it look professional and trustworthy, suitable for a pet grooming business listing.`;

  try {
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "image/png",
      },
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData?.data) {
          return Buffer.from(part.inlineData.data, "base64");
        }
      }
    }

    return null;
  } catch (error) {
    console.error("Gemini image generation failed:", error);
    return null;
  }
}
