import BrowseCategories from "@/components/BrowseCategories";
import Link from "next/link";

export const metadata = {
  title: "Categories | Auctra - Curated Auction Categories",
  description:
    "Browse our curated auction categories including fine art, jewelry, watches, furniture, antiques, and collectibles. Discover unique pieces across all disciplines.",
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Categories
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-slate-100">
            Explore Our Auction Categories
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            From fine art to collectibles, discover extraordinary pieces across
            our carefully curated categories. Each auction features expertly
            authenticated items with detailed provenance and condition reports.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auctions"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              View All Auctions
            </Link>
            <Link
              href="/sell"
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-500"
            >
              Consign Your Collection
            </Link>
          </div>
        </div>
      </section>

      {/* Browse Categories Component */}
      <BrowseCategories />

      {/* Additional Info Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-slate-900 dark:text-slate-100">
              Why Choose Auctra Categories?
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-slate-400 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Expert Curation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Our specialists handpick each item, ensuring quality and
                    authenticity across all categories.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-slate-400 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Detailed Documentation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Every lot includes comprehensive provenance research and
                    condition reports.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-slate-400 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Weekly Updates
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Fresh consignments and new discoveries added to each
                    category every week.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-slate-400 mt-2"></div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                    Global Reach
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Secure shipping and delivery to collectors worldwide across
                    47 countries.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-full blur-3xl opacity-30"></div>
            <div className="relative rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Start Your Collection Today
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Join thousands of collectors who trust Auctra for discovering
                exceptional pieces. Whether you&apos;re a seasoned collector or
                just starting, we have something for every taste and budget.
              </p>
              <div className="space-y-3">
                <Link
                  href="/auth/signin"
                  className="block w-full rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Create Account
                </Link>
                <Link
                  href="/contact"
                  className="block w-full rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Speak with a Specialist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-8 lg:px-10">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white dark:from-slate-100 dark:to-slate-200 dark:text-slate-900">
          <h2 className="text-2xl font-semibold">Get Category Updates</h2>
          <p className="mt-2 text-white/80 dark:text-slate-600">
            Be the first to know when new lots are added to your favorite
            categories.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/60 backdrop-blur focus:border-white focus:outline-none focus:ring-1 focus:ring-white dark:border-slate-400 dark:bg-slate-100/20 dark:text-slate-900 dark:placeholder-slate-600"
            />
            <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
