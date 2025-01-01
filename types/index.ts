export interface TodoItem {
  readonly id: string;
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  maxLength?: number;
  priority?: "low" | "medium" | "high";
}

export interface UseTodoItemsProps {
  todos: TodoItem[];
  onUpdateTodos: (todos: TodoItem[]) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
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
  isNewNoteRoute: boolean;
}

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export type NotificationPayload = Omit<Notification, "id">;

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timeout?: number;
  title?: string;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

export interface NotificationConfig {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  defaultTimeout?: number;
  maxNotifications?: number;
}

export interface NotificationStore {
  add: (notification: NotificationPayload) => void;
  remove: (id: string) => void;
  clear: () => void;
  config?: NotificationConfig;
}

export type NotificationAction = {
  type: "ADD_NOTIFICATION" | "REMOVE_NOTIFICATION" | "CLEAR_NOTIFICATIONS";
  payload?: Notification | string;
  timestamp: Date;
};

export interface NotificationsState {
  notifications: Notification[];
  config?: NotificationConfig;
  history?: NotificationAction[];
}

export type NoteRouteParams = {
  id: string;
};

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface ConfirmDialogButton {
  text: string;
  class: string;
  onClick: () => void;
}

export interface UseConfirmDialogProps {
  modelValue: boolean;
  onUpdateModelValue: (value: boolean) => void;
  onConfirm: () => void;
}
