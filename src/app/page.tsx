import Link from "next/link";
import Image from "next/image";
import BrowseCategories from "@/components/BrowseCategories";
import Stories from "@/components/Stories";

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
      "Get confidential estimates for single items or entire collections, handled by specialists.",
  },
  {
    title: "Curated Curation",
    description:
      "Every piece comes with its own story — from history and ownership to expert insights — so you know exactly what you’re bidding on.",
  },
  {
    title: "Global Delivery",
    description:
      "Safe, careful shipping worldwide. We take care of packing, climate control, and customs, so your items arrive without worry.",
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

        <div className="relative mx-auto flex min-h-[100vh] max-w-6xl flex-col justify-center gap-8 sm:gap-10 px-4 sm:px-6 py-20 sm:py-24 lg:px-10">
          <div className="max-w-3xl space-y-4 sm:space-y-6 text-white">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/70 pt-4">
              Welcome to Auctra
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Discover unique auctions made for collectors and creators
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl">
              Join live auctions for art, jewelry, design, wine, and more.
              Follow the latest trends, connect with experts, and find
              one-of-a-kind pieces — all in one trusted place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <Link
                href="/auctions"
                className="rounded-full bg-white px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-slate-900 shadow-lg shadow-slate-900/30 transition-all hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl text-center"
              >
                Explore live auctions
              </Link>
              <Link
                href="/sell"
                className="rounded-full border border-white/40 px-6 sm:px-8 py-3 sm:py-3.5 text-sm sm:text-base font-semibold text-white transition-all hover:border-white hover:bg-white/10 hover:backdrop-blur-sm text-center"
              >
                Consign a collection
              </Link>
            </div>
          </div>

          <dl className="grid gap-3 sm:gap-4 text-white grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6 backdrop-blur-sm transition-all hover:bg-white/15"
              >
                <dt className="text-[10px] sm:text-xs uppercase tracking-wider sm:tracking-widest text-white/60">
                  {stat.label}
                </dt>
                <dd className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-semibold">
                  {stat.value}
                </dd>
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
              Why Choose Auctra
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Personal service from start to finish
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              From pricing to delivery, our experts guide you every step of the
              way. We make bidding simple with smart tools and attentive
              support, so adding to your collection feels easy.
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
              <h3 className="text-lg font-semibold">
                Be the First to See What’s Next
              </h3>
              <p className="text-sm text-white/80">
                Join our exclusive preview sessions to get a closer look at
                upcoming auctions, connect with experts, and discover standout
                pieces before they go live.
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

      {/* Stories */}
      <Stories />

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
