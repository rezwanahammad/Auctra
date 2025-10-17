import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Auction from "@/models/Auction";
import Category from "@/models/Category";
import Bid from "@/models/Bid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await dbConnect();

    // Create categories if they don't exist
    const categories = await Category.find();
    let fineArtCategory;
    
    if (categories.length === 0) {
      const newCategories = await Category.create([
        { name: "Fine Art", slug: "fine-art" },
        { name: "Jewelry", slug: "jewelry" },
        { name: "Watches", slug: "watches" },
        { name: "Antiques", slug: "antiques" },
        { name: "Furniture", slug: "furniture" }
      ]);
      fineArtCategory = newCategories[0];
    } else {
      fineArtCategory = categories[0];
    }

    // Create test users (sellers and buyers)
    const testUsers = await User.create([
      {
        email: "john.seller@example.com",
        firstName: "John",
        lastName: "Smith",
        role: "seller",
        verified: true,
        hashedPassword: "dummy123",
      },
      {
        email: "mary.collector@example.com", 
        firstName: "Mary",
        lastName: "Johnson",
        role: "seller",
        verified: true,
        hashedPassword: "dummy123",
      },
      {
        email: "david.buyer@example.com",
        firstName: "David",
        lastName: "Wilson",
        role: "buyer",
        verified: true,
        hashedPassword: "dummy123",
      },
      {
        email: "sarah.bidder@example.com",
        firstName: "Sarah",
        lastName: "Brown",
        role: "buyer", 
        verified: true,
        hashedPassword: "dummy123",
      }
    ]);

    const [seller1, seller2, buyer1, buyer2] = testUsers;

    // Create test auctions
    const testAuctions = await Auction.create([
      {
        title: "Vintage Oil Painting - Mountain Landscape",
        description: "Beautiful 19th century oil painting depicting a serene mountain landscape. Excellent condition with original frame.",
        categoryId: fineArtCategory._id,
        sellerId: seller1._id,
        startingPrice: 500,
        currentBid: 850,
        highestBidderId: buyer1._id,
        status: "active",
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        minIncrement: 25,
      },
      {
        title: "Modern Abstract Sculpture",
        description: "Contemporary bronze sculpture by emerging artist. Limited edition piece with certificate of authenticity.",
        categoryId: fineArtCategory._id,
        sellerId: seller2._id,
        startingPrice: 300,
        currentBid: 675,
        highestBidderId: buyer2._id,
        status: "active",
        startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        minIncrement: 50,
      },
      {
        title: "Rare Antique Vase Collection",
        description: "Set of three Ming Dynasty inspired vases. Authentic pieces with detailed provenance documentation.",
        categoryId: fineArtCategory._id,
        sellerId: seller1._id,
        startingPrice: 1200,
        currentBid: 1450,
        highestBidderId: buyer1._id,
        status: "active",
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
        minIncrement: 100,
      },
      {
        title: "Digital Art NFT Collection",
        description: "Exclusive digital art collection with blockchain verification. Trending artist with growing reputation.",
        categoryId: fineArtCategory._id,
        sellerId: seller2._id,
        startingPrice: 150,
        currentBid: 0,
        status: "pending",
        startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        minIncrement: 25,
      },
      {
        title: "Vintage Photography Collection",
        description: "Black and white photography prints from 1940s-1960s. Historic documentation of city life.",
        categoryId: fineArtCategory._id,
        sellerId: seller1._id,
        startingPrice: 400,
        currentBid: 525,
        highestBidderId: buyer2._id,
        status: "ended",
        winnerId: buyer2._id,
        winningBid: 525,
        startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        endedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        minIncrement: 25,
      }
    ]);

    // Create some bids for the active auctions
    const testBids = await Bid.create([
      {
        auctionId: testAuctions[0]._id,
        bidderId: buyer1._id,
        amount: 850,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      },
      {
        auctionId: testAuctions[1]._id,
        bidderId: buyer2._id,
        amount: 675,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      },
      {
        auctionId: testAuctions[2]._id,
        bidderId: buyer1._id,
        amount: 1450,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      }
    ]);

    return res.status(200).json({
      message: "Sample auction data created successfully",
      data: {
        categories: 1,
        users: testUsers.length,
        auctions: testAuctions.length,
        bids: testBids.length,
      },
      users: testUsers.map(user => ({
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role
      })),
      auctions: testAuctions.map(auction => ({
        id: auction._id,
        title: auction.title,
        currentBid: auction.currentBid,
        status: auction.status,
        seller: auction.sellerId
      }))
    });

  } catch (error) {
    console.error("Sample data creation error:", error);
    return res.status(500).json({ 
      error: "Failed to create sample data",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}