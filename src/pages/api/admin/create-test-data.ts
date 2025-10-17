import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/Auction";
import Category from "@/models/Category";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Create a test user (seller)
    const testUser = await User.create({
      email: "testseller@example.com",
      firstName: "Test",
      lastName: "Seller",
      role: "seller",
      verified: true,
      hashedPassword: "dummy", // You should hash this in production
    });

    // Create a category if it doesn't exist
    let category = await Category.findOne({ slug: "fine-art" });
    if (!category) {
      category = await Category.create({
        name: "Fine Art",
        slug: "fine-art"
      });
    }

    // Create test auctions
    const testAuctions = await Auction.create([
      {
        title: "Vintage Painting Collection",
        description: "Beautiful collection of vintage paintings from the 19th century",
        categoryId: category._id,
        sellerId: testUser._id,
        startingPrice: 500,
        currentBid: 750,
        status: "active",
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      },
      {
        title: "Modern Art Sculpture",
        description: "Contemporary sculpture by emerging artist",
        categoryId: category._id,
        sellerId: testUser._id,
        startingPrice: 200,
        currentBid: 450,
        status: "active",
        startTime: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      },
      {
        title: "Antique Jewelry Set",
        description: "Rare antique jewelry from Victorian era",
        categoryId: category._id,
        sellerId: testUser._id,
        startingPrice: 1000,
        currentBid: 1250,
        status: "pending",
        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      }
    ]);

    return res.status(200).json({
      message: "Test data created successfully",
      user: {
        id: testUser._id,
        email: testUser.email,
        name: `${testUser.firstName} ${testUser.lastName}`
      },
      category: {
        id: category._id,
        name: category.name,
        slug: category.slug
      },
      auctions: testAuctions.map(auction => ({
        id: auction._id,
        title: auction.title,
        currentBid: auction.currentBid,
        status: auction.status
      }))
    });

  } catch (error) {
    console.error("Test data creation error:", error);
    return res.status(500).json({ error: "Failed to create test data" });
  }
}