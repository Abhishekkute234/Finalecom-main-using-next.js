import { Schema, model, models, Model, Document } from 'mongoose';

// Define the Product Interface
export interface IProduct extends Document {
  id: string;
  category: string;
  type: string;
  name: string;
  gender: string;
  new: boolean;
  sale: boolean;
  rate: number;
  price: number;
  originPrice: number;
  brand: string;
  sold: number;
  quantity: number;
  quantityPurchase: number;
  sizes: string[];
  variation: {
    color: string;
    colorCode: string;
    colorImage: string;
    image: string;
  }[];
  thumbImage: string[];
  images: string[];
  description: string;
  action: string;
  slug: string;
}

// Create Product Schema
const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'both'], required: true },
    new: { type: Boolean, default: false },
    sale: { type: Boolean, default: false },
    rate: { type: Number, default: 0, min: 0, max: 5 },
    price: { type: Number, required: true },
    originPrice: { type: Number, required: true },
    brand: { type: String, required: true },
    sold: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    quantityPurchase: { type: Number, default: 1 },
    sizes: [{ type: String }],
    variation: [
      {
        color: { type: String, required: true },
        colorCode: { type: String, required: true },
        colorImage: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    thumbImage: [{ type: String }],
    images: [{ type: String }],
    description: { type: String, required: true },
    action: { type: String, required: true },
    slug: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create or retrieve the Product model
const Product: Model<IProduct> = models.Product || model<IProduct>('Product', ProductSchema);

export default Product;
