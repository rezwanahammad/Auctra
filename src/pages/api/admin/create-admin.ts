import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Admin from "@/models/Admin";
import { hash } from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await dbConnect();

    // Check if admin already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create admin user
    const adminUser = new User({
      email,
      hashedPassword,
      firstName,
      lastName,
      role: "admin",
      verified: true,
      isActive: true,
      preferences: {
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
      },
      stats: {
        totalBids: 0,
        totalWins: 0,
        totalSales: 0,
        successfulTransactions: 0,
        rating: 0,
        ratingCount: 0,
      },
    });

    await adminUser.save();

    // Create admin profile
    const adminProfile = new Admin({
      userId: adminUser._id,
      permissions: {
        manageUsers: true,
        manageAuctions: true,
        manageBids: true,
        managePayments: true,
        viewAnalytics: true,
        systemSettings: true,
      },
      isActive: true,
    });

    await adminProfile.save();

    return res.status(200).json({
      message: "Admin user created successfully",
      adminId: adminUser._id,
    });
  } catch (error) {
    console.error("Create admin error:", error);
    return res.status(500).json({ error: "Failed to create admin user" });
  }
}