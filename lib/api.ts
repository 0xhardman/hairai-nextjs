export async function generateHairstyle(
  base64Image: string,
  prompt: string,
  paymentHeader?: string
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (paymentHeader) {
    headers["X-Payment"] = paymentHeader;
  }

  const response = await fetch("/api/generate", {
    method: "POST",
    headers,
    body: JSON.stringify({ image: base64Image, prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate hairstyle");
  }

  return data.image;
}

export async function generateHairstyleFromReference(
  userImage: string,
  referenceImage: string,
  paymentHeader?: string
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (paymentHeader) {
    headers["X-Payment"] = paymentHeader;
  }

  const response = await fetch("/api/generate-reference", {
    method: "POST",
    headers,
    body: JSON.stringify({ userImage, referenceImage }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to transfer style");
  }

  return data.image;
}

export async function analyzeFaceAndSuggest(
  base64Image: string,
  paymentHeader?: string
): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (paymentHeader) {
    headers["X-Payment"] = paymentHeader;
  }

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers,
    body: JSON.stringify({ image: base64Image }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to analyze face");
  }

  return data.suggestion;
}

export async function generateHairstyleVariations(
  base64Image: string,
  prompt: string,
  paymentHeader?: string
): Promise<string[]> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (paymentHeader) {
    headers["X-Payment"] = paymentHeader;
  }

  const response = await fetch("/api/variations", {
    method: "POST",
    headers,
    body: JSON.stringify({ image: base64Image, prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate variations");
  }

  return data.variations;
}
