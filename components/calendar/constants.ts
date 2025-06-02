import FullCalendar from "@fullcalendar/react";
import { ComponentProps } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export const vnTimezone = "Asia/Ho_Chi_Minh";

export const config: ComponentProps<typeof FullCalendar> = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "timeGridWeek",
  views: {
    week: {
      type: "timeGridWeek",
      duration: { days: 7 },
    },
  },
  allDaySlot: false,
  headerToolbar: {
    right: "prev next today",
    left: "",
  },
  buttonText: {
    today: "Hôm nay",
    month: "Tháng",
    day: "Ngày",
    list: "Danh sách",
    week: "Tuần",
  },
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  dayHeaderFormat: { weekday: "short", day: "2-digit" },
  eventTimeFormat: {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  },
  height: "auto",
  expandRows: true,
  nowIndicator: true,
  slotMinTime: "08:00:00",
  slotMaxTime: "24:00:00",
  firstDay: 1, // Monday as first day
  // Custom now indicator settings
  nowIndicatorClassNames: "custom-now-indicator",
};

// Custom CSS variables to be added to global CSS
export const calendarCustomStyles = `
  :root {
    --fc-border-color: #e5e7eb;
    --fc-button-text-color: #fff;
    --fc-button-bg-color: #0f766e;
    --fc-button-border-color: #0f766e;
    --fc-button-hover-bg-color: #0e6b63;
    --fc-button-hover-border-color: #0e6b63;
    --fc-button-active-bg-color: #0c5953;
    --fc-button-active-border-color: #0c5953;
    --fc-event-bg-color: #ffffff;
    --fc-event-border-color: #0ea5e9;
    --fc-event-text-color: #0ea5e9;
    --fc-today-bg-color: rgba(14, 165, 233, 0.1);
    --fc-now-indicator-color: #0ea5e9;
  }

  .fc .fc-button {
    border-radius: 4px;
    padding: 0.5rem 1rem;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 0.875rem;
  }

  .fc .fc-button-primary:not(:disabled):active,
  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background-color: var(--fc-button-active-bg-color);
    border-color: var(--fc-button-active-border-color);
  }

  .fc .fc-toolbar-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .fc-theme-standard .fc-scrollgrid {
    border: 1px solid var(--fc-border-color);
  }

  .fc-col-header-cell {
    background-color: #f9fafb;
    font-weight: 600;
    padding: 0.75rem 0;
  }

  .fc-timegrid-slot {
    height: 3rem;
  }

  /* Outline style for events */
  .fc-event {
    border-radius: 4px;
    border: 1px solid var(--fc-event-border-color);
    border-left-width: 4px;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    background-color: #ffffff;
  }

  /* Event details with icons */
  .event-details {
    margin-top: 4px;
  }

  .event-time, .event-user {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .event-time svg, .event-user svg {
    flex-shrink: 0;
  }

  /* Custom styling for the current time indicator */
  .fc .fc-timegrid-now-indicator-line {
    border-color: #0ea5e9;
    border-width: 1px;
  }

  /* Hide the arrow indicator */
  .fc .fc-timegrid-now-indicator-arrow {
    display: none;
  }
`;
