"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Trash2, Clock, Gavel } from "lucide-react";

interface FavoriteAuction {
  favoriteId: string;
  auction: {
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
  };
  addedAt: string;
}

interface FavoritesResponse {
  success: boolean;
  favorites: FavoriteAuction[];
  totalCount: number;
}

export default function FavoritesPage() {
  const { status } = useSession();
  const [favorites, setFavorites] = useState<FavoriteAuction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/favorites");

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const data: FavoritesResponse = await response.json();
      setFavorites(data.favorites);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load favorites"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status]);

  const handleRemoveFavorite = async (auctionId: string) => {
    setRemovingId(auctionId);
    try {
      const response = await fetch(`/api/favorites?auctionId=${auctionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to remove favorite");
      }

      // Remove from local state
      setFavorites((prev) =>
        prev.filter((fav) => fav.auction.id !== auctionId)
      );
    } catch (error) {
      console.error("Remove favorite error:", error);
      alert("Failed to remove from favorites");
    } finally {
      setRemovingId(null);
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

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-4"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-slate-200 dark:bg-slate-700 rounded-2xl"
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
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
          <div className="text-center">
            <Heart className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Please sign in to view your favorites.
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
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              My Favorites
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            {favorites.length > 0
              ? `You have ${favorites.length} favorite auction${
                  favorites.length === 1 ? "" : "s"
                }`
              : "You haven't added any favorites yet"}
          </p>
        </div>

        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200">
            <p>Error: {error}</p>
          </div>
        )}

        {favorites.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((favorite) => (
              <div
                key={favorite.favoriteId}
                className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 relative"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFavorite(favorite.auction.id)}
                  disabled={removingId === favorite.auction.id}
                  className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 text-red-500 shadow-md transition hover:bg-red-50 disabled:opacity-50 dark:bg-slate-800/90 dark:hover:bg-red-900/30"
                  aria-label="Remove from favorites"
                >
                  {removingId === favorite.auction.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>

                <Link href={`/auctions/${favorite.auction.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                    {favorite.auction.images &&
                    favorite.auction.images.length > 0 ? (
                      <Image
                        src={favorite.auction.images[0].url}
                        alt={
                          favorite.auction.images[0].alt ||
                          favorite.auction.title
                        }
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-slate-800">
                        <Gavel className="h-12 w-12 text-slate-400" />
                      </div>
                    )}

                    {favorite.auction.status === "active" &&
                      favorite.auction.endTime && (
                        <div className="absolute top-3 left-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600 dark:bg-green-900/30 dark:text-green-400">
                            <Clock className="h-3 w-3" />
                            {formatTimeRemaining(favorite.auction.endTime)}
                          </span>
                        </div>
                      )}
                  </div>

                  <div className="p-4">
                    <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                      {favorite.auction.title}
                    </h3>

                    {favorite.auction.category && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        {favorite.auction.category.name}
                      </p>
                    )}

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">
                          {favorite.auction.currentBid > 0
                            ? "Current Bid:"
                            : "Starting Price:"}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {formatPrice(
                            favorite.auction.currentBid > 0
                              ? favorite.auction.currentBid
                              : favorite.auction.startingPrice
                          )}
                        </span>
                      </div>
                      {favorite.auction.reservePrice && (
                        <div className="flex justify-between">
                          <span className="text-slate-600 dark:text-slate-400">
                            Reserve:
                          </span>
                          <span className="text-slate-900 dark:text-slate-100">
                            {formatPrice(favorite.auction.reservePrice)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Added {new Date(favorite.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              No Favorites Yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Start browsing auctions and click the heart icon to save your
              favorite items here.
            </p>
            <Link
              href="/auctions"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
            >
              <Gavel className="h-4 w-4" />
              Browse Auctions
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
