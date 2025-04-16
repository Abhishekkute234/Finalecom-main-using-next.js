import { NextResponse } from "next/server";
import razorpayInstance from "@/lib/razorpay";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // Convert rupees to paise
      currency: "INR",
      receipt: `receipt_${Math.random().toString(36).substring(7)}`,
    };

    const order = await razorpayInstance.orders.create(options);
  

    return NextResponse.json({ order }); // Return the order to the client
  } catch (error) {
    console.error("Error in Razorpay Order API:", error);
    return NextResponse.json({ message: "Failed to create Razorpay order" }, { status: 500 });
  }
}
