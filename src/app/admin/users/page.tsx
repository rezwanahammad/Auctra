"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "buyer" | "seller" | "admin" | "expert";
  verified: boolean;
  sellerVerified: boolean;
  isActive: boolean;
  createdAt: string;
  stats?: {
    totalBids: number;
    totalWins: number;
    totalSales: number;
  };
}

interface UsersData {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function AdminUsersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<UsersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(roleFilter !== "all" && { role: roleFilter }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`/api/admin/users?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [currentPage, roleFilter, searchTerm]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/admin/users");
      return;
    }

    if (status === "authenticated") {
      fetchUsers();
    }
  }, [status, router, currentPage, roleFilter, searchTerm, fetchUsers]);

  const updateUserStatus = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      // Refresh the users list
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading users...</p>
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
            Error Loading Users
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200";
      case "seller":
        return "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200";
      case "buyer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200";
      case "expert":
        return "bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200";
      default:
        return "bg-slate-100 text-slate-800 dark:bg-slate-500/20 dark:text-slate-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 mt-8">
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
                  User Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">
                  Manage all platform users and their permissions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                aria-label="Filter by role"
                className="border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="buyer">Buyers</option>
                <option value="seller">Sellers</option>
                <option value="admin">Admins</option>
                <option value="expert">Experts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Users ({data.pagination.total})
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="text-left py-3 px-6 font-medium text-slate-600 dark:text-slate-400">
                    User
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600 dark:text-slate-400">
                    Role
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600 dark:text-slate-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600 dark:text-slate-400">
                    Stats
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600 dark:text-slate-400">
                    Joined
                  </th>
                  <th className="text-left py-3 px-6 font-medium text-slate-600 dark:text-slate-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? "bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200"
                          }`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                        {user.verified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">
                            Verified
                          </span>
                        )}
                        {user.role === "seller" && user.sellerVerified && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200">
                            Seller Verified
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {user.stats && (
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          <div>Bids: {user.stats.totalBids}</div>
                          <div>Wins: {user.stats.totalWins}</div>
                          {user.role === "seller" && (
                            <div>Sales: {user.stats.totalSales}</div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateUserStatus(user._id, {
                              isActive: !user.isActive,
                            })
                          }
                          className={`p-2 rounded-lg text-sm font-medium transition ${
                            user.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-500/20 dark:text-red-300 dark:hover:bg-red-500/30"
                              : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-500/20 dark:text-green-300 dark:hover:bg-green-500/30"
                          }`}
                        >
                          {user.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() =>
                            updateUserStatus(user._id, {
                              verified: !user.verified,
                            })
                          }
                          className={`p-2 rounded-lg text-sm font-medium transition ${
                            user.verified
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-500/20 dark:text-orange-300 dark:hover:bg-orange-500/30"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-500/30"
                          }`}
                        >
                          {user.verified ? "Unverify" : "Verify"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.pagination.pages > 1 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Showing{" "}
                  {(data.pagination.page - 1) * data.pagination.limit + 1} to{" "}
                  {Math.min(
                    data.pagination.page * data.pagination.limit,
                    data.pagination.total
                  )}{" "}
                  of {data.pagination.total} users
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400">
                    Page {currentPage} of {data.pagination.pages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === data.pagination.pages}
                    aria-label="Next page"
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
