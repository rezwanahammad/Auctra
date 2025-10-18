import path from "path";
import { config as loadEnv } from "dotenv";

// Load environment variables from .env.local before touching the DB layer
loadEnv({ path: path.resolve(process.cwd(), ".env.local") });

(async () => {
  const { dbConnect } = await import("../lib/db");
  const { default: Category } = await import("../models/Category");
  try {
    await dbConnect();
    await Category.deleteMany({});
    await Category.insertMany([
      { name: "Fine Art", slug: "fine-art" },
      { name: "Jewelry", slug: "jewelry" },
      { name: "Watches", slug: "watches" }
    ]);
    console.log("Categories seeded");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed:", error);
    process.exit(1);
  }
})();
