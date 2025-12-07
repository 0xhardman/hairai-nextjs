"use client";

import { useAccount, useSignTypedData } from "wagmi";
import { useCallback } from "react";
import {
  X402_CONFIG,
  PRICING,
  EIP712_TYPES,
  getEIP712Domain,
  createAuthorization,
  buildPaymentHeader,
  TransferAuthorization,
} from "@/lib/x402";

export type PaymentType = keyof typeof PRICING;

interface UsePaymentReturn {
  isConnected: boolean;
  address: `0x${string}` | undefined;
  signPayment: (type: PaymentType) => Promise<string>;
  getPrice: (type: PaymentType) => string;
}

export function usePayment(): UsePaymentReturn {
  const { isConnected, address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const getPrice = useCallback((type: PaymentType): string => {
    const amount = PRICING[type];
    const dollars = Number(amount) / 1_000_000;
    return `$${dollars.toFixed(2)}`;
  }, []);

  const signPayment = useCallback(
    async (type: PaymentType): Promise<string> => {
      if (!isConnected || !address) {
        throw new Error("Wallet not connected");
      }

      const amount = PRICING[type];
      const authorization: TransferAuthorization = createAuthorization(
        address,
        amount
      );

      const domain = getEIP712Domain();

      const signature = await signTypedDataAsync({
        domain,
        types: EIP712_TYPES,
        primaryType: "TransferWithAuthorization",
        message: {
          from: authorization.from,
          to: authorization.to,
          value: authorization.value,
          validAfter: authorization.validAfter,
          validBefore: authorization.validBefore,
          nonce: authorization.nonce,
        },
      });

      return buildPaymentHeader(signature, authorization);
    },
    [isConnected, address, signTypedDataAsync]
  );

  return {
    isConnected,
    address,
    signPayment,
    getPrice,
  };
}
