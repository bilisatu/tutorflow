"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  // @ts-ignore
  apiVersion: "2024-12-18.acacia",
});

export async function addClient(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  
  if (!fullName) throw new Error("Name is required");

  // Get the user's business
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    include: { business: true },
  });

  if (!membership) throw new Error("No business found for this user");

  // Create the client in the database
  await prisma.client.create({
    data: {
      businessId: membership.businessId,
      fullName,
      email,
      phone,
    },
  });

  revalidatePath("/dashboard");
}

export async function addBooking(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const clientId = formData.get("clientId") as string;
  const startsAtRaw = formData.get("startsAt") as string;
  
  if (!clientId || !startsAtRaw) throw new Error("Client and Start Time are required");

  // Get the user's business
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership) throw new Error("No business found for this user");

  // A basic one-hour lesson
  const startsAt = new Date(startsAtRaw);
  const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000); 

  await prisma.booking.create({
    data: {
      businessId: membership.businessId,
      clientId,
      startsAt,
      endsAt,
      status: "SCHEDULED"
    }
  });

  revalidatePath("/dashboard");
}

export async function createInvoice(bookingId: string, amountDollars: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { business: true }
  });

  if (!booking) throw new Error("Booking not found");

  // Basic validation that user owns this business
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, businessId: booking.businessId },
  });

  if (!membership) throw new Error("Unauthorized to invoice this booking");

  // Create DRAFT invoice the client owes
  await prisma.invoice.create({
    data: {
      businessId: booking.businessId,
      clientId: booking.clientId,
      bookingId: booking.id,
      amountCents: Math.round(amountDollars * 100), // Stripe & our DB use cents to avoid float math bugs
      status: "DRAFT",
    }
  });

  // Mark the booking as complete so they know to stop working and wait for payment
  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "COMPLETED" }
  });

  revalidatePath("/dashboard");
}

export async function createStripeCheckout(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { client: true, business: true }
  });

  if (!invoice) throw new Error("Invoice not found");

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id, businessId: invoice.businessId },
  });

  if (!membership) throw new Error("Unauthorized");

  if (!process.env.STRIPE_SECRET_KEY) {
    // Return a mock URL if user hasn't put in their API key yet
    redirect(`/dashboard?warn=missing_stripe_key&invoice=${invoice.id}`);
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `Session Invoice - ${invoice.client.fullName}`,
            description: "Invoice #" + invoice.id.slice(-6).toUpperCase(),
          },
          unit_amount: invoice.amountCents,
        },
        quantity: 1,
      },
    ],
    metadata: { invoiceId: invoice.id },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?canceled=true`,
  });

  if (checkoutSession.url) {
    redirect(checkoutSession.url);
  }
}
