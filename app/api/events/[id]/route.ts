import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

interface Params {
  params: {
    id: string;
  };
}

// Helper function to get token from request
async function getAuthUserId(request: Request) {
  // Check for Authorization header first (Bearer token)
  let token = request.headers.get("Authorization")?.split(" ")[1];

  // If no token in header, try to get from cookies
  if (!token) {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = cookieHeader.split(";");
      const accessTokenCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("access_token=")
      );
      if (accessTokenCookie) {
        token = accessTokenCookie.split("=")[1].trim();
      }
    }
  }

  if (!token) {
    return { error: "Unauthorized", status: 401 };
  }

  // For Bearer token, we expect the payload to have id
  // For cookie token, we expect the payload to have sub (subject)
  const payload = await verifyJWT<{ id?: string; sub?: string; email: string }>(
    token
  );

  if (!payload) {
    return { error: "Invalid token", status: 401 };
  }

  const userId = payload.id || payload.sub;

  if (!userId) {
    return { error: "Invalid token payload", status: 401 };
  }

  return { userId };
}

// GET a specific event
export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const event = await prisma.event.findUnique({
      where: { id },
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

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT/UPDATE an event
export async function PUT(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const authResult = await getAuthUserId(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { userId } = authResult;

    const body = await request.json();
    const { title, start, end, allDay, description } = body;

    // Check if the event exists and belongs to the user
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Allow updates for the event owner only
    if (existingEvent.userId !== userId) {
      return NextResponse.json(
        { error: "You can only update your own events" },
        { status: 403 }
      );
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title: title || existingEvent.title,
        start: start ? new Date(start) : existingEvent.start,
        end: end ? new Date(end) : existingEvent.end,
        allDay: allDay !== undefined ? allDay : existingEvent.allDay,
        description:
          description !== undefined ? description : existingEvent.description,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE an event
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = params;

    const authResult = await getAuthUserId(request);
    if ("error" in authResult) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      );
    }

    const { userId } = authResult;

    // Check if the event exists and belongs to the user
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Allow deletion for the event owner only
    if (existingEvent.userId !== userId) {
      return NextResponse.json(
        { error: "You can only delete your own events" },
        { status: 403 }
      );
    }

    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
