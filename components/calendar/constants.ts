import FullCalendar from "@fullcalendar/react";
import { ComponentProps } from "react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export const vnTimezone = "Asia/Ho_Chi_Minh";

export const config: ComponentProps<typeof FullCalendar> = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "week",
  views: {
    week: {
      type: "timeGrid",
      duration: { days: 7 },
    },
  },
  allDaySlot: false,
  headerToolbar: {
    left: "prev next today",
    center: "title",
    // right: "week timeGridDay dayGridMonth",
    right: "",
  },
  buttonText: {
    today: "Hôm nay",
    month: "Tháng",
    day: "Ngày",
    list: "Danh sách",
    week: "Tuần",
  },
};
