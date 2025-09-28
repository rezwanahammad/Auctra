import { notFound } from "next/navigation";
import { cache } from "react";
import { Types } from "mongoose";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const getCategoryData = cache(async (slug: string): Promise<CategoryData | null> => {
  await dbConnect();

  const categoryDoc = await Category.findOne({ slug }).lean<LeanCategory | null>();
  if (!categoryDoc) {
    return null;
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
    title: `${data.category.name} auctions | Auctra`,
    description:
      data.category.description ??
      `Explore curated ${data.category.name.toLowerCase()} auctions on Auctra.`,
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
  const liveAuctions = auctions.filter((auction) => auction.status === "active");
  const totalVolume = liveAuctions.reduce(
    (sum, auction) => sum + auction.currentBid,
    0,
  );
  const heroImage = auctions.find((auction) => auction.images?.[0]?.url)?.images?.[0]?.url;
  const fallbackImage = "/images/hero-auction.png";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <Image
              src={heroImage || fallbackImage}
              alt={`${category.name} hero`}
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
        </div>

        <div className="relative mx-auto flex min-h-[420px] max-w-6xl flex-col justify-center gap-10 px-6 py-20 sm:px-8 lg:px-10">
          <div className="max-w-3xl space-y-5 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
              {category.name}
            </p>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {`Curated ${category.name.toLowerCase()} auctions`}
            </h1>
            <p className="text-base text-white/80 sm:text-lg">
              {category.description ??
                `Discover sought-after ${category.name.toLowerCase()} lots sourced from private collections and specialist consignors.`}
            </p>
            <div className="flex flex-wrap gap-4 text-white/80">
              <div>
                <p className="text-xs uppercase tracking-[0.4em]">Live lots</p>
                <p className="text-3xl font-semibold text-white">{liveAuctions.length}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em]">Bid volume</p>
                <p className="text-3xl font-semibold text-white">
                  {currency.format(totalVolume)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.4em]">Total lots</p>
                <p className="text-3xl font-semibold text-white">{auctions.length}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-white/80">
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Explore all auctions
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              Consign in this category
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {liveAuctions.length > 0
                ? `Live ${category.name.toLowerCase()} auctions`
                : `All ${category.name.toLowerCase()} catalogues`}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {liveAuctions.length > 0
                ? "Place bids in real time or set alerts for closing lots."
                : "No live sales right now—browse recent catalogues and consign early."}
            </p>
          </div>
        </div>

        <AuctionGrid auctions={auctions} fallbackImage={fallbackImage} />
      </section>
    </div>
  );
}
  const { AuctionGrid } = await import("./AuctionGrid");
