import { parsePaymentHeader, X402_CONFIG, PRICING } from "./x402";
import type { PaymentType } from "@/hooks/usePayment";

export interface PaymentVerificationResult {
  valid: boolean;
  error?: string;
}

/**
 * Verify the X-Payment header for a specific endpoint
 * In production, this should verify the signature on-chain
 * For now, we do basic validation of the payment structure
 */
export function verifyPayment(
  paymentHeader: string | null,
  type: PaymentType
): PaymentVerificationResult {
  if (!paymentHeader) {
    return {
      valid: false,
      error: "Payment required. Please connect wallet and sign transaction.",
    };
  }

  const payment = parsePaymentHeader(paymentHeader);

  if (!payment) {
    return {
      valid: false,
      error: "Invalid payment header format",
    };
  }

  // Verify x402 version
  if (payment.x402Version !== 1) {
    return {
      valid: false,
      error: "Unsupported x402 version",
    };
  }

  // Verify network
  if (payment.network !== X402_CONFIG.network) {
    return {
      valid: false,
      error: `Invalid network. Expected ${X402_CONFIG.network}`,
    };
  }

  // Verify payment amount
  const expectedAmount = PRICING[type];
  const actualAmount = BigInt(payment.payload.authorization.value);

  if (actualAmount < expectedAmount) {
    return {
      valid: false,
      error: `Insufficient payment. Expected ${expectedAmount.toString()}, got ${actualAmount.toString()}`,
    };
  }

  // Verify recipient
  if (
    payment.payload.authorization.to.toLowerCase() !==
    X402_CONFIG.payTo.toLowerCase()
  ) {
    return {
      valid: false,
      error: "Invalid payment recipient",
    };
  }

  // Verify validity period
  const now = BigInt(Math.floor(Date.now() / 1000));
  const validBefore = BigInt(payment.payload.authorization.validBefore);

  if (now >= validBefore) {
    return {
      valid: false,
      error: "Payment authorization expired",
    };
  }

  // In production, you would:
  // 1. Verify the signature against the authorization data
  // 2. Check the nonce hasn't been used
  // 3. Actually execute the transfer on-chain
  // 4. Mark the nonce as used

  return { valid: true };
}

/**
 * Get payment error response for 402 Payment Required
 */
export function getPaymentRequiredResponse(type: PaymentType) {
  const amount = PRICING[type];
  const dollars = Number(amount) / 1_000_000;

  return {
    error: `Payment required: $${dollars.toFixed(2)} USDC`,
    x402: {
      version: 1,
      network: X402_CONFIG.network,
      scheme: X402_CONFIG.scheme,
      asset: X402_CONFIG.asset,
      payTo: X402_CONFIG.payTo,
      amount: amount.toString(),
    },
  };
}
