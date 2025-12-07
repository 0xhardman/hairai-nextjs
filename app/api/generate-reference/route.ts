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

// Payment verification is handled by x402-next middleware
export async function POST(request: NextRequest) {
  try {
    const { userImage, referenceImage } = await request.json();

    if (!userImage || !referenceImage) {
      return NextResponse.json(
        { error: "Both user image and reference image are required" },
        { status: 400 }
      );
    }

    const ai = getClient();
    const modelId = "gemini-2.5-flash-image";

    const prompt = `
Task: Apply the hairstyle from the SECOND image (Reference) to the person in the FIRST image (User).

Constraints:
- Keep the face, facial features, and head shape of the FIRST image exactly the same.
- Transfer the haircut, length, texture, and color from the Reference image.
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
              data: cleanBase64(userImage),
            },
          },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64(referenceImage),
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: ["Text", "Image"],
      },
    });

    const resultImage = extractImageFromResponse(response);
    return NextResponse.json({ image: resultImage });
  } catch (error: any) {
    console.error("Generate Reference API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to transfer style" },
      { status: 500 }
    );
  }
}
