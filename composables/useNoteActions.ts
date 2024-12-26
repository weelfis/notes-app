import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotesStore } from "../stores/notes";
import type { Note } from "../types/index";

export function useNoteActions() {
  const route = useRoute();
  const router = useRouter();
  const notesStore = useNotesStore();

  const showDeleteDialog = ref(false);
  const showCancelDialog = ref(false);

  const isNew = computed(() => route.params.id === "new");

  // Типизация для объекта note
  const note = ref<Note>({
    id: isNew.value ? crypto.randomUUID() : (route.params.id as string),
    title: "",
    todos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  // Инициализация существующей заметки, если она не новая
  if (!isNew.value) {
    const existingNote = notesStore.notes.find((n) => n.id === route.params.id);
    if (existingNote) {
      note.value = { ...existingNote };
    }
  }

  // Типизация для canUndo и canRedo как вычисляемых значений
  const canUndo = computed<boolean>(() => notesStore.currentIndex >= 0);
  const canRedo = computed<boolean>(
    () => notesStore.currentIndex < notesStore.history.length - 1
  );

  // Функция для добавления задачи
  function addTodo() {
    note.value.todos.push({
      id: crypto.randomUUID(),
      text: "",
      completed: false
    });
  }

  // Функция для удаления задачи по индексу
  function removeTodo(index: number) {
    note.value.todos.splice(index, 1);
  }

  // Обработчик потери фокуса для задачи
  function handleTodoBlur(index: number) {
    if (!note.value.todos[index].text.trim()) {
      removeTodo(index);
    }
  }

  // Сохранение заметки
  function save() {
    note.value.todos = note.value.todos.filter(
      (todo) => todo.text.trim() !== ""
    );

    if (isNew.value) {
      notesStore.addNote(note.value);
    } else {
      notesStore.updateNote(note.value);
    }
    router.push("/");
  }

  // Отмена изменений
  function cancel() {
    showCancelDialog.value = true;
  }

  // Подтверждение отмены
  function handleCancelConfirm() {
    router.push("/");
  }

  // Подтверждение удаления заметки
  function confirmDelete() {
    showDeleteDialog.value = true;
  }

  // Функция для подтверждения удаления заметки
  function handleDeleteConfirm() {
    notesStore.deleteNote(note.value.id);
    router.push("/");
  }

  // Функция для undo/redo
  function undoRedo(action: "undo" | "redo") {
    if (action === "undo" && canUndo.value) {
      notesStore.undo();
    } else if (action === "redo" && canRedo.value) {
      notesStore.redo();
    }
  }

  return {
    note,
    showDeleteDialog,
    showCancelDialog,
    isNew,
    canUndo,
    canRedo,
    addTodo,
    removeTodo,
    handleTodoBlur,
    save,
    cancel,
    handleCancelConfirm,
    confirmDelete,
    handleDeleteConfirm,
    undoRedo
  };
}
