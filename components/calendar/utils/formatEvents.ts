import { Event } from "../types";

// Color palette for different users' events
const colorPalette = [
  { bg: "#ffffff", border: "#0284c7", text: "#0284c7" }, // Sky blue
  { bg: "#ffffff", border: "#059669", text: "#059669" }, // Emerald
  { bg: "#ffffff", border: "#7c3aed", text: "#7c3aed" }, // Violet
  { bg: "#ffffff", border: "#ea580c", text: "#ea580c" }, // Orange
  { bg: "#ffffff", border: "#dc2626", text: "#dc2626" }, // Red
  { bg: "#ffffff", border: "#db2777", text: "#db2777" }, // Pink
];

// Get consistent color for a user based on their ID
const getUserColor = (userId: string) => {
  // Simple hash function to get a number from the user ID
  const hash = userId.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  // Use the hash to select a color from the palette
  const colorIndex = hash % colorPalette.length;
  return colorPalette[colorIndex];
};

export const formatEventsForCalendar = (
  events: Event[],
  currentUserId: string
) => {
  return events.map((event) => {
    const isCurrentUser = event.userId === currentUserId;
    const userColor = getUserColor(event.userId);

    // Define colors for current user's events
    const currentUserColors = {
      bg: "#ffffff",
      border: "#0284c7",
      text: "#0284c7",
    };

    return {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
      extendedProps: {
        description: event.description,
        userId: event.userId,
        userName: event.user?.name || "Unknown User",
        isCurrentUser: isCurrentUser,
      },
      // Add different colors based on event owner - using outline style
      backgroundColor: isCurrentUser ? currentUserColors.bg : userColor.bg,
      borderColor: isCurrentUser ? currentUserColors.border : userColor.border,
      textColor: isCurrentUser ? currentUserColors.text : userColor.text,
    };
  });
};
