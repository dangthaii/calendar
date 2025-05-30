import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "your-secret-key";
const ACCESS_TOKEN_EXPIRY = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // 7 days

export async function signJWT(payload: any, expiresIn: string) {
  const secretKey = new TextEncoder().encode(SECRET_KEY);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyJWT<T>(token: string): Promise<T | null> {
  try {
    const secretKey = new TextEncoder().encode(SECRET_KEY);
    const { payload } = await jwtVerify(token, secretKey);
    return payload as T;
  } catch (error) {
    return null;
  }
}

export async function generateTokens(userId: string, email: string) {
  // Generate access token
  const accessToken = await signJWT(
    { sub: userId, email },
    ACCESS_TOKEN_EXPIRY
  );

  // Generate refresh token
  const refreshToken = await signJWT(
    { sub: userId, email },
    REFRESH_TOKEN_EXPIRY
  );

  // Store refresh token in database
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken },
  });

  return { accessToken, refreshToken };
}

export function setTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
) {
  // Set HTTP-only cookies
  response.cookies.set({
    name: "access_token",
    value: accessToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes in seconds
    path: "/",
  });

  response.cookies.set({
    name: "refresh_token",
    value: refreshToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    path: "/",
  });

  return response;
}

export function getTokens(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value || "";
  const refreshToken = request.cookies.get("refresh_token")?.value || "";
  return { accessToken, refreshToken };
}

export async function refreshAccessToken(refreshToken: string) {
  try {
    // Verify refresh token
    const payload = await verifyJWT<{ sub: string; email: string }>(
      refreshToken
    );
    if (!payload) return null;

    // Check if refresh token exists in database
    const user = await prisma.user.findFirst({
      where: {
        id: payload.sub,
        refreshToken,
      },
    });

    if (!user) return null;

    // Generate new tokens
    const tokens = await generateTokens(user.id, user.email);
    return tokens;
  } catch (error) {
    return null;
  }
}

export function clearTokenCookies(response: NextResponse) {
  response.cookies.set({
    name: "access_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set({
    name: "refresh_token",
    value: "",
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}
