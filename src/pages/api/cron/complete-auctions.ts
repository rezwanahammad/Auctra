import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";
import User from "@/models/User";
import '@/models/Category';

interface CronJobResult {
  success: boolean;
  message: string;
  processedCount: number;
  completedAuctions: Array<{
    auctionId: string;
    title: string;
    winner: {
      _id: string;
      username?: string;
      email: string;
      firstName?: string;
      lastName?: string;
    } | null;
    winningBid: number | null;
    hadReserve: boolean;
    reserveMet: boolean;
  }>;
  errors: Array<{
    auctionId: string;
    title: string;
    error: string;
  }>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CronJobResult>
) {
  // Only allow POST requests from authorized sources
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
      processedCount: 0,
      completedAuctions: [],
      errors: []
    });
  }

  // Simple API key authentication for cron jobs
  const authHeader = req.headers.authorization;
  const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'default-cron-secret'}`;
  
  if (authHeader !== expectedAuth) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      processedCount: 0,
      completedAuctions: [],
      errors: []
    });
  }

  try {
    await dbConnect();

    console.log(`[CRON] Starting auction completion job at ${new Date().toISOString()}`);

    // Find all active auctions that have ended
    const expiredAuctions = await Auction.find({
      status: "active",
      endTime: { $lte: new Date() },
    }).populate("highestBidderId", "username email firstName lastName");

    if (expiredAuctions.length === 0) {
      console.log("[CRON] No auctions to complete");
      return res.status(200).json({
        success: true,
        message: "No auctions to complete",
        processedCount: 0,
        completedAuctions: [],
        errors: []
      });
    }

    console.log(`[CRON] Found ${expiredAuctions.length} expired auctions to process`);

    const completedAuctions = [];
    const errors = [];

    for (const auction of expiredAuctions) {
      try {
        console.log(`[CRON] Processing auction: ${auction.title} (${auction._id})`);

        // Check if there are any bids for this auction
        const highestBid = await Bid.findOne({
          auctionId: auction._id,
        }).sort({ bidAmount: -1, createdAt: -1 });

        const updateData: {
          status: string;
          endedAt: Date;
          winnerId?: string;
          winningBid?: number;
        } = {
          status: "ended",
          endedAt: new Date(),
        };

        // If there's a highest bid and it meets reserve price (if set)
        if (highestBid && 
            (!auction.reservePrice || highestBid.bidAmount >= auction.reservePrice)) {
          
          updateData.winnerId = highestBid.bidderId.toString();
          updateData.winningBid = highestBid.bidAmount;

          console.log(`[CRON] Auction has winner: ${highestBid.bidderId} with bid ${highestBid.bidAmount}`);

          // Update winner's statistics
          await User.findByIdAndUpdate(
            highestBid.bidderId,
            {
              $inc: {
                "stats.totalWins": 1,
                "stats.successfulTransactions": 1,
              },
            }
          );

          // Update seller's statistics
          await User.findByIdAndUpdate(
            auction.sellerId,
            {
              $inc: {
                "stats.totalSales": 1,
                "stats.successfulTransactions": 1,
              },
            }
          );
        } else {
          console.log(`[CRON] Auction ended without winner (no bids or reserve not met)`);
        }

        // Update auction with completion data
        const updatedAuction = await Auction.findByIdAndUpdate(
          auction._id,
          updateData,
          { new: true }
        ).populate("winnerId", "username email firstName lastName");

        completedAuctions.push({
          auctionId: auction._id.toString(),
          title: auction.title,
          winner: updatedAuction?.winnerId || null,
          winningBid: updatedAuction?.winningBid || null,
          hadReserve: !!auction.reservePrice,
          reserveMet: !auction.reservePrice || (highestBid?.bidAmount >= auction.reservePrice),
        });

        console.log(`[CRON] Successfully completed auction: ${auction.title}`);

      } catch (error) {
        console.error(`[CRON] Error completing auction ${auction._id}:`, error);
        errors.push({
          auctionId: auction._id.toString(),
          title: auction.title,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    const result = {
      success: true,
      message: `Processed ${completedAuctions.length + errors.length} auctions. ${completedAuctions.length} completed successfully, ${errors.length} failed.`,
      processedCount: completedAuctions.length,
      completedAuctions,
      errors,
    };

    console.log(`[CRON] Auction completion job finished:`, result);

    return res.status(200).json(result);

  } catch (error) {
    console.error("[CRON] Auction completion job failed:", error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
      processedCount: 0,
      completedAuctions: [],
      errors: []
    });
  }
}