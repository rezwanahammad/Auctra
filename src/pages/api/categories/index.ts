import type { NextApiRequest, NextApiResponse } from "next";
import { Types } from "mongoose";
import { dbConnect } from "@/lib/db";
import Category from "@/models/Category";

type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

type CategoryListResponse = {
  categories: CategorySummary[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoryListResponse | { message: string }>,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const categories = await Category.find({})
      .sort({ name: 1 })
      .lean<{
        _id: Types.ObjectId;
        name: string;
        slug: string;
        description?: string;
      }[]>();

    return res.status(200).json({
      categories: categories.map((category) => ({
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        description: category.description,
      })),
    });
  } catch (error) {
    console.error("❌ Fetch categories error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
