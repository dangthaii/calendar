import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { EventModalProps } from "../types";
import { z } from "zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../ui/form";
import { DateTimePicker24h } from "../../ui/date-time-picker";

// Define the form schema using Zod
const eventFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  start: z.date({ required_error: "Start time is required" }),
  end: z.date({ required_error: "End time is required" }),
  description: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export const EventModal = ({
  isOpen,
  onOpenChange,
  currentEvent,
  setCurrentEvent,
  isEditMode,
  onSave,
  onDelete,
  userId,
}: EventModalProps) => {
  // Initialize form with react-hook-form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: currentEvent.title || "",
      start: currentEvent.start ? new Date(currentEvent.start) : undefined,
      end: currentEvent.end ? new Date(currentEvent.end) : undefined,
      description: currentEvent.description || "",
    },
  });

  const values = form.watch();

  // Update form values when currentEvent changes
  useEffect(() => {
    const obj = {
      title: currentEvent.title || "",
      start: currentEvent.start ? new Date(currentEvent.start) : undefined,
      end: currentEvent.end ? new Date(currentEvent.end) : undefined,
      description: currentEvent.description || "",
    };
    console.log("obj :", obj);

    form.reset(obj);
  }, [currentEvent, form]);

  // Handle form submission
  const onSubmit: SubmitHandler<EventFormValues> = (values) => {
    console.log("values :", values);
    const final = {
      ...currentEvent,
      ...values,
      start: values.start.toISOString(),
      end: values.end.toISOString(),
    };

    onSave(final);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    Title
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <Input placeholder="Event title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    Start
                  </FormLabel>
                  <div className="col-span-3">
                    <DateTimePicker24h
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right text-sm font-medium text-gray-700">
                    End
                  </FormLabel>
                  <div className="col-span-3">
                    <DateTimePicker24h
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-start gap-4">
                  <FormLabel className="text-right text-sm font-medium text-gray-700 pt-2">
                    Description
                  </FormLabel>
                  <FormControl className="col-span-3">
                    <Textarea
                      className="min-h-[100px]"
                      placeholder="Event description"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-between border-t pt-4">
              <div>
                {isEditMode && currentEvent.userId === userId && (
                  <Button
                    variant="destructive"
                    onClick={onDelete}
                    size="sm"
                    type="button"
                  >
                    Delete Event
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  size="sm"
                  type="button"
                >
                  Cancel
                </Button>
                {(!isEditMode || currentEvent.userId === userId) && (
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditMode ? "Update Event" : "Create Event"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
