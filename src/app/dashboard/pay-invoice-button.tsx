"use client";

import { useTransition } from "react";
import { createStripeCheckout } from "../actions";

export function PayInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [isPending, startTransition] = useTransition();

  const handlePay = () => {
    startTransition(async () => {
      await createStripeCheckout(invoiceId);
    });
  };

  return (
    <button
      onClick={handlePay}
      disabled={isPending}
      className="text-xs font-semibold hover:underline disabled:opacity-50 text-brand-deep cursor-pointer"
    >
      {isPending ? "Connecting to Stripe..." : "Open payment link \u2192"}
    </button>
  );
}