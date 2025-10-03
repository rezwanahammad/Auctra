"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Crown, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface WonAuction {
  id: string;
  title: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  seller: {
    username: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  winningBid: number;
  startingPrice: number;
  reservePrice?: number;
  images: Array<{
    url: string;
    alt?: string;
  }>;
  endedAt: string;
  createdAt: string;
}

interface WonAuctionsResponse {
  wonAuctions: WonAuction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export default function WonAuctionsPage() {
  const { status } = useSession();
  const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWonAuctions = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auctions/won?page=${page}&limit=12`);

      if (!response.ok) {
        throw new Error("Failed to fetch won auctions");
      }

      const data: WonAuctionsResponse = await response.json();
      setWonAuctions(data.wonAuctions);
      setPagination(data.pagination);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchWonAuctions();
    }
  }, [status]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePageChange = (page: number) => {
    fetchWonAuctions(page);
  };

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Please sign in to view your won auctions.
            </p>
            <Link
              href="/auth/signin"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Crown className="h-8 w-8 text-green-600 dark:text-green-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Won Auctions
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {pagination.totalCount > 0
              ? `You have won ${pagination.totalCount} auction${
                  pagination.totalCount === 1 ? "" : "s"
                }`
              : "You haven't won any auctions yet"}
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            <p>Error: {error}</p>
          </div>
        )}

        {wonAuctions.length > 0 ? (
          <>
            {/* Auctions Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {wonAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    {auction.images && auction.images.length > 0 ? (
                      <Image
                        src={auction.images[0].url}
                        alt={auction.images[0].alt || auction.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <Crown className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <Crown className="h-3 w-3" />
                        Won
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {auction.title}
                    </h3>

                    <div className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                      <p>
                        Category: {auction.category?.name || "Uncategorized"}
                      </p>
                      <p>
                        Seller:{" "}
                        {auction.seller?.firstName || auction.seller?.username}
                      </p>
                    </div>

                    <div className="mb-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Starting Price:
                        </span>
                        <span className="text-slate-900 dark:text-slate-100">
                          {formatPrice(auction.startingPrice)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          Your Winning Bid:
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatPrice(auction.winningBid)}
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Won on {formatDate(auction.endedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>

                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Crown className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              No Won Auctions Yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              You haven&apos;t won any auctions yet. Keep bidding to add items
              to your collection!
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              Browse Auctions
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
