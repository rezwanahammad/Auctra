import Link from "next/link";
import Image from "next/image";
import BrowseCategories from "@/components/BrowseCategories";
import Stories from "@/components/Stories";

const stats = [
  { label: "Auctions launched", value: "2025" },
  { label: "Registered bidders", value: "229+" },
  { label: "Lots sold", value: "137+" },
  { label: "Countries served", value: "9+" },
];

const highlights = [
  {
    title: "Private Valuations",
    description:
      "Get estimate value for single items or entire collections, handled by specialists.",
  },
  {
    title: "Curated Curation",
    description:
      "Every piece comes with its own story — from history and ownership to expert insights — so you know exactly what you’re bidding on.",
  },
  {
    title: "Quick Delivery",
    description:
      "Safe, careful shipping. We take care of packing and customs, so your items arrive without any delay.",
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
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white/70 pt-3">
              Welcome to Auctra
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
              Discover unique auctions made for collectors and creators
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/80 max-w-2xl">
              View & join live auctions for art, jewelry, fine-art, antiques and
              more. Follow the latest trends, connect with experts, and find
              one-of-a-kind pieces.
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
                className="rounded-xl sm:rounded-2xl border border-white/10 bg-white/10 p-4 sm:p-6 transition-all hover:bg-white/15"
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
            {/* <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-300">
              Why Choose Auctra
            </p> */}
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
                Join preview sessions to get a closer look at upcoming auctions
                and discover standout pieces before they go live.
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
    </main>
  );
}
