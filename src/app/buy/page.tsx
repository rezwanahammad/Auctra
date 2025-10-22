"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAuctionsForBuyNow } from "@/data/marketplace";
import BuyNowModal from "@/components/BuyNowModal";
import { ShoppingCart, Heart, MapPin, Star } from "lucide-react";

function formatPrice(price: number): string {
  return `৳${price.toLocaleString()}`;
}

type FormattedAuctionItem = ReturnType<
  typeof import("@/data/marketplace").formatAuctionForBuyNow
>;

function ItemCard({
  item,
  onBuyNow,
}: {
  item: FormattedAuctionItem;
  onBuyNow: (item: FormattedAuctionItem) => void;
}) {
  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((item.originalPrice! - item.price) / item.originalPrice!) * 100
      )
    : 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
      <div className="relative h-64 overflow-hidden">
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{discountPercent}%
          </span>
        )}
        <button
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 opacity-0 transition-all hover:bg-white hover:text-red-500 group-hover:opacity-100 dark:bg-slate-800/90 dark:text-slate-300"
          aria-label="Add to favorites"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="capitalize">{item.category.replace("-", " ")}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location}
          </span>
        </div>

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
          {item.title}
        </h3>

        <p className="mb-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
          {item.description}
        </p>

        <div className="mb-3 flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{item.seller.rating}</span>
            <span>({item.seller.totalSales} sales)</span>
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {formatPrice(item.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-slate-500 line-through dark:text-slate-400">
              {formatPrice(item.originalPrice!)}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onBuyNow(item)}
            className="flex-1 rounded-full bg-slate-900 py-2 px-4 text-center text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Buy Now
          </button>
          <button
            className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            aria-label="Add to favorites"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BuyNowPage() {
  const [items, setItems] = useState<FormattedAuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FormattedAuctionItem | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Buy Now | Auctra - Immediate Purchase Available";

    async function fetchItems() {
      try {
        const fetchedItems = await getAuctionsForBuyNow();
        setItems(fetchedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchItems();
  }, []);

  const handleBuyNow = (item: FormattedAuctionItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    getAuctionsForBuyNow().then(setItems).catch(console.error);
  };

  const categories = [
    { name: "All", slug: "all", count: items.length },
    {
      name: "Fine Art",
      slug: "fine-art",
      count: items.filter(
        (i: FormattedAuctionItem) => i.category === "fine-art"
      ).length,
    },
    {
      name: "Jewelry",
      slug: "jewelry",
      count: items.filter((i: FormattedAuctionItem) => i.category === "jewelry")
        .length,
    },
    {
      name: "Watches",
      slug: "watches",
      count: items.filter((i: FormattedAuctionItem) => i.category === "watches")
        .length,
    },
    {
      name: "Furniture",
      slug: "furniture",
      count: items.filter(
        (i: FormattedAuctionItem) => i.category === "furniture"
      ).length,
    },
  ];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-64 mx-auto dark:bg-slate-700"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mx-auto dark:bg-slate-700"></div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-200 rounded-2xl h-96 dark:bg-slate-700"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      {/* Hero Section */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">
            Buy Now
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-slate-900 dark:text-slate-100">
            Skip the auction, buy immediately
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 dark:text-slate-300">
            Discover authenticated pieces available for immediate purchase. No
            waiting, no bidding wars—just exceptional items ready to ship.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-6 dark:border-slate-700">
          {categories.map((category) => (
            <button
              key={category.slug}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:border-slate-600"
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </section>

      {/* Items Grid */}
      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {items.length} items available
          </p>
          <select
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
            aria-label="Sort items by"
          >
            <option>Sort by: Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest First</option>
          </select>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item: FormattedAuctionItem) => (
            <ItemCard key={item.id} item={item} onBuyNow={handleBuyNow} />
          ))}
        </div>

        {/* Buy Now Modal */}
        {selectedItem && (
          <BuyNowModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            item={{
              id: selectedItem.id,
              title: selectedItem.title,
              images: selectedItem.images,
              buyNowPrice: selectedItem.buyNowPrice || selectedItem.price,
              seller: selectedItem.seller,
            }}
          />
        )}

        {items.length === 0 && !isLoading && (
          <div className="py-16 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-4 dark:bg-slate-800">
              <ShoppingCart className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No items available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Check back soon for new additions to our Buy Now collection.
            </p>
            <Link
              href="/auctions"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Browse Auctions Instead
            </Link>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-8 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80">
          <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Why choose Buy Now?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center dark:bg-green-900">
                <ShoppingCart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Immediate Purchase
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                No waiting for auctions to end
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center dark:bg-blue-900">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Verified Authenticity
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Every item professionally authenticated
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center dark:bg-purple-900">
                <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Curated Selection
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hand-picked by our specialists
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center dark:bg-orange-900">
                <MapPin className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                Global Shipping
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Secure delivery worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center sm:px-8 lg:px-10">
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white dark:from-slate-100 dark:to-slate-200 dark:text-slate-900">
          <h2 className="text-2xl font-semibold">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="mt-2 text-white/80 dark:text-slate-600">
            Set up alerts for specific items or categories and we&apos;ll notify
            you when they become available.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/auctions"
              className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
            >
              Browse Live Auctions
            </Link>
            <Link
              href="/alerts"
              className="rounded-full border border-white/40 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10 dark:border-slate-400 dark:text-slate-900 dark:hover:bg-slate-100/10"
            >
              Set Up Alerts
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
