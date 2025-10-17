"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye, Heart, User } from "lucide-react";

interface Auction {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
  startingPrice: number;
  startTime: string;
  endTime: string;
  status: string;
  sellerId: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
  images?: Array<{
    url?: string;
    alt?: string;
  }>;
}

export default function EventsPage() {
  const [upcomingAuctions, setUpcomingAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUpcomingAuctions();
  }, []);

  const fetchUpcomingAuctions = async () => {
    try {
      const response = await fetch("/api/auctions");
      if (!response.ok) {
        throw new Error("Failed to fetch auctions");
      }

      const data = await response.json();

      // Filter auctions that haven't started yet
      const now = new Date();
      const upcoming =
        data.auctions?.filter((auction: Auction) => {
          const startTime = new Date(auction.startTime);
          return (
            startTime > now &&
            (auction.status === "pending" || auction.status === "draft")
          );
        }) || [];

      setUpcomingAuctions(upcoming);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTimeUntilStart = (startTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const diff = start.getTime() - now.getTime();

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}, ${hours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">
                Loading upcoming auctions...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 mt-8">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Upcoming Auctions
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Reserve your viewing for auctions that haven&apos;t started yet.
              Get early access and plan your bidding strategy.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {upcomingAuctions.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No Upcoming Auctions
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              There are no scheduled auctions at the moment. Check back soon for
              new events!
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition"
            >
              View Active Auctions
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400">
                  {upcomingAuctions.length} upcoming auction
                  {upcomingAuctions.length !== 1 ? "s" : ""} found
                </p>
                <Link
                  href="/auctions"
                  className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
                >
                  View all auctions →
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingAuctions.map((auction) => (
                <div
                  key={auction._id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {auction.images &&
                    auction.images.length > 0 &&
                    auction.images[0].url ? (
                      <Image
                        src={auction.images[0].url}
                        alt={auction.images[0].alt || auction.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <Eye className="h-12 w-12 text-slate-400" />
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                        Upcoming
                      </span>
                    </div>

                    {/* Time Until Start */}
                    <div className="absolute top-4 right-4">
                      <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {getTimeUntilStart(auction.startTime)}
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      className="absolute bottom-4 right-4 p-2 bg-white/90 dark:bg-slate-800/90 rounded-full shadow-md hover:bg-white dark:hover:bg-slate-800 transition-colors"
                      aria-label="Add to favorites"
                      title="Add to favorites"
                    >
                      <Heart className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">
                          {auction.title}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <User className="h-3 w-3" />
                          <span>
                            {auction.sellerId?.firstName ||
                              auction.sellerId?.username ||
                              "Unknown"}{" "}
                            {auction.sellerId?.lastName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {auction.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                        {auction.description}
                      </p>
                    )}

                    {/* Auction Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Starting Price
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(auction.startingPrice)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            {formatDate(auction.startTime)}
                          </div>
                          <div className="text-slate-600 dark:text-slate-400">
                            Starts at {formatTime(auction.startTime)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Link
                        href={`/auctions/${auction._id}`}
                        className="flex-1 bg-slate-900 text-white text-center py-2.5 px-4 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                      >
                        Reserve Viewing
                      </Link>
                      <button
                        className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        aria-label="Quick preview"
                        title="Quick preview"
                      >
                        <Eye className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
