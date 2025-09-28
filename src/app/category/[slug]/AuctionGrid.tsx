'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Gavel } from 'lucide-react';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

type AuctionCard = {
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
};

type Props = {
  auctions: AuctionCard[];
  fallbackImage: string;
};

export default function AuctionGrid({ auctions, fallbackImage }: Props) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bidValues, setBidValues] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<
    Record<string, { type: 'success' | 'error'; message: string }>
  >({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const cards = useMemo(() => auctions, [auctions]);

  if (cards.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        <span className="text-3xl">🖼️</span>
        <p className="text-base font-semibold">No lots available yet</p>
        <p className="max-w-md text-sm">
          We&apos;re sourcing new works for this collection. Be the first to consign or
          set an alert to be notified when the catalogue drops.
        </p>
      </div>
    );
  }

  const handleQuickBid = async (auction: AuctionCard) => {
    const raw = bidValues[auction.id];
    const amount = Number(raw);
    const minRequired = auction.currentBid + auction.minIncrement;

    if (!raw || Number.isNaN(amount)) {
      setFeedback((prev) => ({
        ...prev,
        [auction.id]: {
          type: 'error',
          message: 'Enter a valid bid amount',
        },
      }));
      return;
    }

    if (amount < minRequired) {
      setFeedback((prev) => ({
        ...prev,
        [auction.id]: {
          type: 'error',
          message: `Minimum bid is ${currency.format(minRequired)}`,
        },
      }));
      return;
    }

    try {
      setLoadingId(auction.id);
      setFeedback((prev) => ({ ...prev, [auction.id]: undefined }));

      const response = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auctionId: auction.id, bidAmount: amount }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message ?? 'Failed to place bid');
      }

      setFeedback((prev) => ({
        ...prev,
        [auction.id]: {
          type: 'success',
          message: 'Your bid has been placed! Refreshing…',
        },
      }));
      setBidValues((prev) => ({ ...prev, [auction.id]: '' }));
      setActiveId(null);
      router.refresh();
    } catch (error) {
      setFeedback((prev) => ({
        ...prev,
        [auction.id]: {
          type: 'error',
          message: error instanceof Error ? error.message : 'Bid failed',
        },
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((auction) => {
        const primaryImage =
          auction.images?.find((image) => image.url)?.url || fallbackImage;
        const endLabel = auction.endTime
          ? formatTimeRemaining(new Date(auction.endTime))
          : 'Schedule pending';
        const minRequired = auction.currentBid + auction.minIncrement;
        const feedbackState = feedback[auction.id];

        return (
          <div
            key={auction.id}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-slate-500 focus-within:ring-offset-2 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-slate-900/40"
          >
            <Link
              href={`/auctions/${auction.id}`}
              className="relative block aspect-[4/3] bg-slate-100 dark:bg-slate-800"
            >
              <Image
                src={primaryImage}
                alt={auction.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900 shadow-sm dark:bg-slate-900/80 dark:text-white">
                {auction.status}
              </span>
            </Link>

            <div className="flex flex-1 flex-col gap-4 p-5 text-slate-900 dark:text-slate-100">
              <div className="space-y-2">
                <Link
                  href={`/auctions/${auction.id}`}
                  className="text-lg font-semibold leading-tight hover:underline"
                >
                  {auction.title}
                </Link>
                {auction.description && (
                  <p className="text-sm text-slate-600 line-clamp-2 dark:text-slate-400">
                    {auction.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 text-sm font-medium">
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  Current bid: {currency.format(auction.currentBid)}
                </p>
                <div className="flex items-center justify-between text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  <span>Starting at {currency.format(auction.startingPrice)}</span>
                  <span>{endLabel}</span>
                </div>
              </div>

              <div className="mt-auto space-y-3">
                {activeId === auction.id ? (
                  <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm shadow-inner dark:border-slate-700 dark:bg-slate-900/70">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Quick bid
                    </label>
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        value={bidValues[auction.id] ?? ''}
                        onChange={(event) =>
                          setBidValues((prev) => ({
                            ...prev,
                            [auction.id]: event.target.value,
                          }))
                        }
                        placeholder={String(minRequired)}
                        className="w-full rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-600 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                      />
                      <button
                        type="button"
                        disabled={loadingId === auction.id}
                        onClick={() => handleQuickBid(auction)}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-900"
                      >
                        <Gavel className="h-4 w-4" />
                        {loadingId === auction.id ? 'Placing…' : 'Place bid'}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Minimum bid {currency.format(minRequired)}
                    </p>
                    {feedbackState && (
                      <p
                        className={`mt-2 text-xs ${
                          feedbackState.type === 'error'
                            ? 'text-red-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {feedbackState.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/auctions/${auction.id}`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-400"
                    >
                      View details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(auction.id);
                        setFeedback((prev) => ({ ...prev, [auction.id]: undefined }));
                        setBidValues((prev) => ({
                          ...prev,
                          [auction.id]: String(minRequired),
                        }));
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                    >
                      Quick bid
                      <Gavel className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatTimeRemaining(endDate: Date) {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return 'Auction ended';
  const minutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  if (days > 0) return `${days}d ${hours}h remaining`;
  if (hours > 0) return `${hours}h ${mins}m remaining`;
  return `${mins} minutes left`;
}
