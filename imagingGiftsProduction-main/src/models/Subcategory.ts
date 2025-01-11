// src/models/Subcategory.ts
import mongoose, { Schema, Document } from "mongoose";

// Define the Subcategory interface
interface ISubcategory extends Document {
  name: string;
  parent: mongoose.Types.ObjectId; // Required parent field referencing Category
}

const subcategorySchema = new Schema<ISubcategory>(
  {
    name: { type: String, required: true, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true }
);

const Subcategory =
  mongoose.models.Subcategory || mongoose.model<ISubcategory>("Subcategory", subcategorySchema);

export default Subcategory;
