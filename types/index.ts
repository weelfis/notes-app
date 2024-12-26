export interface TodoItem {
  readonly id: string;
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  disabled?: boolean | (() => boolean);
  show?: boolean;
}

export type HistoryAction = {
  type: "ADD_NOTE" | "UPDATE_NOTE" | "DELETE_NOTE";
  note: Note;
  previousNote?: Note;
  timestamp: Date;
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

export type NoteRouteParams = {
  id: string;
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
