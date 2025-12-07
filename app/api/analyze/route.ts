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

// Payment verification is handled by x402-next middleware
export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const ai = getClient();
    const modelId = "gemini-2.0-flash";

    const prompt = `
      Act as a professional high-end hair stylist.
      1. Analyze the face shape and features of the person in this image.
      2. Recommend ONE specific, trendy hairstyle that would perfectly suit their face shape.
      3. Return ONLY the description of the hairstyle as a prompt. Do not include "I recommend" or preambles.
      Example output: "A textured pixie cut with side-swept bangs to balance the oval face shape, platinum blonde color."
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
            text: prompt,
          },
        ],
      },
    });

    const suggestion = response.text || "A modern, professional hairstyle that suits this face shape.";
    return NextResponse.json({ suggestion });
  } catch (error: any) {
    console.error("Analyze API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze face" },
      { status: 500 }
    );
  }
}
