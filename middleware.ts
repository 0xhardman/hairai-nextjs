import { paymentMiddleware } from "x402-next";
import { facilitator } from "@coinbase/x402";

const WALLET_ADDRESS =
  process.env.NEXT_PUBLIC_PAY_TO ||
  "0x92b6ed1f84d32CB5a39948a83236c0A7838f5118";

const NETWORK = "base";

export const middleware = paymentMiddleware(
  WALLET_ADDRESS as `0x${string}`,
  {
    "/api/generate": {
      price: "$0.10",
      network: NETWORK,
      config: {
        description: "Generate AI hairstyle from text prompt",
      },
    },
    "/api/generate-reference": {
      price: "$0.15",
      network: NETWORK,
      config: {
        description: "Transfer hairstyle from reference image",
      },
    },
    "/api/analyze": {
      price: "$0.05",
      network: NETWORK,
      config: {
        description: "AI face analysis and style recommendation",
      },
    },
    "/api/variations": {
      price: "$0.30",
      network: NETWORK,
      config: {
        description: "Generate 4 hairstyle variations",
      },
    },
  },
  facilitator
);

export const config = {
  matcher: [
    "/api/generate",
    "/api/generate-reference",
    "/api/analyze",
    "/api/variations",
  ],
};
