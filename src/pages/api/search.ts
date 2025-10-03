import { NextApiRequest, NextApiResponse } from "next";
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
    await dbConnect();

    const { q, category, status, limit = 10 } = req.query;

    if (!q || typeof q !== "string" || q.trim().length < 2) {
      return res.status(400).json({ 
        message: "Search query must be at least 2 characters long" 
      });
    }

    const searchQuery = q.trim();
    const limitNum = parseInt(limit as string) || 10;

    // Build the search filter
    const filter: {
      $or: Array<{ [key: string]: { $regex: string; $options: string } }>;
      categoryId?: string;
      status?: string | { $in: string[] };
    } = {
      $or: [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ]
    };

    // Add category filter if provided
    if (category && category !== "all" && typeof category === "string") {
      filter.categoryId = category;
    }

    // Add status filter if provided
    if (status && status !== "all" && typeof status === "string") {
      filter.status = status;
    } else {
      // Default to show active auctions and buy now items
      filter.status = { $in: ["active", "draft", "pending"] };
    }

    // Search auctions
    const auctions = await Auction.find(filter)
      .populate("categoryId", "name slug")
      .populate("sellerId", "username firstName lastName")
      .select("title description startingPrice currentBid reservePrice images status endTime startTime createdAt")
      .sort({ createdAt: -1 })
      .limit(limitNum);

    const formattedResults = auctions.map((auction) => ({
      id: auction._id.toString(),
      title: auction.title,
      description: auction.description,
      startingPrice: auction.startingPrice,
      currentBid: auction.currentBid,
      reservePrice: auction.reservePrice,
      status: auction.status,
      endTime: auction.endTime,
      startTime: auction.startTime,
      images: auction.images,
      category: auction.categoryId ? {
        name: auction.categoryId.name,
        slug: auction.categoryId.slug,
      } : null,
      seller: auction.sellerId ? {
        username: auction.sellerId.username,
        firstName: auction.sellerId.firstName,
        lastName: auction.sellerId.lastName,
      } : null,
    }));

    return res.status(200).json({
      success: true,
      query: searchQuery,
      results: formattedResults,
      totalResults: formattedResults.length,
      hasMore: formattedResults.length === limitNum,
    });

  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}