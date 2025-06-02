import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

// List of paths that don't require authentication
const publicPaths = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/_next",
  "/favicon.ico",
  "/public",
];

// API paths that should bypass middleware JWT verification
// since they already have their own auth checks
const apiPathsWithOwnAuth = ["/api/events", "/api/auth/me"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path is public
  const isPublicPath = publicPaths.some(
    (publicPath) => path === publicPath || path.startsWith(publicPath + "/")
  );

  // Check if the path is an API with its own auth
  const isApiWithOwnAuth = apiPathsWithOwnAuth.some(
    (apiPath) => path === apiPath || path.startsWith(apiPath + "/")
  );

  if (isPublicPath || isApiWithOwnAuth) {
    return NextResponse.next();
  }

  // Get access token from cookies
  const accessToken = request.cookies.get("access_token")?.value;

  // If no access token, redirect to login
  if (!accessToken) {
    // If this is an API request, return 401 instead of redirecting
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  try {
    // Verify the token
    const payload = await verifyJWT(accessToken);

    if (!payload) {
      throw new Error("Invalid token");
    }

    return NextResponse.next();
  } catch (error) {
    // If this is an API request, return 401 instead of redirecting
    if (path.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    // If token is invalid, redirect to login
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(request.url));
    return NextResponse.redirect(url);
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
