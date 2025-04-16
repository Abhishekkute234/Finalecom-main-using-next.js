import { sendVerificationEmail } from "@/lib/mail";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/Users";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

// Resend Email Route
export async function PATCH(request: Request) {
    const { email } = await request.json();
  
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }
  
    try {
      await connectToDatabase();
  
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
  
      if (user.verified) {
        return NextResponse.json(
          { message: "User is already verified" },
          { status: 400 }
        );
      }
  
      const newVerificationToken = randomBytes(32).toString("hex");
      user.verificationToken = newVerificationToken;
      await user.save();
  
      await sendVerificationEmail(email, newVerificationToken);
  
      return NextResponse.json(
        { message: "Verification email resent successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Something went wrong" },
        { status: 500 }
      );
    }
  }
  