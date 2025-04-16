import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // Import the correct type
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const loggedInRedirectRoutes = ["/login", "/register"];
  const adminRestrictedRoutes = ["/admin", "/admin/settings"]; // Add routes restricted to admin
  const authRestrictedRoutes = ["/checkout", "/cart" , "/orders"]; // Routes restricted for unauthenticated users

  // Redirect logged-in users trying to access login or register pages
  if (token && loggedInRedirectRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Restrict access to admin routes
  if (adminRestrictedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token || token.role !== process.env.ADMIN_ACCESS_CODE) {
      return NextResponse.redirect(new URL("/?error=access-denied", req.url));
    }
  }

  // Restrict access to auth-restricted routes (checkout and cart)
  if (authRestrictedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login`, req.url) // Redirect to login with a query parameter
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin/:path*",
    "/shop-manager/:path*",
    "/checkout",
    "/cart",
    "/orders",
  ], // Apply middleware to these routes
};
