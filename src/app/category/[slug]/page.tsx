import { notFound } from "next/navigation";
import { cache } from "react";
import { Types } from "mongoose";
import Image from "next/image";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";
import Auction from "@/models/Auction";
import AuctionGrid from "./AuctionGrid";

type LeanCategory = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
};

type LeanAuction = {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  startingPrice: number;
  currentBid?: number;
  reservePrice?: number;
  status: string;
  startTime?: Date;
  endTime?: Date;
  images?: { url?: string; alt?: string }[];
  minIncrement?: number;
};

type CategoryData = {
  category: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  auctions: Array<{
    id: string;
    title: string;
    description?: string;
    startingPrice: number;
    currentBid: number;
    reservePrice?: number;
    status: string;
    startTime?: string;
    endTime?: string;
    images?: { url: string; alt?: string }[];
    minIncrement: number;
  }>;
};

const formatTaka = (value: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value) + "/-";

const FALLBACK_CATEGORIES: Record<string, { name: string; description: string }> = {
  furniture: {
    name: "Furniture",
    description:
      "Explore statement furniture and decor, spanning mid-century icons to contemporary studio pieces.",
  },
  antiques: {
    name: "Antiques",
    description:
      "Discover heritage objects with storied provenance, from early silver to classical sculpture.",
  },
  toys: {
    name: "Toys & Collectibles",
    description:
      "Track pop culture, comics, and collectible design drops sourced from dedicated consignors.",
  },
};

const getCategoryData = cache(async (slug: string): Promise<CategoryData | null> => {
  await dbConnect();

  const categoryDoc = await Category.findOne({ slug }).lean<LeanCategory | null>();
  if (!categoryDoc) {
    const fallback = FALLBACK_CATEGORIES[slug];
    if (!fallback) {
      return null;
    }
    return {
      category: {
        id: "virtual-" + slug,
        name: fallback.name,
        slug,
        description: fallback.description,
      },
      auctions: [],
    };
  }

  const auctions = await Auction.find({ categoryId: categoryDoc._id })
    .sort({ endTime: 1 })
    .lean<LeanAuction[]>();

  return {
    category: {
      id: categoryDoc._id.toString(),
      name: categoryDoc.name,
      slug: categoryDoc.slug,
      description: categoryDoc.description,
    },
    auctions: auctions.map((auction) => ({
      id: auction._id.toString(),
      title: auction.title,
      description: auction.description,
      startingPrice: auction.startingPrice,
      currentBid: auction.currentBid ?? auction.startingPrice,
      reservePrice: auction.reservePrice,
      status: auction.status,
      startTime: auction.startTime ? auction.startTime.toISOString() : undefined,
      endTime: auction.endTime ? auction.endTime.toISOString() : undefined,
      images: auction.images?.map((image) => ({
        url: image?.url ?? "",
        alt: image?.alt,
      })),
      minIncrement: auction.minIncrement ?? 1,
    })),
  };
});

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getCategoryData(params.slug);
  if (!data) {
    return {
      title: "Category not found | Auctra",
    };
  }
  return {
    title: data.category.name + " auctions | Auctra",
    description:
      data.category.description ??
      "Explore curated " + data.category.name.toLowerCase() + " auctions on Auctra.",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getCategoryData(params.slug);
  if (!data) {
    notFound();
  }

  const { category, auctions } = data;
  const activeAuctions = auctions.filter((auction) => auction.status === "active");
  const endedAuctions = auctions.filter((auction) => auction.status !== "active");
  const totalVolume = activeAuctions.reduce(
    (sum, auction) => sum + auction.currentBid,
    0,
  );
  const heroImage = auctions.find((auction) => auction.images?.[0]?.url)?.images?.[0]?.url;
  const fallbackImage = "/images/hero-auction.png";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <section className="relative mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
            {category.name}
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {"Curated " + category.name.toLowerCase() + " auctions"}
          </h1>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {category.description ??
              "Discover sought-after " +
                category.name.toLowerCase() +
                " lots sourced from private collections and specialist consignors."}
          </p>
          <button
            type="button"
            className="mt-6 inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
          >
            Subscribe to this category
          </button>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center text-slate-500 dark:text-slate-300">
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.35em]">Live lots</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {activeAuctions.length}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.35em]">Bid volume</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {formatTaka(totalVolume)}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
              <p className="text-xs uppercase tracking-[0.35em]">Total lots</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                {auctions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="relative h-96 overflow-hidden rounded-3xl border border-slate-200 shadow-lg dark:border-slate-800">
          <Image
            src={heroImage || fallbackImage}
            alt={category.name + " hero"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/10 to-black/0" />
        </div>
      </section>

      <section id="catalogues" className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {activeAuctions.length > 0
                ? "Active " + category.name.toLowerCase() + " auctions"
                : "All " + category.name.toLowerCase() + " catalogues"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {activeAuctions.length > 0
                ? "Place bids in real time or set alerts for closing lots."
                : "No live sales right now—browse recent catalogues and consign early."}
            </p>
          </div>
        </div>

        <AuctionGrid
          activeAuctions={activeAuctions}
          endedAuctions={endedAuctions}
          fallbackImage={fallbackImage}
        />
      </section>
    </div>
  );
}

