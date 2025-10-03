import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAuctionById } from "@/data/marketplace";
import {
  Star,
  MapPin,
  Truck,
  Shield,
  ArrowLeft,
  Heart,
  ShoppingCart,
} from "lucide-react";

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

// Note: Removed generateStaticParams since auction data is dynamic

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const item = await getAuctionById(id);

  if (!item) {
    return {
      title: "Item not found | Auctra",
    };
  }

  return {
    title: `${item.title} | Buy Now - Auctra`,
    description: item.description,
  };
}

export default async function BuyNowItemPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const item = await getAuctionById(id);

  if (!item) {
    notFound();
  }

  const hasDiscount = item.originalPrice && item.originalPrice > item.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((item.originalPrice! - item.price) / item.originalPrice!) * 100
      )
    : 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <Link
            href="/"
            className="hover:text-slate-900 dark:hover:text-slate-200"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/buy"
            className="hover:text-slate-900 dark:hover:text-slate-200"
          >
            Buy Now
          </Link>
          <span>/</span>
          <span className="text-slate-900 dark:text-slate-100">
            {item.title}
          </span>
        </nav>

        <Link
          href="/buy"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Buy Now
        </Link>
      </div>

      {/* Item Details */}
      <div className="mx-auto max-w-6xl px-6 pb-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative h-96 sm:h-[500px] overflow-hidden rounded-2xl">
              <Image
                src={item.images[0]}
                alt={item.title}
                fill
                className="object-cover"
              />
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-semibold text-white">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {item.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {item.images.slice(1, 5).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative h-20 overflow-hidden rounded-lg"
                  >
                    <Image
                      src={image}
                      alt={`${item.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <span className="capitalize">
                  {item.category.replace("-", " ")}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </span>
              </div>

              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                {item.title}
              </h1>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{item.seller.rating}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    ({item.seller.totalSales} sales)
                  </span>
                </div>
                <Link
                  href={`/seller/${item.seller.id}`}
                  className="font-medium text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300"
                >
                  {item.seller.name}
                </Link>
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 dark:border-slate-700 dark:bg-slate-900/80">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {formatPrice(item.price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-slate-500 line-through dark:text-slate-400">
                    {formatPrice(item.originalPrice!)}
                  </span>
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                + {formatPrice(item.shippingCost)} shipping
              </p>

              <div className="flex gap-3">
                <button className="flex-1 rounded-full bg-slate-900 py-3 px-6 text-center font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                  Buy Now
                </button>
                <button
                  className="rounded-full border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Add to favorites"
                >
                  <Heart className="h-5 w-5" />
                </button>
                <button
                  className="rounded-full border border-slate-200 p-3 text-slate-600 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Item Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Item Details
              </h3>

              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Condition:
                  </span>
                  <span className="font-medium capitalize text-slate-900 dark:text-slate-100">
                    {item.condition.replace("-", " ")}
                  </span>
                </div>

                {item.material && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Material:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.material}
                    </span>
                  </div>
                )}

                {item.dimensions && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Dimensions:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.dimensions}
                    </span>
                  </div>
                )}

                {item.yearMade && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Year Made:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.yearMade}
                    </span>
                  </div>
                )}

                {item.provenance && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Provenance:
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.provenance}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Guarantees */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-slate-900 dark:text-slate-100">
                    Authenticity guaranteed
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-slate-900 dark:text-slate-100">
                    Secure shipping worldwide
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
                  <span className="text-slate-900 dark:text-slate-100">
                    14-day return policy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-12 max-w-4xl">
          <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Description
          </h3>
          <p className="text-slate-700 leading-relaxed dark:text-slate-300">
            {item.description}
          </p>
        </div>
      </div>

      {/* Related Items */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        <h2 className="mb-8 text-2xl font-semibold text-slate-900 dark:text-slate-100">
          You might also like
        </h2>
        <div className="text-center">
          <Link
            href="/buy"
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            Browse More Items
          </Link>
        </div>
      </section>
    </main>
  );
}
