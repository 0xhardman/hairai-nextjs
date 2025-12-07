/**
 * Facilitator Configuration for HairAI
 *
 * Configure multiple facilitators for automatic failover.
 * Facilitators are tried in priority order (lower number = higher priority).
 */

import type { FacilitatorConfig } from "./lib/types";

export const facilitators: FacilitatorConfig[] = [
  // Primary: X402 RS Facilitator
  {
    id: "x402-rs",
    name: "X402 RS",
    url: "https://facilitator.x402.rs",
    priority: 1,
    timeoutMs: 5000,
  },
  // Secondary: PayAI Network Facilitator
  {
    id: "payai-network",
    name: "PayAI Network",
    url: "https://facilitator.payai.network",
    priority: 2,
    timeoutMs: 5000,
  },
  // Fallback: Coinbase CDP (requires API credentials)
  {
    id: "coinbase-cdp",
    name: "Coinbase CDP",
    type: "coinbase-cdp",
    apiKeyId: process.env.CDP_API_KEY_ID,
    apiKeySecret: process.env.CDP_API_KEY_SECRET,
    priority: 3,
    timeoutMs: 10000,
  },
];
