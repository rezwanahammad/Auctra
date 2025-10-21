import { notFound } from "next/navigation";
import { cache } from "react";
import { Types } from "mongoose";
import Image from "next/image";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";
import "@/models/Category";

import AuctionPageClient from "@/app/auctions/[id]/AuctionPageClient";

type LeanAuctionDoc = {
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
  categoryId?:
    | { _id: Types.ObjectId; name: string; slug: string }
    | Types.ObjectId;
  sellerId?: { _id: Types.ObjectId; username?: string } | Types.ObjectId;
};

type LeanBidDoc = {
  _id: Types.ObjectId;
  bidAmount: number;
  createdAt: Date;
  bidderId?: { _id: Types.ObjectId; username?: string } | Types.ObjectId;
};

type AuctionData = {
  auction: {
    id: string;
    title: string;
    description?: string;
    startingPrice: number;
    currentBid: number;
    reservePrice?: number;
    minIncrement: number;
    status: string;
    startTime?: string;
    endTime?: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    seller?: {
      id: string;
      username?: string;
    };
    images: { url: string; alt?: string }[];
  };
  bids: Array<{
    id: string;
    amount: number;
    createdAt: string;
    bidder?: string;
  }>;
};

const formatTaka = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value) +
  "/-";

const getAuctionData = cache(
  async (id: string): Promise<AuctionData | null> => {
    await dbConnect();

    const auctionDoc = await Auction.findById(id)
      .populate<{
        categoryId: { _id: Types.ObjectId; name: string; slug: string };
      }>("categoryId", "name slug")
      .populate<{ sellerId: { _id: Types.ObjectId; username?: string } }>(
        "sellerId",
        "username"
      )
      .lean<LeanAuctionDoc | null>();

    if (!auctionDoc) {
      return null;
    }

    const bids = await Bid.find({ auctionId: id })
      .populate<{ bidderId: { _id: Types.ObjectId; username?: string } }>(
        "bidderId",
        "username"
      )
      .sort({ createdAt: -1 })
      .lean<LeanBidDoc[]>();

    const images = (auctionDoc.images ?? []).map((image, index) => ({
      url: image?.url ?? "/images/hero-auction.png",
      alt: image?.alt ?? `${auctionDoc.title} image ${index + 1}`,
    }));

    return {
      auction: {
        id: auctionDoc._id.toString(),
        title: auctionDoc.title,
        description: auctionDoc.description,
        startingPrice: auctionDoc.startingPrice,
        currentBid: auctionDoc.currentBid ?? auctionDoc.startingPrice,
        reservePrice: auctionDoc.reservePrice,
        minIncrement: auctionDoc.minIncrement ?? 1,
        status: auctionDoc.status,
        startTime: auctionDoc.startTime
          ? auctionDoc.startTime.toISOString()
          : undefined,
        endTime: auctionDoc.endTime
          ? auctionDoc.endTime.toISOString()
          : undefined,
        category:
          auctionDoc.categoryId &&
          typeof auctionDoc.categoryId === "object" &&
          "slug" in auctionDoc.categoryId
            ? {
                id: auctionDoc.categoryId._id.toString(),
                name: auctionDoc.categoryId.name,
                slug: auctionDoc.categoryId.slug,
              }
            : undefined,
        seller:
          auctionDoc.sellerId &&
          typeof auctionDoc.sellerId === "object" &&
          "username" in auctionDoc.sellerId
            ? {
                id: auctionDoc.sellerId._id.toString(),
                username: auctionDoc.sellerId.username,
              }
            : undefined,
        images,
      },
      bids: bids.map((bid) => ({
        id: bid._id.toString(),
        amount: bid.bidAmount,
        createdAt: bid.createdAt.toISOString(),
        bidder:
          bid.bidderId &&
          typeof bid.bidderId === "object" &&
          "username" in bid.bidderId
            ? bid.bidderId.username ?? "Anonymous bidder"
            : undefined,
      })),
    };
  }
);

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const data = await getAuctionData(id);
  if (!data) {
    return {
      title: "Auction not found | Auctra",
    };
  }
  return {
    title: `${data.auction.title} | Auctra`,
    description:
      data.auction.description ??
      `Bid on ${data.auction.title} and explore more curated lots on Auctra.`,
  };
}

export default async function AuctionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const data = await getAuctionData(id);
  if (!data) {
    notFound();
  }

  const { auction, bids } = data;
  const heroImage = auction.images[0]?.url ?? "/images/hero-auction.png";
  const additionalImages = auction.images.slice(1);

  const startLabel = formatDateTime(auction.startTime);
  const endLabel = formatDateTime(auction.endTime);
  const timeRemaining = auction.endTime
    ? formatTimeRemaining(new Date(auction.endTime))
    : "Schedule pending";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <section className="relative mx-auto grid max-w-6xl gap-8 px-6 py-16 sm:px-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-8 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
          <div className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white dark:bg-white dark:text-slate-900">
            {auction.status}
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {auction.title}
          </h1>
          {auction.description && (
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {auction.description}
            </p>
          )}

          <dl className="mt-6 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <DetailRow
              label="Current bid"
              value={formatTaka(auction.currentBid)}
              bold
            />
            <DetailRow
              label="Starting price"
              value={formatTaka(auction.startingPrice)}
            />
            {typeof auction.reservePrice === "number" && (
              <DetailRow
                label="Reserve price"
                value={formatTaka(auction.reservePrice)}
              />
            )}
            <DetailRow
              label="Minimum increment"
              value={formatTaka(auction.minIncrement)}
            />
            <DetailRow label="Starts" value={startLabel} />
            <DetailRow label="Ends" value={endLabel} />
            <DetailRow label="Time remaining" value={timeRemaining} />
          </dl>

          {auction.category && (
            <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
              {auction.category.name}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="relative h-96 overflow-hidden rounded-3xl border border-slate-200 shadow-lg dark:border-slate-800">
            <Image
              src={heroImage}
              alt={auction.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          {additionalImages.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-3">
              {additionalImages.map((image, index) => (
                <div
                  key={index}
                  className="relative h-32 overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700"
                >
                  <Image
                    src={image.url}
                    alt={image.alt ?? `${auction.title} detail ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-8 lg:px-10">
        <AuctionPageClient auction={auction} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 sm:px-8 lg:px-10">
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Bid history
          </h2>
          {bids.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              No bids placed yet. Be the first to make an offer.
            </p>
          ) : (
            <ol className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {bids.map((bid) => (
                <li
                  key={bid.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 dark:border-slate-700 dark:bg-slate-900/60"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {bid.bidder ?? "Private bidder"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(bid.createdAt).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-slate-900 dark:text-white">
                      {formatTaka(bid.amount)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {formatRelativeTime(new Date(bid.createdAt))}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </div>
  );
}

function DetailRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <dl className="flex items-center justify-between">
      <dt className="font-medium text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd
        className={
          bold
            ? "text-base font-semibold text-slate-900 dark:text-white"
            : undefined
        }
      >
        {value}
      </dd>
    </dl>
  );
}

function formatDateTime(value?: string) {
  if (!value) return "TBD";
  return new Date(value).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatTimeRemaining(endDate: Date) {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return "Auction ended";
  const minutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${mins}m remaining`;
  return `${mins} minutes left`;
}

function formatRelativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}
