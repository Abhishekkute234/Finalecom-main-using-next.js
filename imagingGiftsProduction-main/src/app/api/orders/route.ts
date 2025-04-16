
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import Order from "@/models/Order";
import connectToDatabase from "@/lib/mongodb";
import Cart from "@/models/Cart";




export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user;
    const { items, totalAmount, shippingInfo, paymentDetails } = await req.json();

    // Debugging Logs
    console.log("Order Payload:", { items, totalAmount, shippingInfo, paymentDetails });

    // Validate request payload
    if (!items || items.length === 0 || !totalAmount || totalAmount <= 0 || !shippingInfo) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    if (
      !paymentDetails ||
      !paymentDetails.razorpay_order_id ||
      !paymentDetails.razorpay_payment_id ||
      !paymentDetails.razorpay_signature
    ) {
      return NextResponse.json({ message: "Missing payment details" }, { status: 400 });
    }

    // Connect to the database
    await connectToDatabase();

    // Sanitize `items` to ensure prices are numbers
    const sanitizedItems = items.map((item: any) => ({
      ...item,
      price: typeof item.price === "string"
        ? parseFloat(item.price.replace(/,/g, "")) // Remove commas and convert to number
        : item.price,
    }));

    // Sanitize `totalAmount`
    const sanitizedTotalAmount =
      typeof totalAmount === "string"
        ? parseFloat(totalAmount.replace(/,/g, "")) // Remove commas and convert to number
        : totalAmount;

    // Determine order status
    const status = paymentDetails?.razorpay_payment_id ? "Completed" : "Pending";

    // Create a new order
    const newOrder = new Order({
      userEmail: email,
      items: sanitizedItems, // Use sanitized items
      totalAmount: sanitizedTotalAmount, // Use sanitized totalAmount
      shippingInfo,
      paymentDetails,
      status,
      createdAt: new Date(),
    });

    await newOrder.save();

    console.log("Order saved successfully:", newOrder);

    // Return success response
    return NextResponse.json({ message: "Order created successfully", orderId: newOrder._id });
  } catch (error) {
    console.error("Error creating order in database:", error);

    // Handle unknown error types safely
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal Server Error", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: String(error) },
      { status: 500 }
    );
  }
}

// Fetch all orders for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user;

    await connectToDatabase();

    const orders = await Order.find({ userEmail: email });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Cancel an order
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user;
    const { productId } = await req.json();



    await connectToDatabase();

    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    if (productId) {
  
      const productIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);

      if (productIndex > -1) {
        cart.items.splice(productIndex, 1); // Remove the product from the cart
        await cart.save();
        return NextResponse.json({ message: "Product removed from cart" });
      } else {
        return NextResponse.json({ message: "Product not found in cart" }, { status: 404 });
      }
    }

    // Clear all items if no productId is provided

    cart.items = [];
    await cart.save();
    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
