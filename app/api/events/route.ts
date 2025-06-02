import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST a new event
export async function POST(request: Request) {
  try {
    console.log("POST /api/events - Request received");

    // Check for Authorization header first (Bearer token)
    let token = request.headers.get("Authorization")?.split(" ")[1];
    console.log(
      "Authorization header token:",
      token ? "Present" : "Not present"
    );

    // If no token in header, try to get from cookies
    if (!token) {
      const cookieHeader = request.headers.get("cookie");
      console.log("Cookie header:", cookieHeader || "Not present");

      if (cookieHeader) {
        const cookies = cookieHeader.split(";");
        const accessTokenCookie = cookies.find((cookie) =>
          cookie.trim().startsWith("access_token=")
        );
        if (accessTokenCookie) {
          token = accessTokenCookie.split("=")[1].trim();
          console.log("Token found in cookies");
        }
      }
    }

    if (!token) {
      console.log("No token found in request");
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    // For Bearer token, we expect the payload to have id
    // For cookie token, we expect the payload to have sub (subject)
    console.log("Verifying token");
    const payload = await verifyJWT<{
      id?: string;
      sub?: string;
      email: string;
    }>(token);

    if (!payload) {
      console.log("Invalid token - verification failed");
      return NextResponse.json(
        { error: "Invalid token - verification failed" },
        { status: 401 }
      );
    }

    console.log("Token payload:", payload);
    const userId = payload.id || payload.sub;

    if (!userId) {
      console.log("Invalid token payload - no user ID");
      return NextResponse.json(
        { error: "Invalid token payload - no user ID" },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("Request body:", body);

    const { title, start, end, allDay, description } = body;

    if (!title || !start || !end) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Creating event for user:", userId);
    const event = await prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        allDay: allDay || false,
        description,
        userId,
      },
    });

    console.log("Event created:", event);
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
