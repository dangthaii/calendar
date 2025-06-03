export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description?: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CalendarProps {
  userId: string;
  showAllEvents?: boolean;
}

export interface EventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentEvent: Partial<Event>;
  setCurrentEvent: (event: Partial<Event>) => void;
  isEditMode: boolean;
  onSave: (event: Partial<Event>) => void;
  onDelete: () => void;
  userId: string;
}
