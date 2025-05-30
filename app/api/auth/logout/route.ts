import { NextRequest, NextResponse } from "next/server";
import { clearTokenCookies, getTokens, verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get tokens from cookies
    const { accessToken } = getTokens(request);

    // Verify access token
    const payload = await verifyJWT<{ sub: string }>(accessToken);

    if (payload?.sub) {
      // Clear refresh token in database
      await prisma.user.update({
        where: { id: payload.sub },
        data: { refreshToken: null },
      });
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear cookies
    return clearTokenCookies(response);
  } catch (error) {
    console.error("Logout error:", error);

    // Even if there's an error, we should clear cookies
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    return clearTokenCookies(response);
  }
}
