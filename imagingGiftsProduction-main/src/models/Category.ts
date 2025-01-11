// src/models/Category.ts
import mongoose, { Schema, Document } from "mongoose";

// Define the Category interface
interface ICategory extends Document {
  name: string;
  parent?: mongoose.Types.ObjectId | null; // Optional parent field for nested categories
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || mongoose.model<ICategory>("Category", categorySchema);

export default Category;
