import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Bid from "@/models/Bid";
import Auction from "@/models/Auction";
import {
  Heart,
  Gavel,
  Package,
  Settings,
  TrendingUp,
  User as UserIcon,
  Crown,
} from "lucide-react";

async function getUserDashboardData(userId: string) {
  await dbConnect();

  // Get user with all profile data
  const user = await User.findById(userId).select("-hashedPassword");
  if (!user) throw new Error("User not found");

  const totalBids = await Bid.countDocuments({ bidderId: userId });
  const activeBids = await Bid.countDocuments({
    bidderId: userId,
  });

  // Get recent bids with auction info
  const recentBids = await Bid.find({ bidderId: userId })
    .populate("auctionId", "title currentBid endTime status")
    .sort({ createdAt: -1 })
    .limit(5);

  const wonAuctions = await Auction.countDocuments({
    highestBidderId: userId,
  });

  const recentWonAuctions = await Auction.find({
    highestBidderId: userId,
  })
    .populate("categoryId", "name slug")
    .sort({ updatedAt: -1 })
    .limit(5);

  let sellerStats = null;
  if (user.role === "seller") {
    const totalListings = await Auction.countDocuments({ sellerId: userId });
    const activeListings = await Auction.countDocuments({
      sellerId: userId,
      status: "active",
    });
    const soldItems = await Auction.countDocuments({
      sellerId: userId,
      status: "ended",
      winnerId: { $exists: true },
    });

    sellerStats = { totalListings, activeListings, soldItems };
  }

  return {
    user: {
      id: user._id.toString(),
      name: user.fullName || user.username || "User",
      email: user.email,
      role: user.role,
      joinedDate: user.createdAt.toISOString(),
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      verified: user.verified,
      sellerVerified: user.sellerVerified,
      stats: user.stats,
    },
    stats: {
      totalBids,
      activeBids,
      wonAuctions,
      watchlist: 0, 
    },
    sellerStats,
    recentActivity: recentBids.map((bid) => ({
      id: bid._id.toString(),
      type: "bid",
      item: bid.auctionId?.title || "Unknown Item",
      amount: bid.bidAmount,
      status: bid.auctionId?.status === "active" ? "active" : "ended",
      timestamp: bid.createdAt.toISOString(),
    })),
    recentWonAuctions: recentWonAuctions.map((auction) => ({
      id: auction._id.toString(),
      title: auction.title,
      winningBid: auction.currentBid,
      category: auction.categoryId?.name || "Uncategorized",
      endedAt: auction.endTime?.toISOString(),
      images: auction.images,
    })),
  };
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
  }).format(price);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "winning":
      return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30";
    case "won":
      return "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30";
    case "outbid":
      return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30";
    default:
      return "text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-800";
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  let dashboardData;
  try {
    dashboardData = await getUserDashboardData(session.user.id);
  } catch (error) {
    console.error("Error fetching user data:", error);
    redirect("/auth/signin");
  }

  const { user, stats, sellerStats } = dashboardData;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100 pt-20">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Dashboard
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Welcome back, {user.name}
          </p>
        </div>

        {/* User Role Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white">
            {user.role === "seller" ? (
              <>
                <Crown className="h-4 w-4" />
                Seller Account
                {user.sellerVerified && <span className="ml-1">✓</span>}
              </>
            ) : (
              <>
                <UserIcon className="h-4 w-4" />
                Buyer Account
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {user.role === "buyer" ? (
            // Buyer Stats
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                    <Gavel className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.activeBids}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Active Bids
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.wonAuctions}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Leading Bids
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                    <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.watchlist}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Watchlist
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                    <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.totalBids}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total Bids
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Seller Stats
            <>
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                    <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {sellerStats?.activeListings || 0}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Active Listings
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                    <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {sellerStats?.soldItems || 0}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Items Sold
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/30">
                    <Package className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {sellerStats?.totalListings || 0}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total Listings
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                    <Heart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {user.stats?.rating?.toFixed(1) || "0.0"}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Rating
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Recent Activity
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentActivity.length > 0 ? (
                    dashboardData.recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                            <Gavel className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {activity.item}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {formatDate(activity.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatPrice(activity.amount)}
                          </p>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(
                              activity.status
                            )}`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-500 dark:text-slate-400">
                        No recent activity yet. Start bidding on auctions!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Won Auctions */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-200 p-6 dark:border-slate-700">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Leading Bids
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {dashboardData.recentWonAuctions.length > 0 ? (
                    dashboardData.recentWonAuctions.map((auction) => (
                      <div
                        key={auction.id}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                            <Crown className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {auction.title}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {auction.category} •{" "}
                              {formatDate(auction.endedAt || "")}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            {formatPrice(auction.winningBid || 0)}
                          </p>
                          <span className="inline-block rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            Leading
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Crown className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-500 dark:text-slate-400">
                        No won auctions yet. Keep bidding to win!
                      </p>
                    </div>
                  )}
                </div>
                {dashboardData.recentWonAuctions.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <Link
                      href="/dashboard/won"
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Crown className="h-4 w-4" />
                      View All Won Auctions
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link
                  href="/auctions"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Gavel className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-slate-900 dark:text-slate-100">
                    Browse Auctions
                  </span>
                </Link>

                <Link
                  href="/buy"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Package className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-slate-900 dark:text-slate-100">
                    Buy Now Items
                  </span>
                </Link>

                <Link
                  href="/favorites"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <Heart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-slate-900 dark:text-slate-100">
                    My Watchlist
                  </span>
                </Link>

                <Link
                  href="/sell"
                  className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                >
                  <TrendingUp className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span className="text-slate-900 dark:text-slate-100">
                    Sell Items
                  </span>
                </Link>
              </div>
            </div>

            {/* Account Info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Account
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Email:
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {user.email}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Role:
                  </span>
                  <span className="text-slate-900 dark:text-slate-100 capitalize">
                    {user.role}
                    {user.role === "seller" && user.sellerVerified && (
                      <span className="ml-1 text-green-600 dark:text-green-400">
                        ✓
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">
                    Member since:
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {formatDate(user.joinedDate)}
                  </span>
                </div>
                {user.stats && (
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Success Rate:
                    </span>
                    <span className="text-slate-900 dark:text-slate-100">
                      {user.stats.totalBids > 0
                        ? Math.round(
                            (user.stats.totalWins / user.stats.totalBids) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                )}
              </div>

              <Link
                href="/settings"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings className="h-4 w-4" />
                Account Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
