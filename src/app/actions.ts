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

  // Tell Next.js to refresh the dashboard so the new client shows up instantly
  revalidatePath("/dashboard");
}