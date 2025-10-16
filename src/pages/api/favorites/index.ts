import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Favorite from "@/models/Favorite";
import Auction from "@/models/Auction";
import '@/models/Category';
import '@/models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();

  // GET - Fetch all favorites for the current user
  if (req.method === "GET") {
    try {
      const favorites = await Favorite.find({ userId: session.user.id })
        .populate({
          path: "auctionId",
          populate: [
            { path: "categoryId", select: "name slug" },
            { path: "sellerId", select: "username firstName lastName" }
          ]
        })
        .sort({ createdAt: -1 });

      const formattedFavorites = favorites
        .filter(fav => fav.auctionId) // Filter out favorites with deleted auctions
        .map((favorite) => ({
          favoriteId: favorite._id.toString(),
          auction: {
            id: favorite.auctionId._id.toString(),
            title: favorite.auctionId.title,
            description: favorite.auctionId.description,
            startingPrice: favorite.auctionId.startingPrice,
            currentBid: favorite.auctionId.currentBid,
            reservePrice: favorite.auctionId.reservePrice,
            status: favorite.auctionId.status,
            endTime: favorite.auctionId.endTime,
            startTime: favorite.auctionId.startTime,
            images: favorite.auctionId.images,
            category: favorite.auctionId.categoryId ? {
              name: favorite.auctionId.categoryId.name,
              slug: favorite.auctionId.categoryId.slug,
            } : null,
            seller: favorite.auctionId.sellerId ? {
              username: favorite.auctionId.sellerId.username,
              firstName: favorite.auctionId.sellerId.firstName,
              lastName: favorite.auctionId.sellerId.lastName,
            } : null,
          },
          addedAt: favorite.createdAt,
        }));

      return res.status(200).json({
        success: true,
        favorites: formattedFavorites,
        totalCount: formattedFavorites.length,
      });
    } catch (error) {
      console.error("Fetch favorites error:", error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // POST - Add an auction to favorites
  if (req.method === "POST") {
    try {
      const { auctionId } = req.body;

      if (!auctionId) {
        return res.status(400).json({ message: "Auction ID is required" });
      }

      // Check if auction exists
      const auction = await Auction.findById(auctionId);
      if (!auction) {
        return res.status(404).json({ message: "Auction not found" });
      }

      // Check if already favorited
      const existingFavorite = await Favorite.findOne({
        userId: session.user.id,
        auctionId,
      });

      if (existingFavorite) {
        return res.status(200).json({
          success: true,
          message: "Auction already in favorites",
          favoriteId: existingFavorite._id.toString(),
        });
      }

      // Create new favorite
      const favorite = await Favorite.create({
        userId: session.user.id,
        auctionId,
      });

      return res.status(201).json({
        success: true,
        message: "Auction added to favorites",
        favoriteId: favorite._id.toString(),
      });
    } catch (error) {
      console.error("Add favorite error:", error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  // DELETE - Remove an auction from favorites
  if (req.method === "DELETE") {
    try {
      const { auctionId } = req.query;

      if (!auctionId || typeof auctionId !== "string") {
        return res.status(400).json({ message: "Auction ID is required" });
      }

      const result = await Favorite.findOneAndDelete({
        userId: session.user.id,
        auctionId,
      });

      if (!result) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      return res.status(200).json({
        success: true,
        message: "Auction removed from favorites",
      });
    } catch (error) {
      console.error("Remove favorite error:", error);
      return res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
