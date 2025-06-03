import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Event, CalendarProps } from "../types";
import { useEvents } from "@/lib/hooks/useEvents";
import { formatEventsForCalendar } from "../utils/formatEvents";
import { EventModal } from "./EventModal";
import { config } from "../constants";
import "../styles.css";
import { Clock, User } from "lucide-react";

export const CalendarView = ({
  userId,
  showAllEvents = false,
}: CalendarProps) => {
  const { events, isLoading, saveEvent, deleteEvent } = useEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({
    title: "",
    start: "",
    end: "",
    allDay: false,
    description: "",
  });

  // Handle date click to create a new event
  const handleDateClick = (info: any) => {
    const end = new Date(info.date);
    end.setHours(end.getHours() + 1);

    setCurrentEvent({
      title: "",
      start: info.date.toISOString(),
      end: end.toISOString(),
      allDay: info.allDay,
      description: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Handle event click to edit an existing event
  const handleEventClick = (info: any) => {
    const event = events.find((e) => e.id === info.event.id);
    if (event) {
      setCurrentEvent({
        id: event.id,
        title: event.title,
        start: event.start,
        end: event.end,
        allDay: event.allDay,
        description: event.description,
        userId: event.userId,
      });
      setIsEditMode(true);
      setIsModalOpen(true);
    }
  };

  const handleSelectRange = (info: any) => {
    setCurrentEvent({
      title: "",
      start: info.start,
      end: info.end,
      allDay: info.allDay,
      description: "",
    });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  // Save event handler
  const handleSaveEvent = async (event: Partial<Event>) => {
    const success = await saveEvent(event, isEditMode);
    if (success) {
      setIsModalOpen(false);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async () => {
    if (!currentEvent.id) return;

    const success = await deleteEvent(currentEvent.id);
    if (success) {
      setIsModalOpen(false);
    }
  };

  // Format events for FullCalendar
  const formattedEvents = formatEventsForCalendar(events, userId);

  if (isLoading) {
    return <div>Loading calendar...</div>;
  }

  return (
    <div className="calendar-container">
      <FullCalendar
        {...config}
        events={formattedEvents}
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        select={handleSelectRange}
        eventContent={(eventInfo) => {
          const isCurrentUser = eventInfo.event.extendedProps.isCurrentUser;
          return (
            <div className="fc-event-main-content">
              <div className="event-title font-medium truncate">
                {eventInfo.event.title}
              </div>

              <div className="event-details flex flex-col gap-1 mt-1">
                {eventInfo.timeText && (
                  <div className="event-time text-xs flex items-center gap-1">
                    <Clock size={12} className="inline-block" />
                    <span>{eventInfo.timeText}</span>
                  </div>
                )}

                <div className="event-user text-xs flex items-center gap-1">
                  <User size={12} className="inline-block" />
                  <span className="truncate">
                    {eventInfo.event.extendedProps.userName}
                  </span>
                </div>
              </div>
            </div>
          );
        }}
      />

      <EventModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        currentEvent={currentEvent}
        setCurrentEvent={setCurrentEvent}
        isEditMode={isEditMode}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        userId={userId}
      />
    </div>
  );
};
