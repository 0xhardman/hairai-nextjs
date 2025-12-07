import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment.");
  }
  return new GoogleGenAI({ apiKey });
};

const cleanBase64 = (base64: string) =>
  base64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

const extractImageFromResponse = (response: any): string => {
  const parts = response.candidates?.[0]?.content?.parts;
  if (parts) {
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/jpeg;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("No image generated in the response.");
};

const generateSingleVariation = async (
  ai: any,
  image: string,
  prompt: string,
  variationIndex: number
): Promise<string | null> => {
  try {
    const modelId = "gemini-2.5-flash-image";
    const variationPrompt = `${prompt} (Variation ${variationIndex + 1}, slightly different style nuance)`;

    const fullPrompt = `
Task: Change the hairstyle of the person in the image.
Style Description: ${variationPrompt}

Constraints:
- Keep the face, facial features, and head shape exactly the same.
- Keep the background neutral or similar to an ID photo/passport style.
- Output must be photorealistic, high quality, and look like a professional portrait.
- Do not distort the face.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64(image),
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    return extractImageFromResponse(response);
  } catch (error) {
    console.error(`Variation ${variationIndex} failed:`, error);
    return null;
  }
};

// Payment verification is handled by x402-next middleware
export async function POST(request: NextRequest) {
  try {
    const { image, prompt } = await request.json();

    if (!image || !prompt) {
      return NextResponse.json(
        { error: "Image and prompt are required" },
        { status: 400 }
      );
    }

    const ai = getClient();

    const promises = Array(4)
      .fill(0)
      .map((_, i) => generateSingleVariation(ai, image, prompt, i));

    const results = await Promise.all(promises);
    const variations = results.filter((res): res is string => res !== null);

    if (variations.length === 0) {
      return NextResponse.json(
        { error: "Could not generate any variations" },
        { status: 500 }
      );
    }

    return NextResponse.json({ variations });
  } catch (error: any) {
    console.error("Variations API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate variations" },
      { status: 500 }
    );
  }
}
