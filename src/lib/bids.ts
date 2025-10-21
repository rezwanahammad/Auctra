// Bidding utility functions for the auction system

export interface BidRequest {
  auctionId: string;
  bidAmount: number;
}

export interface BidResponse {
  message: string;
  bid?: {
    _id: string;
    auctionId: string;
    bidderId: string;
    bidAmount: number;
    createdAt: Date;
  };
}

export interface BidHistoryItem {
  _id: string;
  auctionId: string;
  bidderId: {
    _id: string;
    username: string;
    email: string;
  };
  bidAmount: number;
  createdAt: Date;
}

export interface BidHistoryResponse {
  bids: BidHistoryItem[];
}

/**
 * Place a bid on an auction
 */
export async function placeBid(auctionId: string, bidAmount: number): Promise<BidResponse> {
  try {
    const response = await fetch('/api/bids', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auctionId,
        bidAmount,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to place bid');
    }

    return data;
  } catch (error) {
    console.error('Error placing bid:', error);
    throw error;
  }
}


 // Fetch bid history for an auction

export async function fetchBidHistory(auctionId: string): Promise<BidHistoryResponse> {
  try {
    const response = await fetch(`/api/auctions/${auctionId}/bids`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch bid history');
    }

    return data;
  } catch (error) {
    console.error('Error fetching bid history:', error);
    throw error;
  }
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'BDT',
  }).format(price);
}

/**
 * Calculate minimum bid amount
 */
export function calculateMinimumBid(currentBid: number, minIncrement: number = 100): number {
  return currentBid + minIncrement;
}

/**
 * Validate bid amount
 */
export function validateBidAmount(bidAmount: number, minimumBid: number): boolean {
  return bidAmount >= minimumBid && bidAmount > 0;
}

/**
 * Format time remaining until auction ends
 */
export function formatTimeRemaining(endTime: string | Date): string {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Auction ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24)); //1 second = 1000 ms
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/**
 * Check if auction is still active
 */
export function isAuctionActive(auction: { status: string; endTime?: string | Date }): boolean {
  if (auction.status !== 'active') return false;
  
  if (auction.endTime) {
    const now = new Date();
    const end = new Date(auction.endTime);
    return end > now;
  }
  
  return true;
}