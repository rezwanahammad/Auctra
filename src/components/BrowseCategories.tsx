import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Category = {
  name: string;
  slug: string;
  image: string;
  highlight: string;
};

const categories: Category[] = [
  {
    name: "Fine Art",
    slug: "fine-art",
    image: "/images/fine-art.jpg",
    highlight: "Modern & Post-War",
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    image: "/images/jewelry.webp",
    highlight: "Signed pieces & gemstones",
  },
  {
    name: "Watches",
    slug: "watches",
    image: "/images/watches.jpg",
    highlight: "Vintage chronographs",
  },
  {
    name: "Furniture",
    slug: "furniture",
    image: "/images/furniture.jpg",
    highlight: "Mid-century icons",
  },
  {
    name: "Antiques",
    slug: "antiques",
    image: "/images/antiques.jpeg",
    highlight: "Pop culture rarities",
  },
  {
    name: "Toys & Collectibles",
    slug: "toys",
    image: "/images/toys.jpg",
    highlight: "Cellar selections",
  },
];

export default function BrowseCategories() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl dark:bg-slate-800/40" />
      <div className="relative mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
              Browse by category
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
              Curated disciplines for every collector
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Follow the momentum across our most requested categories. Each
              catalogue is refreshed weekly with private consignments and
              specialist discoveries.
            </p>
          </div>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-200 dark:hover:border-slate-400"
          >
            View all auctions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 -mx-2 overflow-x-auto pb-4">
          <div className="grid gap-5 px-2 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group relative h-72 overflow-hidden rounded-3xl border border-white/30 bg-white/30 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/50"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/5" />
                <div className="relative flex h-full flex-col justify-between p-6 text-white">
                  <div className="flex items-center justify-between text-xs font-semibold tracking-[0.3em] text-white/70">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{category.highlight}</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-semibold leading-tight">
                      {category.name}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-white/80 group-hover:text-white">
                      Explore lots
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
