"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, Grid, Clock, ArrowLeft } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentBid: number;
  reservePrice?: number;
  status: string;
  endTime?: string;
  startTime?: string;
  images: Array<{ url: string; alt?: string }>;
  category: { name: string; slug: string } | null;
  seller: { username?: string; firstName?: string; lastName?: string } | null;
}

interface SearchResponse {
  success: boolean;
  query: string;
  results: SearchResult[];
  totalResults: number;
  hasMore: boolean;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get("q") || "";

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(query);
  const [statusFilter, setStatusFilter] = useState("all");

  const performSearch = async (searchTerm: string, status: string = "all") => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const url = `/api/search?q=${encodeURIComponent(
        searchTerm
      )}&status=${status}&limit=20`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data: SearchResponse = await response.json();
      setSearchResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query, statusFilter);
    } else {
      setLoading(false);
    }
  }, [query, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim(), statusFilter);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const formatTimeRemaining = (endTime: string): string => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) return "Ended";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Search Results
          </h1>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search auctions, items, or categories..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                aria-label="Filter by auction status"
              >
                <option value="all">All Items</option>
                <option value="active">Active Auctions</option>
                <option value="draft">Buy Now</option>
              </select>

              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>
          </form>

          {query && (
            <p className="text-slate-600 dark:text-slate-400">
              {loading ? "Searching..." : `Results for "${query}"`}
            </p>
          )}
        </div>

        {/* Results */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            <p>Error: {error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Found {searchResults.length} result
                {searchResults.length === 1 ? "" : "s"}
              </p>
              <div className="flex items-center gap-2 text-slate-400">
                <Grid className="h-4 w-4" />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {searchResults.map((result) => (
                <Link
                  key={result.id}
                  href={`/auctions/${result.id}`}
                  className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    {result.images && result.images.length > 0 ? (
                      <Image
                        src={result.images[0].url}
                        alt={result.images[0].alt || result.title}
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <Search className="h-12 w-12 text-slate-400" />
                      </div>
                    )}

                    {result.status === "active" && result.endTime && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                          <Clock className="h-3 w-3" />
                          {formatTimeRemaining(result.endTime)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {result.title}
                    </h3>

                    {result.category && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        {result.category.name}
                      </p>
                    )}

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          {result.currentBid > 0
                            ? "Current Bid:"
                            : "Starting Price:"}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {formatPrice(
                            result.currentBid > 0
                              ? result.currentBid
                              : result.startingPrice
                          )}
                        </span>
                      </div>
                      {result.reservePrice && (
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Reserve:
                          </span>
                          <span className="text-slate-900 dark:text-slate-100">
                            {formatPrice(result.reservePrice)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              No results found
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              We couldn&apos;t find any auctions matching &ldquo;{query}&rdquo;.
              Try different keywords or browse our categories.
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              Browse All Auctions
            </Link>
          </div>
        ) : (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Start Your Search
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Enter keywords to search for auctions, items, or categories.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
          <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded mb-8"></div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i}>
                    <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700 rounded-2xl mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
