import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/Users";
import { sendVerificationEmail } from "@/lib/mail";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  const { name, email, password, confirmPassword, role } = await request.json();

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
      { message: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = randomBytes(32).toString("hex");

    // Restrict roles to only "user" during signup
    const isAdminCreation =
      role === "admin" &&
      request.headers.get("x-admin-access-code") === process.env.ADMIN_ACCESS_CODE;

    const userRole = isAdminCreation ? "admin" : "user"; // Allow "admin" only with valid access code

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      role: userRole,
    });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);


return NextResponse.json(
  { message: "User created. Verification email sent.", email },
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

