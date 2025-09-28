import Link from "next/link";
import Image from "next/image";
import BrowseCategories from "@/components/BrowseCategories";

const stats = [
  { label: "Auctions launched", value: "2.3k" },
  { label: "Registered bidders", value: "18k" },
  { label: "Lots sold", value: "31.4k" },
  { label: "Countries served", value: "47" },
];

const highlights = [
  {
    title: "Private Valuations",
    description:
      "Confidential, specialist-led estimates for single works and entire estates.",
  },
  {
    title: "Curated Curation",
    description:
      "Lot storytelling, provenance sourcing, and editorial features for every release.",
  },
  {
    title: "Global Logistics",
    description:
      "White-glove shipping, climate control, and customs support from door to door.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-auction.png"
            alt="A curated selection of premium lots"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/50 dark:from-black/80 dark:via-black/60" />
          <div className="pointer-events-none absolute -top-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white/20 blur-3xl dark:bg-white/10" />
        </div>

        <div className="relative mx-auto flex min-h-[680px] max-w-6xl flex-col justify-center gap-10 px-6 py-24 sm:px-8 lg:px-10">
          <div className="max-w-3xl space-y-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
              AUCTRA AUCTION SALONS
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Discover extraordinary auctions curated for collectors and
              creators worldwide
            </h1>
            <p className="text-base text-white/80 sm:text-lg">
              Bid live across fine art, rare jewelry, design, wine, and more.
              Track market trends, engage with specialists, and secure
              museum-worthy works from a single, trusted platform.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/auctions"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore live auctions
              </Link>
              <Link
                href="/sell"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Consign a collection
              </Link>
            </div>
          </div>

          <dl className="grid gap-4 text-white sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm"
              >
                <dt className="text-xs uppercase tracking-widest text-white/60">
                  {stat.label}
                </dt>
                <dd className="mt-3 text-3xl font-semibold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">
              WHY COLLECT WITH AUCTRA
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              White-glove service from valuation to delivery
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Every release is stewarded by category experts, from private
              valuations to curated storytelling and global logistics. We pair
              innovative bidding tools with boutique attention so your next
              acquisition is effortless.
            </p>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900/80"
                >
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 shadow-lg dark:border-slate-800">
            <Image
              src="/images/preview.png"
              alt="Curated lots on display"
              width={640}
              height={640}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/0" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-lg font-semibold">Upcoming Salon Preview</h3>
              <p className="text-sm text-white/80">
                RSVP for a private walkthrough of our Modern Icons collection
                before it goes live next week.
              </p>
              <Link
                href="/events"
                className="mt-3 inline-block rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white hover:border-white"
              >
                Reserve a viewing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="bg-white/60 py-16 backdrop-blur dark:bg-slate-900/40">
        <BrowseCategories />
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-8 lg:px-10">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl dark:from-white dark:via-white dark:to-slate-200 dark:text-slate-900">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to release your collection to the world?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 dark:text-slate-700">
            Join thousands of sellers leveraging Auctra&apos;s marketing reach
            and secure handling to deliver works to passionate buyers across 47
            countries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/sell"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:shadow-none dark:hover:bg-slate-800"
            >
              Start a consignment
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10 dark:border-slate-400 dark:text-slate-900 dark:hover:bg-white"
            >
              Speak with a specialist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
