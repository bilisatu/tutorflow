import { bookings, followUps } from "@/lib/mock-data";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddClientForm } from "./add-client-form";
import { AddBookingForm } from "./add-booking-form";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  // 1. Get the user's business
  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  // 2. Fetch real numbers from the database
  const clientCount = membership 
    ? await prisma.client.count({ where: { businessId: membership.businessId } })
    : 0;

  // 3. Fetch real clients
  const realClients = membership
    ? await prisma.client.findMany({ 
        where: { businessId: membership.businessId },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    : [];

  // 4. Fetch real bookings
  const upcomingBookings = membership
    ? await prisma.booking.findMany({
        where: { businessId: membership.businessId, status: "SCHEDULED" },
        include: { client: true },
        orderBy: { startsAt: 'asc' },
        take: 5
      })
    : [];

  return (
    <main className="min-h-screen px-6 py-8 md:px-10 lg:px-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="glass rounded-[2rem] p-6 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono text-xs uppercase tracking-[0.26em] text-muted">
              Protected dashboard scaffold
            </p>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button className="rounded-full bg-brand/10 hover:bg-brand/20 px-4 py-2 text-sm font-semibold text-brand-deep transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          </div>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Operations for a small tutoring business.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                This page is currently backed by sample data. Replace these cards with authenticated, business-scoped Prisma queries as your next implementation step.
              </p>
            </div>
            <div className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white">
              Auth Hooked Up
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <article className="glass rounded-[1.5rem] p-5">
            <p className="text-sm text-muted">Active clients</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">
              {clientCount}
            </p>
            <p className="mt-2 text-sm text-brand-deep">Real database count</p>
          </article>
          
          <article className="glass rounded-[1.5rem] p-5">
            <p className="text-sm text-muted">Upcoming bookings</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{upcomingBookings.length}</p>
            <p className="mt-2 text-sm text-brand-deep">Real scheduled count</p>
          </article>
          
          <article className="glass rounded-[1.5rem] p-5 border-dashed border-2 border-brand/30 bg-brand/5 relative overflow-hidden">
            <p className="text-sm font-semibold text-brand-deep mb-3">Add a new client</p>
            <AddClientForm />
          </article>

          <article className="glass rounded-[1.5rem] p-5 border-dashed border-2 border-accent/30 bg-accent/5 relative overflow-hidden">
            <p className="text-sm font-semibold text-accent mb-3">Schedule session</p>
            <AddBookingForm clients={realClients.map(c => ({ id: c.id, fullName: c.fullName }))} />
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="glass rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                  Your Schedule
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Upcoming Sessions</h2>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingBookings.length === 0 ? (
                <div className="rounded-[1.5rem] border border-dashed border-foreground/20 p-8 text-center text-muted">
                  No sessions scheduled. Book one above!
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-[1.5rem] border border-foreground/8 bg-white/70 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-semibold tracking-tight">
                          {booking.client.fullName}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {booking.startsAt.toLocaleDateString()} at {booking.startsAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <span className="rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold text-accent">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="glass rounded-[2rem] p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              AI workflow starter
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Recent follow-up drafts</h2>
            <div className="mt-6 space-y-4">
              {followUps.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.5rem] border border-foreground/8 bg-white/70 p-5"
                >
                  <p className="text-base font-semibold tracking-tight">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}