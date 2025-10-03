import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";
import User from "@/models/User";
import '@/models/Category';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Find all active auctions that have ended
    const expiredAuctions = await Auction.find({
      status: "active",
      endTime: { $lte: new Date() },
    }).populate("highestBidderId", "username email firstName lastName");

    if (expiredAuctions.length === 0) {
      return res.status(200).json({ 
        message: "No auctions to complete",
        processedCount: 0 
      });
    }

    const completedAuctions = [];
    const errors = [];

    for (const auction of expiredAuctions) {
      try {
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
        }

        // Update auction with completion data
        const updatedAuction = await Auction.findByIdAndUpdate(
          auction._id,
          updateData,
          { new: true }
        ).populate("winnerId", "username email firstName lastName");

        completedAuctions.push({
          auctionId: auction._id,
          title: auction.title,
          winner: updatedAuction.winnerId || null,
          winningBid: updatedAuction.winningBid || null,
          hadReserve: !!auction.reservePrice,
          reserveMet: !auction.reservePrice || (highestBid?.bidAmount >= auction.reservePrice),
        });

      } catch (error) {
        console.error(`Error completing auction ${auction._id}:`, error);
        errors.push({
          auctionId: auction._id,
          title: auction.title,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return res.status(200).json({
      message: "Auction completion process finished",
      processedCount: completedAuctions.length,
      completedAuctions,
      errors,
    });

  } catch (error) {
    console.error("Auction completion error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}