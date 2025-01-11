// src/types/index.ts

import { Document, ObjectId } from "mongoose";

export interface ICategory extends Document {
  name: string;
  parent?: ObjectId; // Optional parent category for subcategories
}

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ObjectId;
  subcategory?: ObjectId;
  images: string[];
}
