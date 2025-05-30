import { NextRequest, NextResponse } from "next/server";
import { getTokens, refreshAccessToken, setTokenCookies } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Get refresh token from cookies
    const { refreshToken } = getTokens(request);

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    // Refresh access token
    const tokens = await refreshAccessToken(refreshToken);

    if (!tokens) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Token refreshed successfully",
    });

    // Set new cookies
    return setTokenCookies(response, tokens.accessToken, tokens.refreshToken);
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
