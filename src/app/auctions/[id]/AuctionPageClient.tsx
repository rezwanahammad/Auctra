"use client";

import { useState } from "react";
import BiddingPanel from "@/components/BiddingPanel";
import BidHistory from "@/components/BidHistory";

interface AuctionPageClientProps {
  auction: {
    id: string;
    title: string;
    description?: string;
    startingPrice: number;
    currentBid: number;
    reservePrice?: number;
    minIncrement: number;
    status: string;
    startTime?: string;
    endTime?: string;
    category?: {
      id: string;
      name: string;
      slug: string;
    };
    seller?: {
      id: string;
      username?: string;
    };
    images?: Array<{ url?: string; alt?: string }>;
  };
}

export default function AuctionPageClient({ auction }: AuctionPageClientProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Convert auction data to format expected by BiddingPanel
  const formattedAuction = {
    id: auction.id,
    title: auction.title,
    description: auction.description || "",
    images: auction.images?.map((img) => img.url || "") || [
      "/images/placeholder.jpg",
    ],
    category: auction.category?.slug || "general",
    condition: "good",
    price: auction.reservePrice || auction.currentBid * 1.2,
    originalPrice: auction.reservePrice,
    currentBid: auction.currentBid,
    startingPrice: auction.startingPrice,
    startingBid: auction.startingPrice,
    reservePrice: auction.reservePrice,
    buyNowPrice: auction.reservePrice || auction.currentBid * 1.2,
    bidders: 0, // This will be updated by real-time data
    seller: {
      id: auction.seller?.id || "",
      name: auction.seller?.username || "Anonymous Seller",
      rating: 4.5,
      totalSales: 0,
    },
    status: auction.status,
    canBuyNow: auction.status === "active",
    endTime: auction.endTime ? new Date(auction.endTime) : undefined,
    location: "Location not specified",
    shippingCost: 50,
    material: undefined as string | undefined,
    dimensions: undefined as string | undefined,
    yearMade: undefined as string | undefined,
    provenance: undefined as string | undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleBidSuccess = (newRefreshTrigger: number) => {
    setRefreshTrigger(newRefreshTrigger);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Bidding Panel */}
      <div className="lg:col-span-2">
        <BiddingPanel
          auction={formattedAuction}
          onBidSuccess={handleBidSuccess}
        />
      </div>

      {/* Bid History */}
      <div className="lg:col-span-1">
        <BidHistory auctionId={auction.id} refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
}
