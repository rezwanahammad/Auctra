import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import Order from "@/models/Order";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await dbConnect();

    const { type, status, limit = 10, page = 1 } = req.query;

    // Build query based on user role and filters
    interface OrderQuery {
      buyerId?: string;
      sellerId?: string;
      status?: string;
      $or?: Array<{ buyerId: string } | { sellerId: string }>;
    }
    const query: OrderQuery = {};
    
    if (type === "purchases" || !type) {
      query.buyerId = session.user.id;
    } else if (type === "sales") {
      query.sellerId = session.user.id;
    } else {
      // Both purchases and sales for the user
      query.$or = [
        { buyerId: session.user.id },
        { sellerId: session.user.id }
      ];
    }

    if (status && typeof status === 'string') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate("auctionId", "title images")
      .populate("buyerId", "username email")
      .populate("sellerId", "username email")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const totalCount = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalCount / Number(limit));

    return res.status(200).json({
      orders: orders.map(order => ({
        id: order._id,
        orderNumber: order.orderNumber,
        auction: {
          id: order.auctionId._id,
          title: order.auctionId.title,
          images: order.auctionId.images || []
        },
        buyer: {
          id: order.buyerId._id,
          username: order.buyerId.username,
          email: order.buyerId.email
        },
        seller: {
          id: order.sellerId._id,
          username: order.sellerId.username,
          email: order.sellerId.email
        },
        amount: order.amount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        shippingDetails: order.shippingDetails,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })),
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalCount,
        hasMore: Number(page) < totalPages
      }
    });

  } catch (error) {
    console.error("❌ Orders fetch error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}