import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Favorite from "@/models/Favorite";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  
  if (!session?.user?.id) {
    return res.status(200).json({ favorites: {} }); // Return empty for unauthenticated users
  }

  try {
    await dbConnect();

    const { auctionIds } = req.body;

    if (!Array.isArray(auctionIds)) {
      return res.status(400).json({ message: "auctionIds must be an array" });
    }

    // Fetch all favorites for these auctions
    const favorites = await Favorite.find({
      userId: session.user.id,
      auctionId: { $in: auctionIds },
    }).select("auctionId");

    // Create a map of auctionId -> true
    const favoritesMap: Record<string, boolean> = {};
    favorites.forEach((fav) => {
      favoritesMap[fav.auctionId.toString()] = true;
    });

    return res.status(200).json({
      success: true,
      favorites: favoritesMap,
    });
  } catch (error) {
    console.error("Check favorites error:", error);
    return res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
