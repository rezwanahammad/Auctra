"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import FavoriteButton from "@/components/FavoriteButton";

interface AuctionListItem {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
  startingPrice: number;
  reservePrice?: number;
  status: string;
  startTime?: string;
  endTime?: string;
  images?: { url: string; alt?: string }[];
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "closed", label: "Closed" },
];

const SORT_OPTIONS = [
  { value: "endingSoon", label: "Ending soon" },
  { value: "newest", label: "Newest" },
  { value: "priceHigh", label: "Highest bid" },
  { value: "priceLow", label: "Lowest bid" },
];

const STATUS_BADGE: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
  pending:
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  closed:
    "bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-200",
};

const EMPTY_AUCTIONS: AuctionListItem[] = [];

const formatTaka = (value: number) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value) +
  "/-";

function timeRemaining(endTime?: string) {
  if (!endTime) return "End date TBD";
  const end = new Date(endTime).getTime();
  if (Number.isNaN(end)) return "End date TBD";
  const diff = end - Date.now();
  if (diff <= 0) return "Auction ended";
  const minutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  if (days > 0) return `Ends in ${days}d ${hours}h`;
  if (hours > 0) return `Ends in ${hours}h ${mins}m`;
  return `Ends in ${mins}m`;
}

function AuctionCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/40 dark:bg-slate-900">
      <div className="h-48 bg-slate-200 dark:bg-slate-800" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-9 w-full rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export default function AuctionsPage() {
  const { data, error } = useSWR<{ auctions: AuctionListItem[] }>(
    "/api/auctions",
    fetcher
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("endingSoon");

  const auctions = data?.auctions ?? EMPTY_AUCTIONS;
  const isLoading = !data && !error;

  const filteredAuctions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const base = auctions.filter((auction) => {
      const matchesStatus =
        statusFilter === "all" || auction.status === statusFilter;
      const matchesTerm =
        term.length === 0 ||
        auction.title.toLowerCase().includes(term) ||
        (auction.description?.toLowerCase().includes(term) ?? false);
      return matchesStatus && matchesTerm;
    });

    return base.sort((a, b) => {
      switch (sortOption) {
        case "endingSoon": {
          const endA = a.endTime ? new Date(a.endTime).getTime() : Infinity;
          const endB = b.endTime ? new Date(b.endTime).getTime() : Infinity;
          return endA - endB;
        }
        case "newest": {
          const startA = a.startTime ? new Date(a.startTime).getTime() : 0;
          const startB = b.startTime ? new Date(b.startTime).getTime() : 0;
          return startB - startA;
        }
        case "priceHigh":
          return b.currentBid - a.currentBid;
        case "priceLow":
          return a.currentBid - b.currentBid;
        default:
          return 0;
      }
    });
  }, [auctions, searchTerm, statusFilter, sortOption]);

  const heroStats = useMemo(() => {
    const totalActive = auctions.filter(
      (auction) => auction.status === "active"
    );
    return {
      total: auctions.length,
      active: totalActive.length,
      volume: totalActive.reduce((sum, auction) => sum + auction.currentBid, 0),
    };
  }, [auctions]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 mt-8">
      <section className="relative overflow-hidden">
        <div className="absolute -left-12 top-16 h-64 w-64 rounded-full bg-purple-400/30 blur-3xl dark:bg-purple-500/20" />
        <div className="absolute right-0 top-36 hidden h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl dark:block" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">
                Seasonal catalogue
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Discover the auctions shaping tomorrow&apos;s collections
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                Analyse live bidding, explore provenance-rich lots, and secure
                rare pieces from the world&apos;s leading sellers—all in one
                curated marketplace.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/auctions"
                  className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:shadow-none dark:hover:bg-slate-200"
                >
                  Browse live auctions
                </Link>
                <Link
                  href="/sell"
                  className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500"
                >
                  Submit a consignment
                </Link>
              </div>
            </div>

            <dl className="grid w-full gap-4 sm:grid-cols-3 lg:w-auto">
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Auctions listed
                </dt>
                <dd className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {heroStats.total}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Currently live
                </dt>
                <dd className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {heroStats.active}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-none">
                <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                  Bid volume
                </dt>
                <dd className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                  {formatTaka(heroStats.volume)}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-10 pb-20">
        <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-none sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((option) => {
                  const isActive = statusFilter === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setStatusFilter(option.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900 ${
                        isActive
                          ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-end sm:gap-6">
                <div className="relative w-full max-w-xs">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search by title or keywords"
                    className="w-full rounded-full border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-100/10"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400 dark:text-slate-500">
                    🔍
                  </span>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
                  Sort by
                  <select
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-inner focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-slate-500"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading && (
                <>
                  <AuctionCardSkeleton />
                  <AuctionCardSkeleton />
                  <AuctionCardSkeleton />
                </>
              )}

              {!isLoading && filteredAuctions.length === 0 && (
                <div className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-300">
                  <span className="text-3xl">🧭</span>
                  <p className="text-base font-semibold">
                    No auctions match your filters yet
                  </p>
                  <p className="max-w-md text-sm">
                    Try adjusting your filters or check back soon—new catalogues
                    drop each week.
                  </p>
                </div>
              )}

              {filteredAuctions.map((auction) => {
                const badgeClass =
                  STATUS_BADGE[auction.status] ??
                  "bg-slate-200 text-slate-700 dark:bg-slate-700/50 dark:text-slate-200";
                const imageSrc =
                  auction.images?.find((image) => image.url)?.url ||
                  "/images/hero-auction.png";

                return (
                  <Link
                    key={auction._id}
                    href={`/auctions/${auction._id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-slate-900/40 dark:focus-visible:ring-slate-200 dark:focus-visible:ring-offset-slate-900"
                  >
                    <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={imageSrc}
                        alt={auction.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                        unoptimized
                      />
                      <span
                        className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                      >
                        {auction.status.toUpperCase()}
                      </span>

                      {/* Favorite Heart Button */}
                      <div className="absolute right-4 top-4 z-10">
                        <FavoriteButton
                          auctionId={auction._id}
                          size="md"
                          className="bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm border border-white/20 text-slate-700 hover:text-red-500 dark:bg-slate-900/80 dark:hover:bg-slate-900 dark:text-slate-300 dark:hover:text-red-400 dark:border-slate-700/50"
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 p-5 text-slate-900 dark:text-slate-100">
                      <div className="space-y-2">
                        <h2 className="text-lg font-semibold leading-tight">
                          {auction.title}
                        </h2>
                        {auction.description && (
                          <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-400">
                            {auction.description}
                          </p>
                        )}
                      </div>

                      <div className="mt-auto space-y-2 text-sm font-medium">
                        <p className="text-base font-semibold">
                          Current bid: {formatTaka(auction.currentBid)}
                        </p>
                        <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          <span>
                            Starting at {formatTaka(auction.startingPrice)}
                          </span>
                          <span>{timeRemaining(auction.endTime)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mx-auto max-w-4xl rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
          Unable to load auctions right now. Please refresh the page or try
          again later.
        </div>
      )}
    </div>
  );
}
