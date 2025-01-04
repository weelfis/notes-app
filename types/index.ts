export interface ITodoItem {
  readonly id: string;
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  maxLength?: number;
  priority?: "low" | "medium" | "high";
}

export interface IUseTodoItemsProps {
  todos: ITodoItem[];
  onUpdateTodos: (todos: ITodoItem[]) => void;
  onAdd?: () => void;
  onRemove?: (index: number) => void;
}

export interface INote {
  id: string;
  title: string;
  todos: ITodoItem[];
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
  note: INote;
  previousNote?: INote;
  timestamp: Date;
  userId?: string;
  metadata?: Record<string, unknown>;
};

export interface INotesState {
  notes: INote[];
  history: HistoryAction[];
  currentIndex: number;
  isNewNoteRoute: boolean;
}

export enum ENotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

export interface INotification {
  id: string;
  type: ENotificationType;
  message: string;
  timeout?: number;
  title?: string;
  actions?: {
    label: string;
    onClick: () => void;
  }[];
}

export type NotificationPayload = Omit<INotification, "id">;

export interface NotificationConfig {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  defaultTimeout?: number;
  maxNotifications?: number;
}

export type NotificationAction = {
  type: "ADD_NOTIFICATION" | "REMOVE_NOTIFICATION" | "CLEAR_NOTIFICATIONS";
  payload?: INotification | string;
  timestamp: Date;
};

export interface INotificationsState {
  notifications: INotification[];
  config?: NotificationConfig;
  history?: NotificationAction[];
}

export interface IConfirmDialogButton {
  text: string;
  class: string;
  onClick: () => void;
}

export interface IUseConfirmDialogProps {
  modelValue: boolean;
  onUpdateModelValue: (value: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
}
