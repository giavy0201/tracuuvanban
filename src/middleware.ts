import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-very-secure-secret-key-1234567890"
);

export async function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;
  const rsc = searchParams.get("_rsc");

  console.log(`Middleware triggered: Pathname=${pathname}, RSC=${rsc}`);

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/admin/login" ||
    rsc
  ) {
    console.log(`Skipping middleware for: ${pathname}, RSC=${rsc}`);
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;
    console.log(`Token: ${token}, JWT_SECRET: ${process.env.JWT_SECRET || "your-very-secure-secret-key-1234567890"}`);

    if (!token) {
      console.log("No token, redirecting to /admin/login");
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      await jwtVerify(token, JWT_SECRET);
      console.log("Token valid, proceeding");
      return NextResponse.next();
    } catch (err) {
      console.log("Invalid token, redirecting to /admin/login", err);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};