// pages/api/auth/[...nextauth].ts (or /app/api/auth/[...nextauth]/route.ts)
import NextAuth from "next-auth";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import User from "@/models/Users";

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          await connectToDatabase();

          // Use `lean()` to get a plain JavaScript object
          const user = await User.findOne({ email: credentials?.email }).lean();
          if (!user) {
            throw new Error("User not found");
          }

          // Check if user is verified
          if (!user.verified) {
            throw new Error("Please verify your email before logging in.");
          }

          const isValidPassword = await bcrypt.compare(
            credentials?.password ?? "",
            user.password ?? ""
          );
          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          // Return the plain user object
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (err: any) {
          throw new Error(err.message || "Login failed");
        }
      },
    }),
  ],
  // ...
});

export { handler as GET, handler as POST };
