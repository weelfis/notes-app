export interface TodoItem {
  readonly id: string;
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  maxLength?: number;
  priority?: "low" | "medium" | "high";
}

export interface Note {
  id: string;
  title: string;
  todos: TodoItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IButton {
  label: string;
  action: () => void;
  class: string;
  disabled: boolean;
}

export type HistoryAction = {
  type: "ADD_NOTE" | "UPDATE_NOTE" | "DELETE_NOTE";
  note: Note;
  previousNote?: Note;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, unknown>;
};

export interface NotesState {
  notes: Note[];
  history: HistoryAction[];
  currentIndex: number;
}

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timeout?: number;
}

export interface NotificationsState {
  notifications: Notification[];
}

export type NoteRouteParams = {
  id: string;
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
