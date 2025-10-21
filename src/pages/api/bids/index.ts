import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Bid from "@/models/Bid";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return placeBid(req, res);
  }
  return res.status(405).json({ message: "Method not allowed" });
}

async function placeBid(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (session.user?.role !== "buyer") {
      return res.status(403).json({ message: "Only buyers can place bids" });
    }

    await dbConnect();

    const { auctionId, bidAmount } = req.body;
    if (!auctionId || !bidAmount) {
      return res.status(400).json({ message: "Missing auctionId or bidAmount" });
    }

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    if (auction.status !== "active") {
      return res.status(400).json({ message: "Auction is not active" });
    }

    const now = new Date();
    if (auction.startTime && now < auction.startTime) {
      return res.status(400).json({ message: "Auction has not started yet" });
    }
    if (auction.endTime && now > auction.endTime) {
      return res.status(400).json({ message: "Auction has already ended" });
    }

    const minRequired = (auction.currentBid || auction.startingPrice) + (auction.minIncrement || 1);
    if (bidAmount < minRequired) {
      return res.status(400).json({ message: `Bid must be at least ৳${minRequired}` });
    }

    // Save the bid
    const bid = await Bid.create({
      auctionId,
      bidderId: session.user.id,
      bidAmount,
    });

    // Update auction
    auction.currentBid = bidAmount;
    auction.highestBidderId = session.user.id;
    await auction.save();

    return res.status(201).json({ message: "Bid placed successfully", bid });
  } catch (error) {
    console.error("Bid error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
