import { NextRequest, NextResponse } from "next/server";
import Product, { IProduct } from "@/models/Product";
import dbConnect from "@/utils/dbConnect";

type Data = {
  success: boolean;
  data?: IProduct | IProduct[];
  error?: string;
  message?: string;
};

// **GET** - Fetch all products or filter by query parameters
export async function GET(req: NextRequest) {
  try {
    // Ensure the database connection is established here
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const gender = searchParams.get("gender");
    const category = searchParams.get("category");

    // Build filters based on query parameters
    const filters: any = {};
    if (type) filters.type = type;
    if (gender) filters.gender = gender;
    if (category) filters.category = category;

    const products = await Product.find(filters);
    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// **POST** - Add a new product
export async function POST(req: NextRequest) {
  try {
    // Ensure the database connection is established here
    await dbConnect();

    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// **PUT** - Update a product by ID
export async function PUT(req: NextRequest) {
  try {
    // Ensure the database connection is established here
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// **DELETE** - Delete a product by ID
export async function DELETE(req: NextRequest) {
  try {
    // Ensure the database connection is established here
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: deletedProduct },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
