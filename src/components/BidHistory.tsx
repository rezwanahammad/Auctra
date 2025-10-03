"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBidHistory, formatPrice, type BidHistoryItem } from "@/lib/bids";
import { Clock, TrendingUp, Users } from "lucide-react";

interface BidHistoryProps {
  auctionId: string;
  refreshTrigger?: number; // notun bid ashle refresh trigger kore
}

export default function BidHistory({
  auctionId,
  refreshTrigger,
}: BidHistoryProps) {
  const [bids, setBids] = useState<BidHistoryItem[]>([]); // storing all the bids
  const [isLoading, setIsLoading] = useState(true); // check if the loading is in progress
  const [error, setError] = useState<string | null>(null);

  //to get the history of the bids
  const loadBidHistory = useCallback(async () => {
    try {
      setError(null);
      const response = await fetchBidHistory(auctionId);
      setBids(response.bids);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load bid history";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [auctionId]);

  useEffect(() => {
    loadBidHistory();
  }, [auctionId, refreshTrigger, loadBidHistory]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Bid History
        </h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-slate-200 rounded-full dark:bg-slate-700"></div>
                <div className="space-y-1">
                  <div className="h-4 w-20 bg-slate-200 rounded dark:bg-slate-700"></div>
                  <div className="h-3 w-16 bg-slate-200 rounded dark:bg-slate-700"></div>
                </div>
              </div>
              <div className="h-4 w-16 bg-slate-200 rounded dark:bg-slate-700"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Bid History
        </h3>
        <div className="text-center text-slate-500 dark:text-slate-400 py-4">
          <p>{error}</p>
          <button
            onClick={loadBidHistory}
            className="mt-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Bid History
        </h3>
        <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <Users className="h-4 w-4" />
          <span>{bids.length} bids</span>
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center text-slate-500 dark:text-slate-400 py-8">
          <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No bids placed yet.</p>
          <p className="text-sm">Be the first to make an offer!</p>
        </div>
      ) : (
        //if there are bids then it will show here as a list
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {bids.map((bid, index) => (
            <div
              key={bid._id}
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                index === 0
                  ? "bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800"
                  : "bg-slate-50 border border-slate-200 dark:bg-slate-800/50 dark:border-slate-700"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* first letter of bidder's name */}
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index === 0
                      ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {bid.bidderId.username?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {bid.bidderId.username || "Anonymous"}
                    </span>
                    {index === 0 && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full dark:bg-green-800 dark:text-green-200">
                        Highest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(bid.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-semibold ${
                    index === 0
                      ? "text-green-700 dark:text-green-300"
                      : "text-slate-900 dark:text-slate-100"
                  }`}
                >
                  {formatPrice(bid.bidAmount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

        {/*manually added refresh button */}
      {bids.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={loadBidHistory}
            className="w-full text-center text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
          >
            Refresh bid history
          </button>
        </div>
      )}
    </div>
  );
}
