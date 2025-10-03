"use client";

import { useState } from "react";
import BiddingPanel from "@/components/BiddingPanel";
import BidHistory from "@/components/BidHistory";
import BuyNowModal from "@/components/BuyNowModal";
import { canBuyNow, getBuyNowPrice } from "@/data/marketplace";

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
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  // Create auction object for marketplace functions
  const auctionForMarketplace = {
    _id: auction.id,
    status: auction.status,
    endTime: auction.endTime ? new Date(auction.endTime) : undefined,
    title: auction.title,
    startingPrice: auction.startingPrice,
    currentBid: auction.currentBid,
    reservePrice: auction.reservePrice,
    description: auction.description,
    images: auction.images,
    minIncrement: auction.minIncrement,
    categoryId: auction.category
      ? {
          _id: auction.category.id,
          name: auction.category.name,
          slug: auction.category.slug,
        }
      : undefined,
    sellerId: auction.seller
      ? {
          _id: auction.seller.id,
          username: auction.seller.username,
        }
      : undefined,
    startTime: auction.startTime ? new Date(auction.startTime) : undefined,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Check if this auction can be bought now
  const auctionCanBuyNow = canBuyNow(auctionForMarketplace);
  const buyNowPrice = getBuyNowPrice(auctionForMarketplace);

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
    buyNowPrice,
    bidders: 0, // This will be updated by real-time data
    seller: {
      id: auction.seller?.id || "",
      name: auction.seller?.username || "Anonymous Seller",
      rating: 4.5,
      totalSales: 0,
    },
    status: auction.status,
    canBuyNow: auctionCanBuyNow,
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

  const handleBuyNowClick = () => {
    setIsBuyNowModalOpen(true);
  };

  const handleBuyNowModalClose = () => {
    setIsBuyNowModalOpen(false);
    // Refresh the page or redirect after purchase
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Bidding Panel */}
        <div className="lg:col-span-2">
          <BiddingPanel
            auction={formattedAuction}
            onBidSuccess={handleBidSuccess}
            onBuyNow={auctionCanBuyNow ? handleBuyNowClick : undefined}
          />
        </div>

        {/* Bid History */}
        <div className="lg:col-span-1">
          <BidHistory auctionId={auction.id} refreshTrigger={refreshTrigger} />
        </div>
      </div>

      {/* Buy Now Modal */}
      <BuyNowModal
        isOpen={isBuyNowModalOpen}
        onClose={handleBuyNowModalClose}
        item={{
          id: auction.id,
          title: auction.title,
          images: auction.images?.map((img) => img.url || "") || [
            "/images/placeholder.jpg",
          ],
          buyNowPrice,
          seller: {
            name: auction.seller?.username || "Anonymous Seller",
            rating: 4.5,
          },
        }}
      />
    </>
  );
}
