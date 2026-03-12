"use client";

import { useTransition } from "react";
import { createInvoice } from "../actions";

export function InvoiceButton({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleInvoice = () => {
    // In a real app, this might open a modal to set the price. We'll hardcode $50 for the demo.
    const standardLessonPrice = 50; 
    
    startTransition(async () => {
      await createInvoice(bookingId, standardLessonPrice);
    });
  };

  return (
    <button
      onClick={handleInvoice}
      disabled={isPending}
      className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand-deep transition-colors hover:bg-brand/20 disabled:opacity-50"
    >
      {isPending ? "Generating..." : "Generate Invoice"}
    </button>
  );
}