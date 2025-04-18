import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true }, // User's email
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
