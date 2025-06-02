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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Event" : "Create Event"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              value={currentEvent.title || ""}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start" className="text-right">
              Start
            </Label>
            <Input
              id="start"
              name="start"
              type="datetime-local"
              value={
                currentEvent.start
                  ? new Date(currentEvent.start).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end" className="text-right">
              End
            </Label>
            <Input
              id="end"
              name="end"
              type="datetime-local"
              value={
                currentEvent.end
                  ? new Date(currentEvent.end).toISOString().slice(0, 16)
                  : ""
              }
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="allDay" className="text-right">
              All Day
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <Checkbox
                id="allDay"
                checked={currentEvent.allDay || false}
                onCheckedChange={handleCheckboxChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={currentEvent.description || ""}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          {isEditMode && currentEvent.userId === userId && (
            <Button variant="destructive" onClick={onDelete}>
              Delete
            </Button>
          )}
          <div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            {(!isEditMode || currentEvent.userId === userId) && (
              <Button type="submit" onClick={onSave}>
                Save
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
