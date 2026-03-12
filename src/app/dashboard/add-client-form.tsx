"use client";

import { useTransition, useRef } from "react";
import { addClient } from "../actions";

export function AddClientForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await addClient(formData);
      formRef.current?.reset();
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        name="fullName"
        placeholder="Client / Student Name"
        required
        className="rounded-lg border border-line bg-white/50 px-4 py-2 text-sm text-foreground focus:border-brand focus:outline-none"
      />
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        className="rounded-lg border border-line bg-white/50 px-4 py-2 text-sm text-foreground focus:border-brand focus:outline-none"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-brand disabled:opacity-50"
      >
        {isPending ? "Adding..." : "Add Client"}
      </button>
    </form>
  );
}