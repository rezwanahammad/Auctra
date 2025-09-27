import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { dbConnect } from "@/lib/db";
import User from "@/app/models/User";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await dbConnect();
  const user = await User.findById(session.user.id).select("-hashedPassword");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
}
