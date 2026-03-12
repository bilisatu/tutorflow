"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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