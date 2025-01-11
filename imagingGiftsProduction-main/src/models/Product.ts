// models/Product.ts
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    quantityPurchase: { type: String, default: null }, // Optional field
    rate: { type: Number, default: 0 }, // Optional field
    variation: { type: String, default: null }, // Optional field
    categories: {
      main: { type: String, required: true },
      sub: { type: String, default: null },
      subSub: { type: String, default: null },
    },
    productSKU: { type: String, required: true },
    brand: { type: String, required: true },
    priceDetails: {
      mrp: { type: Number, default: 0 },
      offerPrice: { type: Number, default: 0 },
    },
    stock: {
      status: { type: String, default: "In Stock" }, // Default status
      count: { type: Number, default: 0 },
    },
    shortDescription: { type: String, default: null },
    detailedDescription: { type: String, default: null },
    technicalSpecifications: {
      keySpecifications: { type: String, default: null },
      lens: { type: String, default: null },
      powerDetails: { type: String, default: null },
      includedAccessories: { type: String, default: null },
    },
    additionalFeatures: {
      warranty: { type: String, default: null },
      certification: { type: String, default: null },
    },
    shippingReturns: {
      weightAndDimensions: { type: String, default: null },
      shippingDetails: { type: String, default: null },
      returnPolicy: { type: String, default: null },
    },

    // Single field for storing the thumbnail image URL
    thumbImage: { type: String, default: null },

    // Array field for storing multiple additional image URLs
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
