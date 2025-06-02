import { Event } from "../types";

export const formatEventsForCalendar = (
  events: Event[],
  currentUserId: string
) => {
  return events.map((event) => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    extendedProps: {
      description: event.description,
      userId: event.userId,
      userName: event.user?.name || "Unknown User",
    },
    // Add different colors based on event owner
    color: event.userId === currentUserId ? "#3788d8" : "#6c757d",
    // Make the event title more descriptive by including the user's name if it's not the current user
    ...(event.userId !== currentUserId && {
      title: `${event.title} (${event.user?.name || "Unknown"})`,
    }),
  }));
};
