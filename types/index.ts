// Интерфейс для отдельной задачи
export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Note {
  id: string;
  title: string;
  todos: TodoItem[];
}
// createdAt: Date;
// updatedAt: Date;

export type HistoryAction = {
  type: "ADD_NOTE" | "UPDATE_NOTE" | "DELETE_NOTE";
  note: Note;
  previousNote?: Note;
  timestamp: Date;
};

// Интерфейс для состояния хранилища
export interface NotesState {
  notes: Note[];
  history: HistoryAction[];
  currentIndex: number;
}

// Перечисление для типов уведомлений
export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info"
}

// Интерфейс для уведомлений
export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timeout?: number;
}

// Тип для параметров роута
export type NoteRouteParams = {
  id: string;
};

// Интерфейс для ответа API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}
