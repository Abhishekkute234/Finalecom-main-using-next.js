// /app/api/auth/verify/route.ts

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/Users";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }


    user.verified = true;
    user.verificationToken = undefined; 
    await user.save();

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_API_URL}/verify-email-success`
    );
    
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
