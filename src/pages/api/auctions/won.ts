import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import '@/models/Category';
import '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Get auctions where the current user has the highest bid
    const wonAuctions = await Auction.find({
      highestBidderId: session.user.id,
    })
      .populate("categoryId", "name slug")
      .populate("sellerId", "username firstName lastName email")
      .sort({ endedAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await Auction.countDocuments({
      highestBidderId: session.user.id,
    });

    const formattedAuctions = wonAuctions.map((auction) => ({
      id: auction._id.toString(),
      title: auction.title,
      description: auction.description,
      category: auction.categoryId,
      seller: auction.sellerId,
      winningBid: auction.currentBid,
      startingPrice: auction.startingPrice,
      reservePrice: auction.reservePrice,
      images: auction.images,
      endedAt: auction.endTime,
      createdAt: auction.createdAt,
    }));

    return res.status(200).json({
      wonAuctions: formattedAuctions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    console.error("Won auctions fetch error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}