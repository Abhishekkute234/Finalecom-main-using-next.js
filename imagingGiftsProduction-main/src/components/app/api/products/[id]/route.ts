import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";

interface PriceDetails {
  offerPrice: number;
  mrp: number;
}

interface ProductDocument {
  _id: string;
  name: string;
  priceDetails: PriceDetails;
}

const ensureDatabaseConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
};

const handleError = (error: any, defaultMessage: string) => {
  console.error(defaultMessage, error);
  return NextResponse.json(
    { success: false, error: defaultMessage },
    { status: 500 }
  );
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN").format(price);
};

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

    const product = (await Product.findById(id).lean()) as ProductDocument | null;

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const formattedProduct = {
      ...product,
      priceDetails: {
        offerPrice: formatPrice(product.priceDetails.offerPrice),
        mrp: formatPrice(product.priceDetails.mrp),
      },
    };

    return NextResponse.json({ success: true, data: formattedProduct });
  } catch (error) {
    return handleError(error, "Failed to fetch product details");
  }
}
