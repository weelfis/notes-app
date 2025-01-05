import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../store/useNotesStore";
import { useNotificationsStore } from "../store/useNotificationsStore";

import { ENotificationType } from "../types/index";
import type { INote, ITodoItem, NotificationPayload } from "../types/index";

export function useNoteEditor() {
  const route = useRoute();
  const router = useRouter();
  const notesStore = useNotesStore();
  const notificationsStore = useNotificationsStore();

  const DEFAULT_NOTE: INote = {
    id: "",
    title: "",
    todos: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const isNew = computed(() => route.params.id === "new");

  const note = ref<INote>({
    ...DEFAULT_NOTE,
    id: isNew.value ? crypto.randomUUID() : (route.params.id as string),
    title: "",
    todos: []
  });

  const showDeleteDialog = ref(false);
  const showCancelDialog = ref(false);

  const createNotification = (
    type: ENotificationType,
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
          createNotification(ENotificationType.ERROR, "Note not found")
        );
        router.push("/");
      }
    }
  }

  function validateNote(): boolean {
    if (!note.value.title.trim()) {
      notificationsStore.add(
        createNotification(
          ENotificationType.ERROR,
          "The note title is required"
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
      note.value.todos = removeEmptyTodos(note.value.todos);

      if (isNew.value) {
        notesStore.addNote(note.value);
      } else {
        notesStore.updateNote(note.value);
      }
      router.push("/");
    } catch (error) {
      notificationsStore.add(
        createNotification(
          ENotificationType.ERROR,
          "An error occurred while saving the note"
        )
      );
    }
  }

  function removeEmptyTodos(todos: ITodoItem[]) {
    return todos.filter((todo) => todo.text.trim());
  }

  function handleCancelConfirm() {
    showCancelDialog.value = false;
    notificationsStore.add(
      createNotification(
        ENotificationType.WARNING,
        "Changes have been canceled"
      )
    );
    router.push("/");
  }

  function handleDeleteConfirm() {
    try {
      showDeleteDialog.value = false;
      notesStore.deleteNote(note.value.id);
      notificationsStore.add(
        createNotification(
          ENotificationType.SUCCESS,
          "Note successfully deleted"
        )
      );
      router.push("/");
    } catch (error) {
      notificationsStore.add(
        createNotification(
          ENotificationType.ERROR,
          "An error occurred while deleting the note"
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
      title: "Delete Note",
      message:
        "Are you sure you want to delete this note? This action cannot be undone.",
      onConfirm: handleDeleteConfirm
    },
    {
      visible: showCancelDialog,
      title: "Cancel Changes",
      message:
        "Are you sure you want to cancel? All unsaved changes will be lost.",
      onConfirm: handleCancelConfirm
    }
  ]);

  return {
    note,
    isNew,
    dialogs,
    showDeleteDialog,
    showCancelDialog,
    loadExistingNote,
    handleDeleteConfirm,
    handleCancelConfirm,
    save,
    cancel
  };
}
