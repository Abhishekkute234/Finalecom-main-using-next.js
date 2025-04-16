import { NextRequest, NextResponse } from "next/server";

import Order from "@/models/Order";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get all orders sorted by date
    const orders = await Order.find().sort({ createdAt: -1 });

    // Set CORS headers
    const response = NextResponse.json({ orders });
    response.headers.set("Access-Control-Allow-Origin", "http://localhost:5173"); // Replace with your frontend origin
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  } catch (error) {
    console.error("GET Error:", error);

    const errorResponse = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    errorResponse.headers.set("Access-Control-Allow-Origin", "http://localhost:5173"); // Ensure CORS headers on errors too
    errorResponse.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    errorResponse.headers.set("Access-Control-Allow-Headers", "Content-Type");
    errorResponse.headers.set("Access-Control-Allow-Credentials", "true");

    return errorResponse;
  }
}

// Handle preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3001");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}
