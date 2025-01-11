// /app/api/auth/signup/route.ts (or wherever your route is)
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/Users";
import { sendVerificationEmail } from "@/lib/mail";
import { randomBytes } from "crypto"; // Node's built-in crypto

export async function POST(request: Request) {
  const { name, email, password, confirmPassword } = await request.json();

  // Validate input, e.g.:
  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { message: "All fields are required" },
      { status: 400 }
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { message: "Password must be at least 6 chars" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a token for verification
    const verificationToken = randomBytes(32).toString("hex");

    // Create the user with verified=false
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
    });
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { message: "User created. Verification email sent." },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
