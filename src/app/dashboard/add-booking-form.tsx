"use client";

import { useTransition, useRef } from "react";
import { addBooking } from "../actions";

export function AddBookingForm({ clients }: { clients: { id: string; fullName: string }[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await addBooking(formData);
      formRef.current?.reset();
    });
  };

  if (clients.length === 0) {
    return <p className="text-sm text-muted">Add a client first to schedule a session.</p>;
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <select
        name="clientId"
        required
        className="rounded-lg border border-line bg-white/50 px-4 py-2 text-sm text-foreground focus:border-brand focus:outline-none"
        defaultValue=""
      >
        <option value="" disabled>Select a client...</option>
        {clients.map(c => (
          <option key={c.id} value={c.id}>{c.fullName}</option>
        ))}
      </select>
      <input
        type="datetime-local"
        name="startsAt"
        required
        className="rounded-lg border border-line bg-white/50 px-4 py-2 text-sm text-foreground focus:border-brand focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-brand disabled:opacity-50"
      >
        {isPending ? "Scheduling..." : "Schedule Session"}
      </button>
    </form>
  );
}