import { Schema, model, models } from "mongoose";

const FavoriteSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      index: true 
    },
    auctionId: { 
      type: Schema.Types.ObjectId, 
      ref: "Auction", 
      required: true,
      index: true 
    },
  },
  { timestamps: true }
);

// Compound index to ensure a user can't favorite the same auction twice
FavoriteSchema.index({ userId: 1, auctionId: 1 }, { unique: true });

export default models.Favorite || model("Favorite", FavoriteSchema);
