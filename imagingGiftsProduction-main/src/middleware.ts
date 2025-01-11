import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Import the correct type
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const loggedInRedirectRoutes = ["/login", "/register"];

  // Redirect logged-in users trying to access login or register pages
  if (token && loggedInRedirectRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/shop"], // Apply middleware to these routes
};
