import { Schema, model, models } from "mongoose";

const ImageSchema = new Schema({
  url: String,
  alt: String,
}, { _id: false });

const AuctionSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  startingPrice: { type: Number, required: true },
  reservePrice: Number,
  currentBid: { type: Number, default: 0 },
  highestBidderId: { type: Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["draft", "pending", "active", "closed"], default: "draft" },
  startTime: Date,
  endTime: { type: Date, index: true },
  minIncrement: { type: Number, default: 0 },
  images: [ImageSchema],
}, { timestamps: true });

export default models.Auction || model("Auction", AuctionSchema);
