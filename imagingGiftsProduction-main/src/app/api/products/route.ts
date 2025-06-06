// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import Product from "@/models/Product";
import connectToDatabase from "@/lib/mongodb";
import mongoose from "mongoose";
import { z } from "zod";
import { getToken } from "next-auth/jwt";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

// Ensure database connection (with connection pooling)
const ensureDatabaseConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
};

// Zod Schema for Product Validation (with thumbImage & multiple images)
const productSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  quantityPurchase: z.number().optional(),
  rate: z.number().min(0).optional(),
  variation: z.string().optional(),
  categories: z.object({
    main: z.string().min(1, "Main category is required"),
    sub: z.string().optional(),
    subSub: z.string().optional(),
  }),
  productSKU: z.string().min(1, "SKU is required"),
  brand: z.string().min(1, "Brand is required"),
  priceDetails: z.object({
    mrp: z.number().min(0, "MRP must be a positive number"),
    offerPrice: z.number().min(0, "Offer Price must be a positive number"),
  }),
  stock: z.object({
    status: z.string(),
    count: z.number().min(0, "Stock count must be a non-negative number"),
  }),
  shortDescription: z.string().optional(),
  detailedDescription: z.string().optional(),
  technicalSpecifications: z
    .object({
      keySpecifications: z.string(),
      lens: z.string().nullable(),
      powerDetails: z.string().nullable(),
      includedAccessories: z.string().nullable(),
    })
    .optional(),
  additionalFeatures: z
    .object({
      warranty: z.string().min(1, "Warranty is required"),
      certification: z.string().nullable(),
    })
    .optional(),
  shippingReturns: z
    .object({
      weightAndDimensions: z.string(),
      shippingDetails: z.string().nullable(),
      returnPolicy: z.string().nullable(),
    })
    .optional(),

  // Replace "imageUrl" with "thumbImage"
  thumbImage: z.string().url("Invalid URL format").optional(),

  // Add an array of images (URLs)
  images: z.array(z.string().url("Invalid URL format")).optional(),
});

// Centralized error handler for cleaner code
const handleError = (error: any, defaultMessage: string) => {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { success: false, error: error.errors },
      { status: 400 }
    );
  }
  console.error(defaultMessage, error);
  return NextResponse.json(
    { success: false, error: defaultMessage },
    { status: 500 }
  );
};


export async function GET(req: Request) {
  try {
    await ensureDatabaseConnection();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const subSubCategory = searchParams.get("subSubCategory");
    const brand = searchParams.get("brand");
    const stockStatus = searchParams.get("stockStatus");
    const sale = searchParams.get("sale") === "true";

    const minPrice = parseFloat(searchParams.get("minPrice") || "0");
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "Infinity");
    const sortField = searchParams.get("sortField") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1); // Ensure page >= 1
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1); // Ensure limit >= 1

    const filter: any = {};

    // Keyword search (basic regex search)
    const search = searchParams.get("search");
    if (search) {
      filter.$or = [
        { productName: { $regex: search, $options: "i" } },
        { detailedDescription: { $regex: search, $options: "i" } },
      ];
    }

    // Category filters
    if (category) filter["categories.main"] = category;
    if (subcategory) filter["categories.sub"] = subcategory;
    if (subSubCategory) filter["categories.subSub"] = subSubCategory;

    // Additional filters
    if (brand) filter.brand = brand;
    if (stockStatus) filter["stock.status"] = stockStatus;
    if (sale) filter.sale = true;

    // Price range
    if (!isNaN(minPrice)) {
      filter["priceDetails.offerPrice"] = { $gte: minPrice };
    }
    if (!isNaN(maxPrice)) {
      filter["priceDetails.offerPrice"] = {
        ...(filter["priceDetails.offerPrice"] || {}),
        $lte: maxPrice,
      };
    }

    // Aggregation Pipeline to Calculate Discount
    const aggregationPipeline: any[] = [
      { $match: filter },
      {
        $addFields: {
          discount: {
            $subtract: ["$priceDetails.mrp", "$priceDetails.offerPrice"],
          },
        },
      },
    ];

    // Apply Sorting
    if (sortField === "discount") {
      aggregationPipeline.push({ $sort: { discount: sortOrder } });
    } else {
      const sortCriteria: any = {};
      sortCriteria[sortField] = sortOrder;
      aggregationPipeline.push({ $sort: sortCriteria });
    }

    // Calculate skip and ensure it's non-negative
    const skip = (page - 1) * limit;
    aggregationPipeline.push({ $skip: skip }, { $limit: limit });

    // Fetch Products
    const products = await Product.aggregate(aggregationPipeline);

    // Count Total Documents for Pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Cap the page number to totalPages
    const finalPage = Math.min(page, totalPages || 1); // Avoid division by zero

    // Format prices with commas before sending the response
    const formattedProducts = products.map((product) => ({
      ...product,
      priceDetails: {
        ...product.priceDetails,
        offerPrice: new Intl.NumberFormat("en-IN").format(product.priceDetails.offerPrice), // Format offerPrice
        mrp: new Intl.NumberFormat("en-IN").format(product.priceDetails.mrp), // Format MRP
      },
      discount: new Intl.NumberFormat("en-IN").format(product.discount), // Format Discount
    }));

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        total,
        page: finalPage,
        pages: totalPages,
      },
    });
  } catch (error) {
    return handleError(error, "Failed to fetch products");
  }
}




async function isAdmin(req: NextRequest): Promise<boolean> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return token?.role === process.env.ADMIN_ACCESS_CODE;
}

// Protect the POST route
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 403 }
    );
  }

  try {
    await ensureDatabaseConnection();

    const formData = await req.formData();
    const productDataString = formData.get("productData") as string;

    if (!productDataString) {
      return NextResponse.json(
        { success: false, error: "Missing product data in form fields" },
        { status: 400 }
      );
    }

    const productData = JSON.parse(productDataString);
    const parsedBody = productSchema.parse(productData);

    let thumbImage: string | undefined;
    const thumbFile = formData.get("thumbFile") as File | null;

    if (thumbFile && thumbFile.size > 0) {
      const arrayBuffer = await thumbFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = buffer.toString("base64");
      const mimeType = thumbFile.type || "application/octet-stream";

      const uploadResult = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${base64String}`,
        { folder: "my_app_folder" }
      );
      thumbImage = uploadResult.secure_url;
    }

    if (thumbImage) {
      parsedBody.thumbImage = thumbImage;
    }

    const imagesUrls: string[] = [];
    const imagesFiles = formData.getAll("imagesFiles") as File[];

    for (const imageFile of imagesFiles) {
      if (imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = buffer.toString("base64");
        const mimeType = imageFile.type || "application/octet-stream";

        const uploadResult = await cloudinary.uploader.upload(
          `data:${mimeType};base64,${base64String}`,
          { folder: "my_app_folder" }
        );
        imagesUrls.push(uploadResult.secure_url);
      }
    }

    if (imagesUrls.length > 0) {
      parsedBody.images = imagesUrls;
    }

    const existingProduct = await Product.findOne({
      $or: [
        { productName: parsedBody.productName },
        { productSKU: parsedBody.productSKU },
      ],
    });
    if (existingProduct) {
      return NextResponse.json(
        { success: false, error: "Product with the same name or SKU already exists" },
        { status: 400 }
      );
    }

    const product = new Product(parsedBody);
    await product.save();

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to add product" },
      { status: 500 }
    );
  }
}

// Protect the DELETE route
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json(
      { success: false, error: "Unauthorized access" },
      { status: 403 }
    );
  }

  try {
    await ensureDatabaseConnection();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || !mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid or missing product ID" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}