// Marketplace utilities to work with existing auction system

// Type definitions that match your existing auction models
export interface AuctionItem {
  _id: string;
  title: string;
  description?: string;
  startingPrice: number;
  currentBid?: number;
  reservePrice?: number;
  status: string;
  startTime?: Date;
  endTime?: Date;
  images?: { url?: string; alt?: string }[];
  minIncrement?: number;
  categoryId?: {
    _id: string;
    name: string;
    slug: string;
  };
  sellerId?: {
    _id: string;
    username?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BidItem {
  _id: string;
  auctionId: string;
  bidderId: string;
  bidAmount: number;
  createdAt: Date;
}

// Helper functions to work with auction data for Buy Now functionality
export function canBuyNow(auction: AuctionItem): boolean {
  // Items can be bought immediately if:
  // 1. Auction is active
  // 2. Current bid is less than reserve (if set) or no reserve
  // 3. Not yet ended
  const now = new Date();
  const isActive = auction.status === 'active';
  const notEnded = !auction.endTime || new Date(auction.endTime) > now;
  
  return isActive && notEnded;
}

export function getBuyNowPrice(auction: AuctionItem): number {
  // For Buy Now, use reserve price if set, otherwise current bid + 40%
  if (auction.reservePrice) {
    return auction.reservePrice;
  }
  
  const currentPrice = auction.currentBid || auction.startingPrice;
  return Math.round(currentPrice * 3); // 3x above current bid
}

export function formatAuctionForBuyNow(auction: AuctionItem) {
  return {
    id: auction._id,
    title: auction.title,
    description: auction.description || '',
    images: auction.images?.map(img => img.url || '') || ['/images/placeholder.jpg'],
    category: auction.categoryId?.slug || 'general',
    condition: 'good', // Default condition
    price: getBuyNowPrice(auction),
    originalPrice: auction.reservePrice,
    currentBid: auction.currentBid || auction.startingPrice,
    startingPrice: auction.startingPrice,
    // For BiddingPanel compatibility
    startingBid: auction.startingPrice,
    reservePrice: auction.reservePrice,
    buyNowPrice: getBuyNowPrice(auction),
    bidders: 0, // Default - 
    seller: {
      id: auction.sellerId?._id || '',
      name: auction.sellerId?.username || 'Anonymous Seller',
      rating: 4.5, // Default rating 
      totalSales: 0 // Default
    },
    status: auction.status,
    canBuyNow: canBuyNow(auction),
    endTime: auction.endTime,
    location: 'Location not specified', 
    shippingCost: 150, // Default shipping 
    // Optional fields
    material: undefined as string | undefined,
    dimensions: undefined as string | undefined,
    yearMade: undefined as string | undefined,
    provenance: undefined as string | undefined,
    createdAt: auction.createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: auction.updatedAt?.toISOString() || new Date().toISOString()
  };
}

// API functions to fetch auction data for Buy Now functionality

export async function getAuctionsForBuyNow() {
  try {
    const response = await fetch('/api/auctions?status=active');
    const auctions = await response.json();
    
    // Filter and format auctions that can be bought immediately
    return auctions
      .filter((auction: AuctionItem) => canBuyNow(auction))
      .map((auction: AuctionItem) => formatAuctionForBuyNow(auction));
  } catch (error) {
    console.error('Error fetching auctions for buy now:', error);
    return [];
  }
}

export async function getAuctionById(id: string) {
  try {
    const response = await fetch(`/api/auctions/${id}`);
    const auction = await response.json();
    
    if (!auction) return null;
    
    return formatAuctionForBuyNow(auction);
  } catch (error) {
    console.error('Error fetching auction:', error);
    return null;
  }
}