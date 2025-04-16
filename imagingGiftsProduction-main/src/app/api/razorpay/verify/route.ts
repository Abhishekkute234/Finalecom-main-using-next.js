import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Signature mismatch");
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    return NextResponse.json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error("Error in Payment Verification API:", error);
    return NextResponse.json({ message: "Payment verification failed" }, { status: 500 });
  }
}
