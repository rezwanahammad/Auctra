"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  placeBid,
  calculateMinimumBid,
  validateBidAmount,
  formatPrice,
  formatTimeRemaining,
  isAuctionActive,
} from "@/lib/bids";
import {
  useRealTimeAuction,
  useOutbidNotification,
} from "@/hooks/useRealTimeAuction";
import { useToastHelpers } from "@/components/Toast";
type FormattedAuctionItem = ReturnType<
  typeof import("@/data/marketplace").formatAuctionForBuyNow
>;
import { Gavel, TrendingUp, Clock, Users, AlertCircle } from "lucide-react";

interface BiddingPanelProps {
  auction: FormattedAuctionItem;
  onBidSuccess?: (refreshTrigger: number) => void;
  onBuyNow?: () => void;
}

export default function BiddingPanel({
  auction,
  onBidSuccess,
  onBuyNow,
}: BiddingPanelProps) {
  const { data: session } = useSession();
  const [bidAmount, setBidAmount] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState<string | null>(null);
  const { success, error: toastError, warning } = useToastHelpers();

  // Real-time auction data
  const { auctionData, refresh, refreshTrigger } = useRealTimeAuction({
    auctionId: auction.id,
    refreshInterval: 10000, // 10 seconds
  });

  // Outbid notifications
  const { wasOutbid, clearOutbidStatus } = useOutbidNotification({
    auctionId: auction.id,
    userId: session?.user?.id,
  });

  // Use real-time data if available, fallback to prop data
  const currentBid =
    auctionData?.currentBid || auction.currentBid || auction.startingBid;
  const bidders = auctionData?.bidders || auction.bidders;
  const status = auctionData?.status || auction.status;
  const endTime = auctionData?.endTime || auction.endTime;

  const minimumBid = calculateMinimumBid(currentBid, 100); // $100 minimum increment
  const timeRemaining = endTime
    ? formatTimeRemaining(endTime.toString())
    : "Auction ended";
  const auctionActive = isAuctionActive({ status, endTime });
  const hasReserve = auction.reservePrice && currentBid < auction.reservePrice;

  const handlePlaceBid = async () => {
    if (!session) return;

    const amount = parseFloat(bidAmount);
    if (!validateBidAmount(amount, minimumBid)) {
      setBidError(`Bid must be at least ${formatPrice(minimumBid)}`);
      return;
    }

    setIsPlacingBid(true);
    setBidError(null);

    try {
      await placeBid(auction.id, amount);

      // Show success toast
      success(
        "Bid Placed Successfully!",
        `Your bid of ${formatPrice(amount)} has been placed.`
      );

      setBidAmount("");

      // Refresh auction data immediately
      refresh();

      // Call parent callback to refresh auction data
      if (onBidSuccess) {
        onBidSuccess(refreshTrigger);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to place bid";
      setBidError(errorMessage);
      toastError("Failed to Place Bid", errorMessage);
    } finally {
      setIsPlacingBid(false);
    }
  };

  // Show outbid notification
  if (wasOutbid) {
    warning(
      "You've been outbid!",
      "Someone has placed a higher bid. Place a new bid to stay in the auction."
    );
    clearOutbidStatus();
  }

  return (
    <div className="sticky top-24 space-y-6">
      {/* Current Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Current Bid
          </span>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Users className="h-4 w-4" />
            <span>{bidders} bidders</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {formatPrice(currentBid)}
          </div>
          {hasReserve && (
            <p className="text-sm text-orange-600 dark:text-orange-400">
              Reserve not yet met
            </p>
          )}
        </div>

        <div className="mb-4 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Clock className="h-4 w-4" />
            <span>{timeRemaining}</span>
          </div>
          {auction.buyNowPrice && (
            <div className="text-slate-600 dark:text-slate-400">
              Buy Now: {formatPrice(auction.buyNowPrice)}
            </div>
          )}
        </div>

        {/* Error and Success Messages */}
        {bidError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{bidError}</span>
          </div>
        )}

        {/* Bidding Form */}
        {auctionActive ? (
          session ? (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="bidAmount"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
                >
                  Your Bid (minimum {formatPrice(minimumBid)})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
                    $
                  </span>
                  <input
                    id="bidAmount"
                    type="number"
                    min={minimumBid}
                    step="100"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="w-full rounded-full border border-slate-200 bg-white pl-8 pr-4 py-2 text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                    placeholder={minimumBid.toString()}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePlaceBid}
                  disabled={
                    !bidAmount ||
                    parseFloat(bidAmount) < minimumBid ||
                    isPlacingBid
                  }
                  className="flex-1 rounded-full bg-slate-900 py-2 px-4 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  {isPlacingBid ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Placing Bid...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Gavel className="h-4 w-4" />
                      Place Bid
                    </div>
                  )}
                </button>

                {auction.canBuyNow && onBuyNow && (
                  <button
                    onClick={onBuyNow}
                    className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100 hover:border-green-300 dark:border-green-700 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/40"
                  >
                    Buy Now: ৳{auction.buyNowPrice?.toLocaleString()}
                  </button>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                By placing a bid, you agree to our Terms of Service and
                acknowledge our bidding policies.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                Sign in to place bids
              </p>
              <div className="flex gap-3">
                <Link
                  href="/auth/signin"
                  className="flex-1 rounded-full bg-slate-900 py-2 px-4 text-center font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="flex-1 rounded-full border border-slate-200 py-2 px-4 text-center font-medium text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Register
                </Link>
              </div>
            </div>
          )
        ) : (
          <div className="text-center p-4 border border-slate-200 rounded-xl bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
            <p className="font-medium text-slate-900 dark:text-slate-100">
              Auction Ended
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Final bid: {formatPrice(currentBid)}
            </p>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Auction Stats
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              Starting Bid:
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formatPrice(auction.startingBid)}
            </span>
          </div>
          {auction.reservePrice && (
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">
                Reserve:
              </span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {formatPrice(auction.reservePrice)}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">Bidders:</span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {auction.bidders}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600 dark:text-slate-400">
              Shipping:
            </span>
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {formatPrice(auction.shippingCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Seller Info */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Seller
        </h3>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              {auction.seller.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">
              {auction.seller.name}
            </p>
            <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
              <TrendingUp className="h-3 w-3" />
              <span>
                {auction.seller.rating} rating • {auction.seller.totalSales}{" "}
                sales
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
