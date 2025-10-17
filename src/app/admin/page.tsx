"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Activity,
  AlertCircle,
  BarChart3,
  Shield,
  UserCheck,
  Gavel,
} from "lucide-react";

interface DashboardData {
  overview: {
    totalUsers: number;
    totalSellers: number;
    totalBuyers: number;
    totalAuctions: number;
    activeAuctions: number;
    totalBids: number;
  };
  recent: {
    users: Array<{
      _id: string;
      firstName?: string;
      lastName?: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    auctions: Array<{
      _id: string;
      title: string;
      currentBid: number;
      status: string;
      sellerId: {
        firstName?: string;
        lastName?: string;
        email: string;
      };
      createdAt: string;
    }>;
  };
  topBidders: Array<{
    totalBids: number;
    totalAmount: number;
    bidder: {
      firstName?: string;
      lastName?: string;
      email: string;
    };
  }>;
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin");
      return;
    }

    if (status === "authenticated") {
      // Check if user has admin role (you might want to add this check)
      fetchDashboardData();
    }
  }, [status, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/analytics");

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Access Denied
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 mt-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Admin Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Welcome back, {session?.user?.name || "Administrator"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Shield className="h-4 w-4" />
                <span>Admin Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {[
            {
              title: "Total Users",
              value: data.overview.totalUsers,
              icon: Users,
              color: "bg-blue-500",
            },
            {
              title: "Sellers",
              value: data.overview.totalSellers,
              icon: UserCheck,
              color: "bg-green-500",
            },
            {
              title: "Buyers",
              value: data.overview.totalBuyers,
              icon: ShoppingBag,
              color: "bg-purple-500",
            },
            {
              title: "Total Auctions",
              value: data.overview.totalAuctions,
              icon: Gavel,
              color: "bg-orange-500",
            },
            {
              title: "Active Auctions",
              value: data.overview.activeAuctions,
              icon: Activity,
              color: "bg-red-500",
            },
            {
              title: "Total Bids",
              value: data.overview.totalBids,
              icon: TrendingUp,
              color: "bg-cyan-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {stat.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Manage Users",
              description: "View, edit and delete user accounts",
              href: "/admin/manage",
              icon: Users,
              color: "bg-blue-500",
            },
            {
              title: "Manage Auctions",
              description: "Delete, modify and oversee all auctions",
              href: "/admin/manage",
              icon: Gavel,
              color: "bg-green-500",
            },
            {
              title: "Platform Analytics",
              description: "View detailed platform metrics and statistics",
              href: "/admin/manage",
              icon: BarChart3,
              color: "bg-purple-500",
            },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-slate-300 dark:hover:border-slate-600 transition-colors group"
            >
              <div
                className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}
              >
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                {action.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                {action.description}
              </p>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Users */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Recent Users
              </h3>
              <Link
                href="/admin/manage"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Manage all →
              </Link>
            </div>
            <div className="space-y-4">
              {data.recent.users && data.recent.users.length > 0 ? (
                data.recent.users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {user.firstName || "Unknown"} {user.lastName || "User"}{" "}
                        ({user.role})
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    No users yet
                  </p>
                  <p className="text-sm text-slate-400">
                    Users will appear here once they register
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Auctions */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Recent Auctions
              </h3>
              <Link
                href="/admin/manage"
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Manage all →
              </Link>
            </div>
            <div className="space-y-4">
              {data.recent.auctions && data.recent.auctions.length > 0 ? (
                data.recent.auctions.map((auction) => (
                  <div
                    key={auction._id}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {auction.title}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        by {auction.sellerId?.firstName || "Unknown"}{" "}
                        {auction.sellerId?.lastName || "Seller"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-slate-100">
                        {formatCurrency(auction.currentBid)}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {auction.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Gavel className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-500 dark:text-slate-400">
                    No auctions yet
                  </p>
                  <button
                    onClick={() =>
                      fetch("/api/admin/create-sample-data", {
                        method: "POST",
                      }).then(() => window.location.reload())
                    }
                    className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    Create Sample Data
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Bidders */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Top Bidders
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Bidder
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Total Bids
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-slate-600 dark:text-slate-400">
                    Total Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.topBidders.map((bidder, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0"
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {bidder.bidder.firstName} {bidder.bidder.lastName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {bidder.bidder.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-900 dark:text-slate-100">
                      {bidder.totalBids}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(bidder.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
