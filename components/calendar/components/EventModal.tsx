import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import { EventModalProps } from "../types";

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
  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentEvent({ ...currentEvent, [name]: value });
  };

  // Handle checkbox change
  const handleCheckboxChange = (checked: boolean) => {
    setCurrentEvent({ ...currentEvent, allDay: checked });
  };

  // Format datetime for input fields
  const formatDateTimeForInput = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 16);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            {isEditMode ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="title"
              className="text-right text-sm font-medium text-gray-700"
            >
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={currentEvent.title || ""}
              onChange={handleInputChange}
              className="col-span-3"
              placeholder="Event title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="start"
              className="text-right text-sm font-medium text-gray-700"
            >
              Start
            </Label>
            <Input
              id="start"
              name="start"
              type="datetime-local"
              value={formatDateTimeForInput(currentEvent.start || "")}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="end"
              className="text-right text-sm font-medium text-gray-700"
            >
              End
            </Label>
            <Input
              id="end"
              name="end"
              type="datetime-local"
              value={formatDateTimeForInput(currentEvent.end || "")}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="allDay"
              className="text-right text-sm font-medium text-gray-700"
            >
              All Day
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={currentEvent.allDay || false}
                onCheckedChange={handleCheckboxChange}
              />
              <Label
                htmlFor="allDay"
                className="text-sm font-medium cursor-pointer"
              >
                All day event
              </Label>
            </div>
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="description"
              className="text-right text-sm font-medium text-gray-700 pt-2"
            >
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={currentEvent.description || ""}
              onChange={handleInputChange}
              className="col-span-3 min-h-[100px]"
              placeholder="Event description"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between border-t pt-4">
          <div>
            {isEditMode && currentEvent.userId === userId && (
              <Button variant="destructive" onClick={onDelete} size="sm">
                Delete Event
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              size="sm"
            >
              Cancel
            </Button>
            {(!isEditMode || currentEvent.userId === userId) && (
              <Button
                type="submit"
                onClick={onSave}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isEditMode ? "Update Event" : "Create Event"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
