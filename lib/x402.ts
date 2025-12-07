// x402 Payment Protocol utilities

/**
 * x402 Payment configuration for HairAI
 */
export const X402_CONFIG = {
  network: "base",
  scheme: "exact",
  payTo: (process.env.NEXT_PUBLIC_PAY_TO ||
    "0x92b6ed1f84d32CB5a39948a83236c0A7838f5118") as `0x${string}`,
  // Base USDC contract address
  asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as `0x${string}`,
  maxTimeoutSeconds: 300,
  extra: {
    name: "USD Coin",
    version: "2",
  },
};

/**
 * Pricing in USDC (6 decimals)
 */
export const PRICING = {
  generate: BigInt(100000), // $0.10
  generateReference: BigInt(150000), // $0.15
  analyze: BigInt(50000), // $0.05
  variations: BigInt(300000), // $0.30
} as const;

/**
 * Generate a random 32-byte nonce for TransferWithAuthorization
 */
export function generateNonce(): `0x${string}` {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}`;
}

/**
 * TransferWithAuthorization message structure
 */
export interface TransferAuthorization {
  from: `0x${string}`;
  to: `0x${string}`;
  value: bigint;
  validAfter: bigint;
  validBefore: bigint;
  nonce: `0x${string}`;
}

/**
 * TransferWithAuthorization JSON serialization format
 */
export interface TransferAuthorizationJSON {
  from: `0x${string}`;
  to: `0x${string}`;
  value: string;
  validAfter: string;
  validBefore: string;
  nonce: `0x${string}`;
}

/**
 * x402 Payment configuration interface
 */
export interface X402PaymentConfig {
  network: string;
  scheme: string;
  maxAmountRequired: string;
  payTo: `0x${string}`;
  asset: `0x${string}`;
  maxTimeoutSeconds: number;
  extra: {
    name: string;
    version: string;
  };
}

/**
 * x402 Payment payload structure
 */
export interface X402PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: {
    signature: `0x${string}`;
    authorization: TransferAuthorizationJSON;
  };
}

/**
 * Build the X-PAYMENT header for x402 protocol
 */
export function buildPaymentHeader(
  signature: `0x${string}`,
  authorization: TransferAuthorization
): string {
  // Convert bigint values to strings for JSON serialization
  const authorizationJSON: TransferAuthorizationJSON = {
    from: authorization.from,
    to: authorization.to,
    value: authorization.value.toString(),
    validAfter: authorization.validAfter.toString(),
    validBefore: authorization.validBefore.toString(),
    nonce: authorization.nonce,
  };

  const paymentPayload: X402PaymentPayload = {
    x402Version: 1,
    scheme: X402_CONFIG.scheme,
    network: X402_CONFIG.network,
    payload: {
      signature,
      authorization: authorizationJSON,
    },
  };

  return btoa(JSON.stringify(paymentPayload));
}

/**
 * Parse the X-PAYMENT header
 */
export function parsePaymentHeader(header: string): X402PaymentPayload | null {
  try {
    const decoded = atob(header);
    return JSON.parse(decoded) as X402PaymentPayload;
  } catch {
    return null;
  }
}

/**
 * Get EIP-712 Domain configuration for USDC on Base
 */
export function getEIP712Domain(chainId: number = 8453) {
  return {
    name: X402_CONFIG.extra.name,
    version: X402_CONFIG.extra.version,
    chainId,
    verifyingContract: X402_CONFIG.asset,
  };
}

/**
 * EIP-712 type definitions for TransferWithAuthorization
 */
export const EIP712_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

/**
 * Create authorization message for signing
 */
export function createAuthorization(
  from: `0x${string}`,
  value: bigint,
  validitySeconds: number = 300
): TransferAuthorization {
  const now = BigInt(Math.floor(Date.now() / 1000));
  return {
    from,
    to: X402_CONFIG.payTo,
    value,
    validAfter: BigInt(0),
    validBefore: now + BigInt(validitySeconds),
    nonce: generateNonce(),
  };
}
