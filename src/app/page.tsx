import Link from "next/link";

const featureHighlights = [
  {
    title: "Bookings that stay under control",
    description:
      "Track sessions, reschedules, and recurring lessons from one calendar-first workflow.",
  },
  {
    title: "Payments tied to real work",
    description:
      "Convert finished sessions into invoices and keep overdue balances visible without spreadsheet drift.",
  },
  {
    title: "One useful AI workflow",
    description:
      "Turn raw lesson notes into polished follow-ups and next-step summaries your clients can actually use.",
  },
];

const operatingMetrics = [
  { label: "Weekly lessons scheduled", value: "128" },
  { label: "Invoices auto-tracked", value: "$12.4k" },
  { label: "Follow-ups drafted", value: "89" },
];

export default function Home() {
  return (
    <main className="grid-shell min-h-screen px-6 py-8 text-foreground md:px-10 lg:px-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="glass flex items-center justify-between rounded-full px-5 py-3 text-sm md:px-6">
          <div>
            <span className="font-mono uppercase tracking-[0.32em] text-muted">
              TutorFlow
            </span>
          </div>
          <nav className="hidden items-center gap-6 text-muted md:flex">
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <Link href="/dashboard">Dashboard</Link>
          </nav>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.9fr]">
          <div className="glass rounded-[2rem] p-8 md:p-12">
            <div className="mb-10 inline-flex rounded-full border border-brand/20 bg-brand/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.28em] text-brand-deep">
              SaaS starter for tutors and service teams
            </div>
            <h1 className="balance-text max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              Run sessions, invoices, and follow-ups without stitching tools together.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted md:text-xl">
              TutorFlow gives solo operators and small teams a focused operating system for bookings, client records, revenue tracking, and one high-value AI workflow.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-full bg-foreground px-6 py-3 text-center text-sm font-semibold text-background transition hover:bg-brand"
              >
                Open starter dashboard
              </Link>
              <a
                href="#workflow"
                className="rounded-full border border-foreground/10 px-6 py-3 text-center text-sm font-semibold transition hover:border-brand hover:bg-white/50"
              >
                See the product shape
              </a>
            </div>
          </div>

          <aside className="glass rounded-[2rem] p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                  Live ops snapshot
                </p>
                <h2 className="mt-2 text-2xl font-semibold">This is the bar</h2>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                Sample data
              </span>
            </div>
            <div className="mt-8 space-y-4">
              {operatingMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.5rem] border border-foreground/8 bg-white/70 p-5"
                >
                  <p className="text-sm text-muted">{metric.label}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section
          id="features"
          className="grid gap-4 md:grid-cols-3"
        >
          {featureHighlights.map((feature, index) => (
            <article
              key={feature.title}
              className="glass rounded-[1.75rem] p-6"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                0{index + 1}
              </p>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight">
                {feature.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-muted">
                {feature.description}
              </p>
            </article>
          ))}
        </section>

        <section
          id="workflow"
          className="glass grid gap-8 rounded-[2rem] p-8 md:grid-cols-[0.9fr_1.1fr] md:p-10"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Product scope
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Built around one real operating loop.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted">
              Create the business record, add clients, schedule work, log notes, issue invoices, and let one AI step turn rough notes into usable follow-ups.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Auth and team-ready business records",
              "Client profiles and reusable services",
              "Calendar-first booking workflow",
              "Invoices, balances, and payment states",
              "Notes attached to every session",
              "AI-generated recap and next steps",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-foreground/8 bg-white/70 px-5 py-4 text-sm font-medium"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
