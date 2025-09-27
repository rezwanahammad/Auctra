import { Schema, model, models } from "mongoose";

const BidSchema = new Schema({
  auctionId: { type: Schema.Types.ObjectId, ref: "Auction", required: true },
  bidderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bidAmount: { type: Number, required: true },
}, { timestamps: true });

export default models.Bid || model("Bid", BidSchema);
