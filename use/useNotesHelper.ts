import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../stores/notes";
import { useNotificationsStore } from "../stores/useNotificationsStore";

import { NotificationType } from "../types/index";
import type {
  Note,
  TodoItem,
  UseTodoItemsProps,
  ConfirmDialogButton,
  UseConfirmDialogProps,
  IButton,
  NotificationPayload
} from "../types/index";

export function useNotesList() {
  const notesStore = useNotesStore();
  const notes = computed(() => notesStore.notes);
  const showConfirmDialog = ref(false);
  const noteToDelete = ref<Note | null>(null);

  function confirmDelete(note: Note) {
    noteToDelete.value = note;
    showConfirmDialog.value = true;
  }

  function handleConfirmDelete() {
    if (noteToDelete.value) {
      notesStore.deleteNote(noteToDelete.value.id);
      noteToDelete.value = null;
    }
  }

  function initializeNotes() {
    notesStore.initializeFromStorage();
  }

  return {
    notes,
    showConfirmDialog,
    noteToDelete,
    confirmDelete,
    handleConfirmDelete,
    initializeNotes
  };
}

export function useNoteEditor() {
  const route = useRoute();
  const router = useRouter();
  const notesStore = useNotesStore();
  const notificationsStore = useNotificationsStore();

  const DEFAULT_NOTE: Note = {
    id: "",
    title: "",
    todos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const isNew = computed(() => route.params.id === "new");

  const note = ref<Note>({
    ...DEFAULT_NOTE,
    id: isNew.value ? crypto.randomUUID() : (route.params.id as string)
  });

  const canUndo = computed(() => notesStore.currentIndex >= 0);
  const canRedo = computed(
    () => notesStore.currentIndex < notesStore.history.length - 1
  );

  const showDeleteDialog = ref(false);
  const showCancelDialog = ref(false);

  const createNotification = (
    type: NotificationType,
    message: string
  ): NotificationPayload => ({
    type,
    message,
    timeout: 3000
  });

  function loadExistingNote() {
    if (!isNew.value) {
      const existingNote = notesStore.notes.find(
        (n) => n.id === route.params.id
      );
      if (existingNote) {
        note.value = {
          ...existingNote,
          todos: existingNote.todos.map((todo) => ({
            ...todo,
            updatedAt: todo.updatedAt ? new Date(todo.updatedAt) : undefined,
            createdAt: todo.createdAt ? new Date(todo.createdAt) : undefined
          }))
        };
      } else {
        notificationsStore.add(
          createNotification(NotificationType.ERROR, "Заметка не найдена")
        );
        router.push("/");
      }
    }
  }

  function validateNote(): boolean {
    if (!note.value.title.trim()) {
      notificationsStore.add(
        createNotification(
          NotificationType.ERROR,
          "Заголовок заметки обязателен"
        )
      );
      return false;
    }
    return true;
  }

  function save() {
    if (!validateNote()) return;

    try {
      note.value.updatedAt = new Date();

      if (isNew.value) {
        notesStore.addNote(note.value);
      } else {
        notesStore.updateNote(note.value);
      }
      router.push("/");
    } catch (error) {
      notificationsStore.add(
        createNotification(
          NotificationType.ERROR,
          "Произошла ошибка при сохранении заметки"
        )
      );
    }
  }

  function handleCancelConfirm() {
    showCancelDialog.value = false;
    notificationsStore.add(
      createNotification(NotificationType.WARNING, "Изменения отменены")
    );
    router.push("/");
  }

  function handleDeleteConfirm() {
    try {
      showDeleteDialog.value = false;
      notesStore.deleteNote(note.value.id);
      notificationsStore.add(
        createNotification(NotificationType.SUCCESS, "Заметка успешно удалена")
      );
      router.push("/");
    } catch (error) {
      notificationsStore.add(
        createNotification(
          NotificationType.ERROR,
          "Произошла ошибка при удалении заметки"
        )
      );
    }
  }

  function undoRedo(action: "undo" | "redo") {
    try {
      if (action === "undo" && canUndo.value) {
        notesStore.undo();
        notificationsStore.add(
          createNotification(NotificationType.SUCCESS, "Действие отменено")
        );
      } else if (action === "redo" && canRedo.value) {
        notesStore.redo();
        notificationsStore.add(
          createNotification(NotificationType.SUCCESS, "Действие восстановлено")
        );
      }
    } catch (error) {
      notificationsStore.add(
        createNotification(
          NotificationType.ERROR,
          `Не удалось ${
            action === "undo" ? "отменить" : "восстановить"
          } действие`
        )
      );
    }
  }

  function cancel() {
    if (
      note.value.title.trim() ||
      note.value.todos.some((todo) => todo.text.trim())
    ) {
      showCancelDialog.value = true;
    } else {
      router.push("/");
    }
  }

  const dialogs = ref([
    {
      visible: showDeleteDialog,
      title: "Удаление заметки",
      message:
        "Вы уверены, что хотите удалить эту заметку? Это действие нельзя отменить.",
      onConfirm: handleDeleteConfirm
    },
    {
      visible: showCancelDialog,
      title: "Отмена изменений",
      message:
        "Вы уверены, что хотите отменить? Все несохраненные изменения будут потеряны.",
      onConfirm: handleCancelConfirm
    }
  ]);

  const buttons = computed<IButton[]>(() => [
    {
      label: "↩",
      action: () => undoRedo("undo"),
      class: "text-gray-600 hover:text-gray-800 disabled:opacity-50",
      disabled: !canUndo.value
    },
    {
      label: "↪",
      action: () => undoRedo("redo"),
      class: "text-gray-600 hover:text-gray-800 disabled:opacity-50",
      disabled: !canRedo.value
    },
    {
      label: "Сохранить",
      action: save,
      class: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600",
      disabled: false
    },
    {
      label: "Отмена",
      action: cancel,
      class:
        "bg-blue-500 text-white px-4 py-2 rounded hover:bg-gray-600 !important",
      disabled: false
    }
  ]);

  return {
    note,
    isNew,
    dialogs,
    buttons,
    showDeleteDialog,
    showCancelDialog,
    loadExistingNote,
    handleDeleteConfirm,
    handleCancelConfirm,
    save,
    cancel
  };
}

export function useTodoItems({
  todos,
  onUpdateTodos,
  onAdd,
  onRemove
}: UseTodoItemsProps) {
  const localTodos = ref<TodoItem[]>(todos);

  watch(
    () => todos,
    (newTodos) => {
      localTodos.value = newTodos;
    },
    { deep: true }
  );

  function createTodo(): TodoItem {
    return {
      id: crypto.randomUUID(),
      text: "",
      completed: false
    };
  }

  function addTodo() {
    const newTodo = createTodo();
    const newTodos = [...localTodos.value, newTodo];
    localTodos.value = newTodos;
    onUpdateTodos(newTodos);
    onAdd?.();
  }

  function removeTodo(index: number) {
    const newTodos = [...localTodos.value];
    newTodos.splice(index, 1);
    localTodos.value = newTodos;
    onUpdateTodos(newTodos);
    onRemove?.(index);
  }

  function updateTodo(index: number, updates: Partial<TodoItem>) {
    const newTodos = [...localTodos.value];
    newTodos[index] = { ...newTodos[index], ...updates };
    localTodos.value = newTodos;
    onUpdateTodos(newTodos);
  }

  return {
    todos: localTodos,
    addTodo,
    removeTodo,
    updateTodo
  };
}

export function useConfirmDialog({
  modelValue,
  onUpdateModelValue,
  onConfirm
}: UseConfirmDialogProps) {
  function closeDialog() {
    onUpdateModelValue(false);
  }

  function confirm() {
    onConfirm();
    closeDialog();
  }

  const buttons: ConfirmDialogButton[] = [
    {
      text: "Нет",
      class: "px-4 py-2 text-gray-600 hover:text-gray-800",
      onClick: closeDialog
    },
    {
      text: "Да",
      class: "px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",
      onClick: confirm
    }
  ];

  return {
    buttons,
    confirm,
    closeDialog
  };
}
