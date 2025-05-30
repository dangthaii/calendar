import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Try to count users as a simple database operation
    const userCount = await prisma.user.count();

    return NextResponse.json({
      success: true,
      message: "Prisma is working correctly",
      userCount,
    });
  } catch (error) {
    console.error("Prisma test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
