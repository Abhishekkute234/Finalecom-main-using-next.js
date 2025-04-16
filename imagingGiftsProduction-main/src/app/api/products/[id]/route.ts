// app/api/products/[id]/route.ts
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
  name?: string;          // This field may or may not be set
  productName?: string;   // This field may or may not be set
  priceDetails: PriceDetails;
  thumbImage: string;
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

    const product = (await Product.findById(id).lean()) as
      | ProductDocument
      | null;

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Ensure both fields are set and fallback to a default value if needed.
    const standardizedName = product.name || product.productName || "Unknown Product";

    const formattedProduct = {
      ...product,
      name: standardizedName,
      productName: standardizedName,
      priceDetails: {
        offerPrice: product.priceDetails.offerPrice, // raw number for calculations
        formattedOfferPrice: formatPrice(product.priceDetails.offerPrice),
        mrp: product.priceDetails.mrp,
        formattedMrp: formatPrice(product.priceDetails.mrp),
      },
    };

    return NextResponse.json({ success: true, data: formattedProduct });
  } catch (error) {
    return handleError(error, "Failed to fetch product details");
  }
}
