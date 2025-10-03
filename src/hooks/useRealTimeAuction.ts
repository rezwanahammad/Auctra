import { useState, useEffect, useCallback } from 'react';

interface UseRealTimeAuctionProps {
  auctionId: string;
  refreshInterval?: number; // in milliseconds, default 10 seconds
}

interface AuctionData {
  currentBid: number;
  bidders: number;
  status: string;
  endTime?: Date;
}

export function useRealTimeAuction({ auctionId, refreshInterval = 10000 }: UseRealTimeAuctionProps) {
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAuctionData = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch(`/api/auctions/${auctionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch auction data');
      }
      
      const data = await response.json();
      setAuctionData({
        currentBid: data.currentBid || data.startingPrice,
        bidders: data.bidders || 0,
        status: data.status,
        endTime: data.endTime ? new Date(data.endTime) : undefined,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch auction data';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [auctionId]);

  // Manual refresh function
  const refresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Initial load and automatic refresh
  useEffect(() => {
    fetchAuctionData();

    // Set up interval for automatic refresh only if auction is active
    const interval = setInterval(() => {
      if (auctionData?.status === 'active') {
        fetchAuctionData();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [fetchAuctionData, refreshInterval, auctionData?.status]);

  // Manual refresh trigger
  useEffect(() => {
    if (refreshTrigger > 0) {
      fetchAuctionData();
    }
  }, [refreshTrigger, fetchAuctionData]);

  return {
    auctionData,
    isLoading,
    error,
    refresh,
    refreshTrigger, // For passing to BidHistory component
  };
}

// Hook for checking if user has been outbid
interface UseOutbidNotificationProps {
  auctionId: string;
  userId?: string;
}

export function useOutbidNotification({ auctionId, userId }: UseOutbidNotificationProps) {
  const [lastHighestBidderId, setLastHighestBidderId] = useState<string | null>(null);
  const [wasOutbid, setWasOutbid] = useState(false);

  //check if user has been outbid=
  const checkOutbidStatus = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/auctions/${auctionId}`);
      const data = await response.json();
      
      const currentHighestBidderId = data.highestBidderId;
      
      // Check if user was previously the highest bidder but is no longer
      if (lastHighestBidderId === userId && currentHighestBidderId !== userId) {
        setWasOutbid(true);
        // Auto-clear outbid notification after 5 seconds
        setTimeout(() => setWasOutbid(false), 5000);
      }
      
      setLastHighestBidderId(currentHighestBidderId);
    } catch (error) {
      console.error('Error checking outbid status:', error);
    }
  }, [auctionId, userId, lastHighestBidderId]);

  useEffect(() => {
    if (userId) {
      // Check every 15 seconds
      const interval = setInterval(checkOutbidStatus, 15000);
      return () => clearInterval(interval);
    }
  }, [checkOutbidStatus, userId]);

  const clearOutbidStatus = useCallback(() => {
    setWasOutbid(false);
  }, []);

  return {
    wasOutbid,
    clearOutbidStatus,
  };
}