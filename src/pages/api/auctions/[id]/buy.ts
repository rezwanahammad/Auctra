import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Auction from "@/models/Auction";
import Order from "@/models/Order";
import User from "@/models/User";
import { getBuyNowPrice, canBuyNow } from "@/data/marketplace";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.query;
    const { shippingAddress, paymentMethod = "card" } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    await dbConnect();

    // Get fresh auction data
    const auction = await Auction.findById(id).populate("sellerId", "username email");
    if (!auction) {
      return res.status(404).json({ message: "Auction not found" });
    }

    // Verify user can buy this auction
    if (auction.sellerId._id.toString() === session.user.id) {
      return res.status(400).json({ message: "Cannot buy your own auction" });
    }

    // Check if auction is available for buy now
    if (!canBuyNow(auction)) {
      return res.status(409).json({ 
        message: "This auction is no longer available for Buy Now" 
      });
    }

    // Check if order already exists (race condition protection)
    const existingOrder = await Order.findOne({ auctionId: id });
    if (existingOrder) {
      return res.status(409).json({ message: "Item already sold" });
    }

    const buyNowPrice = getBuyNowPrice(auction);
    const shippingCost = 50; // Default shipping cost
    const totalAmount = buyNowPrice + shippingCost;

    // Atomic auction update - only update if still active
    const updatedAuction = await Auction.findOneAndUpdate(
      { 
        _id: auction._id, 
        status: "active",
        $or: [
          { endTime: { $gt: new Date() } },
          { endTime: { $exists: false } }
        ]
      },
      {
        $set: {
          status: "sold",
          finalPrice: buyNowPrice,
          buyerId: session.user.id,
          endTime: new Date(),
          soldVia: "buy_now",
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!updatedAuction) {
      return res.status(409).json({ 
        message: "Unable to complete purchase. Item may have been sold or auction ended." 
      });
    }

    // Create order record
    const order = await Order.create({
      auctionId: updatedAuction._id,
      buyerId: session.user.id,
      sellerId: auction.sellerId._id,
      amount: totalAmount,
      status: "pending_payment",
      paymentMethod,
      shippingDetails: {
        address: shippingAddress,
        method: "standard",
        cost: shippingCost
      }
    });

    // Update user statistics
    await User.findByIdAndUpdate(session.user.id, {
      $inc: { 
        "stats.successfulTransactions": 1 
      },
      $set: {
        lastLogin: new Date()
      }
    });

    // Update seller statistics
    await User.findByIdAndUpdate(auction.sellerId._id, {
      $inc: { 
        "stats.totalSales": 1,
        "stats.successfulTransactions": 1
      }
    });

    return res.status(201).json({
      message: "Purchase successful!",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        amount: order.amount,
        status: order.status,
        createdAt: order.createdAt
      },
      auction: {
        id: updatedAuction._id,
        title: updatedAuction.title,
        finalPrice: updatedAuction.finalPrice,
        status: updatedAuction.status
      }
    });

  } catch (error) {
    console.error("❌ Buy now error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}