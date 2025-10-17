"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Eye,
  Search,
  Filter,
  AlertTriangle,
  Ban,
  CheckCircle,
  ArrowLeft,
  Users,
  Gavel,
  BarChart3,
  Activity,
  TrendingUp,
} from "lucide-react";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "buyer" | "seller" | "admin" | "expert";
  verified: boolean;
  isActive: boolean;
  createdAt: string;
}

interface Auction {
  _id: string;
  title: string;
  description?: string;
  currentBid: number;
  startingPrice: number;
  status: string;
  sellerId: {
    firstName?: string;
    lastName?: string;
    email: string;
  };
  createdAt: string;
}

interface Analytics {
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
      createdAt: string;
    }>;
    auctions: Array<{
      _id: string;
      title: string;
      currentBid: number;
      createdAt: string;
    }>;
  };
}

export default function AdminManagementPage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/manage");
      return;
    }

    if (status === "authenticated") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users") {
        await fetchUsers();
      } else if (activeTab === "auctions") {
        await fetchAuctions();
      } else if (activeTab === "analytics") {
        await fetchAnalytics();
      }
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const params = new URLSearchParams({
      ...(filterRole !== "all" && { role: filterRole }),
      ...(searchTerm && { search: searchTerm }),
    });

    const response = await fetch(`/api/admin/users?${params}`);
    if (response.ok) {
      const data = await response.json();
      setUsers(data.users || []);
    }
  };

  const fetchAuctions = async () => {
    const params = new URLSearchParams({
      ...(filterStatus !== "all" && { status: filterStatus }),
      ...(searchTerm && { search: searchTerm }),
    });

    const response = await fetch(`/api/admin/auctions?${params}`);
    if (response.ok) {
      const data = await response.json();
      setAuctions(data.auctions || []);
    }
  };

  const fetchAnalytics = async () => {
    const response = await fetch("/api/admin/analytics");
    if (response.ok) {
      const data = await response.json();
      setAnalytics(data);
    }
  };

  const deleteUser = async (userId: string, deleteRelatedData = false) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          deleteAuctions: deleteRelatedData,
          deleteBids: deleteRelatedData,
        }),
      });

      if (response.ok) {
        setUsers(users.filter((user) => user._id !== userId));
        alert("User deleted successfully");
      } else {
        const error = await response.json();
        alert(`Failed to delete user: ${error.error}`);
      }
    } catch {
      alert("Failed to delete user");
    }
  };

  const deleteAuction = async (auctionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this auction? This will also delete all related bids."
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/auctions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId }),
      });

      if (response.ok) {
        setAuctions(auctions.filter((auction) => auction._id !== auctionId));
        alert("Auction deleted successfully");
      } else {
        const error = await response.json();
        alert(`Failed to delete auction: ${error.error}`);
      }
    } catch {
      alert("Failed to delete auction");
    }
  };

  const updateAuctionStatus = async (auctionId: string, newStatus: string) => {
    try {
      const response = await fetch("/api/admin/auctions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auctionId,
          updates: { status: newStatus },
        }),
      });

      if (response.ok) {
        const { auction } = await response.json();
        setAuctions(auctions.map((a) => (a._id === auctionId ? auction : a)));
        alert(`Auction status updated to ${newStatus}`);
      } else {
        const error = await response.json();
        alert(`Failed to update auction: ${error.error}`);
      }
    } catch {
      alert("Failed to update auction");
    }
  };

  const updateUserStatus = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, updates }),
      });

      if (response.ok) {
        const { user } = await response.json();
        setUsers(users.map((u) => (u._id === userId ? user : u)));
        alert("User updated successfully");
      } else {
        const error = await response.json();
        alert(`Failed to update user: ${error.error}`);
      }
    } catch {
      alert("Failed to update user");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading admin panel...
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 mt-20">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition"
              >
                <ArrowLeft className="h-5 w-5" />
                Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  Admin Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Manage users, auctions, and platform content
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {[
              { id: "users", label: "Users", icon: Users },
              { id: "auctions", label: "Auctions", icon: Gavel },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && fetchData()}
                    className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                {activeTab === "users" ? (
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    aria-label="Filter by user role"
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="all">All Roles</option>
                    <option value="buyer">Buyers</option>
                    <option value="seller">Sellers</option>
                    <option value="admin">Admins</option>
                  </select>
                ) : (
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    aria-label="Filter by auction status"
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="closed">Closed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                )}
                <button
                  onClick={fetchData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "users" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  User Management ({users.length})
                </h3>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-100">
                            {user.firstName} {user.lastName}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {user.email} • {user.role} • Joined{" "}
                            {formatDate(user.createdAt)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200"
                                : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200"
                            }`}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </span>
                          {user.verified && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateUserStatus(user._id, {
                              isActive: !user.isActive,
                            })
                          }
                          className={`p-2 rounded-lg transition ${
                            user.isActive
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-300"
                              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-300"
                          }`}
                          title={
                            user.isActive ? "Deactivate User" : "Activate User"
                          }
                        >
                          {user.isActive ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id, false)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 transition"
                          title="Delete User (Keep Data)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteUser(user._id, true)}
                          className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                          title="Delete User & All Data"
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "auctions" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Auction Management ({auctions.length})
                </h3>
                <div className="space-y-4">
                  {auctions.map((auction) => (
                    <div
                      key={auction._id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-slate-100">
                          {auction.title}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          By {auction.sellerId?.firstName || "Unknown"}{" "}
                          {auction.sellerId?.lastName || "Seller"} • Current
                          Bid: {formatCurrency(auction.currentBid)} • Status:{" "}
                          {auction.status} • Created:{" "}
                          {formatDate(auction.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={auction.status}
                          onChange={(e) =>
                            updateAuctionStatus(auction._id, e.target.value)
                          }
                          aria-label="Update auction status"
                          className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1 text-sm bg-white dark:bg-slate-800"
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="closed">Closed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Link
                          href={`/auctions/${auction._id}`}
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-300 transition"
                          title="View Auction"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => deleteAuction(auction._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 transition"
                          title="Delete Auction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "analytics" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Platform Analytics
                </h3>

                {analytics ? (
                  <>
                    {/* Overview Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-blue-50 dark:bg-blue-500/10 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                              Total Users
                            </p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                              {analytics.overview.totalUsers}
                            </p>
                          </div>
                          <Users className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-green-50 dark:bg-green-500/10 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                              Total Auctions
                            </p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                              {analytics.overview.totalAuctions}
                            </p>
                          </div>
                          <Gavel className="h-8 w-8 text-green-500" />
                        </div>
                      </div>

                      <div className="bg-purple-50 dark:bg-purple-500/10 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                              Active Auctions
                            </p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                              {analytics.overview.activeAuctions}
                            </p>
                          </div>
                          <Activity className="h-8 w-8 text-purple-500" />
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-500/10 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">
                              Total Sellers
                            </p>
                            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                              {analytics.overview.totalSellers}
                            </p>
                          </div>
                          <Users className="h-8 w-8 text-orange-500" />
                        </div>
                      </div>

                      <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">
                              Total Buyers
                            </p>
                            <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                              {analytics.overview.totalBuyers}
                            </p>
                          </div>
                          <Users className="h-8 w-8 text-indigo-500" />
                        </div>
                      </div>

                      <div className="bg-red-50 dark:bg-red-500/10 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                              Total Bids
                            </p>
                            <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                              {analytics.overview.totalBids}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-red-500" />
                        </div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                        <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mb-4">
                          Recent Users
                        </h4>
                        <div className="space-y-3">
                          {analytics.recent.users.slice(0, 5).map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {user.email}
                                </p>
                              </div>
                              <span className="text-xs text-slate-500">
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                        <h4 className="text-md font-semibold text-slate-900 dark:text-slate-100 mb-4">
                          Recent Auctions
                        </h4>
                        <div className="space-y-3">
                          {analytics.recent.auctions
                            .slice(0, 5)
                            .map((auction) => (
                              <div
                                key={auction._id}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {auction.title}
                                  </p>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Current Bid:{" "}
                                    {formatCurrency(auction.currentBid)}
                                  </p>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {formatDate(auction.createdAt)}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Loading analytics data...
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
