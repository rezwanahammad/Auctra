import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import {
  Heart,
  Gavel,
  Package,
  Settings,
  TrendingUp,
  Clock,
} from "lucide-react";

// Mock user data - in a real app, this would come from your database
const mockUserData = {
  id: "user-123",
  name: "John Collector",
  email: "john@example.com",
  joinedDate: "2023-05-15",
  totalBids: 24,
  wonAuctions: 6,
  activeBids: 3,
  watchlist: 8,
  recentActivity: [
    {
      id: "1",
      type: "bid",
      item: "Vintage Rolex Submariner",
      amount: 12500,
      status: "winning",
      timestamp: "2024-10-02T14:30:00Z",
    },
    {
      id: "2",
      type: "won",
      item: "Art Deco Diamond Ring",
      amount: 8750,
      status: "won",
      timestamp: "2024-10-01T20:00:00Z",
    },
    {
      id: "3",
      type: "outbid",
      item: "Mid-Century Armchair",
      amount: 2250,
      status: "outbid",
      timestamp: "2024-09-30T16:45:00Z",
    },
  ],
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
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
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/signin");
  }

  const user = mockUserData; // In a real app, fetch from database using session.user.id

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

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                <Gavel className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {user.activeBids}
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
                  {user.wonAuctions}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Won Auctions
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
                  {user.watchlist}
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
                  {user.totalBids}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Total Bids
                </p>
              </div>
            </div>
          </div>
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
                  {user.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-slate-100 p-2 dark:bg-slate-800">
                          {activity.type === "bid" && (
                            <Gavel className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          )}
                          {activity.type === "won" && (
                            <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          )}
                          {activity.type === "outbid" && (
                            <Clock className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          )}
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
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
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
                    Member since:
                  </span>
                  <span className="text-slate-900 dark:text-slate-100">
                    {formatDate(user.joinedDate)}
                  </span>
                </div>
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
