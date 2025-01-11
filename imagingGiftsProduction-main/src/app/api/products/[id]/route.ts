// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

// Ensure database connection (with connection pooling)
const ensureDatabaseConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
};

// Centralized error handler for cleaner code
const handleError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage, error);
  return NextResponse.json(
    { success: false, error: defaultMessage },
    { status: 500 }
  );
};

// GET API for fetching a specific product by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await ensureDatabaseConnection();

    const { id } = params;

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing product ID" },
        { status: 400 }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleError(error, "Failed to fetch product details");
  }
}
