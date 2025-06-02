"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/lib/axios";
import { useToast } from "@/components/calendar/hooks/useToast";
import { Event } from "@/components/calendar/types";

export function useEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all events
  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: async (): Promise<Event[]> => {
      try {
        console.log("Fetching events...");
        const response = await axiosInstance.get("/events");
        console.log("Events fetched successfully");
        return response.data;
      } catch (error) {
        console.error("Error fetching events:", error);
        toast({
          title: "Error",
          description: "Failed to load events. Please try again later.",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: Omit<Event, "id" | "userId" | "user">) => {
      const response = await axiosInstance.post("/events", eventData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Success",
        description: "Event created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({
      id,
      ...eventData
    }: Partial<Event> & { id: string }) => {
      const response = await axiosInstance.put(`/events/${id}`, eventData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Success",
        description: "Event updated successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to update event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await axiosInstance.delete(`/events/${eventId}`);
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Success",
        description: "Event deleted successfully",
      });
    },
    onError: (error: any) => {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.error ||
          "Failed to delete event. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Save event (create or update)
  const saveEvent = async (
    currentEvent: Partial<Event>,
    isEditMode: boolean
  ) => {
    try {
      if (!currentEvent.title || !currentEvent.start || !currentEvent.end) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return false;
      }

      const eventData = {
        title: currentEvent.title,
        start: currentEvent.start,
        end: currentEvent.end,
        allDay: currentEvent.allDay ?? false,
        description: currentEvent.description,
      };

      if (isEditMode && currentEvent.id) {
        await updateEventMutation.mutateAsync({
          id: currentEvent.id,
          ...eventData,
        });
      } else {
        await createEventMutation.mutateAsync(
          eventData as Omit<Event, "id" | "userId" | "user">
        );
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    events: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    refetchEvents: () =>
      queryClient.invalidateQueries({ queryKey: ["events"] }),
    saveEvent,
    deleteEvent: async (eventId: string) => {
      if (!eventId) return false;
      try {
        await deleteEventMutation.mutateAsync(eventId);
        return true;
      } catch (error) {
        return false;
      }
    },
  };
}
