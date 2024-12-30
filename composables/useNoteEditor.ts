import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../stores/notes";
import type {
  Note,
  TodoItem,
  UseTodoItemsProps,
  ConfirmDialogButton,
  UseConfirmDialogProps
} from "../types/index";

export function useNoteEditor() {
  const route = useRoute();
  const router = useRouter();
  const notesStore = useNotesStore();

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

  function loadExistingNote() {
    if (!isNew.value) {
      const existingNote = notesStore.notes.find(
        (n) => n.id === route.params.id
      );
      if (existingNote) {
        note.value = { ...existingNote };
      } else {
        router.push("/");
      }
    }
  }

  function save() {
    note.value.updatedAt = new Date();

    if (isNew.value) {
      notesStore.addNote(note.value);
    } else {
      notesStore.updateNote(note.value);
    }

    router.push("/");
  }

  function handleCancelConfirm() {
    showCancelDialog.value = false;
    router.push("/");
  }

  function handleDeleteConfirm() {
    showDeleteDialog.value = false;
    notesStore.deleteNote(note.value.id);
    router.push("/");
  }

  function undoRedo(action: "undo" | "redo") {
    if (action === "undo" && canUndo.value) {
      notesStore.undo();
    } else if (action === "redo" && canRedo.value) {
      notesStore.redo();
    }
  }

  function cancel() {
    showCancelDialog.value = true;
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

  const buttons = computed(() => [
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
      class: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600",
      disabled: false
    },
    {
      label: "Отмена",
      action: cancel,
      class: "bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600",
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
    handleCancelConfirm
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
      text: "Отмена",
      class: "px-4 py-2 text-gray-600 hover:text-gray-800",
      onClick: closeDialog
    },
    {
      text: "Хорошо",
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
