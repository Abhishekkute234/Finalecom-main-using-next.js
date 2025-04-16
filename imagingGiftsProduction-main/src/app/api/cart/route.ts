import { NextRequest, NextResponse } from "next/server";

import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // NextAuth configuration
import connectToDatabase from "@/lib/mongodb";


interface DeleteRequestBody {
  productId?: string; // Optional because it might not be provided when clearing the cart
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user;
    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity <= 0) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    await connectToDatabase();

    let cart = await Cart.findOne({ userEmail: email });
    if (!cart) {
      cart = new Cart({ userEmail: email, items: [] });
    }

    const productIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);
    if (productIndex > -1) {
      cart.items[productIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    return NextResponse.json({ message: "Product added to cart" });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
    try {
      const session = await getServerSession(authOptions);
  
      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
  
      const { email } = session.user;
  
      await connectToDatabase();
  
      const cart = await Cart.findOne({ userEmail: email }).populate("items.productId");
      if (!cart || cart.items.length === 0) {
        return NextResponse.json({ cart: [], message: "Cart is empty" });
      }
  
      const cartDetails = cart.items.map((item: any) => ({
        productId: item.productId._id,
        productName: item.productId.productName,
        quantity: item.quantity,
        price: item.productId.priceDetails.offerPrice || item.productId.priceDetails.mrp,
        totalPrice: item.quantity * (item.productId.priceDetails.offerPrice || item.productId.priceDetails.mrp),
        thumbImage: item.productId.thumbImage,
        productSKU: item.productId.productSKU
      }));
  
      return NextResponse.json({ cart: cartDetails });
    } catch (error) {
      console.error("GET Error:", error);
      return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
  }
  
  export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user;
    const { productId, quantity } = await req.json();

    if (!productId || quantity < 0) {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    await connectToDatabase();

    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const productIndex = cart.items.findIndex((item: any) => item.productId.toString() === productId);

    if (productIndex > -1) {
      if (quantity === 0) {
        // Remove item if quantity is set to 0
        cart.items.splice(productIndex, 1);
      } else {
        // Update quantity
        cart.items[productIndex].quantity = quantity;
      }

      await cart.save();
      return NextResponse.json({ message: "Cart updated successfully" });
    } else {
      return NextResponse.json({ message: "Product not found in cart" }, { status: 404 });
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { email } = session.user;

    // Parse and typecast the request body
    let body: DeleteRequestBody = {};
    try {
      body = (await req.json()) as DeleteRequestBody;
    } catch {
      console.warn("Request body is empty or invalid");
    }

    const { productId } = body;

    // Connect to the database
    await connectToDatabase();

    // Find the cart for the user
    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    if (productId) {
      // Remove specific product
      const productIndex = cart.items.findIndex(
        (item: any) => item.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.items.splice(productIndex, 1); // Remove the product from the cart
        await cart.save();
        return NextResponse.json({ message: "Product removed from cart" });
      } else {
        return NextResponse.json({ message: "Product not found in cart" }, { status: 404 });
      }
    }

    // Clear the entire cart
    cart.items = [];
    await cart.save(); // Save changes to the database

    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
