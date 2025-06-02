"use client";

import { CalendarView } from "./components/CalendarView";
import { CalendarProps } from "./types";

// Main Calendar component
export default function Calendar({ userId }: CalendarProps) {
  return <CalendarView userId={userId} showAllEvents={true} />;
}

// Export sub-components and hooks for reuse
export * from "./types";
export * from "./hooks/useToast";
export * from "./hooks/useDebounce";
export * from "./components/EventModal";
export * from "./utils/formatEvents";
